# E-Commerce Web Application

## Mô tả dự án

Hệ thống web quản lý bán giày điện tử, hỗ trợ quản lý sản phẩm, người dùng, giỏ hàng, đơn hàng, đánh giá sản phẩm, phân quyền quản trị viên và các tính năng hỗ trợ mua sắm trực tuyến.
Link DEMO: https://shoesphere-95n3.onrender.com

---

## Công nghệ sử dụng

- **Backend:** Node.js (Express, TypeScript), PostgreSQL, JWT, Socket.io, Multer, Nodemailer
- **Frontend:** HTML, CSS, JavaScript/TypeScript (có thể mở rộng React)
- **Quản lý mã nguồn:** GitHub
- **Khác:** dotenv

---

## Chức năng chính

- Đăng ký, đăng nhập, xác thực người dùng (JWT)
- Quản lý sản phẩm, danh mục, biến thể sản phẩm
- Quản lý người dùng, phân quyền quản trị viên
- Quản lý giỏ hàng, thêm/xóa/sửa số lượng sản phẩm
- Quản lý đơn hàng, trạng thái đơn hàng
- Đánh giá sản phẩm, hiển thị đánh giá
- Gửi email xác nhận, thông báo realtime (Socket.io)
- Upload hình ảnh sản phẩm
- Báo cáo, thống kê (cho admin)

---

## Hướng dẫn cài đặt & chạy thử

### 1. Clone dự án

```sh
git clone https://github.com/<your-username>/<your-repo>.git
cd <your-repo>
```

### 2. Cài đặt dependencies

```sh
npm install
```

### 3. Cấu hình môi trường

Tạo file `.env` ở thư mục gốc, ví dụ:

```
PORT=3000
DATABASE_URL=postgres://postgres:yourpassword@localhost:5432/ecommercedb
JWT_SECRET=your_jwt_secret
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_email_password
```

### 4. Khởi tạo database

- Tạo database PostgreSQL với tên và tài khoản như trong `DATABASE_URL`.
- Chạy các file database để tạo bảng.

### 5. Build và chạy backend

```sh
npm run build      # Biên dịch TypeScript (nếu có)
npm start          # Hoặc: node BE/dist/index.js
```

### 6. Chạy frontend

- Mở file HTML trong thư mục `FE/HTML` bằng Live Server hoặc server tĩnh.
- Đảm bảo backend đang chạy ở `http://localhost:3000`.

---
## Yêu cầu cài đặt

- [Node.js](https://nodejs.org/) >= 18.x
- [npm](https://www.npmjs.com/) >= 9.x
- [PostgreSQL](https://www.postgresql.org/) >= 13.x

### Các package chính sẽ được tự động cài khi chạy `npm install`:
- express
- typescript
- pg
- cors
- dotenv
- jsonwebtoken
- bcryptjs
- multer
- nodemailer
- socket.io

### Các package dev:
- ts-node
- ts-node-dev
- nodemon
- @types/express
- @types/node
- @types/pg
- @types/cors
- @types/jsonwebtoken
- @types/multer
- @types/nodemailer

> **Lưu ý:**  
> - Đảm bảo đã tạo database PostgreSQL và cấu hình đúng thông tin trong file `.env`.


---

