import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { apiEndpoint } from "../config/api.js"
import "./UserLogin.css"

export default function UserLogin() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [errors, setErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)
  const [successMessage, setSuccessMessage] = useState("")
  const navigate = useNavigate()

  const validate = () => {
    const newErrors = {}
    if (!email.trim()) newErrors.email = "Vui lòng nhập email"
    if (!password.trim()) newErrors.password = "Vui lòng nhập mật khẩu"
    return newErrors
  }

  const login = async (e) => {
    e?.preventDefault()
    setErrors({})

    const validationErrors = validate()
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      return
    }

    setSubmitting(true)
    try {
      const res = await fetch(apiEndpoint("/api/auth/login"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      })

      // Kiểm tra nếu response không ok và không phải JSON
      let data
      try {
        const contentType = res.headers.get("content-type")
        if (!contentType || !contentType.includes("application/json")) {
          const text = await res.text()
          console.error("Server response is not JSON:", text.substring(0, 200))
          // Nếu là HTML error page, có thể server chưa chạy hoặc route sai
          if (text.includes("<!DOCTYPE") || text.includes("<html")) {
            throw new Error("Backend chưa chạy hoặc không phản hồi. Hãy chạy netlify dev để bật Functions.")
          }
          throw new Error("Server trả về lỗi không mong đợi.")
        }
        data = await res.json()
      } catch (parseError) {
        if (parseError.message.includes("Backend server")) {
          throw parseError
        }
        // Nếu không parse được JSON, có thể là network error
        if (!res.ok) {
          throw new Error(`Lỗi kết nối: ${res.status} ${res.statusText}`)
        }
        throw new Error("Không thể đọc phản hồi từ server.")
      }

      if (res.ok) {
        console.log("Login response:", data.user) // Debug
        localStorage.setItem("tutor_user", JSON.stringify(data.user))
        
        // ✅ PHÂN BIỆT ADMIN / USER - chuyển hướng ngay lập tức
        if (data.user && data.user.role === "admin") {
          console.log("Redirecting to admin dashboard") // Debug
          // Dùng window.location để force reload và đảm bảo redirect đúng
          // Không dùng return vì sẽ không chạy finally block
          setTimeout(() => {
            window.location.href = "/admin/dashboard"
          }, 100)
        } else {
          console.log("Redirecting to home") // Debug
          setTimeout(() => {
            window.location.href = "/"
          }, 100)
        }
      } else {
        setErrors({ general: data.message || "Sai tài khoản hoặc mật khẩu" })
      }
    } catch (err) {
      setErrors({ general: err.message || "Có lỗi xảy ra, vui lòng thử lại." })
      console.error("Login error:", err)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="login-container">
      <h2>Đăng nhập</h2>
      <form onSubmit={login} className="login-form">
        <div>
          <label>Email *</label>
          <input
            type="email"
            value={email}
            onChange={e => {
              setEmail(e.target.value)
              setErrors(prev => ({ ...prev, email: "" }))
            }}
            placeholder="Email"
          />
          {errors.email && <div className="field-error">{errors.email}</div>}
        </div>

        <div>
          <label>Mật khẩu *</label>
          <input
            type="password"
            value={password}
            onChange={e => {
              setPassword(e.target.value)
              setErrors(prev => ({ ...prev, password: "" }))
            }}
            placeholder="Mật khẩu"
          />
          {errors.password && <div className="field-error">{errors.password}</div>}
        </div>

        {successMessage && (
          <div className="alert alert-success">{successMessage}</div>
        )}
        {errors.general && (
          <div className="alert alert-error">{errors.general}</div>
        )}

        <div className="login-footer">
          <button 
            type="button" 
            className="btn btn-link" 
            onClick={() => navigate("/")}
          >
            ← Quay về trang chủ
          </button>
          <div className="login-footer-actions">
            <button 
              type="button" 
              className="btn btn-outline" 
              onClick={() => navigate("/register")}
            >
              Chưa có tài khoản?
            </button>
            <button 
              type="submit" 
              className="btn btn-primary" 
              disabled={submitting}
            >
              {submitting ? "Đang đăng nhập..." : "Đăng nhập"}
            </button>
          </div>
        </div>
      </form>
    </div>
  )
}
