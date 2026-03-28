'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { Menu, X } from 'lucide-react'
import { cn } from '@/lib/utils'

const navLinks = [
  { href: '/',             label: 'Home' },
  { href: '/about',        label: 'About' },
  { href: '/product',      label: 'Product' },
  { href: '/blog',         label: 'Blog' },
  { href: '/get-in-touch', label: 'Get in Touch' },
]

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const pathname = usePathname()

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-cream/90 backdrop-blur-md border-b border-stone-100">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 shrink-0">
            <div className="w-8 h-8 rounded-lg bg-gold-400 flex items-center justify-center">
              <span className="text-white font-bold text-sm">E</span>
            </div>
            <span className="font-semibold text-stone-800 tracking-tight">ESALOKA</span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map(link => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'px-3 py-2 rounded-lg text-sm transition-colors',
                  link.href === '/get-in-touch'
                    ? 'ml-2 bg-gold-400 text-white hover:bg-gold-500 font-medium px-4'
                    : pathname === link.href
                      ? 'text-stone-900 font-medium bg-stone-100'
                      : 'text-stone-500 hover:text-stone-800 hover:bg-stone-50'
                )}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-stone-100 transition-colors"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Buka menu"
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>

        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-stone-100 bg-cream">
          <div className="px-4 py-3 flex flex-col gap-1">
            {navLinks.map(link => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'py-2.5 px-3 rounded-lg text-sm',
                  link.href === '/get-in-touch'
                    ? 'bg-gold-400 text-white font-medium text-center mt-1'
                    : 'text-stone-600 hover:bg-stone-100'
                )}
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  )
}
