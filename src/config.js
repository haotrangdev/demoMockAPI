export const API_URL = 'https://6a830a1ecb486d2434033464.mockapi.io/nguoidung'
export const PAGE_SIZE = 12

// Trường dùng để tìm kiếm theo tên
export const SEARCH_FIELD = 'hoten'

// Khai báo các trường dữ liệu. sortable: cho phép sắp xếp, type: 'number' | 'string'
// Nếu thêm trường giá vào mockapi (vd: gia), chỉ cần thêm 1 dòng:
// { key: 'gia', title: 'Giá', sortable: true, type: 'number', render: v => Number(v).toLocaleString('vi-VN') + ' ₫' }
export const FIELDS = [
  { key: 'id', title: 'ID', sortable: true, type: 'number' },
  { key: 'hoten', title: 'Họ tên', sortable: true, type: 'string' },
  { key: 'diachi', title: 'Địa chỉ' },
  { key: 'quocgia', title: 'Quốc gia', sortable: true, type: 'string' },
  { key: 'phone', title: 'Điện thoại' },
]
