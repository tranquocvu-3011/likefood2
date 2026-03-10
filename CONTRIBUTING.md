# Hướng dẫn đóng góp — LIKEFOOD

Cảm ơn bạn đã quan tâm đến dự án LIKEFOOD! Mọi đóng góp đều được chào đón.

---

## Mục lục

1. [Báo lỗi (Bug Report)](#báo-lỗi)
2. [Đề xuất tính năng (Feature Request)](#đề-xuất-tính-năng)
3. [Quy trình Pull Request](#quy-trình-pull-request)
4. [Coding Style](#coding-style)
5. [Chạy tests trước khi nộp PR](#chạy-tests)
6. [Giấy phép](#giấy-phép)

---

## Báo lỗi

1. Mở [GitHub Issues](https://github.com/tranquocvu-3011/likefood/issues).
2. Kiểm tra xem lỗi đã được báo cáo chưa.
3. Nếu chưa, tạo issue mới với tiêu đề rõ ràng và mô tả:
   - **Bước tái hiện lỗi** (steps to reproduce).
   - **Kết quả mong đợi** vs **kết quả thực tế**.
   - Môi trường: hệ điều hành, Node.js version, trình duyệt.
   - Screenshot (nếu có).

---

## Đề xuất tính năng

1. Mở [GitHub Issues](https://github.com/tranquocvu-3011/likefood/issues) với nhãn `enhancement`.
2. Mô tả tính năng, lý do cần thiết và cách triển khai (nếu biết).

---

## Quy trình Pull Request

```bash
# 1. Fork repository và clone về máy
git clone https://github.com/<your-username>/likefood.git
cd likefood

# 2. Tạo branch mới từ main
git checkout -b feature/ten-tinh-nang

# 3. Cài dependencies
npm install

# 4. Cấu hình .env (xem .env.example)
cp .env.example .env
# Điền các giá trị cần thiết

# 5. Thực hiện thay đổi, sau đó chạy kiểm tra
npm run lint
npm test

# 6. Commit theo Conventional Commits
git commit -m "feat: thêm tính năng XYZ"

# 7. Push và tạo Pull Request
git push origin feature/ten-tinh-nang
```

### Quy ước Commit Message

Dự án tuân theo [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/):

| Prefix | Khi nào dùng |
|---|---|
| `feat:` | Thêm tính năng mới |
| `fix:` | Sửa lỗi |
| `docs:` | Cập nhật tài liệu |
| `style:` | Định dạng code (không thay đổi logic) |
| `refactor:` | Tái cấu trúc code |
| `test:` | Thêm / sửa test |
| `chore:` | Cập nhật công cụ, deps, config |
| `security:` | Sửa lỗ hổng bảo mật |

---

## Coding Style

- **TypeScript strict**: Không tắt `strict` trong `tsconfig.json`.
- **ESLint**: Chạy `npm run lint` — 0 warnings trước khi nộp PR.
- **Prettier**: Code được format tự động qua ESLint rules.
- **License Header**: Mỗi file `.ts` / `.tsx` mới **phải** bắt đầu bằng:

```typescript
/**
 * LIKEFOOD - Vietnamese Specialty Marketplace
 * Copyright (c) 2026 LIKEFOOD Team
 * Licensed under the MIT License
 * https://github.com/tranquocvu-3011/likefood
 */
```

- **Naming**: camelCase cho biến/hàm, PascalCase cho component/type/interface.
- **API Routes**: Luôn xác thực session/admin qua helper `getServerSession` hoặc `requireAdmin()`.
- **No hardcoded secrets**: Mọi config nhạy cảm phải qua biến môi trường và được khai báo trong `src/env.ts`.

---

## Chạy Tests

```bash
# Chạy toàn bộ test suite
npm test

# Chạy test ở chế độ watch
npm run test:watch

# Xem coverage
npm run test:coverage
```

Yêu cầu: tests phải **xanh 100%** (`74/74 pass`) trước khi nộp Pull Request.

---

## Giấy phép

Khi đóng góp vào dự án này, bạn đồng ý rằng phần đóng góp của bạn sẽ được phân phối
theo giấy phép **MIT** — như toàn bộ dự án. Xem [LICENSE](LICENSE) để biết thêm chi tiết.
