import type { Metadata } from "next"
import { Quicksand } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { Toaster } from "@/components/ui/sonner"
import { AuthProvider } from "@/lib/auth-context"
import { GlassLoader } from "@/components/ui/glass-loader"
import { MobileNav } from "@/components/layout/mobile-nav"
import "./globals.css"

const quicksand = Quicksand({ 
  subsets: ["latin"], 
  variable: "--font-quicksand",
  weight: ["300", "400", "500", "600", "700"]
})

export const metadata: Metadata = {
  title: 'TableTap · Smart Restaurant OS',
  description: 'TableTap: Scan · Pay · Done. Modern restaurant management system for owners, managers, waiters, and kitchen staff',
  icons: {
    icon: [
      { url: '/favicon-icon.png', type: 'image/png' },
      { url: '/favicon.ico', sizes: 'any' },
    ],
    shortcut: '/favicon-icon.png',
    apple: '/apple-icon.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={quicksand.variable} suppressHydrationWarning>
      <body className="font-sans antialiased" suppressHydrationWarning>
        <AuthProvider>
          {children}
          <MobileNav />
          <Toaster position="top-right" />
        </AuthProvider>
        <Analytics />
      </body>
    </html>
  )
}

