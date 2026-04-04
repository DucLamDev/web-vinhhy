# Deploy Tour Vinh Hy với Docker + Cloudflare Tunnel

## 1. Yêu cầu VPS

- Ubuntu 22.04 LTS hoặc Debian 12
- 2 vCPU, 4 GB RAM, 25 GB SSD trở lên
- Docker Engine và Docker Compose plugin
- Domain đã quản lý bằng Cloudflare

## 2. Cài Docker và Compose

```bash
sudo apt update
sudo apt install -y ca-certificates curl gnupg
sudo install -m 0755 -d /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
  $(. /etc/os-release && echo "$VERSION_CODENAME") stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
sudo apt update
sudo apt install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
sudo usermod -aG docker $USER
```

Đăng xuất rồi đăng nhập lại để áp dụng quyền Docker.

## 3. Clone code và chuẩn bị môi trường

```bash
git clone <repo-url> /opt/tour-vinh-hy
cd /opt/tour-vinh-hy
```

Chỉnh các file môi trường:

- `frontend/.env`
- `backend/.env`

Các giá trị production quan trọng:

- `NEXT_PUBLIC_SITE_URL=https://tour.tenmiencuaban.com`
- `NEXT_PUBLIC_API_URL=https://api.tenmiencuaban.com`
- `NEXT_PUBLIC_GOOGLE_AUTH_URL=https://api.tenmiencuaban.com/auth/google`
- `FRONTEND_URL=https://tour.tenmiencuaban.com`
- `MONGODB_URI=mongodb://mongodb:27017/tour-vinh-hy`
- `GOOGLE_CALLBACK_URL=https://api.tenmiencuaban.com/auth/callback`
- SMTP và JWT secret thật

Tạo thêm file `.env.compose` ở root hoặc export trực tiếp biến môi trường khi chạy compose:

```bash
cat > .env.compose <<'EOF'
NEXT_PUBLIC_SITE_URL=https://tour.tenmiencuaban.com
NEXT_PUBLIC_API_URL=https://api.tenmiencuaban.com
NEXT_PUBLIC_GOOGLE_AUTH_URL=https://api.tenmiencuaban.com/auth/google
FRONTEND_URL=https://tour.tenmiencuaban.com
MONGODB_URI=mongodb://mongodb:27017/tour-vinh-hy
CLOUDFLARED_TUNNEL_TOKEN=replace-with-real-token
EOF
```

## 4. Build và chạy containers

```bash
docker compose --env-file .env.compose build
docker compose --env-file .env.compose up -d
```

Kiểm tra trạng thái:

```bash
docker compose ps
docker compose logs -f frontend
docker compose logs -f backend
docker compose logs -f cloudflared
```

## 5. Cloudflare Tunnel

### Cách thiết lập trong dashboard

1. Vào Cloudflare Zero Trust.
2. Tạo một Tunnel mới.
3. Chọn Docker làm connector.
4. Cloudflare sẽ cung cấp `TUNNEL_TOKEN`.
5. Gán token này vào `CLOUDFLARED_TUNNEL_TOKEN` trong `.env.compose`.

### Cấu hình hostname trong Tunnel

Tạo ít nhất 2 public hostname:

- `tour.tenmiencuaban.com` -> `http://frontend:3000`
- `api.tenmiencuaban.com` -> `http://backend:5000`

Cloudflare sẽ tự cấp SSL ở lớp edge, không cần mở port public nếu chỉ dùng tunnel.

## 6. DNS và SSL

- Đảm bảo domain đã được trỏ nameserver về Cloudflare.
- Public hostname của tunnel sẽ tự tạo bản ghi phù hợp.
- Nếu dùng Google OAuth, thêm chính xác:
  - `https://api.tenmiencuaban.com/auth/callback`

## 7. Backup MongoDB

### Backup thủ công

```bash
docker compose exec mongodb mongodump --archive=/tmp/tour-vinh-hy.archive
docker cp tour-vinh-hy-mongodb:/tmp/tour-vinh-hy.archive ./tour-vinh-hy.archive
```

### Restore

```bash
docker cp ./tour-vinh-hy.archive tour-vinh-hy-mongodb:/tmp/tour-vinh-hy.archive
docker compose exec mongodb mongorestore --archive=/tmp/tour-vinh-hy.archive --drop
```

## 8. Monitoring và logs

Xem logs:

```bash
docker compose logs -f
docker compose logs -f frontend
docker compose logs -f backend
docker compose logs -f mongodb
docker compose logs -f cloudflared
```

Kiểm tra tài nguyên:

```bash
docker stats
```

Kiểm tra health endpoint:

```bash
curl http://127.0.0.1:5000/health
curl http://127.0.0.1:3000
```

## 9. Update và rollback

### Update version mới

```bash
cd /opt/tour-vinh-hy
git pull
docker compose --env-file .env.compose build
docker compose --env-file .env.compose up -d
```

### Rollback nhanh

1. Checkout commit hoặc tag cũ:

```bash
git checkout <old-commit-or-tag>
```

2. Rebuild và chạy lại:

```bash
docker compose --env-file .env.compose build
docker compose --env-file .env.compose up -d
```

## 10. Checklist deploy

- Frontend mở được ở domain public
- API `/health` trả về `ok`
- Booking tạo thành công
- Google login callback đúng domain production
- Tunnel `cloudflared` không báo reconnect liên tục
- Mongo volume tồn tại sau khi restart container
