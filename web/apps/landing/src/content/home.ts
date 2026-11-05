import type { DemoLabels, MirrorArt } from "@/components/mirror-screen"
import type { Lang } from "@/routes"

export type HeroFact = { icon: "free" | "noAds" | "noAccount" | "offline"; label: string }

export type Feature = {
  key: "sharp" | "ring-light" | "zoom-exposure" | "photo" | "others-see" | "private"
  title: string
  body: string
  /**
   * A screenshot from the app (iPhone 15, 1179 × 2556, shrunk to 600 px WebP in
   * public/screenshots). null draws `art` instead: the mirror screen in CSS.
   */
  screenshot: string | null
  /** The mirror screen state drawn while there is no screenshot. */
  art: MirrorArt
  /** Which end of the screen the card shows: the phone is cut off at the other end. */
  focus?: "top" | "bottom"
}

export type HomeDoc = {
  title: string
  description: string
  heading: string
  /** The headline is `heading` then, in italic, `headingAccent`. */
  headingAccent: string
  /** The pill above the headline. */
  openSource: string
  github: string
  lead: string
  /** Short promises under the call to action, each with its symbol. */
  facts: HeroFact[]
  requirement: string
  cta: string
  ctaSoon: string
  phone: DemoLabels
  featuresTitle: string
  featuresLead: string
  features: Feature[]
  tipsTitle: string
  tips: string[]
  screenshotSoon: string
}

// The same mirror states in both languages; only the words change.
const art = {
  sharp: { light: null },
  ringLight: { light: 0.2, lightSize: 0.3, panel: "light" },
  zoomExposure: { light: null, zoom: 1.8, exposure: 0.7, panel: "exposure", meterPoint: true },
  photo: { light: 0.5, lightSize: 0.1, frozen: true },
  othersSee: { light: null, flipped: true },
  private: { light: 0.9, lightSize: 0.1 },
} satisfies Record<string, MirrorArt>

