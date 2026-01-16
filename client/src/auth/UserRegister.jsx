import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiEndpoint } from "../config/api.js";
import "./UserRegister.css";

const initialForm = {
  fullName: "",
  email: "",
  password: "",
  phone: "",
  subjects: "",
  area: "",
  note: ""
};

export default function UserRegister() {
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: "" }));
  };

  const validate = () => {
    const newErrors = {};
    if (!form.fullName.trim()) newErrors.fullName = "Vui lòng nhập họ và tên";
    if (!form.email.trim()) newErrors.email = "Vui lòng nhập email";
    if (!form.password.trim()) newErrors.password = "Vui lòng nhập mật khẩu";
    if (!form.phone.trim()) newErrors.phone = "Vui lòng nhập số điện thoại";
    if (!form.subjects.trim()) newErrors.subjects = "Vui lòng nhập môn có thể dạy";
    if (!form.area.trim()) newErrors.area = "Vui lòng nhập khu vực dạy";
    return newErrors;
  };

  const register = async (e) => {
    e?.preventDefault();
    setErrors({});

    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch(apiEndpoint("/api/auth/register"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });

      // Kiểm tra nếu response không ok và không phải JSON
      let data;
      try {
        const contentType = res.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
          const text = await res.text();
          console.error("Server response is not JSON:", text.substring(0, 200));
          // Nếu là HTML error page, có thể server chưa chạy hoặc route sai
          if (text.includes("<!DOCTYPE") || text.includes("<html")) {
            throw new Error("Backend server chưa chạy hoặc không phản hồi. Vui lòng kiểm tra server đã khởi động chưa (port 4000).");
          }
          throw new Error("Server trả về lỗi không mong đợi.");
        }
        data = await res.json();
      } catch (parseError) {
        if (parseError.message.includes("Backend server")) {
          throw parseError;
        }
        // Nếu không parse được JSON, có thể là network error
        if (!res.ok) {
          throw new Error(`Lỗi kết nối: ${res.status} ${res.statusText}`);
        }
        throw new Error("Không thể đọc phản hồi từ server.");
      }

      if (!res.ok) {
        throw new Error(data.message || "Đăng ký thất bại");
      }

      setSuccessMessage(data.message || "Đăng ký thành công!");
      
      // Chuyển đến trang đăng nhập sau 2 giây
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (err) {
      setErrors({ general: err.message || "Có lỗi xảy ra, vui lòng thử lại." });
      console.error("Registration error:", err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="register-container">
      <h2>Đăng ký</h2>
      <form onSubmit={register} className="register-form">
        <div className="grid grid-cols-2">
          <div>
            <label>Họ và tên *</label>
            <input
              name="fullName"
              value={form.fullName}
              onChange={handleChange}
              placeholder="Họ và tên"
            />
            {errors.fullName && <div className="field-error">{errors.fullName}</div>}
          </div>
          <div>
            <label>Số điện thoại *</label>
            <input
              name="phone"
              value={form.phone}
              onChange={handleChange}
              placeholder="Số điện thoại"
            />
            {errors.phone && <div className="field-error">{errors.phone}</div>}
          </div>
        </div>

        <div className="grid grid-cols-2">
          <div>
            <label>Email *</label>
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Email"
            />
            {errors.email && <div className="field-error">{errors.email}</div>}
          </div>
          <div>
            <label>Mật khẩu *</label>
            <input
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Mật khẩu"
            />
            {errors.password && <div className="field-error">{errors.password}</div>}
          </div>
        </div>

        <div className="grid grid-cols-2">
          <div>
            <label>Môn có thể dạy *</label>
            <input
              name="subjects"
              value={form.subjects}
              onChange={handleChange}
              placeholder="Môn có thể dạy"
            />
            {errors.subjects && <div className="field-error">{errors.subjects}</div>}
          </div>
          <div>
            <label>Khu vực dạy *</label>
            <input
              name="area"
              value={form.area}
              onChange={handleChange}
              placeholder="Khu vực dạy"
            />
            {errors.area && <div className="field-error">{errors.area}</div>}
          </div>
        </div>

        <div>
          <label>Ghi chú thêm</label>
          <textarea
            name="note"
            value={form.note}
            onChange={handleChange}
            placeholder="Ghi chú thêm (tùy chọn)"
            rows="3"
          />
        </div>

        {successMessage && (
          <div className="alert alert-success">{successMessage}</div>
        )}
        {errors.general && (
          <div className="alert alert-error">{errors.general}</div>
        )}

        <div className="register-footer">
          <button 
            type="button" 
            className="btn btn-link" 
            onClick={() => navigate("/")}
          >
            ← Quay về trang chủ
          </button>
          <div className="register-footer-actions">
            <button type="button" className="btn btn-outline" onClick={() => navigate("/login")}>
              Đã có tài khoản?
            </button>
            <button type="submit" className="btn btn-primary" disabled={submitting}>
              {submitting ? "Đang đăng ký..." : "Đăng ký"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
