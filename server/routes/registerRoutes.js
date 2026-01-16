import express from "express";

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const {
      fullName,
      subjects,
      phone,
      email,
      note // Thông tin lớp sẽ được gửi vào đây
    } = req.body;

    await fetch(
      "https://docs.google.com/forms/d/e/1FAIpQLSebmZHYjVLDeUKUfMici_M9o9-wZVhebo5BrH4Fk2ZIkEeCRw/formResponse",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          "entry.700107921": fullName || "",
          "entry.1684938228": subjects || "",
          "entry.955170913": phone || "",
          "entry.1436919814": email || "Khách chưa đăng nhập",
          "entry.695481864": note || "" // ✅ Thông tin lớp được gửi vào ghi chú thêm
        }),
      }
    );

    res.json({ message: "Đăng ký nhận lớp thành công!" });
  } catch (error) {
    console.error("Error sending to Google Form:", error);
    res.status(500).json({ message: "Không gửi được dữ liệu" });
  }
});


export default router;
