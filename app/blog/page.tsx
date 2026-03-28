import { Navbar } from '@/components/layout/Navbar'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

const categories = [
  'Circular Economy', 'Waste Management', 'Maggot BSF', 'ESG & Sustainability', 'Case Study Mitra',
]

const placeholderPosts = [
  { title: 'Apa itu Black Soldier Fly dan Mengapa Penting?', category: 'Maggot BSF', date: 'Mar 2025', desc: 'Mengenal larva BSF sebagai solusi biokonversi limbah organik yang efisien dan berkelanjutan.' },
  { title: 'Circular Economy: Dari Konsep ke Aksi Nyata HoReCa', category: 'Circular Economy', date: 'Feb 2025', desc: 'Bagaimana industri hotel dan restoran bisa jadi pemain kunci dalam ekonomi sirkular.' },
  { title: 'Mengenal Kasgot: Pupuk Organik dari Limbah Dapur', category: 'Waste Management', date: 'Feb 2025', desc: 'Frass larva BSF — pupuk organik kaya N-P-K yang mengubah limbah menjadi solusi pertanian.' },
  { title: 'Laporan ESG: Panduan Praktis untuk Bisnis HoReCa', category: 'ESG & Sustainability', date: 'Jan 2025', desc: 'Memahami kewajiban pelaporan DLH dan cara ESALOKA membantu memenuhinya.' },
  { title: 'Case Study: Hotel Bintang 4 Kurangi Biaya Limbah 40%', category: 'Case Study Mitra', date: 'Jan 2025', desc: 'Studi kasus nyata bagaimana mitra ESALOKA menghemat biaya sekaligus berkontribusi lingkungan.' },
  { title: 'Protein dari Limbah: Revolusi Pakan Ternak Lokal', category: 'Maggot BSF', date: 'Des 2024', desc: 'Maggot BSF sebagai alternatif tepung ikan impor — peluang bagi peternak lokal Indonesia.' },
]

export default function BlogPage() {
  return (
    <>
      <Navbar />
      <main className="pt-16">

        {/* Hero */}
        <section className="max-w-6xl mx-auto px-4 sm:px-6 py-16">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 bg-sage-50 border border-sage-200 text-sage-700 text-xs font-medium px-3 py-1.5 rounded-full mb-5">
              Wawasan & Cerita
            </div>
            <h1 className="text-4xl font-semibold text-stone-900 mb-4 tracking-tight">
              Belajar bersama<br />
              <span className="text-gold-500">dari dampak nyata</span>
            </h1>
            <p className="text-stone-500 text-lg leading-relaxed">
              Edukasi, laporan kegiatan, dan cerita di balik perjalanan
              membangun circular economy bersama mitra ESALOKA.
            </p>
          </div>
        </section>

        {/* Featured */}
        <section className="max-w-6xl mx-auto px-4 sm:px-6 pb-16">
          <div className="bg-gradient-to-br from-gold-50 to-sage-50 border border-gold-200 rounded-2xl p-8 md:p-10 mb-12">
            <span className="badge badge-gold text-xs mb-4">Featured</span>
            <h2 className="text-2xl font-semibold text-stone-800 mb-3 max-w-lg">
              ESALOKA: Membangun Platform Circular Economy di Parepare
            </h2>
            <p className="text-stone-500 mb-5 max-w-2xl">
              Sebuah perjalanan membangun jembatan antara limbah organik industri HoReCa,
              teknologi biokonversi BSF, dan platform data yang transparan. Dari visi ke aksi nyata.
            </p>
            <div className="flex items-center gap-4">
              <span className="text-xs text-stone-400">Mar 2025 · Circular Economy</span>
              <button className="text-sm text-gold-600 font-medium flex items-center gap-1 hover:gap-2 transition-all">
                Baca selengkapnya <ArrowRight size={14} />
              </button>
            </div>
          </div>

          {/* Categories */}
          <div className="flex flex-wrap gap-2 mb-8">
            <button className="px-3 py-1.5 rounded-full text-xs font-medium bg-gold-400 text-white">Semua</button>
            {categories.map(c => (
              <button key={c} className="px-3 py-1.5 rounded-full text-xs font-medium border border-stone-200 text-stone-500 hover:border-stone-300 hover:text-stone-700 transition-colors">
                {c}
              </button>
            ))}
          </div>

          {/* Article grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-12">
            {placeholderPosts.map((post, i) => (
              <div key={i} className="card hover:border-stone-200 transition-colors cursor-pointer group">
                <div className="h-32 bg-gradient-to-br from-stone-100 to-stone-50 rounded-xl mb-4 flex items-center justify-center">
                  <span className="text-3xl opacity-30">📄</span>
                </div>
                <span className="badge badge-gray text-[10px] mb-3">{post.category}</span>
                <h3 className="font-semibold text-stone-800 text-sm mb-2 group-hover:text-gold-600 transition-colors leading-snug">
                  {post.title}
                </h3>
                <p className="text-xs text-stone-400 leading-relaxed mb-3">{post.desc}</p>
                <p className="text-xs text-stone-300">{post.date}</p>
              </div>
            ))}
          </div>

          {/* Coming soon note */}
          <div className="text-center py-8 border border-dashed border-stone-200 rounded-2xl">
            <p className="text-sm text-stone-400 mb-2">Blog ini akan terus diperbarui</p>
            <p className="text-xs text-stone-300">
              Artikel lengkap akan dipublikasikan segera. Pantau terus perkembangan ESALOKA.
            </p>
          </div>
        </section>

        {/* CTA */}
        <section className="border-t border-stone-100 bg-white">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 flex flex-col md:flex-row items-center justify-between gap-4">
            <div>
              <p className="font-semibold text-stone-800 mb-1">Ingin berkontribusi cerita?</p>
              <p className="text-sm text-stone-400">Jadilah mitra ESALOKA dan biarkan dampakmu berbicara.</p>
            </div>
            <Link href="/get-in-touch" className="btn-primary flex items-center gap-2 shrink-0">
              Bergabung sekarang <ArrowRight size={14} />
            </Link>
          </div>
        </section>

      </main>
    </>
  )
}
