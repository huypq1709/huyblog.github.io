// Simple script to create admin user using Firebase Web SDK
// Note: This requires user to be authenticated first, so it's mainly for reference
// Best to use Firebase Console or Admin SDK instead

// This script demonstrates how to create user programmatically
// But in practice, you should create admin users through Firebase Console
// or Firebase Admin SDK

console.log(`
╔═══════════════════════════════════════════════════════════╗
║        Hướng dẫn tạo Admin User trong Firebase            ║
╚═══════════════════════════════════════════════════════════╝

Cách đơn giản nhất:

1. Vào Firebase Console: https://console.firebase.google.com/
2. Chọn project: blog-s-huy
3. Vào Authentication > Users
4. Click "Add user"
5. Nhập:
   - Email: admin@admin
   - Password: Ah12345@
6. Click "Add user"

✅ Xong! Bạn có thể đăng nhập với thông tin trên.

════════════════════════════════════════════════════════════

Hoặc sử dụng Firebase CLI (nếu đã cài):

firebase auth:import users.json --project blog-s-huy

Với file users.json:
{
  "users": [{
    "localId": "admin123",
    "email": "admin@admin",
    "passwordHash": "...",
    "emailVerified": true
  }]
}

════════════════════════════════════════════════════════════

Chi tiết xem file: CREATE_ADMIN_USER.md
`);

