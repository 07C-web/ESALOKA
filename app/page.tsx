import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { Navbar } from '@/components/layout/Navbar'
import { formatWeight } from '@/lib/utils'
import {
  ArrowRight, Truck, BarChart2, FileCheck,
  Bug, FlaskConical, Sprout, Check, ChevronRight,
} from 'lucide-react'

export const revalidate = 60 // revalidate every 60s

async function getGlobalStats() {
  try {
    const supabase = await createClient()
    const { data } = await supabase.from('global_stats').select('*').single()
    return data
  } catch {
    return null
  }
}

const steps = [
  {
    icon: Truck,
    number: '01',
    title: 'Pengumpulan limbah',
    desc: 'Mitra HoReCa menyediakan limbah organik tanpa kontaminasi. Berat tercatat otomatis di sistem digital.',
    color: 'text-gold-400',
    bg: 'bg-gold-50',
  },
  {
    icon: BarChart2,
    number: '02',
    title: 'Tracking real-time',
    desc: 'Dashboard web memberi akses kepada mitra untuk memonitor volume sampah yang telah dikelola.',
    color: 'text-sage-500',
    bg: 'bg-sage-50',
  },
  {
    icon: FileCheck,
    number: '03',
    title: 'Pelaporan DLH',
    desc: 'Data pengelolaan terintegrasi untuk memenuhi kewajiban pelaporan kepada Dinas Lingkungan Hidup.',
    color: 'text-blue-400',
    bg: 'bg-blue-50',
  },
  {
    icon: Bug,
    number: '04',
    title: 'Biokonversi',
    desc: 'Limbah diubah menjadi protein (maggot) dan nutrisi tanah (kasgot) melalui proses alami.',
    color: 'text-green-500',
    bg: 'bg-green-50',
  },
  {
    icon: FlaskConical,
    number: '05',
    title: 'Riset & edukasi',
    desc: 'Data komparatif pakan konvensional vs pakan berbasis maggot untuk penelitian unggas.',
    color: 'text-purple-400',
    bg: 'bg-purple-50',
    soon: true,
  },
  {
    icon: Sprout,
    number: '06',
    title: 'Regenerasi lahan',
    desc: 'Efektivitas kompos kasgot dalam meningkatkan produktivitas pertanian urban.',
    color: 'text-emerald-500',
    bg: 'bg-emerald-50',
    soon: true,
  },
]

const tiers = [
  {
    id: 'starter',
    name: 'Starter Partner',
    tagline: 'Mulai perjalananmu',
    price: 'Gratis',
    priceNote: 'Selamanya',
    color: 'border-sage-200',
    badge: 'bg-sage-50 text-sage-700',
    cta: 'Daftar gratis',
    features: [
      'Pengantaran mandiri ke titik dropoff',
      'Pencatatan digital berat limbah',
      'Dashboard volume basic (bulanan)',
      'Sertifikat kontribusi digital',
    ],
    locked: [],
  },
  {
    id: 'growth',
    name: 'Growth Partner',
    tagline: 'Tumbuh bersama dampak',
    price: 'Hubungi kami',
    priceNote: 'Per bulan',
    color: 'border-gold-300',
    badge: 'bg-gold-50 text-gold-700',
    cta: 'Hubungi kami',
    featured: true,
    features: [
      'Penjemputan terjadwal',
      'Dashboard volume real-time',
      'Data konversi maggot & kasgot',
      'Laporan dampak bulanan (PDF)',
      'Metrik ESG basic (CO₂, waste diverted)',
      'Sertifikat kontribusi digital',
    ],
    locked: [],
  },
  {
    id: 'impact',
    name: 'Impact Partner',
    tagline: 'Pemimpin perubahan',
    price: 'Hubungi kami',
    priceNote: 'Per bulan',
    color: 'border-gold-400',
    badge: 'bg-gold-100 text-gold-800',
    cta: 'Hubungi kami',
    features: [
      'Penjemputan prioritas & frekuensi tinggi',
      'Semua fitur Growth Partner',
      'Insight mendalam & analitik lanjutan',
      'Laporan ESG siap submit ke DLH',
      'Eksposur premium & co-branding',
      'Peluang kolaborasi & program mitra',
    ],
    locked: [],
  },
]

