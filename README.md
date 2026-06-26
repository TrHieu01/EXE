# EXE101 - Badminton Social Network & Booking System 🏸

Một nền tảng mạng xã hội và đặt sân cầu lông chuyên nghiệp, giúp người chơi dễ dàng tìm kiếm sân, đặt lịch và kết nối với các đối thủ/đồng đội khác.

## 🚀 Tính năng nổi bật
- **Quản lý tài khoản (Authentication):** Đăng ký, đăng nhập an toàn với JWT.
- **Hệ thống sân bãi (Courts):** Xem thông tin sân cầu lông, tích hợp bản đồ số (Leaflet) để tìm kiếm vị trí trực quan.
- **Tìm kiếm đối thủ/trận đấu (Matches):** Mạng xã hội thu nhỏ giúp người chơi tạo và tìm kiếm các trận đấu, ghép nhóm dễ dàng.
- **Đặt lịch sân (Bookings):** Đặt sân theo thời gian thực, quản lý lịch đặt sân hiệu quả.

## 💻 Công nghệ sử dụng

### Frontend (Client)
- **Framework:** React 19, Vite
- **Styling:** Tailwind CSS 4
- **Routing:** React Router v7
- **Bản đồ:** Leaflet / React Leaflet
- **HTTP Client:** Axios
- **Icon:** Lucide React

### Backend (Server)
- **Framework:** FastAPI (Python)
- **Database:** PostgreSQL
- **ORM:** SQLAlchemy
- **Data Validation:** Pydantic
- **Authentication:** JWT (python-jose), Passlib (bcrypt)
- **Server:** Uvicorn

## 🛠️ Yêu cầu hệ thống
- [Node.js](https://nodejs.org/) (phiên bản 18+ trở lên)
- [Python](https://www.python.org/) (phiên bản 3.9+ trở lên)
- [PostgreSQL](https://www.postgresql.org/)

## ⚙️ Hướng dẫn cài đặt & Chạy ứng dụng

### 1. Cài đặt và chạy Backend (Server)
Mở terminal và di chuyển vào thư mục `server`:
```bash
cd server

# Cài đặt thư viện (nếu sử dụng uv hoặc pip)
pip install -r requirements.txt

# Chạy server FastAPI
uv run uvicorn app.main:app --reload
```
API Docs (Swagger UI) sẽ có sẵn tại: `http://localhost:8000/docs`

### 2. Cài đặt và chạy Frontend (Client)
Mở một terminal khác và di chuyển vào thư mục `client`:
```bash
cd client

# Cài đặt dependencies
npm install

# Khởi chạy ứng dụng
npm run dev
```
Giao diện frontend sẽ chạy tại: `http://localhost:5173`
