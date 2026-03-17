# Tài liệu Hướng dẫn Test và Nghiệp vụ hệ thống NNPTUD-C3

Hệ thống đã được cấu hình và đồng bộ hóa với MongoDB chạy trên Docker. Dưới đây là các tính năng nghiệp vụ đã được triển khai và cách thức kiểm tra qua Postman.

## ⚙️ Cấu hình hệ thống
- **CSDL**: MongoDB (Docker container: `nnptud-c3-mongodb`)
- **Port**: 3000
- **Database Name**: `NNPTUD-C3`
- **Auth**: JWT authenticate via Cookies (`TOKEN_NNPTUD_C3`)

---

## 📦 Nghiệp vụ Quản lý Kho hàng (Inventory)

### 1. Tự động khởi tạo kho
Mỗi khi tạo mới một Product, hệ thống sẽ tự động tạo một bản ghi Inventory tương ứng.
- **Endpoint**: `POST /api/v1/products`
- **Logic**: Sử dụng hook sau khi lưu sản phẩm để tạo bản ghi kho khởi tạo với `stock: 0`, `reserved: 0`, `soldCount: 0`.

### 2. Danh sách kho hàng (Join Product)
- **Endpoint**: `GET /api/v1/inventories`
- **Tính năng**: Sử dụng `.populate('product')` để hiển thị đầy đủ tên, giá và thông tin sản phẩm đi kèm với số lượng kho.

---

## 🧪 Hướng dẫn thực hiện Test trên Postman

### Step 1: Đăng nhập (Lấy quyền)
- **URL**: `POST /api/v1/auth/login`
- **Body**:
  ```json
  {
      "username": "admin",
      "password": "admin123"
  }
  ```
- **Kết quả**: Server trả về Token và thiết lập Cookie.

### Step 2: Nhập hàng (Add Stock)
- **URL**: `POST /api/v1/inventories/add-stock`
- **Body**:
  ```json
  {
      "product": "ID_SAN_PHAM",
      "quantity": 100
  }
  ```
- **Mô tả**: Tăng số lượng `stock` trong kho.

### Step 3: Xuất kho trực tiếp (Remove Stock)
- **URL**: `POST /api/v1/inventories/remove-stock`
- **Body**:
  ```json
  {
      "product": "ID_SAN_PHAM",
      "quantity": 20
  }
  ```
- **Mô tả**: Giảm số lượng `stock`. Hệ thống sẽ báo lỗi 400 nếu kho không đủ trừ.

### Step 4: Đặt hàng / Giữ hàng (Reservation)
- **URL**: `POST /api/v1/inventories/reservation`
- **Body**:
  ```json
  {
      "product": "ID_SAN_PHAM",
      "quantity": 15
  }
  ```
- **Mô tả**: Giảm `stock` và chuyển số lượng đó sang trạng thái `reserved` (giữ hàng).

### Step 5: Hoàn tất bán lẻ (Sold)
- **URL**: `POST /api/v1/inventories/sold`
- **Body**:
  ```json
  {
      "product": "ID_SAN_PHAM",
      "quantity": 10
  }
  ```
- **Mô tả**: Chuyển số lượng từ `reserved` sang `soldCount` sau khi khách đã thanh toán/nhận hàng.

---

## 🛠️ Công nghệ sử dụng
- **Node.js / Express**: Backend framework.
- **Mongoose**: Tương tác với MongoDB.
- **Atomic Operations**: Sử dụng `$inc` để đảm bảo dữ liệu không bị sai lệch khi có nhiều luồng xử lý cùng lúc (Concurrancy control).
- **Validation**: Kiểm tra logic nghiệp vụ chặt chẽ (không cho phép tồn kho âm).

*Tài liệu này được tạo tự động để phục vụ việc kiểm tra và báo cáo tiến độ dự án.*
