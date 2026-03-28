import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { formatWeight } from '@/lib/utils'
import {
  ArrowRight, Truck, BarChart2, FileCheck, Bug,
  FlaskConical, Sprout, Check, ChevronRight,
  AlertTriangle, Layers, Database, Leaf, Target,
  UtensilsCrossed, Hotel, ChefHat, Users,
} from 'lucide-react'

export const revalidate = 60

async function getGlobalStats() {
  try {
    const supabase = await createClient()
    const { data } = await supabase.from('global_stats').select('*').single()
    return data
  } catch { return null }
}

// ── Section 4: How It Works ──────────────────────────────────
const steps = [
  {
    icon: Truck, number: '01', title: 'Pengumpulan Limbah',
    desc: 'Mitra dapat mengantarkan limbah atau menggunakan layanan penjemputan terjadwal.',
    color: 'text-gold-400', bg: 'bg-gold-50',
  },
  {
    icon: Bug, number: '02', title: 'Proses Biokonversi',
    desc: 'Limbah diolah menggunakan larva Black Soldier Fly menjadi maggot dan kasgot.',
    color: 'text-green-500', bg: 'bg-green-50',
  },
  {
    icon: Sprout, number: '03', title: 'Hasil Bernilai',
    desc: 'Produk hasil konversi dimanfaatkan kembali sebagai pakan dan pupuk organik.',
    color: 'text-sage-500', bg: 'bg-sage-50',
  },
  {
    icon: FileCheck, number: '04', title: 'Pelaporan Dampak',
    desc: 'Mitra mendapatkan ringkasan dampak lingkungan secara berkala.',
    color: 'text-blue-400', bg: 'bg-blue-50',
  },
  {
    icon: FlaskConical, number: '05', title: 'Riset & Edukasi',
    desc: 'Data komparatif pakan konvensional vs pakan berbasis maggot untuk penelitian unggas.',
    color: 'text-purple-400', bg: 'bg-purple-50', soon: true,
  },
  {
    icon: BarChart2, number: '06', title: 'Analitik Lanjutan',
    desc: 'Dashboard ESG mendalam untuk pelaporan sustainability goals bisnis Anda.',
    color: 'text-emerald-500', bg: 'bg-emerald-50', soon: true,
  },
]

// ── Section 5: Why ESALOKA ───────────────────────────────────
const whyPoints = [
  {
    icon: Layers,
    title: 'End-to-end waste management',
    desc: 'Dari pengumpulan, biokonversi, hingga pelaporan — satu platform terintegrasi.',
  },
  {
    icon: Database,
    title: 'Berbasis data & transparansi dampak',
    desc: 'Setiap kilogram limbah tercatat dan dapat diverifikasi secara real-time.',
  },
  {
    icon: Leaf,
    title: 'Model ekonomi sirkular',
    desc: 'Limbah bukan akhir siklus — melainkan awal dari rantai nilai baru.',
  },
  {
    icon: Target,
    title: 'Mendukung ESG & sustainability goals',
    desc: 'Laporan dampak siap submit ke DLH dan investor sustainability.',
  },
]

// ── Section 6: Use Case ──────────────────────────────────────
const useCases = [
  {
    icon: UtensilsCrossed,
    title: 'Restoran & Café',
    desc: 'Sisa bahan masak dan food waste harian dikelola secara terjadwal dan transparan.',
    badge: 'Paling umum',
    color: 'bg-gold-50 border-gold-200',
    badgeColor: 'badge-gold',
  },
  {
    icon: Hotel,
    title: 'Hotel & Hospitality',
    desc: 'Volume limbah besar dari dapur & restoran hotel dikonversi menjadi nilai ekonomi.',
    badge: 'Volume tinggi',
    color: 'bg-sage-50 border-sage-200',
    badgeColor: 'badge-sage',
  },
  {
    icon: ChefHat,
    title: 'Catering & Food Service',
    desc: 'Pengelolaan limbah organik dari event dan layanan katering skala besar.',
    badge: 'Fleksibel',
    color: 'bg-blue-50 border-blue-200',
    badgeColor: 'bg-blue-50 text-blue-700 border border-blue-200',
  },
  {
    icon: Users,
    title: 'Komunitas & Institusi',
    desc: 'Sekolah, kampus, dan komunitas yang ingin berkontribusi nyata terhadap lingkungan.',
    badge: 'Dampak kolektif',
    color: 'bg-stone-50 border-stone-200',
    badgeColor: 'badge badge-gray',
  },
]

