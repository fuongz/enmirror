# @enmirror/landing

Web tĩnh cho `enmirror.trinhvaphuong.com`: trang giới thiệu, Chính sách quyền riêng tư, Điều khoản sử dụng, Hỗ trợ và Thương hiệu, bằng tiếng Việt (gốc `/`) và tiếng Anh (`/en`). App Store Connect dùng `/privacy` làm Privacy Policy URL và `/support` làm Support URL; app iOS link tới hai trang này (`ios/EnMirror/Support/AppLinks.swift`), nên đừng đổi hai đường dẫn đó.

Vite, React 19, Tailwind v4, shadcn/ui (style `base-nova`, Base UI). Thêm component: `bunx --bun shadcn@latest add <tên>` trong thư mục này. Workspace gốc là `web/` (Bun workspaces); các lệnh dưới chạy được trong thư mục này hoặc từ `web/` (`bun run typecheck`, `build`, `dev`, `deploy`).

| Lệnh | Việc |
| --- | --- |
| `bun run dev` | Vite dev server render sẵn HTML và tải CSS trước lần hiển thị đầu, giống bản prerender để kiểm tra chuyển trang |
| `bun run build` | Build client, build `src/entry-server.tsx` rồi `scripts/prerender.ts` xuất mỗi route thành `dist/<path>.html`, kèm `404.html`, `sitemap.xml`, `robots.txt` |
| `bun run preview` | Build rồi `wrangler dev`, phục vụ `dist/` như trên Cloudflare (header trong `public/_headers`) |
| `bun run typecheck` | `tsc` cho `src/` và cho config, script |
| `bun run deploy` | Build với `ENMIRROR_RELEASE=1` (fail nếu trang còn placeholder `[DEVELOPER_NAME]` hay `[TODO…]`) rồi `wrangler deploy`. Anh tự chạy (cần `bunx wrangler login` trước) |
| `swift scripts/make-icons.swift` | Vẽ lại `public/logo.png` (512), `icon-192.png`, `favicon-32.png` (bo góc, nền trong suốt) và `apple-touch-icon.png` (180, vuông kín, iOS tự bo) từ `ios/EnMirror/AppIcon.icon/Assets/hand-mirror.png`: hình gương thu 0,85, đặt giữa, trên dải tím display P3 của icon app. Chạy lại khi đổi icon app |

- Nội dung nằm trong `src/content/*`, mỗi file có bản `vi` và `en`. Đổi policy hoặc điều khoản thì đổi cả hai bản và `legalUpdated` trong `src/site.ts`. Policy chỉ nói những gì app làm: không gọi mạng, không thu thập dữ liệu, quyền camera và quyền chỉ thêm ảnh, cài đặt trong UserDefaults (`SettingsKey.swift`), privacy manifest (`PrivacyInfo.xcprivacy`); app đổi thì sửa policy theo.
- `src/site.ts`: tên, domain, email hỗ trợ, `developerName` (`Phuong Phung`, tên seller trên tài khoản Apple Developer) và `appStoreUrl`. `appStoreUrl` đang là `null` vì app chưa phát hành, nên trang chủ và header nổi hiện "Sắp có trên App Store" thay vì nút. Khi app lên App Store, đặt `appStoreUrl: "https://apps.apple.com/app/id6830683755"`.
- Giao diện Sáng / Tối / Theo hệ thống chọn ở footer, lưu trong `localStorage` (`enmirror-theme`); `public/theme.js` áp dụng trước khi trang hiện (file riêng để CSP không cần `unsafe-inline` cho script).
- Ảnh chụp màn hình cho các card tính năng ở trang chủ: hiện chưa có, mỗi card vẽ màn hình gương bằng CSS (`src/components/mirror-screen.tsx`, trạng thái khai ở `art` của từng tính năng trong `src/content/home.ts`: đèn viền, panel, zoom, độ sáng, lật, ảnh đã chụp). Khi có ảnh: chụp trên iPhone 15 (1179 × 2556), `magick <ảnh>.png -resize 600x -quality 82 <tên>.webp`, đặt vào `public/screenshots/` rồi điền đường dẫn vào `screenshot` của tính năng đó (ví dụ `"/screenshots/ring-light.webp"`); bản `vi` và `en` có thể dùng ảnh khác nhau. `screenshot` khác `null` thì card hiện ảnh thay cho bản vẽ CSS. Phần đầu trang chủ (`src/components/mirror-preview.tsx`) luôn là bản vẽ CSS.
- Màu nhấn của trang (`--primary` trong `src/index.css`) là tím lấy từ dải màu icon app, đậm hơn một chút để chữ trên nền trắng đủ tương phản. Bảng màu trên trang Thương hiệu ở `src/content/brand.tsx`.
- Animation nội dung dùng Motion (`src/lib/motion.ts`). Chuyển trang dùng CSS View Transitions: nội dung mới nâng nhẹ 12 px bằng spring 300 ms, bounce 0.1 (đường cong CSS sinh từ Motion), kết hợp fade 180 ms. Header và nền theme đứng yên; Reduce Motion chỉ fade 100 ms, trình duyệt thiếu CSS `linear()` chỉ fade. `public/page-transitions.js` đăng ký trước lần render đầu để bỏ hiệu ứng khi dùng bàn phím và tránh phát lại animation giới thiệu (điện thoại hiện lên, đèn viền bật) khi chuyển trang. Trình duyệt không hỗ trợ vẫn điều hướng bình thường. Khung iPhone (`src/components/iphone-frame.tsx`), màn hình gương CSS và biến thể nút `glass` / `glass-tinted` trong `ui/button.tsx` là phần làm tay ngoài shadcn.

## Deploy

Worker chỉ có static assets (`enmirror-landing-production` trong `wrangler.jsonc`, không script, không binding), route `custom_domain` cho `enmirror.trinhvaphuong.com` (lần deploy đầu tự tạo DNS record và chứng chỉ), `workers_dev` và `preview_urls` tắt.

1. `cd web/apps/landing && bunx wrangler login` (nếu chưa).
2. `bun run deploy` (hoặc `bun run deploy` trong `web/`).
3. Kiểm: `curl -fsSI https://enmirror.trinhvaphuong.com/privacy` trả 200 và có `content-security-policy`; mở `/`, `/en/privacy`, `/support` trên iPhone.

Email `support@trinhvaphuong.com` đi qua Email Routing của zone `trinhvaphuong.com` (thiết lập một lần cho cả zone); gửi thử một email trước khi submit app. Rollback: `bunx wrangler rollback` trong thư mục này.
