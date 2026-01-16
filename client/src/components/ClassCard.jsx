import './ClassCard.css'

const subjectColors = {
  'Toán lớp 9': '#2563eb',
  'Khiêu vũ người lớn': '#ec4899'
}

export default function ClassCard({ item, onRegister }) {
  const color = subjectColors[item.subject] || '#6366f1'

  return (
    <div className="class-card" style={{ borderTopColor: color }}>
      <div className="class-card-header">
        <span className="class-code">{item.code}</span>
        <div className="class-subject-wrap">
          <span className="class-subject-icon" aria-hidden="true">
            📚
          </span>
          <span className="class-subject" style={{ color }}>
            {item.subject}
          </span>
        </div>
      </div>
      <div className="class-meta">
        <p>
          <span className="class-meta-icon" aria-hidden="true">
            👤
          </span>
          <strong>Yêu cầu:</strong> {item.requirement}
        </p>
        <p>
          <span className="class-meta-icon" aria-hidden="true">
            ⏰
          </span>
          <strong>Thời gian:</strong> {item.schedule}
        </p>
        <p>
          <span className="class-meta-icon" aria-hidden="true">
            💰
          </span>
          <strong>Lương:</strong> {item.salary}
        </p>
        <p>
          <span className="class-meta-icon" aria-hidden="true">
            📍
          </span>
          <strong>Địa chỉ:</strong> {item.address}
        </p>
      </div>
      <button className="btn btn-primary class-card-btn" onClick={() => onRegister(item)}>
        Đăng ký nhận lớp
      </button>
    </div>
  )
}

