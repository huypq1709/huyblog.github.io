# Blog Huy

Personal blog với React, TypeScript, Tailwind CSS và MongoDB.

## Cấu trúc Project

```
blog_huy/
├── backend/          # Backend API server (Express + MongoDB)
├── src/              # Frontend (React + TypeScript)
└── ...
```

## Getting Started

### 1. Setup Backend

```bash
cd backend
npm install

# Tạo file .env và cấu hình MongoDB
# Xem backend/README.md hoặc MONGODB_SETUP.md để biết chi tiết

npm run dev
```

Backend sẽ chạy trên `http://localhost:3001`

### 2. Setup Frontend

```bash
# Từ root folder
npm install
npm run dev
```

Frontend sẽ chạy trên `http://localhost:5173` (hoặc port khác nếu 5173 đã được sử dụng)

### 3. Cấu hình Environment Variables

Tạo file `.env` trong root folder (cho frontend):

```env
VITE_API_BASE_URL=http://localhost:3001/api
```

## Documentation

- **Backend Setup**: Xem `backend/README.md` hoặc `BACKEND_SETUP.md`
- **MongoDB Setup**: Xem `MONGODB_SETUP.md`
- **VPS Deployment**: Xem `VPS_DEPLOYMENT.md` (hướng dẫn deploy lên VPS)
- **MongoDB VPS Setup**: Xem `MONGODB_VPS_SETUP.md` (setup MongoDB trên VPS)
- **Firebase Setup** (cho Authentication): Xem `FIREBASE_SETUP.md` hoặc `FIREBASE_QUICK_START.md`

## Features

- ✅ Blog với posts và categories
- ✅ Admin Dashboard để quản lý content
- ✅ Backend API riêng biệt
- ✅ MongoDB Database
- ✅ Firebase Authentication (cho admin login)
- ✅ Responsive design
- ✅ Bilingual support (English/Vietnamese)