// ── Section 7: Subscription Tier ────────────────────────────
const tiers = [
  {
    id: 'starter',
    name: 'Starter Partner',
    tagline: 'Untuk bisnis yang ingin mulai berkontribusi secara mandiri',
    price: 'Gratis',
    priceNote: 'Selamanya',
    border: 'border-sage-200',
    badge: 'bg-sage-50 text-sage-700',
    cta: 'Mulai dari Starter',
    ctaStyle: 'btn-secondary',
    features: [
      'Drop-off limbah ke titik pengumpulan',
      'Pencatatan partisipasi digital',
      'Terdaftar sebagai mitra ESALOKA',
      'Sertifikat kontribusi digital',
    ],
  },
  {
    id: 'growth',
    name: 'Growth Partner',
    tagline: 'Untuk operasional yang lebih terintegrasi',
    price: 'Hubungi kami',
    priceNote: 'Per bulan',
    border: 'border-gold-300',
    badge: 'bg-gold-50 text-gold-700',
    cta: 'Tingkatkan ke Growth',
    ctaStyle: 'btn-primary',
    featured: true,
    features: [
      'Penjemputan terjadwal',
      'Pengelolaan end-to-end',
      'Ringkasan dampak bulanan',
      'Identitas digital mitra',
      'Data konversi maggot & kasgot',
      'Metrik ESG basic (CO₂, waste diverted)',
    ],
  },
  {
    id: 'impact',
    name: 'Impact Partner',
    tagline: 'Untuk kolaborasi strategis & dampak maksimal',
    price: 'Hubungi kami',
    priceNote: 'Per bulan',
    border: 'border-gold-400',
    badge: 'bg-gold-100 text-gold-800',
    cta: 'Jadi Impact Partner',
    ctaStyle: 'btn-secondary',
    features: [
      'Prioritas operasional',
      'Analisis dampak mendalam',
      'Visibilitas brand premium',
      'Dashboard monitoring real-time',
      'Kolaborasi ESG & sustainability goals',
      'Laporan ESG siap submit ke DLH',
    ],
  },
]

// ── Section 8: Mitra Showcase (placeholder) ─────────────────
const mitraPlaceholders = [
  { initials: 'HR', name: 'Hotel Regent', type: 'Hotel' },
  { initials: 'RC', name: 'Restoran Cahaya', type: 'Restoran' },
  { initials: 'CM', name: 'Catering Maju', type: 'Catering' },
  { initials: 'HB', name: 'Hotel Bintang', type: 'Hotel' },
  { initials: 'KN', name: 'Kafe Nusantara', type: 'Café' },
  { initials: 'PS', name: 'Parepare Sejahtera', type: 'Komunitas' },
]

// ── Section 9: Testimoni ─────────────────────────────────────
const testimoni = [
  {
    quote: 'Dengan ESALOKA, kami tidak lagi khawatir soal pengelolaan sisa dapur. Semuanya tercatat dan ada laporan dampaknya.',
    name: 'Budi Santoso',
    role: 'Manajer Operasional',
    bisnis: 'Hotel & Hospitality',
    initials: 'BS',
  },
  {
    quote: 'Laporan ESG yang kami dapat dari ESALOKA sangat membantu untuk pelaporan sustainability ke stakeholder.',
    name: 'Rina Lestari',
    role: 'Direktur',
    bisnis: 'Restoran & Café',
    initials: 'RL',
  },
]

// ────────────────────────────────────────────────────────────

