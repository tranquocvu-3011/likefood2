# Báo cáo UX Admin - Quản lý Sản phẩm (Admin Product UX Report)

_Cập nhật: 2026-03-12_

---

## 1. Tổng quan trước cải tiến

| Vấn đề | Ảnh hưởng |
|---|---|
| `isVisible` không có trong ProductEditor | Admin không thể ẩn/hiện sản phẩm |
| Danh mục dropdown bị lỗi UTF-8 | Mọi sản phẩm tạo mới bị gán danh mục mojibake |
| Admin page dùng public API → ẩn sản phẩm không hiển thị | Admin mù quáng với sản phẩm đang ẩn |
| Filter danh mục hardcoded tiếng Anh | Không filter được gì |
| Tồn kho chỉ có input số → dễ nhập sai | Nhập âm, blank, hoặc nhầm |

---

## 2. Những thay đổi UX đã thực hiện

### ProductEditor (`/admin/products/[id]/edit`, `/admin/products/new`)

#### Thêm mới
- **Toggle "Hiển thị trên cửa hàng"** (isVisible): tắt để ẩn sản phẩm khỏi giao diện người mua.
- **Toggle "Còn hàng"** (inStock): trạng thái 2 mức dễ thao tác.
  - Tắt → tự đặt inventory=0, disable ô nhập số lượng.
  - Bật → giữ số cũ hoặc đặt 9999 nếu đang là 0.
- **Dropdown danh mục live** từ DB: không còn dữ liệu cứng bị lỗi.
- **Sidebar preview** cập nhật: hiển thị tên danh mục thực, trạng thái hiển thị, tồn kho.

#### Sửa đổi
- Trường "Tồn kho" disabled khi "Hết hàng" — tránh nhầm lẫn.
- Validation `buildPayload()` dùng `categoryId` thay vì `category` string.
- AI Description Generator dùng tên danh mục thực thay vì slug lỗi.

### Admin Products Page (`/admin/products`)

#### Thêm mới
- **Filter "Visibility"**: lọc theo Tất cả / Đang hiển thị / Đã ẩn.
- **Cột "Visibility"** trong bảng: badge xanh "Hiển thị" / xám "Đã ẩn".
- **Dropdown danh mục live**: fetch từ `/api/admin/categories`.
- **API admin riêng** (`/api/admin/products`): bao gồm sản phẩm đang ẩn.

#### Sửa đổi
- Stock filter chuyển từ client-side → server-side (chính xác hơn với pagination).
- Fetch từ `/api/admin/products` thay vì `/api/products` (public endpoint).

---

## 3. Luồng admin hiện tại (As-Is)

```
Admin → /admin/products
  ├── Thấy TẤT CẢ sản phẩm (kể cả isVisible=false)
  ├── Filter: Danh mục (live DB) | Stock | Visibility | Sort
  └── Click Edit → /admin/products/[id]/edit
        ├── Dropdown danh mục live
        ├── Toggle: Còn hàng / Hết hàng
        ├── Toggle: Hiển thị / Ẩn trên cửa hàng
        ├── Toggle: Nổi bật / Bình thường
        └── Toggle: Khuyến mãi on/off
```

---

## 4. Khuyến nghị tiếp theo

1. **Quick-edit inline** trong bảng sản phẩm (inventory, isVisible, featured).
2. **Image upload** trực tiếp thay vì nhập URL.
3. **Bulk visibility toggle** — ẩn/hiện nhiều sản phẩm cùng lúc.
4. **Audit log** — ghi lại ai thay đổi gì, khi nào.
