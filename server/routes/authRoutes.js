import express from "express";
import fs from "fs";
import path from "path";

const router = express.Router();
const USERS_FILE = path.join(process.cwd(), "server/data/users.json");

const readUsers = () => {
  try {
    // Kiểm tra file có tồn tại không
    if (!fs.existsSync(USERS_FILE)) {
      // Tạo file mới với mảng rỗng nếu chưa tồn tại
      fs.writeFileSync(USERS_FILE, JSON.stringify([], null, 2));
      return [];
    }
    const data = fs.readFileSync(USERS_FILE, "utf-8");
    return JSON.parse(data);
  } catch (error) {
    console.error("Error reading users file:", error);
    // Trả về mảng rỗng nếu có lỗi
    return [];
  }
};

const saveUsers = (users) => {
  try {
    // Đảm bảo thư mục tồn tại
    const dir = path.dirname(USERS_FILE);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
  } catch (error) {
    console.error("Error saving users file:", error);
    throw error;
  }
};

/* ĐĂNG KÝ */
router.post("/register", (req, res) => {
  try {
    const { email, password, fullName, phone, subjects, area, note } = req.body;
    
    // Validation
    if (!email || !password || !fullName) {
      return res.status(400).json({ message: "Vui lòng điền đầy đủ thông tin bắt buộc" });
    }

    const users = readUsers();

    if (users.find(u => u.email === email)) {
      return res.status(400).json({ message: "Email đã tồn tại" });
    }

    users.push({
      email,
      password, // (demo nên chưa hash)
      fullName,
      phone: phone || "",
      subjects: subjects || "",
      area: area || "",
      note: note || "",
      registeredClasses: [] // Mảng để lưu các mã lớp đã đăng ký
    });

    saveUsers(users);
    res.json({ message: "Đăng ký thành công" });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ message: "Lỗi server khi đăng ký" });
  }
});

/* ĐĂNG NHẬP */
router.post("/login", (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Validation
    if (!email || !password) {
      return res.status(400).json({ message: "Vui lòng nhập email và mật khẩu" });
    }

    // ✅ KIỂM TRA ADMIN TRƯỚC (email admin hoặc username admin)
    const ADMIN_EMAIL = "admin@admin.com";
    const ADMIN_PASSWORD = "123456";
    
    if ((email === ADMIN_EMAIL || email === "admin") && password === ADMIN_PASSWORD) {
      return res.json({ 
        message: "Đăng nhập thành công", 
        user: {
          email: ADMIN_EMAIL,
          fullName: "Administrator",
          role: "admin"
        }
      });
    }

    const users = readUsers();

    const user = users.find(
      u => u.email === email && u.password === password
    );

    if (!user) {
      return res.status(401).json({ message: "Sai tài khoản hoặc mật khẩu" });
    }

    // Đảm bảo user có trường registeredClasses
    if (!user.registeredClasses) {
      user.registeredClasses = [];
    }

    // Đảm bảo user có role (mặc định là "user")
    if (!user.role) {
      user.role = "user";
    }

    res.json({ message: "Đăng nhập thành công", user });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Lỗi server khi đăng nhập" });
  }
});

/* LƯU MÃ LỚP VÀO TÀI KHOẢN */
router.post("/save-class", (req, res) => {
  try {
    const { email, classCode } = req.body;
    
    if (!email || !classCode) {
      return res.status(400).json({ message: "Thiếu thông tin email hoặc mã lớp" });
    }

    const users = readUsers();

    const userIndex = users.findIndex(u => u.email === email);
    if (userIndex === -1) {
      return res.status(404).json({ message: "Không tìm thấy người dùng" });
    }

    // Khởi tạo registeredClasses nếu chưa có
    if (!users[userIndex].registeredClasses) {
      users[userIndex].registeredClasses = [];
    }

    // Kiểm tra xem mã lớp đã tồn tại chưa
    if (!users[userIndex].registeredClasses.includes(classCode)) {
      users[userIndex].registeredClasses.push(classCode);
      saveUsers(users);
    }

    res.json({ 
      message: "Đã lưu mã lớp vào tài khoản", 
      user: users[userIndex] 
    });
  } catch (error) {
    console.error("Save class error:", error);
    res.status(500).json({ message: "Lỗi server khi lưu mã lớp" });
  }
});

export default router;
