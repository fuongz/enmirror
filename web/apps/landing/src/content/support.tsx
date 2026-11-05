import type { ReactNode } from "react"

import { TypographyLink, TypographyP } from "@/components/typography"
import { pathFor, type Lang } from "@/routes"

// Labels in bold are the app's own (ios/EnMirror/Localizable.xcstrings), in the page's language.

export type SupportDoc = {
  title: string
  description: string
  intro: string
  contactTitle: string
  contactBody: string
  emailLabel: string
  faqTitle: string
  faq: { id: string; q: string; a: ReactNode }[]
}

const vi: SupportDoc = {
  title: "Hỗ trợ",
  description: "Câu trả lời cho những thắc mắc thường gặp về enMirror và cách liên hệ.",
  intro: "Bạn cần hỗ trợ? Tìm câu trả lời bên dưới hoặc gửi email cho enMirror.",
  contactTitle: "Liên hệ",
  contactBody:
    "Có thắc mắc, góp ý hay gặp lỗi? Hãy gửi email cho chúng tôi, kèm phiên bản app nếu được. Chúng tôi trả lời trong 1–2 ngày làm việc.",
  emailLabel: "Gửi email",
  faqTitle: "Câu hỏi thường gặp",
  faq: [
    {
      id: "camera-access",
      q: "Gương không hiện hình, app báo chưa có quyền dùng camera",
      a: (
        <TypographyP>
          enMirror cần camera trước để làm gương. Bấm <strong>Mở Cài đặt</strong> trong app, hoặc vào
          Cài đặt → enMirror và bật <strong>Camera</strong>. Hình từ camera chỉ hiển thị trên iPhone
          của bạn, không được ghi lại hay tải lên.
        </TypographyP>
      ),
    },
    {
      id: "sharpness",
      q: "Làm sao để hình rõ nét nhất?",
      a: (
        <TypographyP>
          Cầm iPhone cách mặt khoảng 30 cm: camera trước nét nhất ở khoảng cách đó. Trong phòng tối,
          hãy bật đèn viền. Từ iPhone 14 trở lên, chạm vào gương để máy đo sáng và lấy nét tại điểm đó;
          camera trước của các đời cũ hơn có tiêu cự cố định nên chạm chỉ chỉnh độ sáng.
        </TypographyP>
      ),
    },
    {
      id: "ring-light",
      q: "Vì sao màn hình sáng hẳn lên khi bật đèn viền?",
      a: (
        <TypographyP>
          Để viền sáng như đèn vòng thật, enMirror tăng độ sáng màn hình lên tối đa khi đèn bật. Độ sáng
          trở lại mức cũ ngay khi bạn tắt đèn hoặc rời app. Bấm vào nút đèn để chỉnh{" "}
          <strong>Tông màu đèn</strong> (từ ấm sang lạnh) và <strong>Độ dày đèn</strong>.
        </TypographyP>
      ),
    },
    {
      id: "others-see",
      q: "Vì sao hình trong gương bị ngược?",
      a: (
        <TypographyP>
          Giống gương thật, enMirror mặc định hiện hình lật ngang. Bấm nút <strong>Như người khác nhìn bạn</strong>{" "}
          để xem hình không lật, đúng như người đối diện thấy bạn. Bấm lần nữa để về{" "}
          <strong>Chế độ gương</strong>.
        </TypographyP>
      ),
    },
    {
      id: "save-photo",
      q: "Tôi không lưu được ảnh vào Ảnh",
      a: (
        <TypographyP>
          enMirror chỉ xin quyền thêm ảnh vào thư viện, không đọc ảnh có sẵn. Nếu app báo{" "}
          <strong>Hãy cho phép truy cập Ảnh trong Cài đặt để lưu</strong>, vào Cài đặt → enMirror →
          Ảnh và chọn <strong>Chỉ thêm ảnh</strong>.
        </TypographyP>
      ),
    },
    {
      id: "privacy",
      q: "enMirror có lưu hay gửi hình của tôi đi đâu không?",
      a: (
        <TypographyP>
          Không. enMirror không kết nối mạng và không thu thập dữ liệu. Hình từ camera được xử lý ngay
          trên iPhone, không được lưu hay gửi đi. Ảnh chỉ vào thư viện Ảnh khi bạn bấm{" "}
          <strong>Lưu</strong>. Xem chi tiết trong{" "}
          <TypographyLink href={pathFor("vi", "privacy")}>Chính sách quyền riêng tư</TypographyLink>.
        </TypographyP>
      ),
    },
    {
      id: "devices",
      q: "enMirror chạy trên máy nào?",
      a: (
        <TypographyP>
          iPhone chạy iOS 26 trở lên. enMirror hiện chỉ dành cho iPhone. App có tiếng Việt và tiếng
          Anh; đổi ngôn ngữ trong Cài đặt → enMirror → Ngôn ngữ.
        </TypographyP>
      ),
    },
    {
      id: "price",
      q: "enMirror có thật sự miễn phí không?",
      a: (
        <TypographyP>
          Có. enMirror miễn phí, không quảng cáo, không gói đăng ký, không mua trong app và không cần
          tài khoản.
        </TypographyP>
      ),
    },
    {
      id: "feedback",
      q: "Làm sao để gửi góp ý hoặc báo lỗi?",
      a: (
        <TypographyP>
          Chạm nút <strong>i</strong> ở góc trên màn hình gương để mở <strong>Giới thiệu</strong>, rồi chọn{" "}
          <strong>Gửi góp ý</strong>: email được soạn sẵn kèm phiên bản app. Bạn cũng có thể chạm vào dòng
          phiên bản để sao chép, rồi gửi kèm trong email.
        </TypographyP>
      ),
    },
  ],
}

