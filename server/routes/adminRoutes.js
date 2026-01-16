import express from 'express'

const router = express.Router()

// tài khoản admin cố định
const ADMIN = {
  username: 'admin',
  password: '123456'
}

router.post('/login', (req, res) => {
  const { username, password } = req.body || {}

  if (username === ADMIN.username && password === ADMIN.password) {
    return res.json({ message: 'Đăng nhập thành công' })
  }

  res.status(401).json({ message: 'Sai tài khoản hoặc mật khẩu' })
})

export default router
