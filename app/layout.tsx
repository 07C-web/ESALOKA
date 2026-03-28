import type { Metadata } from "next";
import { Plus_Jakarta_Sans, DM_Mono } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/lib/cart-context";

const plusJakarta = Plus_Jakarta_Sans({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const dmMono = DM_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  title: "ESALOKA — Platform Pengelolaan Limbah Organik",
  description:
    "Platform pengelolaan limbah organik berbasis data — transparan, terverifikasi, dan siap lapor DLH.",
  keywords: ["limbah organik", "maggot", "kasgot", "ESG", "HoReCa", "DLH"],
  authors: [{ name: "ESALOKA" }],
  openGraph: {
    title: "ESALOKA",
    description: "Platform pengelolaan limbah organik berbasis data",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="id">
      <body
        className={`${plusJakarta.variable} ${dmMono.variable} antialiased`}
      >
        <CartProvider>{children}</CartProvider>
      </body>
    </html>
  );
}
