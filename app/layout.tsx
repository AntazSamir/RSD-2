import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import Providers from "./providers"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "DineFlow - Restaurant Management",
  description: "Professional restaurant management dashboard",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`font-sans ${inter.className}`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}