export default async function LandingPage() {
  const stats = await getGlobalStats()
  const s = stats ?? {
    total_waste_managed_kg: 0,
    total_maggot_kg: 0,
    total_kasgot_kg: 0,
    co2_avoided_kg: 0,
    active_mitra_count: 0,
  }

  return (
    <>
      <Navbar />
      <main className="pt-16">

        {/* ── 1. HERO ──────────────────────────────────────── */}
        <section className="max-w-6xl mx-auto px-4 sm:px-6 py-20 md:py-28">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-gold-50 border border-gold-200 text-gold-700 text-xs font-medium px-3 py-1.5 rounded-full mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-gold-400 animate-pulse" />
              Platform aktif · {s.active_mitra_count} mitra bergabung
            </div>

            <h1 className="text-4xl md:text-5xl font-semibold text-stone-900 leading-tight mb-5 tracking-tight">
              Mengubah Limbah Organik<br />
              <span className="text-gold-500">Menjadi Nilai Nyata</span>
            </h1>

            <p className="text-lg text-stone-500 leading-relaxed mb-8 max-w-2xl">
              ESALOKA membantu bisnis mengelola limbah organik secara berkelanjutan—mengubahnya
              menjadi sumber daya bernilai melalui sistem terpadu berbasis maggot BSF.
            </p>

            <div className="flex flex-wrap gap-3">
              <Link href="/get-in-touch" className="btn-primary flex items-center gap-2">
                Mulai Kelola Limbah Anda <ArrowRight size={16} />
              </Link>
              <Link href="/get-in-touch" className="btn-secondary flex items-center gap-2">
                Jadwalkan Konsultasi <ChevronRight size={16} />
              </Link>
            </div>
          </div>
        </section>

        {/* ── 2. IMPACT SECTION ────────────────────────────── */}
        <section id="dampak" className="bg-white border-y border-stone-100">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 py-16">

            <div className="max-w-2xl mb-10">
              <h2 className="text-2xl md:text-3xl font-semibold text-stone-800 mb-3">
                Dampak Nyata, Terukur, dan Transparan
              </h2>
              <p className="text-stone-500 leading-relaxed">
                Setiap kilogram limbah organik yang dikelola bukan hanya mengurangi beban
                lingkungan, tetapi juga menghasilkan nilai ekonomi baru.
              </p>
            </div>

            {/* Live counters */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
              {[
                { label: 'Limbah dikelola',   value: formatWeight(s.total_waste_managed_kg) },
                { label: 'Maggot dihasilkan', value: formatWeight(s.total_maggot_kg) },
                { label: 'Kasgot dihasilkan', value: formatWeight(s.total_kasgot_kg) },
                { label: 'CO₂ dihindari',     value: formatWeight(s.co2_avoided_kg) },
              ].map(item => (
                <div key={item.label} className="bg-stone-50 rounded-2xl p-5 border border-stone-100 text-center">
                  <p className="text-2xl md:text-3xl font-semibold text-stone-800">{item.value}</p>
                  <p className="text-xs text-stone-400 mt-1">{item.label}</p>
                </div>
              ))}
            </div>

            {/* Highlight bullets */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
              {[
                { icon: '🚫', text: 'Limbah tidak lagi berakhir di TPA' },
                { icon: '🐛', text: 'Dikonversi menjadi maggot & kasgot' },
                { icon: '🌿', text: 'Mengurangi emisi gas rumah kaca' },
                { icon: '♻️', text: 'Mendukung ekosistem ekonomi sirkular' },
              ].map(item => (
                <div key={item.text} className="flex items-start gap-3 p-4 rounded-xl bg-sage-50 border border-sage-100">
                  <span className="text-lg leading-none mt-0.5">{item.icon}</span>
                  <p className="text-sm text-sage-700 font-medium leading-snug">{item.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── 3. PROBLEM SECTION ───────────────────────────── */}
        <section className="max-w-6xl mx-auto px-4 sm:px-6 py-20">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">

            {/* Left: emotional copy */}
            <div>
              <div className="inline-flex items-center gap-2 bg-red-50 border border-red-100 text-red-600 text-xs font-medium px-3 py-1.5 rounded-full mb-5">
                <AlertTriangle size={12} />
                Masalah yang sering diabaikan
              </div>
              <h2 className="text-2xl md:text-3xl font-semibold text-stone-800 mb-4 leading-tight">
                Masalah Besar yang<br />Sering Diabaikan
              </h2>
              <p className="text-stone-500 leading-relaxed mb-6">
                Sebagian besar limbah organik dari bisnis seperti restoran, hotel, dan catering
                masih berakhir di tempat pembuangan akhir—tanpa pengolahan, tanpa nilai.
              </p>

              <div className="flex flex-col gap-3 mb-6">
                {[
                  'Limbah organik menyumbang emisi signifikan terhadap perubahan iklim',
                  'Sistem pengelolaan yang ada masih tidak efisien dan tidak transparan',
                  'Potensi ekonomi dari limbah organik belum dimanfaatkan sama sekali',
                ].map((point, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-red-100 flex items-center justify-center shrink-0 mt-0.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-red-400 block" />
                    </div>
                    <p className="text-sm text-stone-600 leading-relaxed">{point}</p>
                  </div>
                ))}
              </div>

              <div className="bg-stone-800 rounded-2xl px-6 py-4">
                <p className="text-sm text-stone-300 italic leading-relaxed">
                  "Masalahnya bukan pada jumlah limbah, tetapi pada bagaimana kita mengelolanya."
                </p>
              </div>
            </div>

            {/* Right: visual stat */}
            <div className="flex flex-col gap-4">
              {[
                { pct: '60%', label: 'limbah organik HoReCa masih berakhir di TPA', color: 'bg-red-400' },
                { pct: '< 5%', label: 'bisnis yang memiliki sistem pengelolaan terukur', color: 'bg-gold-400' },
                { pct: '70%', label: 'potensi CO₂ yang bisa dihindari dengan biokonversi', color: 'bg-sage-400' },
              ].map((stat, i) => (
                <div key={i} className="card flex items-center gap-5">
                  <div className={`w-14 h-14 rounded-2xl ${stat.color} flex items-center justify-center shrink-0`}>
                    <span className="text-white font-semibold text-sm text-center leading-tight px-1">{stat.pct}</span>
                  </div>
                  <p className="text-sm text-stone-600 leading-relaxed">{stat.label}</p>
                </div>
              ))}
              <p className="text-xs text-stone-400 text-center mt-1">*Estimasi berdasarkan data industri pengelolaan limbah Indonesia</p>
            </div>
          </div>
        </section>

        {/* ── 4. HOW IT WORKS ──────────────────────────────── */}
        <section id="cara-kerja" className="bg-white border-y border-stone-100">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 py-20">
            <div className="mb-12 max-w-xl">
              <h2 className="text-2xl md:text-3xl font-semibold text-stone-800 mb-3">
                Bagaimana ESALOKA Bekerja
              </h2>
              <p className="text-stone-500 leading-relaxed">
                Dari limbah dapur hingga protein bernilai tinggi — semua tercatat, transparan,
                dan siap dilaporkan.
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
          </div>
        </section>

        {/* ── 5. WHY ESALOKA ───────────────────────────────── */}
        <section className="max-w-6xl mx-auto px-4 sm:px-6 py-20">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">

            <div>
              <h2 className="text-2xl md:text-3xl font-semibold text-stone-800 mb-4 leading-tight">
                Lebih dari Sekadar<br />Pengelolaan Limbah
              </h2>
              <p className="text-stone-500 leading-relaxed mb-6">
                ESALOKA bukan hanya layanan pengangkutan limbah—kami membangun sistem
                terintegrasi dari hulu ke hilir.
              </p>
              <p className="text-sm text-stone-500 leading-relaxed p-4 bg-gold-50 border border-gold-100 rounded-xl">
                Kami mengubah limbah menjadi peluang—bagi bisnis dan lingkungan.
              </p>

              <div className="mt-8">
                <Link href="/about" className="btn-secondary inline-flex items-center gap-2">
                  Pelajari lebih lanjut <ChevronRight size={14} />
                </Link>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {whyPoints.map((point) => {
                const Icon = point.icon
                return (
                  <div key={point.title} className="card group hover:border-gold-200 transition-colors">
                    <div className="w-10 h-10 rounded-xl bg-gold-50 flex items-center justify-center mb-3 group-hover:bg-gold-100 transition-colors">
                      <Icon size={18} className="text-gold-500" />
                    </div>
                    <h3 className="text-sm font-semibold text-stone-800 mb-1.5">{point.title}</h3>
                    <p className="text-xs text-stone-400 leading-relaxed">{point.desc}</p>
                  </div>
                )
              })}
            </div>
          </div>
        </section>

        {/* ── 6. USE CASE / TARGET ─────────────────────────── */}
        <section className="bg-stone-50 border-y border-stone-100">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 py-20">
            <div className="text-center mb-12">
              <h2 className="text-2xl md:text-3xl font-semibold text-stone-800 mb-3">
                Dirancang untuk Berbagai Jenis Usaha
              </h2>
              <p className="text-stone-500 max-w-lg mx-auto leading-relaxed">
                Apapun skala bisnis Anda, pengelolaan limbah dapat dimulai dari langkah sederhana.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {useCases.map(item => {
                const Icon = item.icon
                return (
                  <div key={item.title} className={`rounded-2xl border-2 p-6 ${item.color}`}>
                    <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center mb-4 shadow-sm">
                      <Icon size={18} className="text-stone-600" />
                    </div>
                    <span className={`badge text-[10px] mb-3 ${item.badgeColor}`}>{item.badge}</span>
                    <h3 className="text-sm font-semibold text-stone-800 mb-2">{item.title}</h3>
                    <p className="text-xs text-stone-500 leading-relaxed">{item.desc}</p>
                  </div>
                )
              })}
            </div>

            <div className="text-center mt-10">
              <Link href="/get-in-touch" className="btn-primary inline-flex items-center gap-2">
                Mulai Kelola Limbah Anda <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </section>

        {/* ── 7. SUBSCRIPTION TIER ─────────────────────────── */}
        <section id="paket" className="max-w-6xl mx-auto px-4 sm:px-6 py-20">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-semibold text-stone-800 mb-3">
              Pilih Skema yang Sesuai dengan Kebutuhan Anda
            </h2>
            <p className="text-stone-500 max-w-lg mx-auto">
              Mulai gratis, upgrade seiring pertumbuhan dampak dan kebutuhan bisnis Anda.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {tiers.map(tier => (
              <div
                key={tier.id}
                className={`card border-2 relative flex flex-col ${tier.border} ${tier.featured ? 'shadow-md' : ''}`}
              >
                {tier.featured && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="bg-gold-400 text-white text-xs font-medium px-3 py-1 rounded-full whitespace-nowrap">
                      Paling populer
                    </span>
                  </div>
                )}

                <div className="mb-5">
                  <span className={`inline-block text-xs font-medium px-2.5 py-1 rounded-full mb-3 ${tier.badge}`}>
                    {tier.id === 'starter' ? 'Starter' : tier.id === 'growth' ? 'Growth' : 'Impact'}
                  </span>
                  <h3 className="text-lg font-semibold text-stone-800">{tier.name}</h3>
                  <p className="text-xs text-stone-400 mt-1 leading-relaxed">{tier.tagline}</p>
                  <div className="mt-3">
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
                  href="/get-in-touch"
                  className={`${tier.ctaStyle} text-center`}
                >
                  {tier.cta}
                </Link>
              </div>
            ))}
          </div>
        </section>

        {/* ── 8. MITRA SHOWCASE ────────────────────────────── */}
        <section className="bg-white border-y border-stone-100">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 py-16">
            <div className="text-center mb-10">
              <h2 className="text-2xl md:text-3xl font-semibold text-stone-800 mb-3">
                Bersama Mitra, Kami Membangun Dampak
              </h2>
              <p className="text-stone-500 max-w-lg mx-auto leading-relaxed">
                Berbagai bisnis telah bergabung dalam ekosistem ESALOKA untuk mengelola limbah
                secara lebih bertanggung jawab.
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
              {mitraPlaceholders.map(mitra => (
                <div key={mitra.name} className="flex flex-col items-center gap-2">
                  <div className="w-14 h-14 rounded-2xl bg-stone-100 border border-stone-200 flex items-center justify-center">
                    <span className="text-sm font-semibold text-stone-500">{mitra.initials}</span>
                  </div>
                  <div className="text-center">
                    <p className="text-xs font-medium text-stone-700 leading-tight">{mitra.name}</p>
                    <p className="text-[10px] text-stone-400">{mitra.type}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="text-center mt-8">
              <p className="text-xs text-stone-400">
                dan {s.active_mitra_count > 6 ? `${s.active_mitra_count - 6}+ mitra lainnya` : 'mitra-mitra baru yang terus bergabung'} 🌱
              </p>
            </div>
          </div>
        </section>

        {/* ── 9. TRUST / SOCIAL PROOF ──────────────────────── */}
        <section className="max-w-6xl mx-auto px-4 sm:px-6 py-20">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-semibold text-stone-800 mb-3">
              Didukung oleh Kolaborasi Nyata
            </h2>
            <p className="text-stone-500 max-w-xl mx-auto leading-relaxed">
              Kami percaya bahwa solusi berkelanjutan hanya dapat dicapai melalui kolaborasi
              antara bisnis, komunitas, dan institusi.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 max-w-3xl mx-auto">
            {testimoni.map((t) => (
              <div key={t.name} className="card border border-stone-100">
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className="text-gold-400 text-sm">★</span>
                  ))}
                </div>
                <p className="text-sm text-stone-600 leading-relaxed mb-5 italic">
                  "{t.quote}"
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-gold-100 flex items-center justify-center shrink-0">
                    <span className="text-xs font-semibold text-gold-700">{t.initials}</span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-stone-800">{t.name}</p>
                    <p className="text-xs text-stone-400">{t.role} · {t.bisnis}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Partner logos placeholder */}
          <div className="mt-12 pt-10 border-t border-stone-100">
            <p className="text-xs text-stone-400 text-center uppercase tracking-widest mb-6">
              Berkolaborasi dengan
            </p>
            <div className="flex flex-wrap justify-center gap-6">
              {['Dinas Lingkungan Hidup', 'BSF Indonesia', 'Komunitas Hijau', 'Parepare Smart City'].map(partner => (
                <div key={partner} className="px-5 py-2.5 rounded-xl border border-stone-200 bg-stone-50">
                  <span className="text-xs font-medium text-stone-400">{partner}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── 10. CTA SECTION ──────────────────────────────── */}
        <section className="max-w-6xl mx-auto px-4 sm:px-6 pb-20">
          <div className="bg-stone-900 rounded-2xl px-8 py-14 text-center relative overflow-hidden">
            {/* subtle bg decoration */}
            <div className="absolute inset-0 opacity-5">
              <div className="absolute top-0 left-1/4 w-64 h-64 rounded-full bg-gold-400 -translate-y-1/2" />
              <div className="absolute bottom-0 right-1/4 w-48 h-48 rounded-full bg-sage-400 translate-y-1/2" />
            </div>

            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 bg-gold-400/20 border border-gold-400/30 text-gold-300 text-xs font-medium px-3 py-1.5 rounded-full mb-6">
                <span className="w-1.5 h-1.5 rounded-full bg-gold-400 animate-pulse" />
                Bergabung sekarang — gratis untuk mulai
              </div>

              <h2 className="text-2xl md:text-3xl font-semibold text-white mb-3">
                Mulai Perjalanan Pengelolaan<br />Limbah yang Lebih Baik
              </h2>
              <p className="text-stone-400 mb-8 max-w-lg mx-auto leading-relaxed">
                Bergabunglah bersama ESALOKA dan jadilah bagian dari perubahan
                menuju sistem yang lebih berkelanjutan.
              </p>

              <div className="flex flex-wrap gap-3 justify-center">
                <Link
                  href="/get-in-touch"
                  className="bg-gold-400 hover:bg-gold-500 text-white font-medium px-7 py-2.5 rounded-xl text-sm transition-colors flex items-center gap-2"
                >
                  Bergabung Sekarang <ArrowRight size={15} />
                </Link>
                <Link
                  href="/get-in-touch"
                  className="border border-stone-600 hover:border-stone-400 text-stone-300 hover:text-white font-medium px-7 py-2.5 rounded-xl text-sm transition-colors"
                >
                  Hubungi Kami
                </Link>
              </div>
            </div>
          </div>
        </section>

      </main>
      <Footer />
    </>
  )
}
