# Hướng dẫn chạy Blog trên VPS

## Bước 1: Kiểm tra MongoDB

```bash
# Kiểm tra MongoDB đang chạy
sudo systemctl status mongod

# Nếu không chạy, khởi động
sudo systemctl start mongod
```

## Bước 2: Setup Backend

```bash
# Vào thư mục backend
cd /opt/blog-huy/backend

# Cài đặt dependencies
npm install

# Tạo file .env
nano .env
```

Thêm vào file `.env`:
```env
PORT=3001
MONGODB_URI=mongodb://localhost:27017
DB_NAME=blog_huy
NODE_ENV=production
```

Lưu file: `Ctrl + O`, `Enter`, `Ctrl + X`

```bash
# Cài đặt PM2 (nếu chưa có)
sudo npm install -g pm2

# Chạy backend với PM2
pm2 start server.js --name blog-backend

# Lưu PM2 process list
pm2 save

# Setup PM2 startup (tự động chạy khi reboot)
pm2 startup systemd
# Chạy lệnh được output
```

## Bước 3: Kiểm tra Backend

```bash
# Xem status
pm2 status

# Xem logs
pm2 logs blog-backend

# Test API
curl http://localhost:3001/health
```

Nếu thấy `{"status":"ok","database":"connected",...}`, backend đã chạy thành công!

## Bước 4: Build Frontend

```bash
# Vào thư mục root của project
cd /opt/blog-huy

# Cài đặt dependencies
npm install

# Tạo file .env cho frontend
nano .env
```

Thêm vào file `.env`:

**Nếu cả frontend và backend đều chạy trên VPS:**
```env
VITE_API_BASE_URL=http://localhost:3001/api
```

**Nếu frontend truy cập từ bên ngoài (qua IP):**
```env
VITE_API_BASE_URL=http://222.255.119.53:3001/api
```

**Lưu ý:** Thay `222.255.119.53` bằng IP thực tế của VPS.

Lưu file và build:

```bash
# Build production
npm run build
```

## Bước 5: Serve Frontend

```bash
# Cài đặt serve (nếu chưa có)
sudo npm install -g serve

# Serve frontend với PM2
pm2 serve dist 5173 --name blog-frontend --spa

# Lưu PM2 process list
pm2 save
```

## Bước 6: Kiểm tra tất cả services

```bash
# MongoDB
sudo systemctl status mongod

# Backend & Frontend
pm2 status
pm2 logs
```

## Bước 7: Test

```bash
# Test backend
curl http://localhost:3001/health

# Test frontend
curl http://localhost:5173
```

## Truy cập Blog

- **Frontend**: `http://your-vps-ip:5173`
- **Backend API**: `http://your-vps-ip:3001/health`

## Quản lý PM2

```bash
# Xem status
pm2 status

# Xem logs
pm2 logs blog-backend
pm2 logs blog-frontend

# Restart
pm2 restart blog-backend
pm2 restart blog-frontend

# Stop
pm2 stop blog-backend
pm2 stop blog-frontend
```

## Troubleshooting

### Backend không kết nối MongoDB

```bash
# Kiểm tra MongoDB
sudo systemctl status mongod
mongosh --eval "db.version()"

# Kiểm tra connection string trong .env
cat /opt/blog-huy/backend/.env
```

### Frontend không build được

```bash
# Kiểm tra Node version
node --version

# Xóa và cài lại
rm -rf node_modules package-lock.json
npm install
npm run build
```

### Port đã được sử dụng

```bash
# Kiểm tra port
sudo netstat -tlnp | grep 3001
sudo netstat -tlnp | grep 5173

# Kill process nếu cần
sudo kill -9 <PID>
```
