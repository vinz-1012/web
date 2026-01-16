import { useState } from 'react'
import './TutorRegisterModal.css'

export default function TutorRegisterModal({ open, onClose, selectedClass }) {
  const [submitting, setSubmitting] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')
  const [errorMessage, setErrorMessage] = useState('')

  // ✅ LẤY USER ĐÃ ĐĂNG NHẬP
  const user = JSON.parse(localStorage.getItem('tutor_user') || 'null')

  if (!open || !selectedClass) return null

  const handleConfirm = async () => {
    setSuccessMessage('')
    setErrorMessage('')

    // Kiểm tra nếu chưa đăng nhập
    if (!user) {
      setErrorMessage('Vui lòng đăng nhập để đăng ký nhận lớp')
      return
    }

    setSubmitting(true)
    try {
      // Tạo thông tin lớp để gửi vào ghi chú thêm
      const classInfo = `Mã lớp: ${selectedClass.code}\nMôn học: ${selectedClass.subject}\nĐịa chỉ: ${selectedClass.address}`
      
      // Gửi đăng ký nhận lớp với thông tin từ user và thông tin lớp vào ghi chú
      const res = await fetch('http://localhost:4000/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: user.fullName || '',
          email: user.email,
          phone: user.phone || '',
          subjects: user.subjects || '',
          area: user.area || '',
          note: classInfo // ✅ Gửi thông tin lớp vào ghi chú thêm
        })
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.message || 'Đăng ký thất bại')

      // ✅ Lưu mã lớp vào tài khoản
      try {
        const saveClassRes = await fetch('http://localhost:4000/api/auth/save-class', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: user.email,
            classCode: selectedClass.code
          })
        })

        const saveClassData = await saveClassRes.json()
        if (saveClassRes.ok && saveClassData.user) {
          // Cập nhật user trong localStorage với thông tin mới
          localStorage.setItem('tutor_user', JSON.stringify(saveClassData.user))
        }
      } catch (saveErr) {
        console.error('Lỗi khi lưu mã lớp vào tài khoản:', saveErr)
        // Không throw error ở đây vì đăng ký nhận lớp đã thành công
      }

      setSuccessMessage('🎉 Đăng ký nhận lớp thành công!')
      
      // Tự động đóng sau 2 giây
      setTimeout(() => {
        handleClose()
      }, 2000)
    } catch (err) {
      setErrorMessage(err.message || 'Có lỗi xảy ra, vui lòng thử lại.')
    } finally {
      setSubmitting(false)
    }
  }

  const handleClose = () => {
    setSuccessMessage('')
    setErrorMessage('')
    onClose()
  }

  return (
    <div className="modal-backdrop" onClick={handleClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <h2>Đăng ký nhận lớp {selectedClass.code}</h2>
            <p>{selectedClass.subject} · {selectedClass.address}</p>
          </div>
          <button className="modal-close" onClick={handleClose}>✕</button>
        </div>

        <div className="modal-body">
          {!user ? (
            <div className="register-prompt">
              <p>Vui lòng đăng nhập để đăng ký nhận lớp</p>
            </div>
          ) : (
            <div className="register-confirm">
              <div className="class-info">
                <h3>Thông tin lớp học</h3>
                <div className="info-item">
                  <strong>Mã lớp:</strong> {selectedClass.code}
                </div>
                <div className="info-item">
                  <strong>Môn học:</strong> {selectedClass.subject}
                </div>
                <div className="info-item">
                  <strong>Địa chỉ:</strong> {selectedClass.address}
                </div>
              </div>

              <div className="user-info">
                <h3>Thông tin của bạn</h3>
                <div className="info-item">
                  <strong>Họ tên:</strong> {user.fullName || 'Chưa cập nhật'}
                </div>
                <div className="info-item">
                  <strong>Email:</strong> {user.email}
                </div>
                <div className="info-item">
                  <strong>Số điện thoại:</strong> {user.phone || 'Chưa cập nhật'}
                </div>
              </div>

              {successMessage && <div className="alert alert-success">{successMessage}</div>}
              {errorMessage && <div className="alert alert-error">{errorMessage}</div>}
            </div>
          )}

          <div className="modal-footer">
            <button type="button" onClick={handleClose}>Hủy</button>
            {user && (
              <button 
                type="button" 
                onClick={handleConfirm} 
                disabled={submitting}
                className="btn btn-primary"
              >
                {submitting ? 'Đang gửi...' : 'Xác nhận đăng ký'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
