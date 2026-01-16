import { Navigate } from 'react-router-dom'

export default function RequireAdmin({ children }) {
  const isAdmin = localStorage.getItem('tutor_admin_logged_in') === 'true'

  if (!isAdmin) {
    return <Navigate to="/admin/login" replace />
  }

  return children
}
