// API Configuration
// Sử dụng environment variable hoặc fallback về localhost cho development
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000'

export default API_URL

// Helper function để tạo full API endpoint
export const apiEndpoint = (path) => {
  // Đảm bảo path bắt đầu bằng /
  const cleanPath = path.startsWith('/') ? path : `/${path}`
  return `${API_URL}${cleanPath}`
}
