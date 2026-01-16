import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import '../App.css'

const ADMIN_USERNAME = 'admin'
const ADMIN_PASSWORD = '123456'

export default function AdminLogin() {
  const navigate = useNavigate()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()

    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
      localStorage.setItem('tutor_admin_logged_in', 'true')
      window.location.href = '/admin/dashboard'
    } else {
      setError('Sai tài khoản hoặc mật khẩu')
    }
  }

  return (
    <div className="app-shell">
      <main className="container" style={{ maxWidth: 420 }}>
        

        <div className="page-header">
          <h1 className="page-title">Đăng nhập Admin</h1>
          <p className="page-subtitle">Quản lý danh sách lớp gia sư</p>
        </div>

        <form className="grid" onSubmit={handleSubmit}>
          <div>
            <label className="field-label">Username</label>
            <input
              className="field-input"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          <div>
            <label className="field-label">Password</label>
            <input
              type="password"
              className="field-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {error && <div className="alert alert-error">{error}</div>}

          <button type="submit" className="btn btn-primary">
            Đăng nhập
          </button>
          {/* 🔙 NÚT QUAY LẠI HOME */}
          <div style={{ display: 'flex', justifyContent: 'center' }}>
  <button
    className="btn btn-outline"
    style={{ marginBottom: 16 }}
    onClick={() => navigate('/')}
  >
    ← Về trang Home
  </button>
</div>

        </form>
      </main>
    </div>
  )
}
