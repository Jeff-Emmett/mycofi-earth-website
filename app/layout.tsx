import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { Crimson_Text } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { Suspense } from "react"
import "./globals.css"

const crimsonText = Crimson_Text({
  weight: ["400", "600", "700"],
  subsets: ["latin"],
  variable: "--font-crimson",
})

export const metadata: Metadata = {
  title: "MycoFi - Mycoeconomics & Permaculture Currencies",
  description:
    "Exploring regenerative economic systems inspired by mycelial networks and nature's resource allocation algorithms",
  generator: "v0.app",
  icons: {
    icon: "data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🍄</text></svg>",
  },
  metadataBase: new URL("https://mycofi.earth"),
  openGraph: {
    title: "MycoFi - Mycoeconomics & Permaculture Currencies",
    description: "Exploring regenerative economic systems inspired by mycelial networks and nature's resource allocation algorithms",
    url: "https://mycofi.earth",
    siteName: "MycoFi",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "MycoFi - Regenerative Economics",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "MycoFi - Mycoeconomics & Permaculture Currencies",
    description: "Exploring regenerative economic systems inspired by mycelial networks and nature's resource allocation algorithms",
    images: ["/og-image.jpg"],
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans ${GeistSans.variable} ${crimsonText.variable}`}>
        <Suspense fallback={<div>Loading...</div>}>{children}</Suspense>
        <Analytics />
      </body>
    </html>
  )
}
