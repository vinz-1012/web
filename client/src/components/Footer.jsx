import './Footer.css'

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        {/* Top Section - Social Media */}
        <div className="footer-top">
          <div className="footer-social">
            <button className="footer-like-btn">Like 175K</button>
            <button className="footer-share-btn">Share</button>
          </div>
          <div className="footer-logo">
            <h2>RISE®</h2>
            <p>Road to International Standard Education</p>
          </div>
          <div className="footer-social-icons">
            <a href="#" className="social-icon" aria-label="Facebook">📘</a>
            <a href="#" className="social-icon" aria-label="Instagram">📷</a>
            <a href="#" className="social-icon" aria-label="Twitter">🐦</a>
            <a href="#" className="social-icon" aria-label="YouTube">📺</a>
            <a href="#" className="social-icon" aria-label="TikTok">🎵</a>
          </div>
        </div>

        {/* Main Footer Content */}
        <div className="footer-main">
          <div className="footer-column">
            <h3>Về RISE</h3>
            <ul>
              <li><a href="#">Giới thiệu</a></li>
              <li><a href="#">Liên hệ</a></li>
              <li><a href="#">Điều khoản bảo mật</a></li>
              <li><a href="#">Điều khoản sử dụng</a></li>
            </ul>
          </div>

          <div className="footer-column">
            <h3>Tài nguyên</h3>
            <ul>
              <li><a href="#">Thư viện đề thi</a></li>
              <li><a href="#">Blog</a></li>
              <li><a href="#">Tổng hợp tài liệu</a></li>
            </ul>
          </div>

          <div className="footer-column">
            <h3>Chính sách chung</h3>
            <ul>
              <li><a href="#">Hướng dẫn sử dụng</a></li>
              <li><a href="#">Hướng dẫn thanh toán</a></li>
              <li><a href="#">Điều khoản và Điều Kiện Giao Dịch</a></li>
              <li><a href="#">Chính sách giá bán</a></li>
              <li><a href="#">Chính sách kiểm hàng</a></li>
              <li><a href="#">Chính sách giao, nhận hàng</a></li>
              <li><a href="#">Phản hồi, khiếu nại</a></li>
              <li><a href="#">Chính sách chuyển đổi, hoàn hủy</a></li>
            </ul>
          </div>
        </div>

        {/* Business Information */}
        <div className="footer-business">
          <div className="business-info">
            <h3>Thông tin doanh nghiệp</h3>
            <p><strong>TRUNG TÂM GIA SƯ RISE</strong></p>
            <p><strong>Điện thoại liên hệ/Hotline:</strong> 096 369 5525</p>
            <p><strong>Email:</strong> rise.tutoring@gmail.com</p>
            <p><strong>Địa chỉ trụ sở:</strong> Số 15, Ngõ 208 Giải Phóng, Phường Phương Liệt, Quận Thanh Xuân, Thành phố Hà Nội, Việt Nam</p>
            <p><strong>Giấy chứng nhận Đăng ký doanh nghiệp số:</strong> 0109675459 do Sở Kế hoạch và Đầu tư thành phố Hà Nội cấp</p>
            <p><strong>Ngày cấp phép:</strong> 17/06/2021</p>
          </div>
        </div>

        {/* Copyright */}
        <div className="footer-bottom">
          <p>RISE.COM © Bản quyền của Trung tâm Gia sư RISE.</p>
          <p className="footer-disclaimer">
            RISE - Road to International Standard Education. Con đường hướng tới giáo dục chuẩn quốc tế.
          </p>
        </div>
      </div>

      {/* Floating Navigation */}
      <div className="footer-floating-nav">
        <a href="#" className="floating-nav-item" title="Từ điển">📖</a>
        <a href="#" className="floating-nav-item" title="Messenger">💬</a>
        <a href="#" className="floating-nav-item" title="Zalo">💙</a>
        <a href="#" className="floating-nav-item" title="Lên đầu trang" onClick={(e) => {
          e.preventDefault()
          window.scrollTo({ top: 0, behavior: 'smooth' })
        }}>↑</a>
      </div>
    </footer>
  )
}
