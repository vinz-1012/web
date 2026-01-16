// API Configuration
// Sử dụng environment variable nếu có, mặc định dùng relative path (phu hop Netlify Functions)
const API_URL = import.meta.env.VITE_API_URL ?? ''

export default API_URL

// Helper function để tạo full API endpoint
export const apiEndpoint = (path) => {
  // Đảm bảo path bắt đầu bằng /
  const cleanPath = path.startsWith('/') ? path : `/${path}`
  if (!API_URL) {
    return cleanPath
  }
  return `${API_URL.replace(/\/$/, '')}${cleanPath}`
}
