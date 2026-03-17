# Tài liệu Chi tiết Hệ thống & Hướng dẫn Full API (NNPTUD-C3)

Tài liệu này tổng hợp toàn bộ các thay đổi hệ thống và hướng dẫn chi tiết cách vận hành, kiểm tra toàn bộ các API hiện có trong dự án.

---

## 🛠 Những thay đổi và tính năng đã thực hiện

1.  **Đồng bộ CSDL (DB Syncing & Seeding)**:
    *   Tự động hóa việc khởi tạo dữ liệu mẫu (`seed.js`) để đảm bảo hệ thống có sẵn các Role: `ADMIN`, `USER`.
    *   Tạo tài khoản Admin mặc định: `admin` / `admin123`.
    *   Sửa lỗi ID bị fix cứng trong logic Auth bằng cách đồng bộ đúng ID Role trong MongoDB.
2.  **Hệ thống Quản lý Kho hàng (Inventory)**:
    *   **Automation**: Tự động tạo bản ghi kho (`Inventory`) ngay khi tạo mới Sản phẩm (`Product`).
    *   **Atomic Operations**: Sử dụng giải thuật cập nhật nguyên tử (`$inc`) để xử lý các vấn đề tranh chấp dữ liệu (Race Conditions) khi nhiều người cùng thao tác lên kho hàng.
    *   **Logic Nghiệp vụ**: Triển khai đầy đủ các bước: Nhập hàng -> Giữ hàng (Reservation) -> Bán hàng (Sold) -> Giảm kho trực tiếp.
3.  **Bảo mật & Phân quyền**:
    *   Tích hợp JWT Authenticate qua Cookies.
    *   Middleware `checkRole` để bảo vệ các API nhạy cảm (như xem danh sách Users).

---

## 🚀 Hướng dẫn Full API & Dữ liệu mẫu

### 1. Authentication (Xác thực)

#### **Đăng nhập (Login)**
*   **Method**: `POST`
*   **URL**: `http://localhost:3000/api/v1/auth/login`
*   **Body mẫu**:
    ```json
    {
        "username": "admin",
        "password": "admin123"
    }
    ```
*   **Kết quả**: Trả về Token và set Cookie `TOKEN_NNPTUD_C3`.

#### **Đăng ký (Register)**
*   **Method**: `POST`
*   **URL**: `http://localhost:3000/api/v1/auth/register`
*   **Body mẫu**:
    ```json
    {
        "username": "user_test_01",
        "password": "password123",
        "email": "test@example.com"
    }
    ```

#### **Thông tin tài khoản hiện tại (Me)**
*   **Method**: `GET`
*   **URL**: `http://localhost:3000/api/v1/auth/me`
*   *Yêu cầu*: Đã đăng nhập.

---

### 2. Quản lý Sản phẩm (Products)

#### **Lấy danh sách sản phẩm**
*   **Method**: `GET`
*   **URL**: `http://localhost:3000/api/v1/products`
*   **Query params**: `?minprice=100&maxprice=5000&title=phone`

#### **Thêm sản phẩm mới (Kèm tạo kho hàng tự động)**
*   **Method**: `POST`
*   **URL**: `http://localhost:3000/api/v1/products`
*   **Body mẫu**:
    ```json
    {
        "title": "Samsung Galaxy S24",
        "price": 900,
        "description": "Flagship mới nhất của Samsung",
        "category": "69b8f51e3944ed86c8624ea5",
        "images": ["https://example.com/s24.jpg"]
    }
    ```

---

### 3. Quản lý Kho hàng (Inventory) - Chuyên sâu

#### **Lấy toàn bộ trạng thái kho (Join Product)**
*   **Method**: `GET`
*   **URL**: `http://localhost:3000/api/v1/inventories`
*   **Kết quả**: Hiển thị `stock`, `reserved`, `soldCount` và thông tin sản phẩm.

#### **Nhập hàng (Add Stock)**
*   **Method**: `POST`
*   **URL**: `http://localhost:3000/api/v1/inventories/add-stock`
*   **Body mẫu**:
    ```json
    {
        "product": "ID_SAN_PHAM",
        "quantity": 50
    }
    ```

#### **Đặt hàng / Giữ hàng (Reservation)**
*   **Method**: `POST`
*   **URL**: `http://localhost:3000/api/v1/inventories/reservation`
*   **Logic**: `stock` giảm, `reserved` tăng.
*   **Body mẫu**:
    ```json
    {
        "product": "ID_SAN_PHAM",
        "quantity": 5
    }
    ```

#### **Hoàn tất bán hàng (Sold)**
*   **Method**: `POST`
*   **URL**: `http://localhost:3000/api/v1/inventories/sold`
*   **Logic**: `reserved` giảm, `soldCount` tăng.
*   **Body mẫu**:
    ```json
    {
        "product": "ID_SAN_PHAM",
        "quantity": 5
    }
    ```

---

### 4. Các API Quản trị khác

*   **Danh mụ (Categories)**: `GET`, `POST`, `PUT`, `DELETE` tại `/api/v1/categories`.
*   **Người dùng (Users)**: `GET /api/v1/users` (Yêu cầu quyền ADMIN).
*   **Phân quyền (Roles)**: `GET /api/v1/roles` để xem các ID quyền trong hệ thống.

---

## 📌 Lưu ý khi vận hành
1.  **Thứ tự test**: Nên Đăng nhập -> Tạo Category -> Tạo Product -> Thao tác Inventory.
2.  **ID Sản phẩm**: Bạn cần lấy mã `_id` từ kết quả của lệnh tạo sản phẩm hoặc lệnh GET Products để đưa vào các lệnh điều chỉnh kho hàng.
3.  **Lỗi 403**: Nếu gặp lỗi này, hãy kiểm tra xem bạn đã đăng nhập chưa và tài khoản có quyền `ADMIN` hay không.

*Tài liệu này giúp bạn hiểu sâu hơn về luồng dữ liệu và cấu trúc của dự án.*
