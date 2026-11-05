import type { Lang } from "@/routes"

/** Each language in its own name, with its flag. */
export const languages: Record<Lang, { flag: string; name: string }> = {
  vi: { flag: "🇻🇳", name: "Tiếng Việt" },
  en: { flag: "🇬🇧", name: "English" },
}

export const ui = {
  vi: {
    nav: { home: "Trang chủ", privacy: "Quyền riêng tư", terms: "Điều khoản", support: "Hỗ trợ", brand: "Thương hiệu" },
    language: "Ngôn ngữ",
    getApp: "Tải ứng dụng",
    soon: "Sắp có",
    theme: { label: "Giao diện", light: "Sáng", dark: "Tối", system: "Theo hệ thống" },
    updated: "Cập nhật lần cuối",
    onThisPage: "Trên trang này",
    footerRights: "Bảo lưu mọi quyền.",
    notFoundTitle: "Không tìm thấy trang",
    notFoundBody: "Không thấy trang bạn đang tìm. Có thể trang đã được chuyển sang địa chỉ khác.",
    backHome: "Về trang chủ",
  },
  en: {
    nav: { home: "Home", privacy: "Privacy", terms: "Terms", support: "Support", brand: "Brand" },
    language: "Language",
    getApp: "Get the app",
    soon: "Coming soon",
    theme: { label: "Appearance", light: "Light", dark: "Dark", system: "System" },
    updated: "Last updated",
    onThisPage: "On this page",
    footerRights: "All rights reserved.",
    notFoundTitle: "Page not found",
    notFoundBody: "The page you are looking for does not exist or has moved.",
    backHome: "Back to home",
  },
} satisfies Record<Lang, unknown>

const enMonths = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
]

// Formatted by hand: Intl output differs between the build (Bun) and browsers, which breaks
// hydration of the prerendered page.
export function formatDate(iso: string, lang: Lang): string {
  const [year, month, day] = iso.split("-").map(Number)
  if (lang === "vi") return `${day} tháng ${month} năm ${year}`
  return `${day} ${enMonths[(month ?? 1) - 1]} ${year}`
}
