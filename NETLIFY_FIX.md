# 🔧 Sửa lỗi Build Failed trên Netlify

## ❌ Lỗi: "vite: not found"

### Nguyên nhân:
Netlify không tự động cài đặt dependencies trước khi build.

### ✅ Giải pháp:

#### Cách 1: Cập nhật Build Command trong Netlify UI (Nhanh nhất)

1. Vào Netlify Dashboard > Site settings > Build & deploy
2. Tìm phần "Build settings"
3. Click "Edit settings"
4. Cập nhật **Build command**:
   ```
   cd client && npm install && npm run build
   ```
5. Click "Save"
6. Trigger deploy lại (Deploys > Trigger deploy > Deploy site)

#### Cách 2: Sử dụng file `netlify.toml` (Khuyến nghị)

File `netlify.toml` đã được tạo ở root với cấu hình đúng:

```toml
[build]
  base = "client"
  command = "npm install && npm run build"
  publish = "client/dist"
```

**Sau khi commit và push file này:**
1. Netlify sẽ tự động đọc cấu hình từ `netlify.toml`
2. Không cần cấu hình trong UI nữa
3. Build sẽ tự động chạy `npm install` trước

#### Cách 3: Kiểm tra Base Directory

Đảm bảo trong Netlify UI:
- **Base directory:** `client` (hoặc để trống nếu dùng `netlify.toml`)
- **Build command:** `npm install && npm run build` (hoặc để trống nếu dùng `netlify.toml`)
- **Publish directory:** `client/dist` (hoặc để trống nếu dùng `netlify.toml`)

## 🔍 Kiểm tra lại

Sau khi sửa, deploy log sẽ hiển thị:
```
Installing dependencies...
Installing NPM modules using NPM version 9.x.x
...
Running build command
> vite build
✓ built in X.XXs
```

## 📝 Checklist

- [ ] Đã cập nhật Build command thành `npm install && npm run build`
- [ ] File `netlify.toml` đã được commit và push
- [ ] Base directory đúng là `client`
- [ ] Publish directory đúng là `client/dist`
- [ ] Đã trigger deploy lại
- [ ] Build thành công

## 🆘 Nếu vẫn lỗi

1. **Kiểm tra Node version:**
   - Đảm bảo Node 18+ (đã cấu hình trong `netlify.toml`)

2. **Kiểm tra package.json:**
   - Đảm bảo `package.json` có trong thư mục `client/`
   - Đảm bảo có script `build`

3. **Xem build logs chi tiết:**
   - Vào Deploys > Click vào deploy failed
   - Xem phần "Installing dependencies" và "Building"

4. **Clear cache và rebuild:**
   - Site settings > Build & deploy > Clear cache and deploy site