const en: SupportDoc = {
  title: "Support",
  description: "Answers to common questions about enMirror, and how to reach us.",
  intro: "Need help? Check the common questions below, or email us.",
  contactTitle: "Contact",
  contactBody:
    "Send questions, feedback or bug reports, with the app version if you can. We reply within 1–2 business days.",
  emailLabel: "Send email",
  faqTitle: "Frequently asked questions",
  faq: [
    {
      id: "camera-access",
      q: "The mirror is blank and says camera access is off",
      a: (
        <TypographyP>
          enMirror needs the front camera to work as a mirror. Tap <strong>Open Settings</strong> in the
          app, or go to Settings → enMirror and turn on <strong>Camera</strong>. The camera image is only
          shown on your iPhone; nothing is recorded or uploaded.
        </TypographyP>
      ),
    },
    {
      id: "sharpness",
      q: "How do I get the sharpest image?",
      a: (
        <TypographyP>
          Hold your iPhone about 30 cm from your face: the front camera is sharpest there. In a dim room,
          turn on the ring light. On iPhone 14 and later, tap the mirror to set exposure and focus at that
          point; older front cameras have fixed focus, so a tap sets exposure only.
        </TypographyP>
      ),
    },
    {
      id: "ring-light",
      q: "Why does the screen get so bright with the ring light on?",
      a: (
        <TypographyP>
          To glow like a real ring light, enMirror turns screen brightness up to full while the light is
          on. It goes back to where it was as soon as you turn the light off or leave the app. Tap the light
          button to set the <strong>Light tone</strong> (warm to cool) and <strong>Light size</strong>.
        </TypographyP>
      ),
    },
    {
      id: "others-see",
      q: "Why is the image reversed?",
      a: (
        <TypographyP>
          Like a real mirror, enMirror shows you flipped by default. Tap <strong>As others see you</strong> to
          see the unflipped view, the way the person in front of you sees you. Tap again for{" "}
          <strong>Mirror view</strong>.
        </TypographyP>
      ),
    },
    {
      id: "save-photo",
      q: "I can't save a photo to Photos",
      a: (
        <TypographyP>
          enMirror only asks to add photos to your library; it never reads the photos you have. If the app
          says <strong>Allow Photos access in Settings to save</strong>, go to Settings → enMirror → Photos
          and choose <strong>Add Photos Only</strong>.
        </TypographyP>
      ),
    },
    {
      id: "privacy",
      q: "Does enMirror store or send my image anywhere?",
      a: (
        <TypographyP>
          No. enMirror makes no network requests and collects no data. Camera frames are processed on your
          iPhone and never stored or sent. A photo goes into your Photos library only when you tap{" "}
          <strong>Save</strong>. See the{" "}
          <TypographyLink href={pathFor("en", "privacy")}>Privacy Policy</TypographyLink> for details.
        </TypographyP>
      ),
    },
    {
      id: "devices",
      q: "Which devices does enMirror run on?",
      a: (
        <TypographyP>
          iPhone with iOS 26 or later. enMirror is for iPhone only for now. The app is in English and
          Vietnamese; change the language in Settings → enMirror → Language.
        </TypographyP>
      ),
    },
    {
      id: "price",
      q: "Is enMirror really free?",
      a: (
        <TypographyP>
          Yes. No ads, no subscriptions, no in-app purchases and no account.
        </TypographyP>
      ),
    },
    {
      id: "feedback",
      q: "How do I send feedback or report a bug?",
      a: (
        <TypographyP>
          Tap the <strong>i</strong> button at the top of the mirror to open <strong>About</strong>, then
          choose <strong>Send Feedback</strong>: the email comes with the app version filled in. You can also
          tap the version line to copy it and paste it into your email.
        </TypographyP>
      ),
    },
  ],
}

export const support: Record<Lang, SupportDoc> = { vi, en }
