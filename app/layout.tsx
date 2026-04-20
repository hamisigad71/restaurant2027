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
  title: 'Smart Restaurant OS',
  description: 'Modern restaurant management system for owners, managers, waiters, and kitchen staff',
  generator: 'v0.app',
  icons: {
    icon: '/icon.svg',
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
        {/* Forces the 7-second auto-hiding loader on initial app load */}
        <GlassLoader autoHideDuration={7000} />
        
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

