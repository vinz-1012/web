import { useEffect, useState } from 'react'
import { apiEndpoint } from '../config/api.js'
import '../App.css'

const emptyClass = {
  code: '',
  subject: '',
  requirement: '',
  schedule: '',
  salary: '',
  address: '',
  status: true
}

export default function ClassForm({ open, onClose, onSaved, editingClass }) {
  const [form, setForm] = useState(emptyClass)
  const [errors, setErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (editingClass) {
      setForm({
        code: editingClass.code || '',
        subject: editingClass.subject || '',
        requirement: editingClass.requirement || '',
        schedule: editingClass.schedule || '',
        salary: editingClass.salary || '',
        address: editingClass.address || '',
        status: editingClass.status ?? true
      })
    } else {
      setForm(emptyClass)
    }
    setErrors({})
  }, [editingClass])

  if (!open) return null

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setForm((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }))
  }

  const validate = () => {
    const newErrors = {}
    ;['code', 'subject', 'requirement', 'schedule', 'salary', 'address'].forEach((field) => {
      if (!form[field].trim()) newErrors[field] = 'Không được để trống'
    })
    return newErrors
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const validationErrors = validate()
    if (Object.keys(validationErrors).length) {
      setErrors(validationErrors)
      return
    }

    setSubmitting(true)
    try {
      const method = editingClass ? 'PUT' : 'POST'
      const url = editingClass
        ? apiEndpoint(`/api/classes/${editingClass.id}`)
        : apiEndpoint('/api/classes')

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.message || 'Lưu lớp thất bại')
      onSaved()
      onClose()
    } catch (err) {
      alert(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <h2>{editingClass ? 'Sửa lớp' : 'Thêm lớp mới'}</h2>
          </div>
          <button className="modal-close" onClick={onClose}>
            ✕
          </button>
        </div>

        <form className="modal-body" onSubmit={handleSubmit}>
          <div className="grid grid-cols-2">
            <div>
              <label className="field-label" htmlFor="code">Mã lớp *</label>
              <input
                id="code"
                name="code"
                className="field-input"
                value={form.code}
                onChange={handleChange}
              />
              {errors.code && <div className="field-error">{errors.code}</div>}
            </div>
            <div>
              <label className="field-label" htmlFor="subject">Môn học *</label>
              <input
                id="subject"
                name="subject"
                className="field-input"
                value={form.subject}
                onChange={handleChange}
              />
              {errors.subject && <div className="field-error">{errors.subject}</div>}
            </div>
          </div>

          <div>
            <label className="field-label" htmlFor="requirement">Yêu cầu *</label>
            <input
              id="requirement"
              name="requirement"
              className="field-input"
              value={form.requirement}
              onChange={handleChange}
            />
            {errors.requirement && <div className="field-error">{errors.requirement}</div>}
          </div>

          <div className="grid grid-cols-2">
            <div>
              <label className="field-label" htmlFor="schedule">Thời gian *</label>
              <input
                id="schedule"
                name="schedule"
                className="field-input"
                value={form.schedule}
                onChange={handleChange}
              />
              {errors.schedule && <div className="field-error">{errors.schedule}</div>}
            </div>
            <div>
              <label className="field-label" htmlFor="salary">Lương *</label>
              <input
                id="salary"
                name="salary"
                className="field-input"
                value={form.salary}
                onChange={handleChange}
              />
              {errors.salary && <div className="field-error">{errors.salary}</div>}
            </div>
          </div>

          <div>
            <label className="field-label" htmlFor="address">Địa chỉ *</label>
            <input
              id="address"
              name="address"
              className="field-input"
              value={form.address}
              onChange={handleChange}
            />
            {errors.address && <div className="field-error">{errors.address}</div>}
          </div>

          <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, marginTop: 4 }}>
            <input
              type="checkbox"
              name="status"
              checked={form.status}
              onChange={handleChange}
            />
            Hiển thị cho gia sư (ON)
          </label>

          <div className="modal-footer">
            <button type="button" className="btn btn-outline" onClick={onClose}>
              Hủy
            </button>
            <button type="submit" className="btn btn-primary" disabled={submitting}>
              {submitting ? 'Đang lưu...' : 'Lưu lớp'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

