import type { LegalDoc } from "@/components/legal-article"
import { TypographyLink, TypographyList, TypographyP } from "@/components/typography"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import type { Lang } from "@/routes"
import { site } from "@/site"

// Facts behind this text: the app makes no network requests (no networking code at all),
// ios/EnMirror/PrivacyInfo.xcprivacy (no tracking, no collected data), ios/EnMirror/InfoPlist.xcstrings
// (camera and add-only Photos permissions), ios/EnMirror/Support/SettingsKey.swift (what UserDefaults
// keeps) and the privacy manifest (no data collected, no tracking). Change it together with the app,
// and bump site.legalUpdated.

const mail = <TypographyLink href={`mailto:${site.supportEmail}`}>{site.supportEmail}</TypographyLink>

function Permissions({ lang }: { lang: Lang }) {
  const rows =
    lang === "vi"
      ? [
          { name: "Camera", when: "Lần đầu mở app", why: "Hiển thị hình từ camera trước làm gương. Hình chỉ hiện trên màn hình, không được lưu hay gửi đi." },
          { name: "Ảnh (chỉ thêm ảnh)", when: "Lần đầu bạn bấm Lưu", why: "Thêm ảnh bạn chọn vào thư viện Ảnh. enMirror không đọc được ảnh có sẵn trong thư viện." },
        ]
      : [
          { name: "Camera", when: "The first time you open the app", why: "Shows the front camera as your mirror. The image is only shown on screen, never stored or sent." },
          { name: "Photos (add only)", when: "The first time you tap Save", why: "Adds the photo you chose to your library. enMirror cannot read the photos already there." },
        ]
  const head = lang === "vi" ? ["Quyền", "Khi nào app xin quyền", "Dùng để làm gì"] : ["Permission", "When we ask", "What it is for"]

  return (
    <Table>
      <TableHeader>
        <TableRow>
          {head.map((title) => (
            <TableHead key={title}>{title}</TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {rows.map((row) => (
          <TableRow key={row.name}>
            <TableCell className="font-medium">{row.name}</TableCell>
            <TableCell className="whitespace-normal">{row.when}</TableCell>
            <TableCell className="whitespace-normal">{row.why}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

const vi: LegalDoc = {
  title: "Chính sách quyền riêng tư",
  description:
    "enMirror không thu thập dữ liệu. Hình từ camera chỉ được xử lý trên iPhone của bạn, không được tải lên mạng.",
  updated: site.legalUpdated,
  intro: (
    <>
      <TypographyP>
        <strong>enMirror không thu thập dữ liệu của bạn.</strong> App không kết nối
        mạng, không cần tài khoản, không có quảng cáo, không dùng công cụ phân tích hay theo dõi và không
        chứa SDK của bên thứ ba.
      </TypographyP>
      <TypographyP>
        Hình từ camera chỉ được xử lý ngay trên iPhone của bạn. Ảnh chỉ được lưu vào thư viện Ảnh khi
        bạn bấm Lưu. Bạn có thể xem chi tiết bên dưới.
      </TypographyP>
    </>
  ),
  sections: [
    {
      id: "controller",
      title: "Ai chịu trách nhiệm",
      body: (
        <TypographyP>
          enMirror do {site.developerName} phát triển ("chúng tôi"). Bạn có thể gửi mọi câu hỏi về quyền
          riêng tư tới {mail}.
        </TypographyP>
      ),
    },
    {
      id: "no-data",
      title: "Dữ liệu chúng tôi thu thập",
      body: (
        <>
          <TypographyP>
            Không có dữ liệu nào được thu thập. enMirror không kết nối mạng, nên app không gửi dữ liệu
            từ iPhone của bạn đi đâu. Cụ thể:
          </TypographyP>
          <TypographyList>
            <li>không tài khoản, không đăng nhập, không mã định danh người dùng;</li>
            <li>không công cụ phân tích, không theo dõi bạn trên các app hay trang web khác;</li>
            <li>không quảng cáo và không SDK của bên thứ ba;</li>
            <li>không bán hay chia sẻ dữ liệu, vì chúng tôi không có dữ liệu nào của bạn.</li>
          </TypographyList>
          <TypographyP>
            Tệp khai báo quyền riêng tư (privacy manifest) trong app khai báo <strong>không thu thập dữ liệu</strong>{" "}
            và không theo dõi. Mã nguồn mở trên GitHub, nên ai cũng kiểm tra được điều này.
          </TypographyP>
        </>
      ),
    },
    {
      id: "camera",
      title: "Camera",
      body: (
        <TypographyP>
          enMirror dùng camera trước để hiển thị hình của bạn. Các khung hình được xử lý ngay trên thiết bị
          để hiện lên màn hình. Chúng không được lưu lại, không được ghi hình và không được gửi đi đâu. Khi
          bạn bật gương trễ, app giữ các khung hình của tối đa 5 giây gần nhất trong bộ nhớ để hiện lại sau
          vài giây; chúng bị xoá ngay khi bạn tắt gương trễ hoặc rời app, và không bao giờ được ghi xuống
          máy.
        </TypographyP>
      ),
    },
    {
      id: "face-data",
      title: "Dữ liệu khuôn mặt",
      body: (
        <>
          <TypographyP>
            <strong>enMirror không thu thập, lưu trữ hay chia sẻ dữ liệu khuôn mặt.</strong> App chỉ hiển
            thị hình từ camera trước lên màn hình như một chiếc gương.
          </TypographyP>
          <TypographyList>
            <li>
              App không nhận diện, phát hiện, theo dõi hay phân tích khuôn mặt, và không tạo bản đồ hay số
              đo khuôn mặt. App không dùng camera TrueDepth, dữ liệu Face ID, ARKit hay framework Vision.
            </li>
            <li>
              Khung oval, đường giữa và lưới chỉ là hình vẽ cố định trên màn hình; chúng không dò tìm
              khuôn mặt.
            </li>
            <li>
              Khung hình camera chỉ nằm trong bộ nhớ của iPhone trong lúc hiển thị (tối đa 5 giây với gương
              trễ) rồi bị xoá. Không có gì được ghi xuống máy, gửi lên mạng hay chia sẻ cho bên thứ ba.
            </li>
            <li>
              Một ảnh chỉ được giữ lại khi chính bạn bấm Lưu (vào thư viện Ảnh trên máy bạn) hoặc Chia sẻ
              (tới nơi bạn chọn). Chúng tôi không nhận được ảnh đó.
            </li>
          </TypographyList>
        </>
      ),
    },
    {
      id: "photos",
      title: "Ảnh bạn chụp",
      body: (
        <>
          <TypographyP>
            Khi bạn bấm nút chụp, enMirror giữ khung hình đó trong bộ nhớ để bạn xem kỹ. Bấm{" "}
            <strong>Xoá</strong> hoặc quay lại gương thì ảnh sẽ được xoá khỏi bộ nhớ. Ảnh chỉ được lưu vào thư viện Ảnh khi
            bạn bấm <strong>Lưu</strong>, dùng quyền <strong>chỉ thêm ảnh</strong>: enMirror không đọc được
            ảnh có sẵn trong thư viện.
          </TypographyP>
          <TypographyP>
            Khi bạn bấm <strong>Chia sẻ</strong>, ảnh được gửi tới app hoặc người bạn chọn trong bảng chia
            sẻ của iOS. Từ đó, cách ảnh được xử lý tuân theo chính sách của app hoặc dịch vụ bạn chọn.
          </TypographyP>
        </>
      ),
    },
    {
      id: "permissions",
      title: "Các quyền app cần",
      body: (
        <>
          <TypographyP>
            Bạn có thể bật hoặc tắt từng quyền bất cứ lúc nào trong Cài đặt → enMirror.
          </TypographyP>
          <Permissions lang="vi" />
        </>
      ),
    },
    {
      id: "on-device",
      title: "Các tuỳ chọn lưu trên iPhone",
      body: (
        <TypographyP>
          enMirror lưu một số tuỳ chọn như tông màu, độ dày đèn viền và chế độ "Như người khác
          nhìn bạn". Các tuỳ chọn này chỉ được lưu trên iPhone và bị xoá khi bạn xoá app.
        </TypographyP>
      ),
    },
    {
      id: "email",
      title: "Khi bạn liên hệ với chúng tôi",
      body: (
        <TypographyP>
          Nếu bạn gửi email tới {mail} (kể cả qua nút Gửi góp ý trong app, email này có kèm phiên bản app),
          chúng tôi nhận được địa chỉ email và nội dung bạn gửi. Chúng tôi chỉ dùng chúng để trả lời bạn.
          Bạn có thể yêu cầu xoá thư trao đổi bất cứ lúc nào.
        </TypographyP>
      ),
    },
    {
      id: "website",
      title: "Trang web này",
      body: (
        <TypographyP>
          Trang web enMirror không dùng cookie, không có công cụ phân tích hay theo dõi. Lựa chọn giao diện
          sáng hoặc tối được lưu trong trình duyệt của bạn và không được gửi đi.
        </TypographyP>
      ),
    },
    {
      id: "children",
      title: "Trẻ em",
      body: (
        <TypographyP>
          enMirror không thu thập dữ liệu của bất kỳ ai, kể cả trẻ em.
        </TypographyP>
      ),
    },
    {
      id: "changes",
      title: "Thay đổi chính sách",
      body: (
        <TypographyP>
          Chúng tôi cập nhật ngày ở đầu trang mỗi khi chính sách thay đổi. Nếu một phiên bản sau của enMirror
          thay đổi cách xử lý dữ liệu, chính sách này sẽ được cập nhật trước khi phiên bản đó phát hành.
        </TypographyP>
      ),
    },
  ],
}

const en: LegalDoc = {
  title: "Privacy Policy",
  description: "enMirror collects no data. The camera image stays on your iPhone and nothing is uploaded.",
  updated: site.legalUpdated,
  intro: (
    <>
      <TypographyP>
        <strong>enMirror collects no data about you.</strong> The app makes no network requests,
        has no account, no ads, no analytics or tracking, and no third-party SDKs.
      </TypographyP>
      <TypographyP>
        Camera frames are processed on your iPhone only. A photo is saved to your Photos library only when
        you tap Save. You can find the details below.
      </TypographyP>
    </>
  ),
  sections: [
    {
      id: "controller",
      title: "Who is responsible",
      body: (
        <TypographyP>
          enMirror is developed by {site.developerName} ("we"). Send any privacy question to {mail}.
        </TypographyP>
      ),
    },
    {
      id: "no-data",
      title: "Data we collect",
      body: (
        <>
          <TypographyP>
            None. enMirror makes no network requests, so nothing leaves your iPhone through the app. In
            particular:
          </TypographyP>
          <TypographyList>
            <li>no account, no sign-in, no user identifier;</li>
            <li>no analytics, and no tracking across other apps or websites;</li>
            <li>no ads and no third-party SDKs;</li>
            <li>no selling or sharing of data, because we have none of yours.</li>
          </TypographyList>
          <TypographyP>
            The app's privacy manifest declares <strong>no data collected</strong> and no tracking. The source
            is open on GitHub, so anyone can check.
          </TypographyP>
        </>
      ),
    },
    {
      id: "camera",
      title: "Camera",
      body: (
        <TypographyP>
          enMirror uses the front camera to show your reflection. Frames are processed on your iPhone
          and shown on screen. They are never stored, never recorded and never sent anywhere. When you
          turn on the delayed mirror, the app keeps up to the last 5 seconds of frames in memory to show
          them a few seconds later; they are deleted as soon as you turn the delay off or leave the app,
          and are never written to storage.
        </TypographyP>
      ),
    },
    {
      id: "face-data",
      title: "Face data",
      body: (
        <>
          <TypographyP>
            <strong>enMirror does not collect, store or share face data.</strong> It only shows the front
            camera image on screen, like a mirror.
          </TypographyP>
          <TypographyList>
            <li>
              The app does not recognise, detect, track or analyse faces, and creates no face maps or
              measurements. It does not use the TrueDepth camera, Face ID data, ARKit or the Vision
              framework.
            </li>
            <li>
              The face oval, centre line and grid are fixed drawings on the screen; they do not look for a
              face.
            </li>
            <li>
              Camera frames exist only in your iPhone's memory while they are shown (up to 5 seconds with
              the delayed mirror) and are then discarded. Nothing is written to storage, sent over the
              network or shared with third parties.
            </li>
            <li>
              A photo is kept only when you tap Save (to the Photos library on your iPhone) or Share (to the
              place you pick). We never receive it.
            </li>
          </TypographyList>
        </>
      ),
    },
    {
      id: "photos",
      title: "Photos you take",
      body: (
        <>
          <TypographyP>
            When you tap the shutter, enMirror keeps that still in memory so you can look closely. Tap{" "}
            <strong>Delete</strong> or go back to the mirror and it is gone. A photo is written to your Photos
            library only when you tap <strong>Save</strong>, using <strong>add-only</strong> access: enMirror
            cannot read the photos already in your library.
          </TypographyP>
          <TypographyP>
            When you tap <strong>Share</strong>, the photo goes to the app or person you pick in the iOS share
            sheet. From there, that app's or service's own policy applies.
          </TypographyP>
        </>
      ),
    },
    {
      id: "permissions",
      title: "Permissions",
      body: (
        <>
          <TypographyP>You can turn each one on or off at any time in Settings → enMirror.</TypographyP>
          <Permissions lang="en" />
        </>
      ),
    },
    {
      id: "on-device",
      title: "Settings kept on your iPhone",
      body: (
        <TypographyP>
          enMirror remembers a few choices, such as the ring light's tone and size and the "As others see
          you" view. They are stored only on your iPhone and removed when you
          delete the app.
        </TypographyP>
      ),
    },
    {
      id: "email",
      title: "When you contact us",
      body: (
        <TypographyP>
          If you email {mail} (including through Send Feedback in the app, which adds the app version), we
          receive your email address and what you write. We use them only to reply to you. You can ask us to
          delete the conversation at any time.
        </TypographyP>
      ),
    },
    {
      id: "website",
      title: "This website",
      body: (
        <TypographyP>
          The enMirror website uses no cookies, analytics or tracking. Your light or dark appearance choice is
          stored in your browser and never sent.
        </TypographyP>
      ),
    },
    {
      id: "children",
      title: "Children",
      body: <TypographyP>enMirror collects no data from anyone, children included.</TypographyP>,
    },
    {
      id: "changes",
      title: "Changes to this policy",
      body: (
        <TypographyP>
          We update the date at the top whenever this policy changes. If a later version of enMirror changes
          how it handles data, this policy is updated before that version is released.
        </TypographyP>
      ),
    },
  ],
}

export const privacy: Record<Lang, LegalDoc> = { vi, en }
