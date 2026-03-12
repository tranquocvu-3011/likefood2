# Báo cáo Hệ thống Tồn kho (Inventory System Report)

_Cập nhật: 2026-03-12_

---

## 1. Kiến trúc hiện tại

| Trường | Kiểu | Ý nghĩa |
|---|---|---|
| `product.inventory` | `Int` | Số lượng tồn kho tổng (base inventory) |
| `variant.stock` | `Int` | Tồn kho theo biến thể cụ thể |
| `isVisible` | `Boolean` | Sản phẩm có hiển thị trên cửa hàng không |

## 2. Cải tiến đã thực hiện

### 2-State Inventory Toggle (Admin Editor)
- **Trước**: Chỉ có trường số nhập tay `Tồn kho`, admin dễ nhập sai (negative, blank).
- **Sau**: Thêm toggle **"Còn hàng / Hết hàng"** (ToggleRow component).
  - **Còn hàng** (ON): Giữ nguyên số lượng hoặc đặt về 9999 nếu hiện tại = 0.
  - **Hết hàng** (OFF): Tự động đặt `inventory = 0`.
  - Trường số vẫn khả dụng khi "Còn hàng" để nhập số chính xác.
  - Trường số bị disable khi "Hết hàng".

### CartContext - Inventory Cap
- **Trước**: Người dùng có thể thêm vô hạn số lượng vào giỏ (không kiểm tra `inventory`).
- **Sau**: `addItem()` kiểm tra `currentQty + addQty > product.inventory` trước khi thêm.
  - Nếu vượt: hiển thị thông báo lỗi với số lượng còn lại.
  - Nếu hết hàng hoàn toàn: thông báo "đã hết hàng".

## 3. Vấn đề đã biết (chưa sửa)

| ID | Mô tả | Mức độ |
|---|---|---|
| INV-01 | `product.inventory` và `variant.stock` đều bị trừ khi bán → base inventory âm | High |
| INV-02 | Tồn kho trong localStorage cart không đồng bộ khi hết hàng sau thời gian | Medium |
| INV-03 | Không có webhook/revalidate khi inventory thay đổi → frontend cache cũ | Medium |

## 4. Khuyến nghị tiếp theo

1. **Tách rõ hai tầng tồn kho**: nếu sản phẩm có biến thể, chỉ trừ `variant.stock`; tổng `product.inventory` nên là computed field.
2. **Thêm API endpoint `POST /api/admin/inventory/adjust`** cho điều chỉnh hàng loạt.
3. **Stale cart detection**: khi mở giỏ hàng, gọi API kiểm tra tồn kho thực tế.
