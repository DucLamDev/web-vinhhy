# Setup Guide

## 1. Yeu cau

- Node.js 18+
- MongoDB Atlas hoac MongoDB local
- Google Cloud OAuth credentials
- SMTP account Gmail hoac Zoho
- WordPress site co REST API

## 2. Cai backend

```bash
cd backend
npm install
cp .env.example .env
```

Cap nhat cac bien:

- `MONGODB_URI`
- `JWT_SECRET`
- `GOOGLE_CLIENT_ID`
- `GOOGLE_CLIENT_SECRET`
- `GOOGLE_CALLBACK_URL`
- `SMTP_HOST`, `SMTP_USER`, `SMTP_PASS`
- `CRM_API_URL`

Seed tour mau:

```bash
npm run seed
```

Chay backend:

```bash
npm run dev
```

## 3. Cai frontend

```bash
cd frontend
npm install
cp .env.example .env.local
```

Cap nhat:

- `NEXT_PUBLIC_SITE_URL`
- `NEXT_PUBLIC_API_URL`
- `NEXT_PUBLIC_GOOGLE_AUTH_URL`
- `WORDPRESS_API_URL`

Chay frontend:

```bash
npm run dev
```

## 4. Google OAuth

Trong Google Cloud Console:

1. Tao OAuth Client ID.
2. Them Authorized redirect URI: `http://localhost:5000/auth/callback`
3. Them Authorized JavaScript origin cho frontend va backend neu can.

## 5. Deployment

### Frontend tren Vercel

1. Import thu muc `frontend/`.
2. Them env vars cho Vercel.
3. Build command: `npm run build`
4. Output: Next.js mac dinh.

### Backend tren VPS/EC2

1. Deploy thu muc `backend/`.
2. Cai Node.js 18+.
3. Tao file `.env`.
4. Chay bang `npm install && npm run start`.
5. Reverse proxy qua Nginx neu can.

### MongoDB Atlas

1. Tao cluster.
2. Allow IP cua server.
3. Tao user database.
4. Gan connection string vao `MONGODB_URI`.

## 6. WordPress Headless CMS

Website frontend goi:

```text
https://your-wordpress-site.com/wp-json/wp/v2/posts?_embed
```

Neu WordPress su dung plugin SEO nhu Yoast, metadata co the duoc lay tu `yoast_head_json`.

## 7. Goi y tiep theo

- Them dashboard admin rieng cho quan ly booking.
- Them review system luu MongoDB.
- Them chatbot ho tro Zalo/WhatsApp hoac widget live chat.
