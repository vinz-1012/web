# 🚀 Hướng dẫn Deploy lên Netlify (Miễn phí)

## Tổng quan

Netlify là một platform miễn phí để deploy frontend React/Vite. Bạn có thể deploy frontend lên Netlify và backend lên Render.com hoặc Netlify Functions.

## 📋 Yêu cầu

- Tài khoản GitHub/GitLab/Bitbucket
- Code đã được push lên repository
- Tài khoản Netlify (miễn phí)

## 🎯 Bước 1: Chuẩn bị Code

### 1.1. Đảm bảo code đã sẵn sàng

```bash
cd client
npm install
npm run build
```

### 1.2. Tạo file `netlify.toml` (tùy chọn)

File này giúp Netlify tự động cấu hình đúng.

## 🚀 Bước 2: Deploy lên Netlify

### Cách 1: Deploy qua GitHub (Khuyến nghị)

1. **Đăng nhập Netlify:**
   - Truy cập https://www.netlify.com
   - Click "Sign up" hoặc "Log in"
   - Chọn đăng nhập bằng GitHub/GitLab/Bitbucket

2. **Tạo Site mới:**
   - Click "Add new site" > "Import an existing project"
   - Chọn "Deploy with GitHub" (hoặc GitLab/Bitbucket)
   - Authorize Netlify truy cập repository của bạn
   - Chọn repository chứa code

3. **Cấu hình Build Settings:**
   ```
   Base directory: client
   Build command: npm install && npm run build
   Publish directory: client/dist
   ```
   
   **Lưu ý:** Nếu bạn đã tạo file `netlify.toml` ở root, Netlify sẽ tự động đọc cấu hình từ file đó. Bạn có thể để trống các trường này trong UI.

4. **Environment Variables:**
   - Click "Show advanced" > "New variable"
   - Thêm biến:
     ```
     Key: VITE_API_URL
     Value: https://your-backend-url.onrender.com
     ```
   - (Hoặc để trống nếu chưa có backend URL)

5. **Deploy:**
   - Click "Deploy site"
   - Đợi build hoàn tất (2-5 phút)
   - Netlify sẽ tự động tạo URL: `https://random-name-123.netlify.app`

### Cách 2: Deploy bằng Netlify CLI

1. **Cài đặt Netlify CLI:**
   ```bash
   npm install -g netlify-cli
   ```

2. **Đăng nhập:**
   ```bash
   netlify login
   ```

3. **Deploy:**
   ```bash
   cd client
   npm run build
   netlify deploy --prod --dir=dist
   ```

   Hoặc deploy với drag & drop:
   ```bash
   netlify deploy --prod
   # Sau đó kéo thả thư mục client/dist vào terminal
   ```

## 🔧 Bước 3: Cấu hình Custom Domain (Tùy chọn)

### 3.1. Thêm Domain vào Netlify

1. Vào Netlify Dashboard > Site settings > Domain management
2. Click "Add custom domain"
3. Nhập domain của bạn (ví dụ: `tutorfinder.com`)
4. Netlify sẽ hiển thị DNS records cần thêm

### 3.2. Cấu hình DNS

**Option A: Sử dụng Netlify DNS (Khuyến nghị)**
- Netlify sẽ cung cấp nameservers
- Thay đổi nameservers tại nhà cung cấp domain:
  ```
  Nameserver 1: dns1.p01.nsone.net
  Nameserver 2: dns2.p01.nsone.net
  Nameserver 3: dns3.p01.nsone.net
  Nameserver 4: dns4.p01.nsone.net
  ```

**Option B: Sử dụng DNS của nhà cung cấp domain**
- Thêm A record:
  ```
  Type: A
  Name: @
  Value: 75.2.60.5
  ```
- Thêm CNAME record:
  ```
  Type: CNAME
  Name: www
  Value: your-site-name.netlify.app
  ```

### 3.3. SSL Certificate