const vi: HomeDoc = {
  title: "enMirror: Gương soi miễn phí, không quảng cáo",
  description:
    "App gương soi miễn phí cho iPhone, có đèn viền, zoom và chụp ảnh để xem kỹ. Không quảng cáo, không cần đăng ký gói hay tạo tài khoản. Dùng được cả khi không có mạng.",
  heading: "Soi rõ, sáng đủ.",
  headingAccent: "Miễn\u00a0phí, không quảng\u00a0cáo.",
  openSource: "Mã nguồn mở",
  github: "GitHub",
  lead: "Biến iPhone thành gương soi với đèn viền, zoom và chụp ảnh để xem kỹ. Dùng thoải mái, không mất phí, không cần đăng ký gói.",
  facts: [
    { icon: "free", label: "Miễn phí" },
    { icon: "noAds", label: "Không quảng cáo" },
    { icon: "noAccount", label: "Không cần tài khoản" },
    { icon: "offline", label: "Dùng không cần mạng" },
  ],
  requirement: "Dành cho iPhone chạy iOS 26 trở lên",
  cta: "Tải enMirror — miễn phí",
  ctaSoon: "Sắp có trên App Store",
  phone: {
    share: "Chia sẻ",
    save: "Lưu",
    delete: "Xoá",
    region: "Dùng thử enMirror",
    hint: "Bấm các nút để dùng thử",
    light: "Đèn viền",
    exposure: "Độ sáng",
    zoom: "Phóng to",
    flip: "Như người khác nhìn bạn",
    shutter: "Chụp ảnh",
    tone: "Tông màu đèn",
    size: "Độ dày đèn",
    inApp: "Có trong app enMirror",
    asOthers: "Như người khác nhìn bạn",
    mirrorView: "Chế độ gương",
    delay: "Gương trễ",
    liveMirror: "Gương trực tiếp",
    delayedBy: "Gương trễ {s} giây",
    turnAround: "Quay lưng lại. {s} giây nữa bạn sẽ thấy mình ở đây.",
    guide: "Đường căn",
    guides: { off: "Tắt đường căn", centerLine: "Đường giữa", grid: "Lưới 3×3", oval: "Khung oval" },
    about: {
      title: "Giới thiệu",
      done: "Xong",
      tagline: "Soi rõ, sáng đủ. Miễn phí, không quảng cáo.",
      version: "Phiên bản",
      bento: {
        title: "Miễn phí",
        subtitle: "Không tốn đồng nào, bây giờ hay sau này.",
        checks: ["Không quảng cáo", "Không gói đăng ký", "Không mua trong app"],
        offline: "Chạy offline, không cần tài khoản.",
        light: "Đèn viền, zoom và góc nhìn như người khác thấy bạn.",
      },
      copied: "Đã sao chép",
      language: "Ngôn ngữ",
      languageName: "Tiếng Việt",
      privacyPolicy: "Chính sách quyền riêng tư",
      supportTitle: "Hỗ trợ",
      rate: "Đánh giá enMirror trên App Store",
      feedback: "Gửi góp ý",
      help: "Trợ giúp",
      creditsTitle: "Ghi công",
      credits: ["Biểu tượng app: được vẽ riêng cho enMirror.", "Biểu tượng: SF Symbols của Apple."],
    },
  },
  featuresTitle: "Soi gương thôi, mà đủ tiện",
  featuresLead: "Đèn viền, zoom, chụp ảnh — có sẵn và miễn phí. Không quảng cáo chen ngang, không cần đăng ký gói.",
  features: [
    {
      key: "sharp",
      title: "Rõ đến từng chi tiết",
      body: "Soi gương toàn màn hình với độ phân giải cao nhất mà camera trước hỗ trợ. Trên iPhone 13 Pro, hình ảnh trực tiếp có độ phân giải 4032 × 3024.",
      screenshot: null,
      art: art.sharp,
    },
    {
      key: "ring-light",
      title: "Đèn viền quanh màn hình",
      body: "Thiếu sáng? Bật đèn viền quanh màn hình, chỉnh tông ấm hoặc lạnh (2700–6500 K) và độ dày tuỳ thích. Màn hình sẽ sáng tối đa khi bật đèn, rồi trở về mức cũ khi bạn tắt đèn hoặc rời app.",
      screenshot: null,
      art: art.ringLight,
      focus: "bottom",
    },
    {
      key: "zoom-exposure",
      title: "Zoom và độ sáng",
      body: "Dùng hai ngón hoặc kéo thanh trượt để zoom tới 3×. Chạm hai lần để về 1×. Bạn có thể chỉnh sáng trong khoảng ±2 EV, hoặc chạm vào chỗ muốn đo sáng. Với iPhone 14 trở lên, máy sẽ lấy nét ở đó luôn.",
      screenshot: null,
      art: art.zoomExposure,
      focus: "bottom",
    },
    {
      key: "photo",
      title: "Chụp lại để xem kỹ",
      body: "Bấm chụp để giữ lại ảnh ở độ phân giải đầy đủ. Dùng hai ngón để phóng to, kéo ảnh để xem kỹ từng chỗ. Sau đó, bạn có thể chia sẻ, lưu vào Ảnh hoặc bấm Xoá để quay lại soi gương.",
      screenshot: null,
      art: art.photo,
      focus: "bottom",
    },
    {
      key: "others-see",
      title: "Thấy mình như người đối diện thấy",
      body: "Hình trong gương được lật ngang, giống gương thật. Chỉ cần chạm một lần để xem hình không lật — như cách người đối diện nhìn bạn.",
      screenshot: null,
      art: art.othersSee,
    },
    {
      key: "private",
      title: "Riêng tư, không cần mạng",
      body: "Không cần mạng hay tài khoản. enMirror không thu thập dữ liệu; hình từ camera chỉ được xử lý trên iPhone của bạn. Muốn giữ ảnh, bạn chỉ cần bấm Lưu.",
      screenshot: null,
      art: art.private,
    },
  ],
  tipsTitle: "Mẹo nhỏ",
  tips: [
    "Giữ iPhone cách mặt khoảng 30 cm để hình rõ nét nhất.",
    "Thiếu sáng thì bật đèn viền nhé.",
  ],
  screenshotSoon: "Ảnh chụp màn hình",
}

