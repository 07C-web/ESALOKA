'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Menu, X } from 'lucide-react'

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-cream/90 backdrop-blur-md border-b border-stone-100">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gold-400 flex items-center justify-center">
              <span className="text-white font-bold text-sm">E</span>
            </div>
            <span className="font-semibold text-stone-800 tracking-tight">ESALOKA</span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-6">
            <Link href="/#cara-kerja" className="text-sm text-stone-500 hover:text-stone-800 transition-colors">
              Cara kerja
            </Link>
            <Link href="/#paket" className="text-sm text-stone-500 hover:text-stone-800 transition-colors">
              Paket kemitraan
            </Link>
            <Link href="/#dampak" className="text-sm text-stone-500 hover:text-stone-800 transition-colors">
              Dampak
            </Link>
            <Link href="/get-in-touch" className="text-sm text-stone-500 hover:text-stone-800 transition-colors">
              Hubungi kami
            </Link>
          </div>

          {/* CTA */}
          <div className="hidden md:flex items-center gap-3">
            <Link href="/login" className="text-sm text-stone-600 hover:text-stone-800 font-medium transition-colors">
              Masuk
            </Link>
            <Link href="/get-in-touch#daftar" className="btn-primary text-sm py-2 px-4">
              Daftar mitra
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-stone-100 transition-colors"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden border-t border-stone-100 bg-cream">
          <div className="px-4 py-3 flex flex-col gap-1">
            <Link href="/#cara-kerja" className="py-2.5 text-sm text-stone-600" onClick={() => setIsOpen(false)}>Cara kerja</Link>
            <Link href="/#paket" className="py-2.5 text-sm text-stone-600" onClick={() => setIsOpen(false)}>Paket kemitraan</Link>
            <Link href="/#dampak" className="py-2.5 text-sm text-stone-600" onClick={() => setIsOpen(false)}>Dampak</Link>
            <Link href="/get-in-touch" className="py-2.5 text-sm text-stone-600" onClick={() => setIsOpen(false)}>Hubungi kami</Link>
            <div className="pt-2 border-t border-stone-100 flex gap-2">
              <Link href="/login" className="btn-secondary flex-1 text-center text-sm py-2">Masuk</Link>
              <Link href="/get-in-touch#daftar" className="btn-primary flex-1 text-center text-sm py-2">Daftar</Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}
