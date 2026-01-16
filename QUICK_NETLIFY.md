# ⚡ Deploy Netlify - Hướng dẫn Nhanh

## 🚀 5 Bước Deploy lên Netlify (Miễn phí)

### Bước 1: Chuẩn bị Code
```bash
cd client
npm install
npm run build
```

### Bước 2: Đăng ký Netlify
1. Truy cập: https://www.netlify.com
2. Click "Sign up" (miễn phí)
3. Đăng nhập bằng GitHub/GitLab/Bitbucket

### Bước 3: Deploy
1. Click "Add new site" > "Import an existing project"
2. Chọn GitHub và chọn repository của bạn
3. Cấu hình:
   ```
   Base directory: client
   Build command: npm install && npm run build
   Publish directory: client/dist
   ```
   
   **Hoặc:** Nếu đã có file `netlify.toml` ở root, để Netlify tự động đọc cấu hình.
4. Click "Show advanced" > "New variable":
   ```
   Key: VITE_API_URL
   Value: https://your-backend-url.onrender.com
   ```
5. Click "Deploy site"

### Bước 4: Đợi Build
- Đợi 2-5 phút
- Netlify sẽ tự động tạo URL: `https://random-name-123.netlify.app`

### Bước 5: Test
- Truy cập URL được cung cấp
- Kiểm tra website hoạt động

## 🔗 Kết nối Custom Domain (Tùy chọn)

1. Vào Netlify Dashboard > Site settings > Domain management
2. Click "Add custom domain"
3. Nhập domain của bạn
4. Thêm DNS records theo hướng dẫn của Netlify

## ✅ Xong!

Website của bạn đã live trên Netlify!

**Lưu ý:**
- Mỗi khi push code lên GitHub, Netlify tự động deploy
- SSL được cung cấp miễn phí tự động
- Xem `NETLIFY_DEPLOY.md` để biết chi tiết hơn
