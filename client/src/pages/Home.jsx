import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import ClassCard from '../components/ClassCard.jsx'
import TutorRegisterModal from '../components/TutorRegisterModal.jsx'
import Footer from '../components/Footer.jsx'
import '../components/ClassCard.css'
import './Home.css'

export default function Home() {
  const navigate = useNavigate()
  const [classes, setClasses] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [selectedClass, setSelectedClass] = useState(null)
  const [user, setUser] = useState(null)

  // ✅ Load user từ localStorage
  useEffect(() => {
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
    }

    loadUser()

    // Lắng nghe thay đổi localStorage
    const handleStorageChange = (e) => {
      if (e.key === 'tutor_user') {
        loadUser()
      }
    }

    window.addEventListener('storage', handleStorageChange)
    window.addEventListener('userUpdated', loadUser)

    return () => {
      window.removeEventListener('storage', handleStorageChange)
      window.removeEventListener('userUpdated', loadUser)
    }
  }, [])

  // ✅ Chỉ fetch classes khi đã đăng nhập
  useEffect(() => {
    if (!user) {
      setLoading(false)
      return
    }

    async function fetchClasses() {
      setLoading(true)
      try {
        const res = await fetch('http://localhost:4000/api/classes')
        const text = await res.text()
        const data = JSON.parse(text)

        setClasses(Array.isArray(data) ? data.filter(cls => cls.status === true) : [])
      } catch (err) {
        console.error(err)
        setError('Không tải được danh sách lớp. Backend chưa có API /api/classes.')
      } finally {
        setLoading(false)
      }
    }

    fetchClasses()
  }, [user])

  // ✅ Scroll đến danh sách lớp sau khi đăng nhập thành công
  useEffect(() => {
    if (user && classes.length > 0) {
      // Scroll đến phần danh sách lớp sau 500ms
      setTimeout(() => {
        const classesSection = document.querySelector('.classes-section-main')
        if (classesSection) {
          classesSection.scrollIntoView({ behavior: 'smooth', block: 'start' })
        }
      }, 500)
    }
  }, [user, classes])

  return (
    <div className="app-shell">
      {/* ===== HERO ===== */}
      <header className="home-hero-purple">
        <div className="container home-hero-inner-purple">
          <div className="home-nav-purple">
            <div className="home-logo-purple">
              <h1>RISE</h1>
              <p>Road to International Standard Education</p>
            </div>

            {/* ===== AUTH BUTTONS ===== */}
            <div className="home-auth-buttons-purple">
              {!user ? (
                <>
                  <button 
                    className="btn btn-white" 
                    onClick={(e) => {
                      e.preventDefault()
                      navigate('/login')
                    }}
                  >
                    Đăng nhập
                  </button>
                  <button 
                    className="btn btn-outline-white" 
                    onClick={(e) => {
                      e.preventDefault()
                      navigate('/register')
                    }}
                  >
                    Đăng ký
                  </button>
                </>
              ) : (
                <>
                  <span className="user-greeting-purple">
                    👋 Xin chào, <b>{user.fullName || user.email}</b>
                  </span>
                  <button
                    className="btn btn-outline-white"
                    onClick={(e) => {
                      e.preventDefault()
                      localStorage.removeItem('tutor_user')
                      setUser(null)
                      window.dispatchEvent(new Event('userUpdated'))
                    }}
                  >
                    Đăng xuất
                  </button>
                </>
              )}
            </div>
          </div>

          <div className="hero-content-purple">
            <div className="hero-text-purple">
              <h2 className="hero-title-purple">Trung tâm Gia sư RISE</h2>
              <p className="hero-subtitle-purple">
                Con đường hướng tới giáo dục chuẩn quốc tế
              </p>
              <p className="hero-description-purple">
                RISE - nơi kết nối gia sư chất lượng với học sinh, mang đến trải nghiệm học tập xuất sắc và chuẩn quốc tế. 
                Chúng tôi cam kết đem đến những giáo viên tận tâm, phương pháp giảng dạy hiện đại và môi trường học tập lý tưởng.
              </p>
              <div className="hero-stats-purple">
                <div className="stat-item-purple">
                  <div className="stat-number-purple">500+</div>
                  <div className="stat-label-purple">Gia sư chuyên nghiệp</div>
                </div>
                <div className="stat-item-purple">
                  <div className="stat-number-purple">2000+</div>
                  <div className="stat-label-purple">Học sinh đã tin tưởng</div>
                </div>
                <div className="stat-item-purple">
                  <div className="stat-number-purple">98%</div>
                  <div className="stat-label-purple">Hài lòng từ phụ huynh</div>
                </div>
              </div>
            </div>
            <div className="hero-image-purple">
              <img 
                src="/images/download.jpg" 
                alt="Gia sư RISE đang hướng dẫn học sinh"
                className="hero-image-actual"
                onError={(e) => {
                  // Thử ảnh dự phòng
                  if (e.target.src.includes('download.jpg')) {
                    e.target.src = "/images/download (1).jpg"
                  } else {
                    e.target.src = "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=600&h=400&fit=crop"
                  }
                }}
              />
            </div>
          </div>
        </div>
      </header>

      {/* ===== ABOUT SECTION ===== */}
      <section className="about-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Về Trung tâm Gia sư RISE</h2>
            <p className="section-subtitle">
              RISE - Road to International Standard Education: Con đường hướng tới giáo dục chuẩn quốc tế
            </p>
          </div>

          <div className="about-content">
            <div className="about-text">
              <h3>Sứ mệnh của chúng tôi</h3>
              <p>
                Trung tâm Gia sư RISE được thành lập với sứ mệnh mang đến nền giáo dục chất lượng cao, 
                đạt chuẩn quốc tế cho học sinh Việt Nam. Chúng tôi tin rằng mỗi học sinh đều có tiềm năng 
                vô hạn và chỉ cần có phương pháp giảng dạy phù hợp cùng sự hướng dẫn tận tâm.
              </p>

              <h3>Tại sao chọn RISE?</h3>
              <div className="features-grid">
                <div className="feature-card">
                  <div className="feature-icon">🎯</div>
                  <h4>Giáo viên chất lượng</h4>
                  <p>Đội ngũ gia sư được tuyển chọn kỹ lưỡng, có trình độ chuyên môn cao và kinh nghiệm giảng dạy phong phú</p>
                </div>
                <div className="feature-card">
                  <div className="feature-icon">📖</div>
                  <h4>Phương pháp hiện đại</h4>
                  <p>Áp dụng các phương pháp giảng dạy tiên tiến, phù hợp với từng đối tượng học sinh</p>
                </div>
                <div className="feature-card">
                  <div className="feature-icon">🌟</div>
                  <h4>Chuẩn quốc tế</h4>
                  <p>Chương trình học được thiết kế theo tiêu chuẩn quốc tế, giúp học sinh phát triển toàn diện</p>
                </div>
                <div className="feature-card">
                  <div className="feature-icon">💼</div>
                  <h4>Linh hoạt</h4>
                  <p>Học tại nhà hoặc trực tuyến, thời gian linh hoạt phù hợp với lịch trình của học sinh</p>
                </div>
              </div>
            </div>

            <div className="about-image">
              <img 
                src="/images/download (1).jpg" 
                alt="Lớp học tại trung tâm RISE"
                className="about-image-actual"
                onError={(e) => {
                  // Thử ảnh dự phòng
                  if (e.target.src.includes('download (1).jpg')) {
                    e.target.src = "/images/download (2).jpg"
                  } else {
                    e.target.src = "https://images.unsplash.com/photo-1529390079861-591de354faf5?w=600&h=400&fit=crop"
                  }
                }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* ===== SERVICES SECTION ===== */}
      <section className="services-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Dịch vụ của chúng tôi</h2>
            <p className="section-subtitle">
              RISE cung cấp đa dạng các dịch vụ gia sư chất lượng cao
            </p>
          </div>

          <div className="services-grid">
            <div className="service-card">
              <div className="service-icon">📚</div>
              <h3>Gia sư theo môn học</h3>
              <p>Toán, Lý, Hóa, Văn, Anh và các môn học khác từ cấp 1 đến cấp 3</p>
            </div>
            <div className="service-card">
              <div className="service-icon">🎓</div>
              <h3>Luyện thi đại học</h3>
              <p>Chương trình luyện thi chuyên sâu, cam kết điểm số cao</p>
            </div>
            <div className="service-card">
              <div className="service-icon">🌍</div>
              <h3>Ngoại ngữ</h3>
              <p>Tiếng Anh, Tiếng Nhật, Tiếng Hàn với giáo viên bản ngữ</p>
            </div>
            <div className="service-card">
              <div className="service-icon">💻</div>
              <h3>Tin học</h3>
              <p>Tin học văn phòng, lập trình, thiết kế đồ họa</p>
            </div>
          </div>
        </div>
      </section>

      {/* ===== CLASSES SECTION - CHỈ HIỂN THỊ KHI ĐÃ ĐĂNG NHẬP ===== */}
      {user && (
        <section className="classes-section-main">
          <div className="container">
            <div className="section-header">
              <h2 className="section-title">Danh sách lớp đang tuyển</h2>
              <p className="section-subtitle">
                Tìm lớp phù hợp với khả năng và khu vực của bạn
              </p>
            </div>

            {loading && <p className="loading-text">Đang tải danh sách lớp...</p>}
            {error && <p className="error-text">{error}</p>}

            {!loading && !error && (
              <div className="classes-grid">
                {classes.length > 0 ? (
                  classes.map((item) => (
                    <ClassCard
                      key={item.id}
                      item={item}
                      onRegister={() => setSelectedClass(item)}
                    />
                  ))
                ) : (
                  <p className="no-classes">Hiện chưa có lớp nào đang tuyển. Vui lòng quay lại sau.</p>
                )}
              </div>
            )}
          </div>
        </section>
      )}

      {/* ===== LOGIN PROMPT - HIỂN THỊ KHI CHƯA ĐĂNG NHẬP ===== */}
      {!user && (
        <section className="login-prompt-section">
          <div className="container">
            <div className="login-prompt-card">
              <h2>🔐 Đăng nhập để xem danh sách lớp</h2>
              <p>Vui lòng đăng nhập hoặc đăng ký tài khoản để xem và đăng ký nhận lớp.</p>
              <div className="login-prompt-buttons">
                <button 
                  className="btn btn-primary" 
                  onClick={(e) => {
                    e.preventDefault()
                    navigate('/login')
                  }}
                >
                  Đăng nhập ngay
                </button>
                <button 
                  className="btn btn-outline" 
                  onClick={(e) => {
                    e.preventDefault()
                    navigate('/register')
                  }}
                >
                  Tạo tài khoản mới
                </button>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ===== GALLERY SECTION ===== */}
      <section className="gallery-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Hình ảnh hoạt động tại RISE</h2>
            <p className="section-subtitle">
              Những khoảnh khắc đẹp trong quá trình học tập tại trung tâm
            </p>
          </div>
          <div className="gallery-grid">
            <div className="gallery-item">
              <img 
                src="/images/download (2).jpg" 
                alt="Gia sư RISE hướng dẫn học sinh"
                onError={(e) => {
                  if (e.target.src.includes('download (2).jpg')) {
                    e.target.src = "/images/download (3).jpg"
                  } else {
                    e.target.src = "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=500&h=400&fit=crop"
                  }
                }}
              />
              <div className="gallery-overlay">
                <p>Học tập cá nhân hóa</p>
              </div>
            </div>
            <div className="gallery-item">
              <img 
                src="/images/download (3).jpg" 
                alt="Lớp học nhóm tại RISE"
                onError={(e) => {
                  if (e.target.src.includes('download (3).jpg')) {
                    e.target.src = "/images/download (4).jpg"
                  } else {
                    e.target.src = "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=500&h=400&fit=crop"
                  }
                }}
              />
              <div className="gallery-overlay">
                <p>Lớp học tương tác</p>
              </div>
            </div>
            <div className="gallery-item">
              <img 
                src="/images/download (4).jpg" 
                alt="Học sinh chăm chỉ tại RISE"
                onError={(e) => {
                  if (e.target.src.includes('download (4).jpg')) {
                    e.target.src = "/images/download (5).jpg"
                  } else {
                    e.target.src = "https://images.unsplash.com/photo-1529390079861-591de354faf5?w=500&h=400&fit=crop"
                  }
                }}
              />
              <div className="gallery-overlay">
                <p>Môi trường học tập tích cực</p>
              </div>
            </div>
            <div className="gallery-item">
              <img 
                src="/images/download (5).jpg" 
                alt="Học tập ngoài trời"
                onError={(e) => {
                  if (e.target.src.includes('download (5).jpg')) {
                    e.target.src = "/images/unnamed.jpg"
                  } else {
                    e.target.src = "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=500&h=400&fit=crop"
                  }
                }}
              />
              <div className="gallery-overlay">
                <p>Học tập linh hoạt</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== TESTIMONIALS SECTION ===== */}
      <section className="testimonials-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Phụ huynh nói gì về RISE</h2>
          </div>
          <div className="testimonials-grid">
            <div className="testimonial-card">
              <div className="testimonial-stars">⭐⭐⭐⭐⭐</div>
              <p className="testimonial-text">
                "Con tôi đã tiến bộ rõ rệt sau khi học với gia sư từ RISE. Giáo viên rất tận tâm và phương pháp giảng dạy rất hiệu quả."
              </p>
              <p className="testimonial-author">- Chị Nguyễn Thị Mai, Phụ huynh</p>
            </div>
            <div className="testimonial-card">
              <div className="testimonial-stars">⭐⭐⭐⭐⭐</div>
              <p className="testimonial-text">
                "RISE đã giúp con tôi đạt điểm cao trong kỳ thi đại học. Cảm ơn trung tâm rất nhiều!"
              </p>
              <p className="testimonial-author">- Anh Trần Văn Nam, Phụ huynh</p>
            </div>
            <div className="testimonial-card">
              <div className="testimonial-stars">⭐⭐⭐⭐⭐</div>
              <p className="testimonial-text">
                "Dịch vụ chuyên nghiệp, giáo viên chất lượng. Tôi rất hài lòng với RISE và sẽ tiếp tục sử dụng dịch vụ."
              </p>
              <p className="testimonial-author">- Chị Lê Thị Hoa, Phụ huynh</p>
            </div>
          </div>
        </div>
      </section>

      {/* ===== FOOTER ===== */}
      <Footer />

      {/* ===== REGISTER MODAL ===== */}
      <TutorRegisterModal
        open={!!selectedClass}
        selectedClass={selectedClass}
        user={user}
        onClose={() => setSelectedClass(null)}
      />
    </div>
  )
}
