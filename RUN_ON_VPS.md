# Hướng dẫn chạy Blog trên VPS

## Cập nhật code mới từ GitHub (sau khi push)

Chạy **trên server (VPS)** để kéo code mới và build lại:

```bash
# Vào thư mục project (đường dẫn có thể là /opt/blog-huy hoặc nơi bạn clone)
cd /opt/blog-huy

# Kéo code mới từ GitHub
git pull origin main

# Cài lại dependencies nếu có thay đổi package.json (tùy chọn)
# npm install
# cd backend && npm install && cd ..

# Build lại frontend (bắt buộc sau khi pull)
npm run build

# Restart frontend để dùng bản build mới
pm2 restart blog-frontend

# Nếu có sửa backend, restart backend
# pm2 restart blog-backend
```

Sau đó truy cập lại trang web (có thể cần Ctrl+F5 hoặc xóa cache trình duyệt để thấy thay đổi).

---

## Hướng dẫn cài deploy.sh lên server

`deploy.sh` nằm trong repo (thư mục gốc project). Để dùng trên server:

### Bước 1: Có file deploy.sh trên server

**Cách A – Đã clone repo rồi:** kéo code mới để có `deploy.sh`:

```bash
cd /opt/blog-huy
git pull origin main
```

Sau khi pull, kiểm tra:

```bash
ls -l deploy.sh
```

Nếu thấy file `deploy.sh` là đã có.

**Cách B – Chưa có deploy.sh (repo cũ):** đảm bảo repo trên GitHub đã có file `deploy.sh` (đã push từ máy local), rồi trên server chạy:

```bash
cd /opt/blog-huy
git pull origin main
```

### Bước 2: Cho phép thực thi

```bash
cd /opt/blog-huy
chmod +x deploy.sh
```

Kiểm tra lại:

```bash
ls -l deploy.sh
```

Dòng hiển thị phải có chữ `x` (ví dụ: `-rwxr-xr-x`).

### Bước 3: Chạy thử (cập nhật thủ công)

```bash
cd /opt/blog-huy
bash deploy.sh
```

Script sẽ: `git pull` → `npm install` → `npm run build` → `pm2 restart blog-frontend` và `blog-backend`. Nếu chạy không lỗi là đã cài đúng.

### Bước 4 (tùy chọn): Tự chạy khi push – cấu hình GitHub Webhook

Nếu muốn mỗi lần push lên GitHub thì server tự chạy `deploy.sh`, làm tiếp theo mục **"Tự động cập nhật khi push (GitHub Webhook)"** bên dưới.

---

## Tự động cập nhật khi push (GitHub Webhook)

Mỗi khi bạn `git push` lên GitHub, server có thể tự chạy `git pull`, build lại frontend và restart PM2. Cách làm:

### 1. Trên server: cấu hình webhook secret và cho phép chạy deploy.sh

**Backend `.env`** (ví dụ `/opt/blog-huy/backend/.env`):

```env
PORT=3001
MONGODB_URI=mongodb://localhost:27017
DB_NAME=blog_huy
NODE_ENV=production

# Bí mật để GitHub gửi webhook (tự đặt chuỗi bất kỳ, ví dụ dùng: openssl rand -hex 32)
WEBHOOK_SECRET=openssl rand -hex 32
```

Tạo secret an toàn (chạy trên server hoặc máy local):

```bash
    openssl rand -hex 32
```

Copy kết quả vào `WEBHOOK_SECRET` trong `.env`, sau đó restart backend:

```bash
pm2 restart blog-backend
```

**Cho phép chạy script deploy:**

```bash
cd /opt/blog-huy
chmod +x deploy.sh
```

### 2. Trên GitHub: thêm Webhook

1. Vào repo **GitHub** → **Settings** → **Webhooks** → **Add webhook**.
2. **Payload URL:**  
   `http://IP-VPS-CỦA-BẠN:3001/api/deploy-webhook`  
   (Nếu có domain trỏ tới VPS: `https://api.ten-domain.com/api/deploy-webhook`.)
3. **Content type:** `application/json`.
4. **Secret:** dán đúng chuỗi đã đặt trong `WEBHOOK_SECRET` (backend `.env`).
5. **Which events:** chọn **Just the push event**.
6. Bấm **Add webhook**.

