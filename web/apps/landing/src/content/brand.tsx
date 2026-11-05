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
    vi: "Màu tím ở phía trên biểu tượng (display P3 0.510, 0.286, 0.965)",
    en: "Top of the icon's purple gradient (display P3 0.510, 0.286, 0.965)",
  },
  {
    hex: "#36108B",
    vi: "Màu tím ở phía dưới biểu tượng (display P3 0.192, 0.071, 0.521)",
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
      Bạn muốn giới thiệu enMirror? Dưới đây là tên, biểu tượng và bảng màu để bạn dùng cho đúng.
      Bạn cũng có thể xem phần ghi công ở cuối trang.
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
            Biểu tượng enMirror là chiếc gương cầm tay màu tím nhạt trên nền tím chuyển màu. Hãy giữ nguyên
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
            Nền biểu tượng chuyển từ tím sáng ở trên sang tím đậm ở dưới. Trên web, màu tím enMirror
            dùng để làm nổi bật nút và liên kết. Trong app, nút đang bật có màu vàng hổ phách, hợp với ánh
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
          <TypographyP>App enMirror không dùng mã nguồn, phông chữ hay âm thanh của bên thứ ba. Hình ảnh và biểu tượng được ghi công dưới đây, cùng với phông chữ của trang web:</TypographyP>
          <TypographyList>
            <li>
              Hình chiếc gương được tạo riêng cho enMirror bằng ChatGPT (OpenAI),
              sau đó được tác giả hoàn thiện trong Icon Composer.
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
      Writing about enMirror? Here’s how to use the name, icon and colours.
      You’ll also find artwork and font credits below.
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
            The icon fades from light purple at the top to deep purple at the bottom. On the website, enMirror purple highlights
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
          <TypographyP>The enMirror app ships no third-party code, fonts or sounds. Artwork and symbol credits are listed below, along with the website font:</TypographyP>
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
