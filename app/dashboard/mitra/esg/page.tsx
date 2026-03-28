import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { LockedSection } from '@/components/ui/LockedSection'
import { StatCard } from '@/components/ui/StatCard'
import { formatWeight, calcCO2 } from '@/lib/utils'
import { SubscriptionTier } from '@/types'
import { Leaf } from 'lucide-react'

export default async function MitraESGPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: mitra } = await supabase
    .from('mitra').select('*').eq('user_id', user.id).single()
  if (!mitra) redirect('/login')

  const tier = mitra.subscription_tier as SubscriptionTier

  if (tier === 'starter') {
    return (
      <div className="page-enter">
        <div className="mb-6">
          <h1 className="text-xl font-semibold text-stone-800">ESG metrics</h1>
          <p className="text-sm text-stone-400 mt-0.5">Laporan dampak lingkungan terverifikasi</p>
        </div>
        <LockedSection title="Fitur ini memerlukan Growth Partner" description="Upgrade untuk mengakses metrik ESG, CO₂ equivalent, dan laporan dampak bulanan" requiredTier="growth" />
      </div>
    )
  }

  const now = new Date()
  const firstOfYear  = `${now.getFullYear()}-01-01`
  const firstOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0]

  const { data: allCollections } = await supabase
    .from('waste_collections').select('weight_kg').eq('mitra_id', mitra.id)
  const { data: ytdCollections } = await supabase
    .from('waste_collections').select('weight_kg').eq('mitra_id', mitra.id).gte('collection_date', firstOfYear)
  const { data: monthCollections } = await supabase
    .from('waste_collections').select('weight_kg').eq('mitra_id', mitra.id).gte('collection_date', firstOfMonth)

  const totalAll   = (allCollections || []).reduce((s, c) => s + Number(c.weight_kg), 0)
  const totalYTD   = (ytdCollections || []).reduce((s, c) => s + Number(c.weight_kg), 0)
  const totalMonth = (monthCollections || []).reduce((s, c) => s + Number(c.weight_kg), 0)

  const co2All   = calcCO2(totalAll)
  const co2YTD   = calcCO2(totalYTD)
  const co2Month = calcCO2(totalMonth)

  const esgMetrics = [
    { label: 'CO₂ dihindari (bulan ini)', value: `${co2Month} Kg`, desc: 'Setara membakar 0.7L BBM per kg limbah dialihkan dari TPA' },
    { label: 'CO₂ dihindari (tahun ini)', value: `${co2YTD} Kg`, desc: `Kumulatif ${now.getFullYear()}` },
    { label: 'Limbah dialihkan dari TPA (all time)', value: formatWeight(totalAll), desc: 'Tidak berakhir di tempat pemrosesan akhir' },
    { label: 'CO₂ dihindari (all time)', value: formatWeight(co2All), desc: 'Total dampak kumulatif sejak bergabung' },
  ]

  return (
    <div className="page-enter">
      <div className="flex items-start justify-between mb-6 flex-wrap gap-3">
        <div>
          <h1 className="text-xl font-semibold text-stone-800">ESG metrics</h1>
          <p className="text-sm text-stone-400 mt-0.5">Laporan dampak lingkungan terverifikasi · {mitra.business_name}</p>
        </div>
        {tier === 'impact' && (
          <button className="btn-primary text-sm py-2 px-4 flex items-center gap-2">
            <Leaf size={14} /> Download laporan ESG
          </button>
        )}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {esgMetrics.map((m, i) => (
          <StatCard key={i} label={m.label} value={m.value} sub={m.desc} highlight={i === 0} />
        ))}
      </div>

      {/* ESG Context card */}
      <div className="card mb-6 bg-sage-50 border-sage-200">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-sage-100 flex items-center justify-center shrink-0">
            <Leaf size={22} className="text-sage-600" />
          </div>
          <div>
            <h2 className="font-semibold text-stone-800 mb-2">Apa artinya angka ini?</h2>
            <p className="text-sm text-stone-600 leading-relaxed">
              Setiap kilogram limbah organik yang tidak berakhir di TPA menghindari produksi metana —
              gas rumah kaca 28x lebih kuat dari CO₂. Dengan menyerahkan limbah ke ESALOKA,
              {' '}<strong>{mitra.business_name}</strong> telah menghindari emisi{' '}
              <strong>{formatWeight(co2All)} CO₂ equivalent</strong> sejak bergabung.
            </p>
          </div>
        </div>
      </div>

      {/* ESG Pillars */}
      <div className="card mb-6">
        <h2 className="section-title mb-4">Kontribusi terhadap SDGs</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { sdg: 'SDG 12', title: 'Konsumsi & Produksi Bertanggung Jawab', desc: 'Mengurangi limbah makanan melalui sistem pengelolaan yang terverifikasi.', color: 'bg-amber-50 border-amber-200 text-amber-700' },
            { sdg: 'SDG 13', title: 'Penanganan Perubahan Iklim', desc: 'Menurunkan emisi metana dari TPA dan mengganti protein hewani impor dengan sumber lokal.', color: 'bg-green-50 border-green-200 text-green-700' },
            { sdg: 'SDG 15', title: 'Ekosistem Daratan', desc: 'Mengembalikan nutrisi ke tanah pertanian melalui kasgot organik bermutu tinggi.', color: 'bg-emerald-50 border-emerald-200 text-emerald-700' },
          ].map(item => (
            <div key={item.sdg} className={`rounded-xl border p-4 ${item.color}`}>
              <span className={`text-xs font-bold px-2 py-0.5 rounded-full bg-white/60 mb-2 inline-block`}>{item.sdg}</span>
              <p className="font-semibold text-stone-800 text-sm mb-1">{item.title}</p>
              <p className="text-xs text-stone-600 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Full ESG report CTA (impact only) */}
      {tier === 'growth' && (
        <LockedSection title="Laporan ESG lengkap siap submit DLH" description="Dokumen PDF terformat, siap dilampirkan ke laporan Dinas Lingkungan Hidup" requiredTier="impact" />
      )}
    </div>
  )
}
