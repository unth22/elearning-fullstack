# Tiếng Trung Thương Mại — E-learning MVP

Fullstack: **React (Vite)** + **Node.js/Express** + **PostgreSQL**.

## Cấu trúc thư mục

```
elearning-fullstack/
├── frontend/          React + Vite + Tailwind
│   ├── public/
│   ├── src/
│   │   ├── pages/       HomePage, LoginPage, RegisterPage
│   │   ├── services/    gọi API (authService, courseService)
│   │   └── App.jsx
│   ├── vite.config.js   có proxy /api -> backend port 5000
│   └── package.json
├── backend/            Express + PostgreSQL
│   ├── src/
│   │   ├── config/db.js
│   │   ├── models/      users, courses, lessons
│   │   ├── controllers/
│   │   ├── routes/
│   │   └── middlewares/ JWT auth + phân quyền admin
│   ├── database/migrations/001_init_schema.sql
│   ├── server.js
│   └── .env.example
└── package.json         root — dùng npm workspaces để chạy cả 2 cùng lúc
```

## Yêu cầu trước khi chạy

1. Đã cài **Node.js** ≥ 18.
2. Đã cài **PostgreSQL** và tạo sẵn 1 database rỗng, ví dụ tên `elearning`.

## Các bước chạy (đúng như bạn muốn: install rồi dev)

```bash
# 1. Cài đặt tất cả (root + frontend + backend cùng lúc nhờ npm workspaces)
npm install

# 2. Tạo file .env thật cho backend từ file mẫu
cp backend/.env.example backend/.env
# rồi mở backend/.env, sửa DATABASE_URL cho đúng username/password/database của bạn

# 3. Tạo bảng trong PostgreSQL (chỉ cần chạy 1 lần)
psql -U <user> -d elearning -f backend/database/migrations/001_init_schema.sql

# 4. Chạy cả frontend + backend cùng lúc
npm run dev
```

Sau bước 4:
- Backend chạy tại `http://localhost:5000`
- Frontend chạy tại `http://localhost:5173`

Frontend gọi API qua đường dẫn `/api/...`, Vite tự động proxy sang backend — bạn **không cần sửa gì thêm**.

## Tạo tài khoản admin đầu tiên

Mặc định user đăng ký qua form sẽ có `role = 'student'`. Để có tài khoản admin đầu tiên, đăng ký bình thường qua giao diện, sau đó chạy lệnh SQL sau (chỉ cần 1 lần):

```sql
UPDATE users SET role = 'admin' WHERE email = 'email-ban-dung-de-dang-ky@vidu.com';
```

## Ghi chú

- Toàn bộ mật khẩu được băm bằng `bcrypt` trước khi lưu — không lưu mật khẩu gốc.
- Đăng nhập trả về JWT token, được lưu ở `localStorage` phía frontend.
- Route `/api/admin/...` yêu cầu token hợp lệ **và** `role = 'admin'`.
