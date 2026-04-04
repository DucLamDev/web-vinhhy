# Tour Vinh Hy Monorepo

Monorepo fullstack cho website dat tour "Tour Vinh Hy" gom:

- `frontend/`: Next.js App Router, TailwindCSS, component style theo huong shadcn/ui, React Query, SEO SSR/SSG, sitemap, robots, JSON-LD.
- `backend/`: Node.js + Express.js ES6, MongoDB Mongoose, Google OAuth 2.0, JWT, booking flow, email SMTP, CRM sync, rate limiting.
- `docs/`: tai lieu API va huong dan setup.

## Folder structure

```text
web-vinhhy/
|-- backend/
|   |-- src/
|   |   |-- config/
|   |   |-- controllers/
|   |   |-- data/
|   |   |-- middleware/
|   |   |-- models/
|   |   |-- routes/
|   |   |-- scripts/
|   |   |-- services/
|   |   `-- utils/
|   |-- .env.example
|   `-- package.json
|-- frontend/
|   |-- app/
|   |-- components/
|   |-- lib/
|   |-- .env.example
|   `-- package.json
`-- docs/
    |-- API.md
    `-- SETUP.md
```

## Core features

- Google login/register qua OAuth 2.0.
- User profile va booking history qua JWT auth.
- Tour listing, detail, gallery, itinerary, bang gia va booking form.
- Booking flow: luu MongoDB, gui email xac nhan, goi CRM API, tra warning neu co loi tung buoc.
- Blog headless WordPress tu `/wp-json/wp/v2/posts`.
- SEO: metadata dong, sitemap, robots, JSON-LD, SSR/SSG, URL than thien.

## Quick start

1. Cai dependency cho backend va frontend.
2. Copy `.env.example` thanh `.env` cho tung app.
3. Seed tours bang `npm run seed` trong `backend/`.
4. Chay backend truoc, sau do chay frontend.

Chi tiet xem [docs/SETUP.md](./docs/SETUP.md) va [docs/API.md](./docs/API.md).
