import { Navbar } from '@/components/layout/Navbar'
import Link from 'next/link'
import { ArrowRight, AlertTriangle, XCircle, Lightbulb, Zap, BarChart2, Globe, TrendingUp } from 'lucide-react'

export default function AboutPage() {
  return (
    <>
      <Navbar />
      <main className="pt-16">

        {/* 1. Hero — Purpose + Impact */}
        <section className="max-w-6xl mx-auto px-4 sm:px-6 py-20 md:py-28">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-gold-50 border border-gold-200 text-gold-700 text-xs font-medium px-3 py-1.5 rounded-full mb-6">
              Tentang ESALOKA
            </div>
            <h1 className="text-4xl md:text-5xl font-semibold text-stone-900 leading-tight mb-6 tracking-tight">
              Kami mengubah cara<br />
              <span className="text-gold-500">limbah dikelola.</span>
            </h1>
            <p className="text-lg text-stone-500 leading-relaxed max-w-2xl">
              ESALOKA lahir dari keyakinan bahwa limbah organik bukan akhir dari sebuah siklus —
              melainkan awal dari siklus baru yang lebih produktif dan bertanggung jawab.
              Kami membangun jembatan antara industri, alam, dan teknologi.
            </p>
          </div>
        </section>

        {/* 2. The Problem */}
        <section className="bg-stone-900 text-white">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 py-16">
            <div className="flex items-center gap-2 mb-3">
              <AlertTriangle size={16} className="text-gold-400" />
              <span className="text-xs font-semibold text-gold-400 uppercase tracking-widest">The Problem</span>
            </div>
            <h2 className="text-3xl font-semibold mb-6">Urgensi & skala masalah</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { stat: '~60%', label: 'Komposisi sampah perkotaan Indonesia adalah organik', desc: 'Mayoritas berakhir di TPA tanpa pengolahan berarti.' },
                { stat: '185 juta ton', label: 'Food waste dihasilkan Indonesia per tahun', desc: 'Setara kerugian ekonomi ratusan triliun rupiah setiap tahunnya.' },
                { stat: '70%', label: 'Emisi metana TPA berasal dari sampah organik', desc: 'Berkontribusi besar pada krisis iklim yang kita hadapi bersama.' },
              ].map((item, i) => (
                <div key={i} className="border border-stone-700 rounded-2xl p-6">
                  <p className="text-3xl font-bold text-gold-400 mb-2">{item.stat}</p>
                  <p className="text-sm font-medium text-stone-200 mb-2">{item.label}</p>
                  <p className="text-sm text-stone-400 leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 3. Why Current System Fails */}
        <section className="max-w-6xl mx-auto px-4 sm:px-6 py-16">
          <div className="flex items-center gap-2 mb-3">
            <XCircle size={16} className="text-red-400" />
            <span className="text-xs font-semibold text-red-400 uppercase tracking-widest">Why Current System Fails</span>
          </div>
          <h2 className="text-2xl font-semibold text-stone-800 mb-8">Mengapa sistem saat ini tidak cukup</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { title: 'Tidak ada akuntabilitas data', desc: 'Pengelolaan limbah sering tidak tercatat dan tidak terverifikasi, membuat klaim ESG sulit dibuktikan.' },
              { title: 'Tidak ada nilai ekonomi balik', desc: 'Bisnis membayar untuk membuang limbah tanpa mendapat manfaat nyata — zero return on waste.' },
              { title: 'Silo antar pemangku kepentingan', desc: 'Produsen limbah, pengelola, dan regulator tidak terhubung dalam satu ekosistem data.' },
              { title: 'Laporan ESG manual & tidak scalable', desc: 'Proses pelaporan ke DLH masih manual, rentan kesalahan, dan memakan waktu berharga.' },
            ].map((item, i) => (
              <div key={i} className="card border-l-4 border-l-red-200 rounded-l-none">
                <h3 className="font-semibold text-stone-800 mb-2">{item.title}</h3>
                <p className="text-sm text-stone-500 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* 4. Our Solution */}
        <section className="bg-gold-50 border-y border-gold-100">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 py-16">
            <div className="flex items-center gap-2 mb-3">
              <Lightbulb size={16} className="text-gold-500" />
              <span className="text-xs font-semibold text-gold-600 uppercase tracking-widest">Our Solution</span>
            </div>
            <h2 className="text-2xl font-semibold text-stone-800 mb-4">The ESALOKA Model</h2>
            <p className="text-stone-500 max-w-2xl mb-10">
              ESALOKA membangun circular economy platform yang menghubungkan mitra HoReCa,
              proses biokonversi, dan pelaporan regulasi dalam satu ekosistem terintegrasi.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {[
                { icon: '🏨', title: 'Mitra HoReCa', desc: 'Hotel, restoran, dan catering menjadi penyedia bahan baku organik — bukan lagi penghasil limbah.' },
                { icon: '🐛', title: 'Biokonversi BSF', desc: 'Limbah diubah menjadi maggot protein tinggi dan kasgot pupuk organik melalui proses alami.' },
                { icon: '📊', title: 'Platform Data', desc: 'Semua tercatat, terverifikasi, dan tersedia real-time untuk mitra, admin, dan DLH.' },
              ].map((item, i) => (
                <div key={i} className="bg-white rounded-2xl border border-gold-200 p-6">
                  <span className="text-3xl mb-4 block">{item.icon}</span>
                  <h3 className="font-semibold text-stone-800 mb-2">{item.title}</h3>
                  <p className="text-sm text-stone-500 leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 5. How It Works */}
        <section className="max-w-6xl mx-auto px-4 sm:px-6 py-16">
          <div className="flex items-center gap-2 mb-3">
            <Zap size={16} className="text-gold-400" />
            <span className="text-xs font-semibold text-gold-600 uppercase tracking-widest">How It Works</span>
          </div>
          <h2 className="text-2xl font-semibold text-stone-800 mb-8">Alur sederhana, dampak nyata</h2>
          <div className="flex flex-col gap-0">
            {[
              { step: '01', title: 'Mitra menyetor limbah organik', desc: 'Pengumpulan terjadwal atau mandiri ke titik dropoff. Setiap pickup dicatat otomatis di sistem.' },
              { step: '02', title: 'Proses biokonversi', desc: 'Limbah diproses oleh larva BSF menjadi maggot (protein) dan kasgot (pupuk organik).' },
              { step: '03', title: 'Data masuk ke dashboard', desc: 'Mitra melihat kontribusi real-time: volume limbah, hasil konversi, dan dampak ESG.' },
              { step: '04', title: 'Produk didistribusikan', desc: 'Maggot dan kasgot dijual ke peternak dan petani — menutup siklus ekonomi secara penuh.' },
            ].map((item, i, arr) => (
              <div key={i} className="flex gap-5">
                <div className="flex flex-col items-center">
                  <div className="w-10 h-10 rounded-full bg-gold-400 flex items-center justify-center shrink-0">
                    <span className="text-white font-mono text-xs font-bold">{item.step}</span>
                  </div>
                  {i < arr.length - 1 && <div className="w-0.5 h-12 bg-gold-200 mt-1" />}
                </div>
                <div className="pb-8">
                  <h3 className="font-semibold text-stone-800 mb-1">{item.title}</h3>
                  <p className="text-sm text-stone-500 leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 6. Impact & ESG */}
        <section className="bg-sage-50 border-y border-sage-100">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 py-16">
            <div className="flex items-center gap-2 mb-3">
              <BarChart2 size={16} className="text-sage-600" />
              <span className="text-xs font-semibold text-sage-600 uppercase tracking-widest">Impact & ESG</span>
            </div>
            <h2 className="text-2xl font-semibold text-stone-800 mb-4">Terukur, terverifikasi, siap lapor</h2>
            <p className="text-stone-500 max-w-2xl mb-8">
              ESALOKA adalah satu-satunya platform di kelasnya yang memberikan bukti dampak
              real-time — siap untuk pelaporan ESG dan kewajiban Dinas Lingkungan Hidup.
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: 'CO₂ equivalent dihindari', icon: '🌍' },
                { label: 'Limbah dialihkan dari TPA', icon: '🗑️' },
                { label: 'Protein hewani dihasilkan', icon: '🐛' },
                { label: 'Laporan DLH siap submit', icon: '📋' },
              ].map((item, i) => (
                <div key={i} className="bg-white rounded-2xl border border-sage-200 p-5 text-center">
                  <span className="text-3xl mb-3 block">{item.icon}</span>
                  <p className="text-xs text-stone-500 leading-relaxed">{item.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 7. Vision & Scalability */}
        <section className="max-w-6xl mx-auto px-4 sm:px-6 py-16">
          <div className="flex items-center gap-2 mb-3">
            <TrendingUp size={16} className="text-gold-400" />
            <span className="text-xs font-semibold text-gold-600 uppercase tracking-widest">Vision & Scalability</span>
          </div>
          <h2 className="text-2xl font-semibold text-stone-800 mb-4">Visi jangka panjang</h2>
          <p className="text-stone-500 max-w-2xl mb-10">
            ESALOKA dibangun untuk tumbuh — dari satu kota, menjadi model circular economy
            yang bisa direplikasi di seluruh Indonesia.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {[
              { phase: 'Fase 1 (Sekarang)', title: 'Kota Parepare', desc: 'Membangun ekosistem mitra HoReCa, operasional biokonversi, dan platform data terintegrasi.' },
              { phase: 'Fase 2', title: 'Sulawesi Selatan', desc: 'Ekspansi ke kota-kota tetangga, payment gateway, dan notifikasi otomatis.' },
              { phase: 'Fase 3', title: 'Nasional', desc: 'IoT tracking, carbon credit, ESG reporting otomatis, dan marketplace produk ternak.' },
            ].map((item, i) => (
              <div key={i} className="card">
                <span className="text-xs font-medium text-stone-400 uppercase tracking-wide">{item.phase}</span>
                <h3 className="font-semibold text-stone-800 mt-2 mb-2">{item.title}</h3>
                <p className="text-sm text-stone-500 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* 8. CTA */}
        <section className="bg-gold-400">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 py-16 text-center">
            <Globe size={36} className="text-gold-200 mx-auto mb-4" />
            <h2 className="text-2xl md:text-3xl font-semibold text-white mb-3">
              Bergabunglah dalam gerakan ini
            </h2>
            <p className="text-gold-100 mb-8 max-w-lg mx-auto">
              Setiap kilogram limbah yang kamu serahkan adalah kontribusi nyata
              untuk ekosistem yang lebih sehat.
            </p>
            <div className="flex flex-wrap gap-3 justify-center">
              <Link
                href="/get-in-touch#daftar"
                className="bg-white text-gold-700 font-medium px-6 py-2.5 rounded-xl text-sm hover:bg-gold-50 transition-colors flex items-center gap-2"
              >
                Daftar sebagai mitra <ArrowRight size={14} />
              </Link>
              <Link
                href="/product"
                className="border border-gold-300 text-white font-medium px-6 py-2.5 rounded-xl text-sm hover:bg-gold-500 transition-colors"
              >
                Lihat produk kami
              </Link>
            </div>
          </div>
        </section>

      </main>
    </>
  )
}
