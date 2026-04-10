import type { Metadata } from "next"
import { Nunito, PT_Sans } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { Toaster } from "@/components/ui/sonner"
import { AuthProvider } from "@/lib/auth-context"
import { GlassLoader } from "@/components/ui/glass-loader"
import "./globals.css"

const nunito = Nunito({ 
  subsets: ["latin"], 
  variable: "--font-heading",
  weight: ["200", "300", "400", "500", "600", "700", "800", "900"]
})

const ptSans = PT_Sans({ 
  subsets: ["latin"], 
  variable: "--font-sans",
  weight: ["400", "700"]
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
    <html lang="en" className={`${nunito.variable} ${ptSans.variable}`} suppressHydrationWarning>
      <body className="font-sans antialiased" suppressHydrationWarning>
        {/* Forces the 7-second auto-hiding loader on initial app load */}
        <GlassLoader autoHideDuration={7000} />
        
        <AuthProvider>
          {children}
          <Toaster position="top-right" />
        </AuthProvider>
        <Analytics />
      </body>
    </html>
  )
}

