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
  title: "enMirror: Gương soi rõ nét, có đèn viền",
  description:
    "Ứng dụng gương soi miễn phí cho iPhone: camera trước rõ nét, đèn viền chỉnh được tông màu, zoom, chụp lại để xem kỹ. Không quảng cáo, không cần tài khoản, chạy hoàn toàn offline.",
  heading: "Gương soi rõ nét,",
  headingAccent: "có đèn viền.",
  openSource: "Mã nguồn mở",
  github: "GitHub",
  lead: "enMirror là app gương soi mã nguồn mở cho iPhone. Camera trước ở độ nét cao nhất, đèn viền quanh màn hình cho phòng thiếu sáng, miễn phí và không quảng cáo.",
  facts: [
    { icon: "free", label: "Miễn phí" },
    { icon: "noAds", label: "Không quảng cáo" },
    { icon: "noAccount", label: "Không cần tài khoản" },
    { icon: "offline", label: "Chạy offline" },
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
    about: {
      title: "Giới thiệu",
      done: "Xong",
      tagline: "Gương soi rõ nét, có đèn viền. Miễn phí, không quảng cáo.",
      version: "Phiên bản",
      highlights: [
        "Miễn phí mãi mãi: không quảng cáo, không gói đăng ký, không mua trong app",
        "Chạy offline, không cần tài khoản",
        "Đèn viền, zoom và chế độ xem như người khác nhìn bạn",
      ],
      tipsTitle: "Mẹo",
      tips: [
        "Chạm vào gương để đo sáng tại điểm đó. Từ iPhone 14 trở lên, máy lấy nét luôn tại đó.",
        "Chụm hai ngón để zoom, chạm hai lần để về 1×.",
        "Cầm iPhone cách mặt khoảng 30 cm: camera trước nét nhất ở khoảng cách đó.",
        "Trong phòng tối, hãy bật đèn viền.",
      ],
      language: "Ngôn ngữ",
      languageName: "Tiếng Việt",
      privacyTitle: "Quyền riêng tư",
      privacy: "enMirror không thu thập dữ liệu. Hình từ camera chỉ ở trên iPhone của bạn, không có gì được tải lên, và ảnh chỉ được lưu khi bạn bấm Lưu.",
      privacyPolicy: "Chính sách quyền riêng tư",
      supportTitle: "Hỗ trợ",
      rate: "Đánh giá enMirror trên App Store",
      feedback: "Gửi góp ý",
      help: "Trợ giúp & Hỗ trợ",
      creditsTitle: "Ghi công",
      credits: ["Icon app: hình vẽ riêng cho enMirror.", "Biểu tượng: SF Symbols của Apple."],
    },
  },
  featuresTitle: "Mọi thứ một chiếc gương cần",
  featuresLead: "Không hơn, không kém. Không quảng cáo xen ngang, không gói đăng ký.",
  features: [
    {
      key: "sharp",
      title: "Rõ đến từng chi tiết",
      body: "Toàn màn hình là hình từ camera trước, ở định dạng nét nhất máy hỗ trợ. Trên iPhone 13 Pro, đó là hình trực tiếp 4032 × 3024.",
      screenshot: null,
      art: art.sharp,
    },
    {
      key: "ring-light",
      title: "Đèn viền quanh màn hình",
      body: "Bật đèn để viền màn hình sáng lên như đèn vòng. Chỉnh tông từ ấm sang lạnh (2700–6500 K) và độ dày viền. Độ sáng màn hình lên tối đa và trở lại như cũ khi tắt đèn hoặc rời app.",
      screenshot: null,
      art: art.ringLight,
      focus: "bottom",
    },
    {
      key: "zoom-exposure",
      title: "Zoom và độ sáng",
      body: "Chụm hai ngón hoặc kéo thanh trượt để phóng to tới 3×, chạm hai lần để về 1×. Chỉnh độ sáng ±2 EV, hoặc chạm vào gương để đo sáng tại điểm đó; từ iPhone 14 trở lên, máy lấy nét luôn tại đó.",
      screenshot: null,
      art: art.zoomExposure,
      focus: "bottom",
    },
    {
      key: "photo",
      title: "Chụp lại để xem kỹ",
      body: "Bấm nút chụp để giữ lại khung hình ở độ phân giải đầy đủ. Chụm và kéo để xem kỹ, rồi Chia sẻ, Lưu vào Ảnh hoặc Xoá để quay lại gương.",
      screenshot: null,
      art: art.photo,
      focus: "bottom",
    },
    {
      key: "others-see",
      title: "Như người khác nhìn bạn",
      body: "Gương thường cho bạn thấy hình ngược. Một chạm để lật lại, xem mình đúng như người đối diện đang thấy.",
      screenshot: null,
      art: art.othersSee,
    },
    {
      key: "private",
      title: "Riêng tư, không cần mạng",
      body: "enMirror không kết nối mạng, không cần tài khoản và không thu thập dữ liệu. Hình từ camera chỉ ở trên iPhone của bạn; ảnh chỉ được lưu khi bạn bấm Lưu.",
      screenshot: null,
      art: art.private,
    },
  ],
  tipsTitle: "Mẹo nhỏ",
  tips: [
    "Cầm iPhone cách mặt khoảng 30 cm: camera trước nét nhất ở khoảng cách đó.",
    "Trong phòng tối, hãy bật đèn viền.",
  ],
  screenshotSoon: "Ảnh chụp màn hình",
}

