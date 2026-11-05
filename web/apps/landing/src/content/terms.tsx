import type { LegalDoc } from "@/components/legal-article"
import { TypographyLink, TypographyList, TypographyP } from "@/components/typography"
import { pathFor, type Lang } from "@/routes"
import { site } from "@/site"

// Simple consumer terms for a free app that works offline, with no account, no purchases and no
// content shared through us. They sit on top of Apple's Standard EULA.

const mail = <TypographyLink href={`mailto:${site.supportEmail}`}>{site.supportEmail}</TypographyLink>
const eula = "https://www.apple.com/legal/internet-services/itunes/dev/stdeula/"

const vi: LegalDoc = {
  title: "Điều khoản sử dụng",
  description: "Những điều cần biết khi dùng enMirror, ứng dụng gương soi miễn phí cho iPhone.",
  updated: site.legalUpdated,
  intro: (
    <TypographyP>
      Các điều khoản này áp dụng khi bạn dùng ứng dụng enMirror do {site.developerName} cung cấp. Khi tải
      và dùng enMirror, bạn đồng ý với các điều khoản này. Cách enMirror xử lý dữ liệu (thực ra là không
      thu thập gì) có trong{" "}
      <TypographyLink href={pathFor("vi", "privacy")}>Chính sách quyền riêng tư</TypographyLink>.
    </TypographyP>
  ),
  sections: [
    {
      id: "free",
      title: "Miễn phí, không tài khoản",
      body: (
        <TypographyP>
          enMirror miễn phí: không quảng cáo, không gói đăng ký, không mua trong app. Bạn không cần tạo tài
          khoản, và app chạy hoàn toàn offline.
        </TypographyP>
      ),
    },
    {
      id: "licence",
      title: "Quyền sử dụng",
      body: (
        <TypographyP>
          Bạn được dùng enMirror cho mục đích cá nhân trên iPhone của mình, theo các điều khoản này và quy
          định của App Store. Bạn không được sao chép, sửa đổi, dịch ngược hay phân phối lại app, trừ khi
          pháp luật cho phép. Tên, biểu tượng và hình ảnh của enMirror thuộc về chúng tôi; xem trang{" "}
          <TypographyLink href={pathFor("vi", "brand")}>Thương hiệu</TypographyLink> nếu bạn muốn giới
          thiệu enMirror.
        </TypographyP>
      ),
    },
    {
      id: "use",
      title: "Sử dụng đúng mục đích",
      body: (
        <>
          <TypographyP>enMirror là một chiếc gương. Khi dùng app, bạn đồng ý:</TypographyP>
          <TypographyList>
            <li>không chụp hay chia sẻ ảnh người khác khi chưa được họ đồng ý;</li>
            <li>không dùng enMirror cho bất kỳ việc gì vi phạm pháp luật;</li>
            <li>
              không dựa vào enMirror cho mục đích y tế hay an toàn: hình ảnh trên màn hình có thể khác thực
              tế do ánh sáng, độ sáng và camera của từng máy.
            </li>
          </TypographyList>
        </>
      ),
    },
    {
      id: "photos",
      title: "Ảnh của bạn",
      body: (
        <TypographyP>
          Ảnh bạn chụp bằng enMirror thuộc về bạn. Ảnh chỉ nằm trên iPhone của bạn, chúng tôi không nhận
          được bản nào. Bạn tự chịu trách nhiệm về ảnh mình lưu và chia sẻ.
        </TypographyP>
      ),
    },
    {
      id: "ring-light",
      title: "Đèn viền và độ sáng màn hình",
      body: (
        <TypographyP>
          Khi bật đèn viền, enMirror đưa độ sáng màn hình lên tối đa và trả về mức cũ khi tắt đèn hoặc rời
          app. Độ sáng tối đa làm pin hao nhanh hơn và máy có thể ấm lên; hãy tắt đèn khi không cần.
        </TypographyP>
      ),
    },
    {
      id: "as-is",
      title: "Ứng dụng và giới hạn trách nhiệm",
      body: (
        <>
          <TypographyP>
            enMirror được cung cấp miễn phí, "nguyên trạng". Chúng tôi cố gắng giữ app ổn định nhưng không
            cam kết app luôn chạy được trên mọi thiết bị hay không có lỗi. Chúng tôi có thể thay đổi, thêm
            hoặc bỏ tính năng qua các bản cập nhật.
          </TypographyP>
          <TypographyP>
            Trong phạm vi pháp luật cho phép, chúng tôi không chịu trách nhiệm đối với thiệt hại gián tiếp
            phát sinh từ việc dùng enMirror. Các quyền của bạn với tư cách người tiêu dùng theo pháp luật
            không bị ảnh hưởng.
          </TypographyP>
        </>
      ),
    },
    {
      id: "apple",
      title: "Điều khoản của Apple",
      body: (
        <TypographyP>
          Các điều khoản này bổ sung cho{" "}
          <TypographyLink href={eula} rel="noreferrer">
            Giấy phép người dùng cuối tiêu chuẩn của Apple (Standard EULA)
          </TypographyLink>{" "}
          áp dụng cho ứng dụng tải từ App Store. Apple không chịu trách nhiệm về enMirror hay việc hỗ trợ
          enMirror.
        </TypographyP>
      ),
    },
    {
      id: "changes-law",
      title: "Thay đổi và luật áp dụng",
      body: (
        <TypographyP>
          Khi các điều khoản thay đổi, chúng tôi cập nhật trang này và ngày ở đầu trang. Các điều khoản này
          chịu sự điều chỉnh của pháp luật Việt Nam. Bạn có thể gửi câu hỏi tới {mail}.
        </TypographyP>
      ),
    },
  ],
}

