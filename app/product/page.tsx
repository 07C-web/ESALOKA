import { createClient } from '@/lib/supabase/server'
import { Navbar } from '@/components/layout/Navbar'
import { ProductCard } from '@/components/ui/ProductCard'
import { ArrowRight } from 'lucide-react'
import Link from 'next/link'

export const revalidate = 300

async function getProducts() {
  const supabase = await createClient()
  const { data } = await supabase
    .from('products')
    .select('*')
    .eq('is_active', true)
    .order('sort_order')
  return data || []
}

export default async function ProductPage() {
  const products = await getProducts()
  const proteinSeries = products.filter(p => p.category === 'protein_series')
  const soilSeries    = products.filter(p => p.category === 'soil_series')

  return (
    <>
      <Navbar />
      <main className="pt-16">

        {/* Hero */}
        <section className="max-w-6xl mx-auto px-4 sm:px-6 py-16">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 bg-gold-50 border border-gold-200 text-gold-700 text-xs font-medium px-3 py-1.5 rounded-full mb-5">
              <span className="w-1.5 h-1.5 rounded-full bg-gold-400"></span>
              Produk hasil biokonversi
            </div>
            <h1 className="text-4xl font-semibold text-stone-900 mb-4 tracking-tight leading-tight">
              Dari limbah organik<br />
              <span className="text-gold-500">menjadi produk bernilai</span>
            </h1>
            <p className="text-stone-500 text-lg leading-relaxed mb-6">
              Setiap produk ESALOKA adalah hasil transformasi nyata — limbah organik HoReCa diubah
              menjadi protein hewani dan nutrisi tanah berkualitas tinggi.
            </p>
            <p className="text-sm text-stone-400">
              Semua produk tersedia dalam satuan 1 kg/pack · Harga Rp 20.000/kg
            </p>
          </div>
        </section>

        {/* Protein Series */}
        <section className="bg-white border-y border-stone-100">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 py-16">
            <div className="flex items-start justify-between mb-10 flex-wrap gap-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-2xl">🐛</span>
                  <span className="text-xs font-semibold text-gold-600 uppercase tracking-widest">Protein Series</span>
                </div>
                <h2 className="text-2xl font-semibold text-stone-800 mb-2">Produk berbasis Maggot BSF</h2>
                <p className="text-stone-500 max-w-lg">
                  Larva Black Soldier Fly kaya protein tinggi — solusi pakan alami
                  untuk unggas, ikan, dan ternak. Diproduksi dari proses biokonversi terverifikasi.
                </p>
              </div>
              <div className="bg-gold-50 border border-gold-200 rounded-2xl px-5 py-4 text-right shrink-0">
                <p className="text-xs text-stone-400 mb-1">Kandungan protein</p>
                <p className="text-2xl font-bold text-gold-600">40–55%</p>
                <p className="text-xs text-stone-400">per berat kering</p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {proteinSeries.map(p => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        </section>

        {/* Soil Series */}
        <section className="max-w-6xl mx-auto px-4 sm:px-6 py-16">
          <div className="flex items-start justify-between mb-10 flex-wrap gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-2xl">🌱</span>
                <span className="text-xs font-semibold text-sage-600 uppercase tracking-widest">Soil Series</span>
              </div>
              <h2 className="text-2xl font-semibold text-stone-800 mb-2">Produk berbasis Kasgot & Kompos</h2>
              <p className="text-stone-500 max-w-lg">
                Pupuk dan soil amendment organik dari frass larva BSF —
                kaya unsur hara N-P-K untuk memperbaiki kesuburan tanah secara alami.
              </p>
            </div>
            <div className="bg-sage-50 border border-sage-200 rounded-2xl px-5 py-4 text-right shrink-0">
              <p className="text-xs text-stone-400 mb-1">Unsur hara</p>
              <p className="text-2xl font-bold text-sage-600">N-P-K</p>
              <p className="text-xs text-stone-400">organik terverifikasi</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {soilSeries.map(p => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>

        {/* Bulk & Partnership CTA */}
        <section className="bg-stone-50 border-y border-stone-100">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 py-14">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div>
                <h3 className="text-xl font-semibold text-stone-800 mb-2">Butuh dalam jumlah besar?</h3>
                <p className="text-stone-500 text-sm max-w-md">
                  Tersedia pembelian bulk untuk peternak, distributor, dan pelaku pertanian.
                  Hubungi kami untuk harga khusus dan pengiriman terjadwal.
                </p>
              </div>
              <div className="flex gap-3 shrink-0">
                <Link href="/get-in-touch" className="btn-primary flex items-center gap-2">
                  Hubungi kami <ArrowRight size={16} />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Footer simple */}
        <footer className="border-t border-stone-100 bg-white">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-3">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-md bg-gold-400 flex items-center justify-center">
                  <span className="text-white font-bold text-xs">E</span>
                </div>
                <span className="font-semibold text-stone-800 text-sm">ESALOKA</span>
              </div>
              <p className="text-xs text-stone-400">© 2025 ESALOKA. Pengelolaan limbah organik yang bertanggung jawab.</p>
            </div>
          </div>
        </footer>

      </main>
    </>
  )
}
