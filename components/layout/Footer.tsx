import Link from 'next/link'

export function Footer() {
  return (
    <footer className="border-t border-stone-100 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-10">

          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-gold-400 flex items-center justify-center">
                <span className="text-white font-bold text-sm">E</span>
              </div>
              <span className="font-semibold text-stone-800 tracking-tight">ESALOKA</span>
            </div>
            <p className="text-xs text-stone-400 leading-relaxed max-w-xs">
              Platform circular economy — menghubungkan limbah organik HoReCa
              dengan biokonversi BSF dan pelaporan ESG terverifikasi.
            </p>
          </div>

          {/* Platform */}
          <div>
            <p className="text-xs font-semibold text-stone-700 uppercase tracking-widest mb-4">Platform</p>
            <div className="flex flex-col gap-2.5">
              {[
                { href: '/',             label: 'Beranda' },
                { href: '/about',        label: 'Tentang kami' },
                { href: '/product',      label: 'Produk' },
                { href: '/blog',         label: 'Blog' },
                { href: '/get-in-touch', label: 'Hubungi kami' },
              ].map(link => (
                <Link key={link.href} href={link.href}
                  className="text-sm text-stone-400 hover:text-stone-700 transition-colors">
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Produk */}
          <div>
            <p className="text-xs font-semibold text-stone-700 uppercase tracking-widest mb-4">Produk</p>
            <div className="flex flex-col gap-2.5">
              {[
                'Maggot Basah', 'Maggot Kering', 'Tepung Maggot',
                'Kasgot Basah', 'Kasgot Kering', 'Kompos Premium',
              ].map(p => (
                <Link key={p} href="/product"
                  className="text-sm text-stone-400 hover:text-stone-700 transition-colors">
                  {p}
                </Link>
              ))}
            </div>
          </div>

          {/* Kontak */}
          <div>
            <p className="text-xs font-semibold text-stone-700 uppercase tracking-widest mb-4">Kontak</p>
            <div className="flex flex-col gap-2.5">
              <a href="https://wa.me/6281234567890" target="_blank" rel="noopener noreferrer"
                className="text-sm text-stone-400 hover:text-stone-700 transition-colors">
                WhatsApp
              </a>
              <a href="mailto:hello@esaloka.com"
                className="text-sm text-stone-400 hover:text-stone-700 transition-colors">
                hello@esaloka.com
              </a>
              <p className="text-sm text-stone-400">Parepare, Sulawesi Selatan</p>
              <Link href="/login"
                className="text-sm text-gold-500 hover:text-gold-600 font-medium transition-colors mt-1">
                Login Dashboard →
              </Link>
            </div>
          </div>
        </div>

        <div className="border-t border-stone-100 pt-6 flex flex-col sm:flex-row justify-between items-center gap-3">
          <p className="text-xs text-stone-400">© 2025 ESALOKA. All rights reserved.</p>
          <p className="text-xs text-stone-300">Circular economy platform · Parepare, Indonesia</p>
        </div>
      </div>
    </footer>
  )
}
