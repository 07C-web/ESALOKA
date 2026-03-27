import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'ESALOKA — Platform Pengelolaan Limbah Organik',
  description:
    'Platform pengelolaan limbah organik berbasis data — transparan, terverifikasi, dan siap lapor DLH. Bersama ESALOKA, limbahmu jadi protein dan nutrisi tanah.',
  keywords: ['limbah organik', 'maggot', 'kasgot', 'ESG', 'HoReCa', 'DLH', 'pengelolaan sampah'],
  authors: [{ name: 'ESALOKA' }],
  openGraph: {
    title: 'ESALOKA',
    description: 'Platform pengelolaan limbah organik berbasis data',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="id">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {children}
      </body>
    </html>
  )
}
