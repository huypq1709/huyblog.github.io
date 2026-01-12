# Bước tiếp theo sau khi MongoDB đã chạy

## ✅ Đã hoàn thành
- MongoDB đã được cài đặt và đang chạy
- MongoDB service: `active (running)`

## 📋 Các bước tiếp theo

### Bước 1: Upload code lên VPS

Bạn có thể upload code bằng một trong các cách sau:

#### Option A: Dùng Git (Khuyến nghị)

```bash
# Trên VPS
cd /opt
git clone <your-repo-url> blog-huy
cd blog-huy
```

#### Option B: Dùng SCP từ máy local

**⚠️ QUAN TRỌNG:** Phải chạy lệnh này từ máy Windows (PowerShell/CMD), KHÔNG phải từ VPS!

```powershell
# Từ máy Windows (PowerShell hoặc CMD)
# Điều hướng đến thư mục chứa blog_huy
cd C:\Users\phamq\Downloads

# Upload thư mục
scp -r blog_huy root@222.255.119.53:/opt/
```

**Lưu ý:**
- Thay `222.255.119.53` bằng IP thực tế của VPS
- Sẽ hỏi password của VPS
- Nếu lỗi "scp: command not found", cài OpenSSH Client trên Windows

Xem chi tiết trong file `UPLOAD_TO_VPS.md`

#### Option C: Dùng WinSCP hoặc FileZilla (GUI)

1. Kết nối VPS qua WinSCP/FileZilla
2. Upload toàn bộ thư mục `blog_huy` lên `/opt/blog-huy`

### Bước 2: Setup Backend

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

### Bước 3: Cài đặt PM2 (Process Manager)

```bash
# Cài đặt PM2 globally
sudo npm install -g pm2

# Chạy backend với PM2
cd /opt/blog-huy/backend
pm2 start server.js --name blog-backend

# Lưu PM2 process list để tự động restart khi reboot
pm2 save

# Setup PM2 startup script
pm2 startup systemd
# Chạy lệnh được output (sẽ có dạng: sudo env PATH=... pm2 startup systemd -u root --hp /root)
```

### Bước 4: Kiểm tra Backend

```bash
# Kiểm tra status
pm2 status

# Xem logs
pm2 logs blog-backend

# Test API
curl http://localhost:3001/health
```

Nếu thấy response `{"status":"ok","database":"connected",...}`, backend đã chạy thành công!

### Bước 5: Build Frontend

```bash
# Vào thư mục root của project
cd /opt/blog-huy

# Cài đặt dependencies
npm install

# Tạo file .env cho frontend
nano .env
```

Thêm vào file `.env`:

```env
VITE_API_BASE_URL=http://localhost:3001/api
```

Lưu file và build:

```bash
# Build production
npm run build
```

Output sẽ ở thư mục `dist/`

### Bước 6: Serve Frontend

#### Option A: Dùng PM2 serve (Đơn giản)

```bash
# Cài đặt serve (nếu chưa có)
sudo npm install -g serve

# Serve frontend với PM2
pm2 serve dist 5173 --name blog-frontend --spa

# Lưu PM2 process list
pm2 save
```

#### Option B: Copy static files vào thư mục web (Nếu dùng Nginx)

```bash
# Tạo thư mục cho static files
sudo mkdir -p /var/www/blog-huy

# Copy files đã build
sudo cp -r dist/* /var/www/blog-huy/

# Set permissions
sudo chown -R www-data:www-data /var/www/blog-huy
```

### Bước 7: Cấu hình Nginx/Docker để route traffic

Vì bạn đã có Docker chạy trên port 80/443, bạn cần cấu hình để:

- Route `/` → Frontend (port 5173 hoặc `/var/www/blog-huy`)
- Route `/api` → Backend (port 3001)

#### Nếu dùng Docker Nginx:

Tìm container Nginx:

```bash
docker ps
```

Xem cấu hình Nginx hiện tại:

```bash
# Tìm container name (ví dụ: nginx hoặc nginx-proxy)
docker exec -it <container-name> cat /etc/nginx/nginx.conf
```

Hoặc nếu có volume mount, sửa file config trên host.

#### Tạo Nginx config mới:

```bash
# Tạo file config
sudo nano /etc/nginx/sites-available/blog-huy
```

Thêm config:

```nginx
server {
    listen 80;
    server_name your-domain.com;  # Hoặc IP của VPS

    # Frontend
    location / {
        proxy_pass http://localhost:5173;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    # Backend API
    location /api {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

### Bước 8: Kiểm tra tất cả services

```bash
# MongoDB
sudo systemctl status mongod

# Backend
pm2 status
pm2 logs blog-backend

# Frontend
pm2 status
pm2 logs blog-frontend

# Test endpoints
curl http://localhost:3001/health
curl http://localhost:5173
```

## 📝 Tóm tắt commands

```bash
# 1. Upload code (git clone hoặc scp)

# 2. Setup Backend
cd /opt/blog-huy/backend
npm install
nano .env  # Tạo file .env với MONGODB_URI
pm2 start server.js --name blog-backend
pm2 save

# 3. Build Frontend
cd /opt/blog-huy
npm install
nano .env  # Tạo file .env với VITE_API_BASE_URL
npm run build

# 4. Serve Frontend
pm2 serve dist 5173 --name blog-frontend --spa
pm2 save

# 5. Kiểm tra
pm2 status
pm2 logs
```

## 🔍 Troubleshooting

### Backend không kết nối được MongoDB

```bash
# Kiểm tra MongoDB
mongosh --eval "db.version()"

# Kiểm tra connection string trong .env
cat /opt/blog-huy/backend/.env
```

### PM2 không chạy

```bash
# Kiểm tra Node.js
node --version

# Reinstall PM2
sudo npm install -g pm2
```

### Frontend không build được

```bash
# Kiểm tra Node version (cần >= 18)
node --version

# Xóa node_modules và cài lại
rm -rf node_modules package-lock.json
npm install
```

## 🎯 Mục tiêu tiếp theo

Sau khi hoàn thành các bước trên:
1. ✅ Backend chạy trên port 3001
2. ✅ Frontend chạy trên port 5173
3. ✅ MongoDB đang chạy
4. ⏳ Cấu hình Nginx/Docker để route traffic từ port 80/443

Sau đó bạn có thể truy cập blog qua domain hoặc IP của VPS!