const en: HomeDoc = {
  title: "enMirror: a free mirror app, with no ads",
  description:
    "A free mirror app for iPhone with a ring light, zoom and photos for a closer look. No ads, subscriptions or in-app purchases. No account or internet needed.",
  heading: "A clearer view. A little light.",
  headingAccent: "Free. No\u00a0ads.",
  openSource: "Open source",
  github: "GitHub",
  lead: "Turn your iPhone into a mirror with a ring light, zoom and photos for a closer look. Use it all for free, with no subscriptions or in-app purchases.",
  facts: [
    { icon: "free", label: "Free" },
    { icon: "noAds", label: "No ads" },
    { icon: "noAccount", label: "No account" },
    { icon: "offline", label: "Works offline" },
  ],
  requirement: "For iPhone with iOS 26 or later",
  cta: "Get enMirror — it's free",
  ctaSoon: "Coming soon to the App Store",
  phone: {
    share: "Share",
    save: "Save",
    delete: "Delete",
    region: "Try enMirror",
    hint: "Tap the buttons to try it",
    light: "Ring light",
    exposure: "Exposure",
    zoom: "Zoom",
    flip: "As others see you",
    shutter: "Take photo",
    tone: "Light tone",
    size: "Light size",
    inApp: "Available in the enMirror app",
    asOthers: "As others see you",
    mirrorView: "Mirror view",
    delay: "Delayed mirror",
    liveMirror: "Live mirror",
    delayedBy: "Mirror {s} s behind",
    turnAround: "Turn around. You'll see yourself here in {s} s.",
    guide: "Alignment guide",
    guides: { off: "Guide off", centerLine: "Center line", grid: "Grid", oval: "Face oval" },
    about: {
      title: "About",
      done: "Done",
      tagline: "A clearer view. A little light. Free. No ads.",
      version: "Version",
      bento: {
        title: "Free",
        subtitle: "Costs nothing, now or later.",
        checks: ["No ads", "No subscriptions", "No in-app purchases"],
        offline: "Works offline, no account needed.",
        light: "Ring light, zoom and how others see you.",
      },
      copied: "Copied",
      language: "Language",
      languageName: "English",
      privacyPolicy: "Privacy Policy",
      supportTitle: "Support",
      rate: "Rate enMirror on the App Store",
      feedback: "Send Feedback",
      help: "Help & Support",
      creditsTitle: "Acknowledgements",
      credits: ["App icon: original artwork made for enMirror.", "Symbols: SF Symbols by Apple."],
    },
  },
  featuresTitle: "Everything a mirror needs",
  featuresLead: "Ring light, zoom and photos, all included for free. No ads getting in the way. No subscriptions.",
  features: [
    {
      key: "sharp",
      title: "See every detail",
      body: "Your front camera fills the screen at the highest resolution it supports. On iPhone 13 Pro, that's a live 4032 × 3024 view.",
      screenshot: null,
      art: art.sharp,
    },
    {
      key: "ring-light",
      title: "A ring light around the screen",
      body: "Need more light? Light up the edge of your screen and adjust the tone from warm to cool (2700–6500 K), plus the width of the ring. The screen goes to full brightness while the light is on, then returns to its previous level when you turn it off or leave the app.",
      screenshot: null,
      art: art.ringLight,
      focus: "bottom",
    },
    {
      key: "zoom-exposure",
      title: "Zoom and exposure",
      body: "Pinch or drag the slider to zoom up to 3×. Double-tap to return to 1×. Adjust exposure by ±2 EV, or tap a spot on the mirror to meter there. On iPhone 14 and later, that tap sets focus too.",
      screenshot: null,
      art: art.zoomExposure,
      focus: "bottom",
    },
    {
      key: "photo",
      title: "Snap a photo. Take a closer look.",
      body: "Tap the shutter to capture a full-resolution photo. Pinch to zoom and drag to look around. Share it, save it to Photos, or tap Delete to go back to the mirror.",
      screenshot: null,
      art: art.photo,
      focus: "bottom",
    },
    {
      key: "others-see",
      title: "As others see you",
      body: "The default view is flipped, just like a real mirror. Tap once for an unflipped view to see yourself the way someone facing you does.",
      screenshot: null,
      art: art.othersSee,
    },
    {
      key: "private",
      title: "Private by design",
      body: "No internet, no account and no data collection. Your camera image stays on your iPhone. A photo is saved only when you tap Save.",
      screenshot: null,
      art: art.private,
    },
  ],
  tipsTitle: "Tips",
  tips: [
    "Hold your iPhone about 30 cm from your face for the sharpest view.",
    "Low light? Turn on the ring light.",
  ],
  screenshotSoon: "App screenshot",
}

export const home: Record<Lang, HomeDoc> = { vi, en }