GitHub sẽ gửi một request "ping"; nếu cấu hình đúng bạn sẽ thấy dấu tick xanh.

### 3. Cách hoạt động

- Khi bạn **push** lên nhánh **main**, GitHub gửi POST tới `/api/deploy-webhook`.
- Backend kiểm tra chữ ký (secret), nếu đúng thì chạy `deploy.sh` trong thư mục gốc project.
- `deploy.sh` thực hiện: `git pull origin main` → `npm install` → `npm run build` → `pm2 restart blog-frontend` và `blog-backend`.

**Lưu ý:** Nếu VPS đứng sau tường lửa/NAT, đảm bảo port 3001 (hoặc domain API) mở từ internet để GitHub gửi webhook được. Không cần mở cho user cuối nếu bạn dùng domain khác cho frontend.

---

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
# Tùy chọn: dùng cho auto-deploy khi push (xem mục "Tự động cập nhật khi push")
# WEBHOOK_SECRET=your-secret-from-openssl-rand-hex-32
# Tùy chọn: dịch Việt -> Anh trong Admin (Gemini API free tier, lấy key tại https://aistudio.google.com/apikey)
# GEMINI_API_KEY=your-gemini-api-key
# GEMINI_MODEL=gemini-2.5-flash   (mặc định, stable; có thể đổi: gemini-2.5-flash-lite, gemini-2.0-flash-001)
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

### Dịch Việt → Anh (Gemini API, free tier)

Trong Admin có nút **"Tạo bản tiếng Anh từ tiếng Việt"** (Bio và Bài viết). Cần cấu hình API key:

1. Lấy key miễn phí: [Google AI Studio](https://aistudio.google.com/apikey) → Create API key.
2. Thêm vào **backend** `.env`: `GEMINI_API_KEY=your-key`.
3. Restart backend: `pm2 restart blog-backend`.

Nếu không cấu hình, nút vẫn hiển thị nhưng gọi API sẽ báo lỗi (có thể bỏ qua và tự nhập tiếng Anh).

**Nếu bị 502 Bad Gateway khi bấm "Tạo bản tiếng Anh":**

- Thường do **GEMINI_API_KEY** chưa set trên server hoặc key sai/hết hạn. Kiểm tra:
  ```bash
  cat /opt/blog-huy/backend/.env | grep GEMINI
  ```
  Thêm/sửa `GEMINI_API_KEY=...` (lấy key mới tại [Google AI Studio](https://aistudio.google.com/apikey)), rồi `pm2 restart blog-backend`.
- Xem log backend để biết lỗi chi tiết từ Gemini:
  ```bash
  pm2 logs blog-backend
  ```
  (Tìm dòng "Gemini API error" – 401/403 = key sai, 429 = vượt giới hạn, thử lại sau.)

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

### Frontend không build được / Deploy webhook báo "Deploy failed" (EBADENGINE, Node >= 20)

Một số package (Firebase, v.v.) yêu cầu **Node.js >= 20**. Trên server đang là Node v18 thì `npm install` hoặc `npm run build` có thể fail.

**Kiểm tra phiên bản Node trên server:**

```bash
node --version
```

Nếu hiển thị `v18.x.x`, cần nâng lên Node 20 trở lên.

**Cách 1 – Dùng nvm (khuyến nghị):**

```bash
# Cài nvm (nếu chưa có)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.1/install.sh | bash
source ~/.bashrc   # hoặc source ~/.profile

# Cài Node 20 LTS và dùng mặc định
nvm install 20
nvm use 20
nvm alias default 20

# Kiểm tra
node --version   # phải là v20.x.x
npm --version
```

Sau đó chạy lại deploy (hoặc push để webhook chạy):

```bash
cd /opt/blog-huy
bash deploy.sh
```

**Cách 2 – NodeSource (Ubuntu/Debian):**

```bash
# Node 20.x
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

node --version
```

Sau khi nâng Node lên 20+, chạy lại `bash deploy.sh` hoặc bấm "Redeliver" webhook trên GitHub.

### Port đã được sử dụng

```bash
# Kiểm tra port
sudo netstat -tlnp | grep 3001
sudo netstat -tlnp | grep 5173

# Kill process nếu cần
sudo kill -9 <PID>
```
