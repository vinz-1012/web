import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import ClassForm from './ClassForm.jsx'
import { apiEndpoint } from '../config/api.js'
import '../App.css'

export default function AdminDashboard() {
  const navigate = useNavigate()
  const [classes, setClasses] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingClass, setEditingClass] = useState(null)

  const loadClasses = async () => {
    setLoading(true)
    try {
      const res = await fetch(apiEndpoint('/api/classes/admin'))
      const data = await res.json()
      setClasses(Array.isArray(data) ? data : [])
    } catch (err) {
      console.error(err)
      setError('Không tải được danh sách lớp.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    // ✅ Kiểm tra user từ tutor_user với role admin
    const savedUser = localStorage.getItem('tutor_user')
    if (savedUser) {
      try {
        const user = JSON.parse(savedUser)
        if (user.role !== 'admin') {
          navigate('/login')
          return
        }
      } catch (e) {
        console.error('Error parsing user:', e)
        navigate('/login')
        return
      }
    } else {
      navigate('/login')
      return
    }
    loadClasses()
  }, [navigate])

  const handleLogout = () => {
    localStorage.removeItem('tutor_user')
    localStorage.removeItem('tutor_admin_logged_in')
    window.location.href = '/'   // ⬅️ về Home luôn
  }
  

  const handleDelete = async (cls) => {
    if (!window.confirm(`Xoá lớp ${cls.code}?`)) return
    try {
      const res = await fetch(apiEndpoint(`/api/classes/${cls.id}`), {
        method: 'DELETE'
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.message || 'Xoá lớp thất bại')
      await loadClasses()
    } catch (err) {
      alert(err.message)
    }
  }

  const handleToggleStatus = async (cls) => {
    try {
      const res = await fetch(apiEndpoint(`/api/classes/${cls.id}/status`), {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: !cls.status })
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.message || 'Cập nhật trạng thái thất bại')
      await loadClasses()
    } catch (err) {
      alert(err.message)
    }
  }

  return (
    <div className="app-shell">
      <main className="container">
        <div className="page-header">
          <div>
            <h1 className="page-title">Quản lý lớp gia sư</h1>
            <p className="page-subtitle">Thêm, chỉnh sửa, bật/tắt hiển thị các lớp.</p>
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <button className="btn btn-outline" onClick={handleLogout}>
              Đăng xuất
            </button>
            <button
              className="btn btn-primary"
              onClick={() => {
                setEditingClass(null)
                setIsFormOpen(true)
              }}
            >
              + Thêm lớp
            </button>
          </div>
        </div>

        {loading && <p>Đang tải danh sách lớp...</p>}
        {error && <p style={{ color: '#b91c1c' }}>{error}</p>}

        {!loading && !error && (
          <div style={{ overflowX: 'auto' }}>
            <table className="table">
              <thead>
                <tr>
                  <th>Mã lớp</th>
                  <th>Môn học</th>
                  <th>Thời gian</th>
                  <th>Lương</th>
                  <th>Trạng thái</th>
                  <th>Hành động</th>
                </tr>
              </thead>
              <tbody>
                {classes.map((cls) => (
                  <tr key={cls.id}>
                    <td>{cls.code}</td>
                    <td>{cls.subject}</td>
                    <td>{cls.schedule}</td>
                    <td>{cls.salary}</td>
                    <td>
                      <span className={`badge ${cls.status ? 'badge-on' : 'badge-off'}`}>
                        {cls.status ? 'ON' : 'OFF'}
                      </span>
                    </td>
                    <td>
                      <div className="table-actions">
                        <button
                          className="btn btn-outline"
                          style={{ padding: '4px 10px', fontSize: 12 }}
                          onClick={() => {
                            setEditingClass(cls)
                            setIsFormOpen(true)
                          }}
                        >
                          Sửa
                        </button>
                        <button
                          className="btn btn-outline"
                          style={{ padding: '4px 10px', fontSize: 12 }}
                          onClick={() => handleDelete(cls)}
                        >
                          Xoá
                        </button>
                        <button
                          className="btn btn-outline"
                          style={{ padding: '4px 10px', fontSize: 12 }}
                          onClick={() => handleToggleStatus(cls)}
                        >
                          {cls.status ? 'Ẩn' : 'Hiện'}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>

      <ClassForm
        open={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSaved={loadClasses}
        editingClass={editingClass}
      />
    </div>
  )
}