export default async function LandingPage() {
  const stats = await getGlobalStats()

  const fallbackStats = {
    total_waste_managed_kg: 12400,
    total_maggot_kg: 1800,
    total_kasgot_kg: 890,
    co2_avoided_kg: 8200,
    active_mitra_count: 47,
  }

  const s = stats || fallbackStats

  return (
    <>
      <Navbar />
      <main className="pt-16">

        {/* ── Hero ─────────────────────────────────────────── */}
        <section className="max-w-6xl mx-auto px-4 sm:px-6 py-20 md:py-28">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-gold-50 border border-gold-200 text-gold-700 text-xs font-medium px-3 py-1.5 rounded-full mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-gold-400 animate-pulse"></span>
              Platform aktif · {s.active_mitra_count} mitra bergabung
            </div>
            <h1 className="text-4xl md:text-5xl font-semibold text-stone-900 leading-tight mb-5 tracking-tight">
              Limbah organikmu<br />
              <span className="text-gold-500">jadi protein & nutrisi</span>
            </h1>
            <p className="text-lg text-stone-500 leading-relaxed mb-8 max-w-xl">
              Platform pengelolaan limbah organik berbasis data — transparan,
              terverifikasi, dan siap lapor DLH. Bergabunglah bersama mitra HoReCa
              terpercaya di Sulawesi Selatan.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link href="/get-in-touch#daftar" className="btn-primary flex items-center gap-2">
                Mulai sekarang <ArrowRight size={16} />
              </Link>
              <Link href="#cara-kerja" className="btn-secondary flex items-center gap-2">
                Pelajari cara kerja <ChevronRight size={16} />
              </Link>
            </div>
          </div>
        </section>

        {/* ── Impact Counter ────────────────────────────────── */}
        <section id="dampak" className="bg-white border-y border-stone-100">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
            <p className="text-xs font-medium text-stone-400 uppercase tracking-widest mb-6 text-center">
              Dampak nyata, terukur, real-time
            </p>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {[
                { label: 'Limbah dikelola',      value: formatWeight(s.total_waste_managed_kg) },
                { label: 'Maggot dihasilkan',    value: formatWeight(s.total_maggot_kg) },
                { label: 'Kasgot dihasilkan',    value: formatWeight(s.total_kasgot_kg) },
                { label: 'CO₂ dihindari',        value: formatWeight(s.co2_avoided_kg) },
                { label: 'Mitra aktif',          value: `${s.active_mitra_count} bisnis` },
              ].map(item => (
                <div key={item.label} className="text-center">
                  <p className="text-2xl md:text-3xl font-semibold text-stone-800">{item.value}</p>
                  <p className="text-xs text-stone-400 mt-1">{item.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Cara Kerja ────────────────────────────────────── */}
        <section id="cara-kerja" className="max-w-6xl mx-auto px-4 sm:px-6 py-20">
          <div className="mb-12 max-w-xl">
            <h2 className="text-2xl md:text-3xl font-semibold text-stone-800 mb-3">
              Alur kerja ESALOKA
            </h2>
            <p className="text-stone-500">
              Dari limbah dapur hingga protein bernilai tinggi — semua tercatat dan transparan.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {steps.map(step => {
              const Icon = step.icon
              return (
                <div key={step.number} className={`card relative ${step.soon ? 'opacity-60' : ''}`}>
                  {step.soon && (
                    <span className="absolute top-4 right-4 text-[10px] bg-stone-100 text-stone-500 px-2 py-0.5 rounded-full font-medium">
                      Segera
                    </span>
                  )}
                  <div className={`w-10 h-10 rounded-xl ${step.bg} flex items-center justify-center mb-4`}>
                    <Icon size={20} className={step.color} />
                  </div>
                  <span className="text-xs text-stone-300 font-mono font-medium">{step.number}</span>
                  <h3 className="text-sm font-semibold text-stone-800 mt-1 mb-2">{step.title}</h3>
                  <p className="text-sm text-stone-500 leading-relaxed">{step.desc}</p>
                </div>
              )
            })}
          </div>
        </section>

        {/* ── Pricing ───────────────────────────────────────── */}
        <section id="paket" className="bg-white border-y border-stone-100">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 py-20">
            <div className="text-center mb-12">
              <h2 className="text-2xl md:text-3xl font-semibold text-stone-800 mb-3">
                Pilih paket kemitraan
              </h2>
              <p className="text-stone-500 max-w-lg mx-auto">
                Mulai gratis, upgrade seiring pertumbuhan dampak Anda.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {tiers.map(tier => (
                <div
                  key={tier.id}
                  className={`card border-2 relative flex flex-col ${tier.color} ${tier.featured ? 'shadow-md' : ''}`}
                >
                  {tier.featured && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                      <span className="bg-gold-400 text-white text-xs font-medium px-3 py-1 rounded-full">
                        Paling populer
                      </span>
                    </div>
                  )}
                  <div className="mb-5">
                    <span className={`inline-block text-xs font-medium px-2.5 py-1 rounded-full mb-3 ${tier.badge}`}>
                      {tier.tagline}
                    </span>
                    <h3 className="text-lg font-semibold text-stone-800">{tier.name}</h3>
                    <div className="mt-2">
                      <span className="text-2xl font-semibold text-stone-800">{tier.price}</span>
                      <span className="text-xs text-stone-400 ml-1">/ {tier.priceNote}</span>
                    </div>
                  </div>
                  <ul className="flex flex-col gap-2.5 flex-1 mb-6">
                    {tier.features.map(f => (
                      <li key={f} className="flex items-start gap-2 text-sm text-stone-600">
                        <Check size={14} className="text-gold-500 shrink-0 mt-0.5" />
                        {f}
                      </li>
                    ))}
                  </ul>
                  <Link
                    href="/get-in-touch#daftar"
                    className={tier.featured ? 'btn-primary text-center' : 'btn-secondary text-center'}
                  >
                    {tier.cta}
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── CTA Banner ────────────────────────────────────── */}
        <section className="max-w-6xl mx-auto px-4 sm:px-6 py-20">
          <div className="bg-gold-400 rounded-2xl px-8 py-12 text-center">
            <h2 className="text-2xl md:text-3xl font-semibold text-white mb-3">
              Siap bergabung bersama ESALOKA?
            </h2>
            <p className="text-gold-100 mb-8 max-w-lg mx-auto">
              Mulai kelola limbah organik bisnis Anda secara bertanggung jawab.
              Gratis untuk memulai.
            </p>
            <div className="flex flex-wrap gap-3 justify-center">
              <Link href="/get-in-touch#daftar" className="bg-white text-gold-700 font-medium px-6 py-2.5 rounded-xl text-sm hover:bg-gold-50 transition-colors">
                Daftar sebagai mitra
              </Link>
              <Link href="/get-in-touch" className="border border-gold-300 text-white font-medium px-6 py-2.5 rounded-xl text-sm hover:bg-gold-500 transition-colors">
                Hubungi kami
              </Link>
            </div>
          </div>
        </section>

        {/* ── Footer ────────────────────────────────────────── */}
        <footer className="border-t border-stone-100 bg-white">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
            <div className="flex flex-col md:flex-row justify-between gap-6">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-7 h-7 rounded-lg bg-gold-400 flex items-center justify-center">
                    <span className="text-white font-bold text-xs">E</span>
                  </div>
                  <span className="font-semibold text-stone-800">ESALOKA</span>
                </div>
                <p className="text-xs text-stone-400 max-w-xs">
                  Platform pengelolaan limbah organik berbasis data untuk bisnis HoReCa.
                </p>
              </div>
              <div className="flex flex-wrap gap-8 text-sm">
                <div className="flex flex-col gap-2">
                  <p className="font-medium text-stone-700 text-xs uppercase tracking-wide">Platform</p>
                  <Link href="/#cara-kerja" className="text-stone-400 hover:text-stone-600">Cara kerja</Link>
                  <Link href="/#paket" className="text-stone-400 hover:text-stone-600">Paket kemitraan</Link>
                  <Link href="/login" className="text-stone-400 hover:text-stone-600">Masuk</Link>
                </div>
                <div className="flex flex-col gap-2">
                  <p className="font-medium text-stone-700 text-xs uppercase tracking-wide">Kontak</p>
                  <Link href="/get-in-touch" className="text-stone-400 hover:text-stone-600">Hubungi kami</Link>
                  <Link href="/get-in-touch#daftar" className="text-stone-400 hover:text-stone-600">Daftar mitra</Link>
                </div>
              </div>
            </div>
            <div className="border-t border-stone-100 mt-8 pt-6 flex flex-col md:flex-row justify-between items-center gap-2">
              <p className="text-xs text-stone-400">© 2025 ESALOKA. All rights reserved.</p>
              <p className="text-xs text-stone-400">Pengelolaan limbah organik yang bertanggung jawab</p>
            </div>
          </div>
        </footer>

      </main>
    </>
  )
}
