import { DownloadIcon } from "lucide-react"

import type { LegalDoc } from "@/components/legal-article"
import { Logo } from "@/components/logo"
import { TypographyLink, TypographyList, TypographyP } from "@/components/typography"
import { buttonVariants } from "@/components/ui/button"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import type { Lang } from "@/routes"

// Facts behind this page: THIRD_PARTY_NOTICES.md (artwork), ios/EnMirror/AppIcon.icon/icon.json
// (gradient, in display P3; the hex values are the sRGB conversions), AccentColor in
// ios/EnMirror/Assets.xcassets, and --primary in src/index.css.

const ofl = "https://openfontlicense.org"

/** The brand colours. */
const colours = [
  {
    hex: "#8B45FF",
    vi: "Đầu dải tím của biểu tượng (display P3 0.510, 0.286, 0.965)",
    en: "Top of the icon's purple gradient (display P3 0.510, 0.286, 0.965)",
  },
  {
    hex: "#36108B",
    vi: "Cuối dải tím của biểu tượng (display P3 0.192, 0.071, 0.521)",
    en: "Bottom of the icon's purple gradient (display P3 0.192, 0.071, 0.521)",
  },
  { hex: "#702CDB", vi: "Tím enMirror trên trang web: nút, liên kết", en: "enMirror purple on the website: buttons, links" },
  { hex: "#FFC76B", vi: "Vàng hổ phách: nút đang bật trong app", en: "Amber: active controls in the app" },
] as const

function Swatches({ lang }: { lang: Lang }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {colours.map((colour) => (
        <Card key={colour.hex} className="pt-0">
          {/* The swatch is the data here: the colour itself, so it is set inline. */}
          <div className="h-20" style={{ backgroundColor: colour.hex }} />
          <CardHeader>
            <CardTitle className="font-mono">{colour.hex}</CardTitle>
            <CardDescription>{colour[lang]}</CardDescription>
          </CardHeader>
        </Card>
      ))}
    </div>
  )
}

function LogoBlock({ download }: { download: string }) {
  return (
    <Card>
      <CardHeader className="flex flex-wrap items-center gap-6">
        <Logo className="size-24" />
        <a href="/logo.png" download="enmirror-logo.png" className={buttonVariants({ variant: "outline" })}>
          <DownloadIcon data-icon="inline-start" />
          {download}
        </a>
      </CardHeader>
    </Card>
  )
}

const vi: LegalDoc = {
  title: "Thương hiệu",
  description: "Tên, biểu tượng và màu sắc của enMirror. Những điều cần biết khi giới thiệu enMirror.",
  intro: (
    <TypographyP>
      Bạn muốn giới thiệu enMirror? Đây là cách viết tên, dùng biểu tượng và màu sắc. Phần ghi công bên dưới
      liệt kê các tác phẩm enMirror sử dụng.
    </TypographyP>
  ),
  sections: [
    {
      id: "name",
      title: "Tên",
      body: (
        <TypographyP>
          Viết là <strong>enMirror</strong>: một từ, chữ e viết thường, chữ M viết hoa. Không viết "Enmirror",
          "EnMirror", "ENMIRROR" hay "en Mirror". Ở đầu câu vẫn giữ nguyên là enMirror.
        </TypographyP>
      ),
    },
    {
      id: "logo",
      title: "Biểu tượng",
      body: (
        <>
          <TypographyP>
            Biểu tượng enMirror là chiếc gương cầm tay màu oải hương trên nền tím chuyển màu. Hãy giữ nguyên
            tỉ lệ và màu sắc, chừa khoảng trống xung quanh. Không thêm viền, đổ bóng hay hiệu ứng.
          </TypographyP>
          <LogoBlock download="Tải biểu tượng PNG" />
        </>
      ),
    },
    {
      id: "colours",
      title: "Màu sắc",
      body: (
        <>
          <TypographyP>
            Màu tím của biểu tượng chuyển từ trên xuống dưới. Trên trang web, màu tím enMirror chỉ dùng cho
            những chỗ nổi bật như nút và liên kết. Trong app, nút đang bật có màu vàng hổ phách, hợp với ánh
            đèn viền.
          </TypographyP>
          <Swatches lang="vi" />
        </>
      ),
    },
    {
      id: "credits",
      title: "Ghi công",
      body: (
        <>
          <TypographyP>enMirror không dùng mã nguồn, phông chữ hay âm thanh của bên thứ ba. Các tác phẩm được dùng:</TypographyP>
          <TypographyList>
            <li>
              Hình chiếc gương trong biểu tượng là tác phẩm riêng cho enMirror: tạo bằng ChatGPT (OpenAI) cho
              tác giả, rồi hoàn thiện trong Icon Composer.
            </li>
            <li>Biểu tượng trong giao diện app là SF Symbols của Apple.</li>
            <li>
              Phông chữ trên trang này là Geist của Vercel, theo giấy phép{" "}
              <TypographyLink href={ofl} rel="noreferrer">
                SIL Open Font License 1.1
              </TypographyLink>
              .
            </li>
          </TypographyList>
        </>
      ),
    },
  ],
}

const en: LegalDoc = {
  title: "Brand",
  description: "enMirror's name, icon and colours, and credits for the work enMirror builds on.",
  intro: (
    <TypographyP>
      What to know when writing about enMirror or using its imagery: how to write the name, the icon, the
      colours, and credits for the work enMirror builds on.
    </TypographyP>
  ),
  sections: [
    {
      id: "name",
      title: "Name",
      body: (
        <TypographyP>
          Write <strong>enMirror</strong>: one word, lowercase e, capital M. Not "Enmirror", "EnMirror",
          "ENMIRROR" or "en Mirror". Keep it as enMirror at the start of a sentence too.
        </TypographyP>
      ),
    },
    {
      id: "logo",
      title: "Icon",
      body: (
        <>
          <TypographyP>
            The icon is a lavender hand mirror on a purple gradient. Keep its proportions and colours, add no
            outline, shadow or effect, and leave clear space around it.
          </TypographyP>
          <LogoBlock download="Download PNG" />
        </>
      ),
    },
    {
      id: "colours",
      title: "Colours",
      body: (
        <>
          <TypographyP>
            The icon's purple runs from top to bottom. On the website, enMirror purple is kept for prominent
            elements such as buttons and links. In the app, active controls are amber, to match the ring light.
          </TypographyP>
          <Swatches lang="en" />
        </>
      ),
    },
    {
      id: "credits",
      title: "Credits",
      body: (
        <>
          <TypographyP>enMirror ships no third-party code, fonts or sounds. The work it uses:</TypographyP>
          <TypographyList>
            <li>
              The hand mirror in the icon is original artwork for enMirror: generated with ChatGPT (OpenAI) for
              the author, then finished in Icon Composer.
            </li>
            <li>The symbols in the app are Apple's SF Symbols.</li>
            <li>
              This site is set in Geist by Vercel, licensed under the{" "}
              <TypographyLink href={ofl} rel="noreferrer">
                SIL Open Font License 1.1
              </TypographyLink>
              .
            </li>
          </TypographyList>
        </>
      ),
    },
  ],
}

export const brand: Record<Lang, LegalDoc> = { vi, en }
