# Báo cáo Hệ thống Quản lý Danh mục (Category Management Report)

_Cập nhật: 2026-03-12_

---

## 1. Vấn đề cốt lõi: Dual Category System

Cơ sở dữ liệu có **hai hệ thống danh mục song song**:

| Nguồn | Trường | Trạng thái |
|---|---|---|
| Legacy | `product.category` (String, NOT NULL) | Lưu tên danh mục dạng text |
| Hiện đại | `product.categoryId` (FK → `Category.id`) | Nullable — nhiều sản phẩm chưa được migrate |

### Hậu quả trước khi sửa
- `ProductEditor` chỉ gửi `category` (string), không gửi `categoryId`.
- `productCount` trong `/api/categories` chỉ đếm `categoryId` FK → 111 sản phẩm legacy không được tính.
- Bộ lọc danh mục trong admin bị mã hóa cứng với tên tiếng Anh (`MEAT`, `SEAFOOD`) không khớp DB.

## 2. Cải tiến đã thực hiện

### 2.1 Admin Categories API (`/api/admin/categories`)
- API đã tồn tại và trả về danh mục từ DB thực tế (GET/POST/PUT/DELETE).
- Không có filter `isVisible` → admin thấy tất cả danh mục.

### 2.2 Admin Products List API (`/api/admin/products` - MỚI)
- Endpoint mới hỗ trợ filter: `search`, `category` (theo ID/slug/name), `stock`, `visibility`, `sort`.
- Không filter `isVisible=true` → admin thấy cả sản phẩm đang ẩn.

### 2.3 ProductEditor - Live Category Dropdown
- **Trước**: Hardcoded `ADMIN_CATEGORY_OPTIONS` với chuỗi UTF-8 bị lỗi (mojibake).
- **Sau**: Fetch live từ `/api/admin/categories` khi component mount.
- Category select dùng `id` làm value, `name` lưu vào `formData.category`.
- Payload gửi lên API bao gồm cả `categoryId` và `category` name.

### 2.4 Admin Products Page - Live Categories & Visibility Filter
- **Trước**: Filter CATEGORIES hardcoded (`MEAT`, `SEAFOOD`...) không khớp DB.
- **Sau**: Fetch live từ `/api/admin/categories`, hiển thị tên tiếng Việt thực tế.
- Thêm filter **Visibility** (Tất cả / Đang hiển thị / Đã ẩn).
- Thêm cột **Visibility** trong bảng sản phẩm.

### 2.5 Categories API - productCount Fix
- **Trước**: `productCount` chỉ đếm `categoryId` FK → bỏ sót legacy products.
- **Sau**: Đếm thêm `product.category` (string) → map sang `Category.name` → cộng vào count.

## 3. Vấn đề còn tồn tại

| ID | Mô tả | Mức độ |
|---|---|---|
| CAT-01 | Nil products (111 sản phẩm) có `category` string nhưng không `categoryId` — cần migration | High |
| CAT-02 | PUT `/api/admin/products/[id]` vẫn có upsert category nếu `categoryId` không hợp lệ | Medium |
| CAT-03 | Không có UI migrate hàng loạt category string → categoryId FK | Medium |

## 4. Script Migration gợi ý

```sql
-- Bước 1: Xem danh mục chưa match
SELECT DISTINCT p.category, c.id as categoryId
FROM product p
LEFT JOIN category c ON c.name = p.category
WHERE p.categoryId IS NULL AND p.isDeleted = 0;

-- Bước 2: Update categoryId theo name matching
UPDATE product p
JOIN category c ON c.name = p.category
SET p.categoryId = c.id
WHERE p.categoryId IS NULL AND p.isDeleted = 0;
```
