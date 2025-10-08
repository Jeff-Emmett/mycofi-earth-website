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
    icon: "/mycofi-logo.jpg",
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