- Netlify tự động cung cấp SSL miễn phí (Let's Encrypt)
- SSL sẽ được kích hoạt tự động sau khi DNS propagate (24-48 giờ)

## 🔄 Bước 4: Continuous Deployment

Netlify tự động deploy khi bạn push code lên GitHub:

1. Mỗi khi push code lên branch `main` (hoặc `master`)
2. Netlify tự động build và deploy
3. Bạn sẽ nhận email thông báo deploy thành công/thất bại

### Cấu hình Branch Deploy

- Vào Site settings > Build & deploy > Continuous Deployment
- Có thể cấu hình deploy preview cho các pull requests

## ⚙️ Bước 5: Cấu hình Environment Variables

### Thêm Environment Variables:

1. Vào Site settings > Environment variables
2. Click "Add variable"
3. Thêm các biến:
   ```
   VITE_API_URL=https://api.your-domain.com
   ```
4. Click "Save"
5. Redeploy site để áp dụng thay đổi

### Environment Variables theo Branch:

- Có thể set biến khác nhau cho production, staging, preview
- Ví dụ:
  - Production: `VITE_API_URL=https://api.production.com`
  - Staging: `VITE_API_URL=https://api.staging.com`

## 📝 File cấu hình Netlify

### `netlify.toml` (trong thư mục `client/`)

```toml
[build]
  base = "client"
  command = "npm run build"
  publish = "dist"

[build.environment]
  NODE_VERSION = "18"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-XSS-Protection = "1; mode=block"
    X-Content-Type-Options = "nosniff"
    Referrer-Policy = "strict-origin-when-cross-origin"
```

## 🐛 Troubleshooting

### Lỗi Build Failed:

1. **Kiểm tra Build Logs:**
   - Vào Deploys > Click vào deploy failed
   - Xem logs để tìm lỗi

2. **Lỗi thường gặp:**
   - `Module not found`: Kiểm tra `package.json` có đầy đủ dependencies
   - `Build command failed`: Kiểm tra script `build` trong `package.json`
   - `Publish directory not found`: Kiểm tra `publish` directory trong settings

### Lỗi 404 trên các routes:

- Thêm file `_redirects` trong `client/public/`:
  ```
  /*    /index.html   200
  ```

### Environment Variables không hoạt động:

- Đảm bảo biến bắt đầu bằng `VITE_` cho Vite
- Redeploy site sau khi thêm/sửa biến
- Kiểm tra build logs để xem biến có được inject không

### DNS không hoạt động:

- Kiểm tra DNS records đã được thêm đúng chưa
- Sử dụng https://dnschecker.org để kiểm tra
- Đợi 24-48 giờ để DNS propagate

## 💡 Tips & Best Practices

1. **Preview Deploys:**
   - Mỗi pull request sẽ có preview URL riêng
   - Test trước khi merge vào main

2. **Deploy Contexts:**
   - Production: Branch `main`
   - Deploy previews: Pull requests
   - Branch deploys: Các branch khác

3. **Build Optimization:**
   - Netlify tự động optimize assets
   - Sử dụng Netlify Edge Functions cho performance tốt hơn

4. **Analytics:**
   - Netlify Analytics (có phí) hoặc Google Analytics (miễn phí)
   - Xem traffic và performance

5. **Form Handling:**
   - Netlify Forms miễn phí (nếu cần thay Google Forms)

## 📊 So sánh Netlify vs Vercel

| Tính năng | Netlify | Vercel |
|-----------|---------|--------|
| Free tier | ✅ 100GB bandwidth/tháng | ✅ 100GB bandwidth/tháng |
| Build time | 300 phút/tháng | 6000 phút/tháng |
| SSL | ✅ Tự động | ✅ Tự động |
| CDN | ✅ Global | ✅ Global |
| Functions | ✅ Netlify Functions | ✅ Vercel Functions |
| Dễ sử dụng | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ |

## 🔗 Kết nối với Backend

Sau khi deploy frontend, cập nhật:

1. **Backend CORS:**
   - Trong `server/index.js`, thêm domain Netlify vào `CLIENT_ORIGIN`:
     ```javascript
     const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN || 'https://your-site.netlify.app'
     ```

2. **Frontend Environment Variable:**
   - Trong Netlify Dashboard, thêm:
     ```
     VITE_API_URL=https://your-backend-url.onrender.com
     ```

## 📞 Hỗ trợ

- Netlify Docs: https://docs.netlify.com
- Netlify Community: https://answers.netlify.com
- Netlify Status: https://www.netlify.com/status

## ✅ Checklist Deploy

- [ ] Code đã được push lên GitHub
- [ ] `npm run build` chạy thành công
- [ ] Đã tạo tài khoản Netlify
- [ ] Đã connect repository
- [ ] Đã cấu hình build settings
- [ ] Đã thêm environment variables
- [ ] Deploy thành công
- [ ] Test website hoạt động
- [ ] (Tùy chọn) Đã thêm custom domain
- [ ] (Tùy chọn) SSL đã được kích hoạt
