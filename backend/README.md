# Blog Huy Backend

Backend API server cho blog, sử dụng Express và MongoDB.

## Setup

### 1. Cài đặt dependencies

```bash
cd backend
npm install
```

### 2. Setup MongoDB

Bạn cần có MongoDB đang chạy. Có 2 lựa chọn:

#### Option A: MongoDB Local

1. Cài đặt MongoDB trên máy local: https://www.mongodb.com/try/download/community
2. Đảm bảo MongoDB đang chạy (mặc định: `mongodb://localhost:27017`)

#### Option B: MongoDB Atlas (Cloud)

1. Tạo tài khoản tại [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Tạo cluster mới
3. Lấy connection string (URI)
4. Thêm connection string vào `.env`

### 3. Tạo file .env

Tạo file `backend/.env`:

```env
PORT=3001
MONGODB_URI=mongodb://localhost:27017
DB_NAME=blog_huy
```

**Ví dụ với MongoDB Atlas:**
```env
PORT=3001
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/?retryWrites=true&w=majority
DB_NAME=blog_huy
```

**Lưu ý**: File `.env` không được commit lên git.

### 4. Chạy server

**Development mode (với auto-reload):**
```bash
npm run dev
```

**Production mode:**
```bash
npm start
```

Server sẽ chạy trên `http://localhost:3001`

## API Endpoints

### Posts

- `GET /api/posts` - Lấy tất cả posts (sắp xếp theo date desc)
- `GET /api/posts/:id` - Lấy post theo ID
- `POST /api/posts` - Tạo post mới
- `PUT /api/posts/:id` - Cập nhật post
- `DELETE /api/posts/:id` - Xóa post

### Social Links

- `GET /api/social-links` - Lấy tất cả social links
- `GET /api/social-links/:id` - Lấy social link theo ID
- `POST /api/social-links` - Tạo social link mới
- `PUT /api/social-links/:id` - Cập nhật social link
- `DELETE /api/social-links/:id` - Xóa social link

### Health Check

- `GET /health` - Kiểm tra server status và database connection

## Example Requests

### Create Post

```bash
curl -X POST http://localhost:3001/api/posts \
  -H "Content-Type: application/json" \
  -d '{
    "title": "My First Post",
    "content": "This is the content...",
    "category": "tech",
    "date": "2025-01-01"
  }'
```

### Create Social Link

```bash
curl -X POST http://localhost:3001/api/social-links \
  -H "Content-Type: application/json" \
  -d '{
    "platform": "Facebook",
    "username": "myusername",
    "url": "https://facebook.com/myusername"
  }'
```

## Database Structure

### Collections

- **posts**: Chứa các bài viết blog
- **socialLinks**: Chứa các liên kết mạng xã hội

### Indexes

- `posts.date` (descending) - Để sắp xếp posts theo ngày
- `posts.category` - Để filter theo category

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port | `3001` |
| `MONGODB_URI` | MongoDB connection string | `mongodb://localhost:27017` |
| `DB_NAME` | Database name | `blog_huy` |