import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useEffect, useState } from 'react'

import HomePage from './pages/Home.jsx'

// AUTH (USER + ADMIN DÙNG CHUNG)
import UserLogin from './auth/UserLogin'
import UserRegister from './auth/UserRegister'

// ADMIN
import AdminDashboard from './admin/Dashboard.jsx'

import './App.css'

function App() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // LẤY USER CHUNG (CẢ ADMIN + USER)
    const loadUser = () => {
      const savedUser = localStorage.getItem('tutor_user')
      if (savedUser) {
        try {
          setUser(JSON.parse(savedUser))
        } catch (e) {
          console.error('Error parsing user:', e)
          setUser(null)
        }
      } else {
        setUser(null)
      }
      setLoading(false)
    }

    loadUser()

    // Lắng nghe thay đổi localStorage (khi đăng nhập/đăng xuất)
    const handleStorageChange = (e) => {
      if (e.key === 'tutor_user') {
        loadUser()
      }
    }

    window.addEventListener('storage', handleStorageChange)
    
    // Custom event để cập nhật khi đăng nhập trong cùng tab
    const handleUserUpdate = () => {
      loadUser()
    }
    window.addEventListener('userUpdated', handleUserUpdate)

    return () => {
      window.removeEventListener('storage', handleStorageChange)
      window.removeEventListener('userUpdated', handleUserUpdate)
    }
  }, [])

  if (loading) return null // hoặc spinner

  return (
    <BrowserRouter>
      <Routes>
        {/* HOME */}
        <Route path="/" element={<HomePage />} />

        {/* AUTH */}
        <Route
          path="/login"
          element={
            user
              ? user.role === 'admin'
                ? <Navigate to="/admin/dashboard" replace />
                : <Navigate to="/" replace />
              : <UserLogin />
          }
        />

        <Route
          path="/register"
          element={user ? <Navigate to="/" replace /> : <UserRegister />}
        />

        {/* ADMIN DASHBOARD */}
        <Route
          path="/admin/dashboard"
          element={
            (() => {
              // Debug: kiểm tra user
              const savedUser = localStorage.getItem('tutor_user')
              if (savedUser) {
                try {
                  const parsedUser = JSON.parse(savedUser)
                  if (parsedUser.role === 'admin') {
                    return <AdminDashboard />
                  }
                } catch (e) {
                  console.error('Error parsing user in route:', e)
                }
              }
              // Nếu không có user hoặc không phải admin, redirect về login
              return <Navigate to="/login" replace />
            })()
          }
        />

        {/* FALLBACK */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
