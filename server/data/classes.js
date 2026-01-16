// Initial in-memory classes data.
// In a real app this might come from a database. Here we keep it simple.

export const classes = [
  {
    id: 1,
    code: 'MSTT2971',
    subject: 'Toán lớp 9',
    requirement: 'Giáo viên nữ',
    schedule: "3 buổi/tuần, tối sắp xếp",
    salary: "Thoả thuận (1h30'/buổi)",
    address: 'Đường số 8, Linh Đông, Thủ Đức',
    status: true,
    createdAt: new Date().toISOString()
  },
  {
    id: 2,
    code: 'MSTT2970',
    subject: 'Khiêu vũ người lớn',
    requirement: 'Giáo viên nữ',
    schedule: '3 buổi/tuần, sáng thứ 2-4-6',
    salary: 'Thoả thuận (1h/buổi)',
    address: 'Lê Văn Lương, Nhà Bè',
    status: true,
    createdAt: new Date().toISOString()
  }
]

// Simple helpers so other modules can work with the same array reference
export function getClasses() {
  return classes
}

export function findClassById(id) {
  return classes.find((item) => item.id === id)
}

