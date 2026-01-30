# Fix Frontend API URL trên VPS

## Vấn đề

Frontend đang cố kết nối đến `localhost:3001/api` nhưng:
- Nếu truy cập từ browser bên ngoài VPS → `localhost` không hoạt động
- Cần trỏ đến IP VPS: `http://222.255.119.53:3001/api`

## Giải pháp

### Option 1: Frontend chạy trên VPS (Khuyến nghị)

Nếu cả frontend và backend đều chạy trên VPS:

```bash
# Vào thư mục root
cd /opt/blog-huy

# Sửa file .env
nano .env
```

Thêm/sửa:
```env
VITE_API_BASE_URL=http://localhost:3001/api
```

**Lưu ý:** Dùng `localhost` vì cả frontend và backend đều chạy trên cùng VPS.

```bash
# Rebuild frontend
npm run build

# Restart frontend với PM2
pm2 restart blog-frontend
```

### Option 2: Frontend chạy local, Backend trên VPS

Nếu bạn truy cập frontend từ máy local:

```bash
# Trên máy local, sửa file .env
# Windows: notepad .env
```

Thêm/sửa:
```env
VITE_API_BASE_URL=http://222.255.119.53:3001/api
```

```bash
# Restart frontend local
npm run dev
```

### Option 3: Dùng relative URL (Nếu dùng Nginx reverse proxy)

Nếu bạn cấu hình Nginx để route `/api` đến backend:

```env
VITE_API_BASE_URL=/api
```

Sau đó Nginx sẽ tự động route `/api` đến `http://localhost:3001`.

## Kiểm tra

1. **Kiểm tra file .env trên VPS:**
   ```bash
   cat /opt/blog-huy/.env
   ```

2. **Kiểm tra build có đúng không:**
   ```bash
   # Xem file build có chứa đúng URL không
   grep -r "localhost:3001" /opt/blog-huy/dist/
   # Hoặc
   grep -r "222.255.119.53" /opt/blog-huy/dist/
   ```

3. **Test từ browser:**
   - Mở browser console (F12)
   - Xem Network tab
   - Kiểm tra URL đang được gọi

## Troubleshooting

### Vẫn lỗi sau khi rebuild

1. **Clear browser cache:**
   - Ctrl + Shift + R (hard refresh)
   - Hoặc clear cache trong browser settings

2. **Kiểm tra PM2 đang serve đúng thư mục:**
   ```bash
   pm2 info blog-frontend
   # Đảm bảo đang serve từ /opt/blog-huy/dist
   ```

3. **Restart PM2:**
   ```bash
   pm2 restart blog-frontend
   pm2 logs blog-frontend
   ```

### CORS Error

Nếu gặp CORS error, đảm bảo backend đã enable CORS:

```javascript
// backend/server.js
app.use(cors()); // Đã có sẵn
```

### Port không accessible

Nếu port 3001 không accessible từ bên ngoài:
- Kiểm tra firewall
- Hoặc cấu hình Nginx reverse proxy
