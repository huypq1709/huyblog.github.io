# Hướng dẫn Upload Code lên VPS

## Cách 1: SCP từ Windows (PowerShell/CMD)

**⚠️ QUAN TRỌNG:** Phải chạy lệnh này từ máy Windows, KHÔNG phải từ VPS!

### Bước 1: Mở PowerShell hoặc CMD trên Windows

### Bước 2: Chạy lệnh SCP

```powershell
# Từ thư mục chứa blog_huy
cd C:\Users\phamq\Downloads

# Upload toàn bộ thư mục
scp -r blog_huy root@222.255.119.53:/opt/
```

**Lưu ý:**
- `-r` = recursive (upload cả thư mục)
- `root@222.255.119.53` = user@IP của VPS
- `/opt/` = thư mục đích trên VPS
- Sẽ hỏi password của VPS

### Nếu gặp lỗi "scp: command not found"

Cài OpenSSH trên Windows:
```powershell
# Chạy PowerShell as Administrator
Add-WindowsCapability -Online -Name OpenSSH.Client~~~~0.0.1.0
```

## Cách 2: Dùng WinSCP (GUI - Dễ nhất)

### Bước 1: Download WinSCP
- Tải từ: https://winscp.net/

### Bước 2: Kết nối VPS
1. Mở WinSCP
2. New Session:
   - **File protocol**: SFTP
   - **Host name**: `222.255.119.53`
   - **User name**: `root`
   - **Password**: (nhập password VPS)
3. Click **Login**

### Bước 3: Upload files
1. Bên trái: Chọn thư mục `C:\Users\phamq\Downloads\blog_huy`
2. Bên phải: Navigate đến `/opt/`
3. Kéo thả thư mục `blog_huy` từ trái sang phải
4. Chờ upload xong

## Cách 3: Dùng Git (Khuyến nghị nếu có repo)

### Trên VPS:

```bash
cd /opt
git clone <your-repo-url> blog-huy
cd blog-huy
```

Nếu chưa có Git repo, có thể tạo trên GitHub/GitLab rồi clone.

## Cách 4: Dùng FileZilla (Tương tự WinSCP)

1. Download FileZilla: https://filezilla-project.org/
2. Kết nối với SFTP:
   - Host: `sftp://222.255.119.53`
   - Username: `root`
   - Password: (password VPS)
3. Upload thư mục `blog_huy` lên `/opt/`

## Sau khi upload xong

Trên VPS, kiểm tra:

```bash
ls -la /opt/blog-huy
# Hoặc
ls -la /opt/blog_huy
```

Nếu thấy các file như `package.json`, `src/`, `backend/`, v.v. thì đã upload thành công!

## Troubleshooting

### Lỗi "Permission denied"

```bash
# Trên VPS, set permissions
sudo chown -R root:root /opt/blog-huy
```

### Lỗi "Connection refused"

- Kiểm tra firewall VPS
- Đảm bảo port 22 (SSH) đang mở

### Upload chậm

- Có thể zip file trước, upload, rồi unzip trên VPS:
  ```bash
  # Trên Windows: zip -r blog_huy.zip blog_huy
  # Upload blog_huy.zip
  # Trên VPS: unzip blog_huy.zip
  ```