const en: LegalDoc = {
  title: "Terms of Use",
  description: "What to know when using enMirror, the free mirror app for iPhone.",
  updated: site.legalUpdated,
  intro: (
    <TypographyP>
      These terms apply when you use the enMirror app, provided by {site.developerName}. By downloading and
      using enMirror you agree to them. How enMirror handles data (it collects none) is described in the{" "}
      <TypographyLink href={pathFor("en", "privacy")}>Privacy Policy</TypographyLink>.
    </TypographyP>
  ),
  sections: [
    {
      id: "free",
      title: "Free, with no account",
      body: (
        <TypographyP>
          enMirror is free: no ads, no subscriptions, no in-app purchases. You do not need an account, and the
          app works fully offline.
        </TypographyP>
      ),
    },
    {
      id: "licence",
      title: "Licence",
      body: (
        <TypographyP>
          You may use enMirror for personal purposes on your own iPhone, under these terms and the App Store
          rules. You may not copy, modify, reverse engineer or redistribute the app, except where the law
          allows it. enMirror's name, icon and artwork belong to us; see the{" "}
          <TypographyLink href={pathFor("en", "brand")}>Brand</TypographyLink> page if you want to write about
          enMirror.
        </TypographyP>
      ),
    },
    {
      id: "use",
      title: "Acceptable use",
      body: (
        <>
          <TypographyP>enMirror is a mirror. When you use it, you agree:</TypographyP>
          <TypographyList>
            <li>not to photograph or share other people without their consent;</li>
            <li>not to use enMirror for anything unlawful;</li>
            <li>
              not to rely on enMirror for medical or safety purposes: what you see on screen can differ from
              reality because of lighting, brightness and each phone's camera.
            </li>
          </TypographyList>
        </>
      ),
    },
    {
      id: "photos",
      title: "Your photos",
      body: (
        <TypographyP>
          Photos you take with enMirror are yours. They stay on your iPhone; we never receive a copy. You are
          responsible for the photos you save and share.
        </TypographyP>
      ),
    },
    {
      id: "ring-light",
      title: "Ring light and screen brightness",
      body: (
        <TypographyP>
          With the ring light on, enMirror turns screen brightness up to full and restores it when you turn the
          light off or leave the app. Full brightness drains the battery faster and can make the phone warm;
          turn the light off when you do not need it.
        </TypographyP>
      ),
    },
    {
      id: "as-is",
      title: "The app and our liability",
      body: (
        <>
          <TypographyP>
            enMirror is provided free and "as is". We work to keep it reliable but do not promise it works on
            every device or is free of bugs. Updates may change, add or remove features.
          </TypographyP>
          <TypographyP>
            To the extent the law allows, we are not liable for indirect damages arising from using enMirror.
            Your statutory rights as a consumer are not affected.
          </TypographyP>
        </>
      ),
    },
    {
      id: "apple",
      title: "Apple's terms",
      body: (
        <TypographyP>
          These terms add to{" "}
          <TypographyLink href={eula} rel="noreferrer">
            Apple's Standard End User License Agreement
          </TypographyLink>
          , which applies to apps from the App Store. Apple is not responsible for enMirror or its support.
        </TypographyP>
      ),
    },
    {
      id: "changes-law",
      title: "Changes and governing law",
      body: (
        <TypographyP>
          When these terms change, we update this page and the date at the top. These terms are governed by
          the laws of Vietnam. Send questions to {mail}.
        </TypographyP>
      ),
    },
  ],
}

export const terms: Record<Lang, LegalDoc> = { vi, en }
