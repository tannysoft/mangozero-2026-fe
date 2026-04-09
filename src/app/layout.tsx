import type { Metadata, Viewport } from "next";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.mangozero.com"),
  title: {
    default:
      "Mango Zero — สำนักข่าวไลฟ์สไตล์ บันเทิง ไอดอล Thai POP K-POP J-POP สำหรับ Gen Y/Z",
    template: "%s | Mango Zero",
  },
  description:
    "เว็บข่าวไลฟ์สไตล์ บันเทิง ไอดอล ดนตรี ศิลปิน Thai POP K-POP J-POP ซีรีส์ หนัง โซเชียล เทรนด์กระแส สนุกสนานจัดเต็มสำหรับ Gen Y / Gen Z",
  openGraph: {
    siteName: "Mango Zero",
    type: "website",
    locale: "th_TH",
  },
  icons: {
    icon: "/favicon.ico",
  },
};

export const viewport: Viewport = {
  themeColor: "#eba121",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="th">
      <head>
        <link rel="stylesheet" href="https://use.typekit.net/dvb1ujv.css" />
      </head>
      <body className="min-h-screen antialiased">
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
