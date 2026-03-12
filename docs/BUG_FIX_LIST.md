# Danh sách Bug đã sửa (Bug Fix List)

_Cập nhật: 2026-03-12 — Sprint: Admin/Product/Category/Inventory Refactor_

---

## Bug đã sửa (Resolved)

### BUG-001 — `isVisible` không có trong ProductEditor [CRITICAL]
- **Mô tả**: Admin không thể ẩn sản phẩm khỏi cửa hàng.
- **Nguyên nhân**: `ProductSubmitPayload` và `initialValues` thiếu trường `isVisible`.
- **Sửa**: Thêm `isVisible` vào interface, payload, và UI (ToggleRow).
- **File**: `src/components/admin/ProductEditor.tsx`, `src/app/admin/products/[id]/edit/page.tsx`, `src/app/admin/products/new/page.tsx`

### BUG-002 — Admin category options bị lỗi mojibake UTF-8 [CRITICAL]
- **Mô tả**: Dropdown danh mục hiển thị `"CÃ¡ khÃ´"` thay vì `"Cá khô"`.
- **Nguyên nhân**: `ADMIN_CATEGORY_OPTIONS` trong `admin-catalog.ts` chứa chuỗi UTF-8 bị double-encode.
- **Sửa**: Xóa `ADMIN_CATEGORY_OPTIONS`, thay bằng fetch live từ `/api/admin/categories`.
- **File**: `src/lib/admin-catalog.ts`, `src/components/admin/ProductEditor.tsx`

### BUG-003 — Admin filter danh mục không hoạt động [CRITICAL]
- **Mô tả**: Filter danh mục trên trang quản lý sản phẩm không lọc được gì.
- **Nguyên nhân**: Hardcoded English values (`MEAT`, `SEAFOOD`) không khớp tên Việt trong DB.
- **Sửa**: Xóa `CATEGORIES` hardcoded, fetch live từ `/api/admin/categories`, filter bằng `categoryId`.
- **File**: `src/app/admin/products/page.tsx`

### BUG-004 — Admin trang sản phẩm không thấy sản phẩm đang ẩn [HIGH]
- **Mô tả**: Sản phẩm có `isVisible=false` bị ẩn khỏi trang quản lý admin.
- **Nguyên nhân**: Admin page fetch từ public `/api/products` (có `where.isVisible = true`).
- **Sửa**: Tạo endpoint `/api/admin/products` mới (không filter `isVisible`), admin page dùng endpoint này.
- **File**: `src/app/api/admin/products/route.ts` (new), `src/app/admin/products/page.tsx`

### BUG-005 — Cart cho phép số lượng vượt tồn kho [CRITICAL]
- **Mô tả**: Người dùng có thể thêm không giới hạn sản phẩm dù tồn kho = 0.
- **Nguyên nhân**: `addItem()` trong CartContext không kiểm tra `inventory`.
- **Sửa**: Thêm kiểm tra `currentQty + addQty > product.inventory` trước khi `setItems`.
- **File**: `src/contexts/CartContext.tsx`

### BUG-006 — `productCount` trong `/api/categories` bỏ sót legacy products [HIGH]
- **Mô tả**: Danh mục hiển thị số lượng sản phẩm sai (thiếu sản phẩm dùng `category` string cũ).
- **Nguyên nhân**: `groupBy categoryId` chỉ đếm sản phẩm có `categoryId` FK; 111 sản phẩm legacy bị bỏ qua.
- **Sửa**: Thêm query `groupBy category` (string) và cộng vào count theo name matching.
- **File**: `src/app/api/categories/route.ts`

### BUG-007 — `categoryId` không được gửi trong payload tạo/sửa sản phẩm [CRITICAL]
- **Mô tả**: Mỗi lần admin chỉnh sửa sản phẩm, danh mục không được link đúng vào bảng Category.
- **Nguyên nhân**: `ProductSubmitPayload` thiếu `categoryId`.
- **Sửa**: Thêm `categoryId` vào payload, category select dùng `cat.id` làm value.
- **File**: `src/components/admin/ProductEditor.tsx`

---

## Bug đã biết nhưng chưa sửa (Known Issues)

| ID | Mô tả | Mức độ | File |
|---|---|---|---|
| BUG-008 | `product.inventory` và `variant.stock` cùng bị trừ → base inventory âm | High | `src/app/api/checkout/` |
| BUG-009 | Stale inventory trong localStorage cart (không sync khi inventory thay đổi) | Medium | `src/contexts/CartContext.tsx` |
| BUG-010 | CSV import `split(",")` vỡ khi mô tả có dấu phẩy | Medium | `src/app/api/admin/products/import/` |
| BUG-011 | `isPrimary` luôn = false khi tạo product image | Low | `src/app/api/admin/products/[id]/route.ts` |
| BUG-012 | Không có validation `slug` khi tạo sản phẩm — slug có thể null | Low | `src/app/api/products/route.ts` |
| BUG-013 | 111 sản phẩm legacy có `category` string nhưng thiếu `categoryId` FK | High | DB — cần migration SQL |

---

## Checklist kiểm tra sau deploy

- [ ] Tạo sản phẩm mới → dropdown danh mục hiển thị tên tiếng Việt đúng
- [ ] Edit sản phẩm → `isVisible` toggle phản ánh trạng thái thực tế
- [ ] Toggle "Hết hàng" → inventory = 0, không cho đặt mua
- [ ] Admin product list → thấy cả sản phẩm đang ẩn
- [ ] Filter danh mục → kết quả đúng
- [ ] Filter Visibility → lọc Ẩn/Hiện đúng
- [ ] Giỏ hàng → không thêm vượt số lượng tồn kho
- [ ] Trang danh mục → productCount hiển thị đúng