const en: HomeDoc = {
  title: "enMirror: a clear mirror with a ring light",
  description:
    "A free mirror app for iPhone: a sharp front-camera view, a ring light with adjustable tone, zoom, and stills to look closely. No ads, no account, fully offline.",
  heading: "A clear mirror,",
  headingAccent: "with a ring light.",
  openSource: "Open source",
  github: "GitHub",
  lead: "enMirror is an open-source mirror app for iPhone. The front camera at its sharpest and a ring light around the screen for dim rooms, free and without ads.",
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
    about: {
      title: "About",
      done: "Done",
      tagline: "A clear mirror with a ring light. Free, with no ads.",
      version: "Version",
      highlights: [
        "Free forever: no ads, no subscriptions, no in-app purchases",
        "Works offline, with no account",
        "Ring light, zoom and a true view of how others see you",
      ],
      tipsTitle: "Tips",
      tips: [
        "Tap the mirror to set the exposure there. On iPhone 14 and later it focuses there too.",
        "Pinch to zoom, double-tap to go back to 1×.",
        "Hold your iPhone about 30 cm from your face: the front camera is sharpest there.",
        "In a dim room, turn on the ring light.",
      ],
      language: "Language",
      languageName: "English",
      privacyTitle: "Privacy",
      privacy: "enMirror collects no data. The camera image stays on your iPhone, nothing is uploaded, and a photo is saved only when you tap Save.",
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
  featuresLead: "Nothing more. No ads in the way, no subscriptions.",
  features: [
    {
      key: "sharp",
      title: "Every detail, sharp",
      body: "The whole screen is the front camera, on the sharpest format your iPhone offers. On iPhone 13 Pro that is a live 4032 × 3024 stream.",
      screenshot: null,
      art: art.sharp,
    },
    {
      key: "ring-light",
      title: "A ring light around the screen",
      body: "Turn on the light and the screen's edge glows like a ring light. Set its tone from warm to cool (2700–6500 K) and its size. Screen brightness goes to full and comes back when you turn the light off or leave the app.",
      screenshot: null,
      art: art.ringLight,
      focus: "bottom",
    },
    {
      key: "zoom-exposure",
      title: "Zoom and exposure",
      body: "Pinch or use the slider to zoom up to 3×; double-tap to go back to 1×. Adjust exposure by ±2 EV, or tap the mirror to set it at that point. On iPhone 14 and later it focuses there too.",
      screenshot: null,
      art: art.zoomExposure,
      focus: "bottom",
    },
    {
      key: "photo",
      title: "Take a still, look closely",
      body: "The shutter keeps a full-resolution still. Pinch and pan to inspect it, then Share, Save to Photos, or Delete to go back to the mirror.",
      screenshot: null,
      art: art.photo,
      focus: "bottom",
    },
    {
      key: "others-see",
      title: "As others see you",
      body: "A mirror shows you reversed. One tap flips the view, so you see yourself the way the person in front of you does.",
      screenshot: null,
      art: art.othersSee,
    },
    {
      key: "private",
      title: "Private by design",
      body: "enMirror never goes online, needs no account and collects no data. The camera image stays on your iPhone; a photo is saved only when you tap Save.",
      screenshot: null,
      art: art.private,
    },
  ],
  tipsTitle: "Tips",
  tips: [
    "Hold your iPhone about 30 cm from your face: the front camera is sharpest there.",
    "In a dim room, turn on the ring light.",
  ],
  screenshotSoon: "App screenshot",
}

export const home: Record<Lang, HomeDoc> = { vi, en }
