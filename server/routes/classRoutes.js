import express from 'express'
import { getClasses, findClassById } from '../data/classes.js'

const router = express.Router()

// GET /api/classes - public classes (status = true)
router.get('/', (req, res) => {
  const active = getClasses().filter((cls) => cls.status)
  res.json(active)
})

// GET /api/admin/classes - all classes for admin
router.get('/admin', (req, res) => {
  res.json(getClasses())
})

// POST /api/classes - create new class
router.post('/', (req, res) => {
  const { code, subject, requirement, schedule, salary, address, status } = req.body || {}

  if (!code || !subject || !requirement || !schedule || !salary || !address) {
    return res.status(400).json({ message: 'Thiếu thông tin lớp học bắt buộc.' })
  }

  const classes = getClasses()
  const newId = classes.length ? Math.max(...classes.map((c) => c.id)) + 1 : 1

  const newClass = {
    id: newId,
    code,
    subject,
    requirement,
    schedule,
    salary,
    address,
    status: typeof status === 'boolean' ? status : true,
    createdAt: new Date().toISOString()
  }

  classes.push(newClass)
  res.status(201).json(newClass)
})

// PUT /api/classes/:id - update full class
router.put('/:id', (req, res) => {
  const id = Number(req.params.id)
  const classes = getClasses()
  const cls = findClassById(id)

  if (!cls) {
    return res.status(404).json({ message: 'Không tìm thấy lớp.' })
  }

  const { code, subject, requirement, schedule, salary, address, status } = req.body || {}

  if (!code || !subject || !requirement || !schedule || !salary || !address) {
    return res.status(400).json({ message: 'Thiếu thông tin lớp học bắt buộc.' })
  }

  cls.code = code
  cls.subject = subject
  cls.requirement = requirement
  cls.schedule = schedule
  cls.salary = salary
  cls.address = address
  cls.status = typeof status === 'boolean' ? status : cls.status

  res.json(cls)
})

// DELETE /api/classes/:id - delete class
router.delete('/:id', (req, res) => {
  const id = Number(req.params.id)
  const classes = getClasses()
  const index = classes.findIndex((c) => c.id === id)

  if (index === -1) {
    return res.status(404).json({ message: 'Không tìm thấy lớp.' })
  }

  const removed = classes.splice(index, 1)[0]
  res.json(removed)
})

// PATCH /api/classes/:id/status - toggle status
router.patch('/:id/status', (req, res) => {
  const id = Number(req.params.id)
  const { status } = req.body || {}

  const cls = findClassById(id)
  if (!cls) {
    return res.status(404).json({ message: 'Không tìm thấy lớp.' })
  }

  if (typeof status !== 'boolean') {
    return res.status(400).json({ message: 'Giá trị status không hợp lệ.' })
  }

  cls.status = status
  res.json(cls)
})

export default router

