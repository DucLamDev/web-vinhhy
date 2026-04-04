# API Documentation

Base URL mac dinh: `http://localhost:5000`

## 1. Auth

### `GET /auth/google`

Redirect nguoi dung den Google OAuth consent screen.

### `GET /auth/callback`

Google redirect ve backend. Backend tao JWT va redirect tiep:

```text
http://localhost:3000/auth/callback?token=<jwt>
```

## 2. Tours

### `GET /tours`

Lay danh sach tour da publish.

Sample response:

```json
[
  {
    "_id": "661f...",
    "title": "Tour Vinh Hy 1 ngay cao cap",
    "slug": "tour-vinh-hy-1-ngay",
    "summary": "Hanh trinh trong ngay...",
    "prices": {
      "adult": 1290000,
      "child": 890000,
      "senior": 1090000
    }
  }
]
```

### `GET /tours/:slug`

Lay chi tiet 1 tour theo slug.

## 3. Booking

### `POST /booking`

Tao booking moi. Co the gui kem `Authorization: Bearer <jwt>` neu da dang nhap.

Request body:

```json
{
  "tourSlug": "tour-vinh-hy-1-ngay",
  "name": "Nguyen Van A",
  "email": "a@gmail.com",
  "phone": "0900000000",
  "address": "Phan Rang",
  "travelDate": "2026-04-20",
  "adult": 2,
  "child": 1,
  "infant": 0,
  "senior": 0,
  "notes": "Can don tai trung tam"
}
```

Response:

```json
{
  "message": "Booking created successfully",
  "bookingId": "661f...",
  "totalPrice": 3470000,
  "warnings": []
}
```

Booking flow:

1. Luu booking vao MongoDB.
2. Gui email xac nhan bang Nodemailer.
3. Goi CRM API `POST /booking` voi payload mapping theo yeu cau.
4. Neu email hoac CRM loi, API van tra `201` cung `warnings` de frontend thong bao.

## 4. User

Tat ca endpoint ben duoi yeu cau JWT:

### `GET /user/me`

Lay thong tin user hien tai.

### `PUT /user/me`

Cap nhat ho ten va so dien thoai.

```json
{
  "name": "Nguyen Van A",
  "phone": "0900000000"
}
```

### `GET /user/bookings`

Lay lich su booking cua user dang nhap.

## 5. Health

### `GET /health`

Kiem tra tinh trang service.
