import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { LockedSection } from '@/components/ui/LockedSection'
import { StatCard } from '@/components/ui/StatCard'
import { formatWeight, MONTHS_ID } from '@/lib/utils'
import { SubscriptionTier } from '@/types'

export default async function MitraInsightPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: mitra } = await supabase
    .from('mitra').select('*').eq('user_id', user.id).single()
  if (!mitra) redirect('/login')

  const tier = mitra.subscription_tier as SubscriptionTier

  if (tier !== 'impact') {
    return (
      <div className="page-enter">
        <div className="mb-6">
          <h1 className="text-xl font-semibold text-stone-800">Insight mendalam</h1>
          <p className="text-sm text-stone-400 mt-0.5">Analitik lanjutan & proyeksi kontribusi</p>
        </div>
        <LockedSection
          title="Fitur eksklusif Impact Partner"
          description="Akses analitik tren, proyeksi volume, rasio konversi detail, dan benchmark performa"
          requiredTier="impact"
        />
      </div>
    )
  }

  const now = new Date()
  const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 5, 1).toISOString().split('T')[0]

  const { data: trendData } = await supabase
    .from('waste_collections')
    .select('collection_date, weight_kg')
    .eq('mitra_id', mitra.id)
    .gte('collection_date', sixMonthsAgo)
    .order('collection_date')

  const grouped: Record<string, number> = {}
  ;(trendData || []).forEach(c => {
    const key = c.collection_date.slice(0, 7)
    grouped[key] = (grouped[key] || 0) + Number(c.weight_kg)
  })

  const monthlyTrend = Object.entries(grouped)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([key, total]) => {
      const [, mo] = key.split('-')
      return { label: MONTHS_ID[parseInt(mo) - 1], total }
    })

  const vals = monthlyTrend.map(m => m.total)
  const maxVal = Math.max(...vals, 1)
  const avgVal = vals.length > 0 ? vals.reduce((s, v) => s + v, 0) / vals.length : 0
  const lastVal = vals[vals.length - 1] || 0
  const prevVal = vals[vals.length - 2] || 0
  const growth  = prevVal > 0 ? Math.round(((lastVal - prevVal) / prevVal) * 100) : 0
  const projected = Math.round(avgVal * 1.1)

  const { data: bioData } = await supabase
    .from('bioconversions').select('maggot_kg, kasgot_kg').eq('mitra_id', mitra.id)
  const totalMaggot = (bioData || []).reduce((s, b) => s + Number(b.maggot_kg), 0)
  const { data: allCollections } = await supabase
    .from('waste_collections').select('weight_kg').eq('mitra_id', mitra.id)
  const totalWaste = (allCollections || []).reduce((s, c) => s + Number(c.weight_kg), 0)
  const convRate = totalWaste > 0 ? ((totalMaggot / totalWaste) * 100).toFixed(1) : '0'

  return (
    <div className="page-enter">
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-1">
          <h1 className="text-xl font-semibold text-stone-800">Insight mendalam</h1>
          <span className="badge bg-gold-100 text-gold-800 border border-gold-300 text-[10px]">Impact Partner</span>
        </div>
        <p className="text-sm text-stone-400">Analitik lanjutan · {mitra.business_name}</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <StatCard label="Rata-rata per bulan"   value={formatWeight(avgVal)}    sub="6 bulan terakhir" highlight />
        <StatCard label="Pertumbuhan"           value={`${growth >= 0 ? '+' : ''}${growth}%`} sub="vs bulan lalu" />
        <StatCard label="Proyeksi bulan depan"  value={formatWeight(projected)} sub="Estimasi +10% tren" />
        <StatCard label="Rasio konversi maggot" value={`${convRate}%`}          sub="Dari total limbah" />
      </div>

      {/* Trend chart */}
      <div className="card mb-6">
        <h2 className="section-title mb-5">Tren volume 6 bulan terakhir</h2>
        {monthlyTrend.length === 0 ? (
          <p className="text-sm text-stone-400 text-center py-8">Belum ada data trend</p>
        ) : (
          <>
            <div className="flex items-end gap-3 h-44 mb-2">
              {monthlyTrend.map((m, i) => {
                const isLast = i === monthlyTrend.length - 1
                const heightPct = (m.total / maxVal) * 100
                return (
                  <div key={i} className="flex-1 flex flex-col items-center gap-1.5">
                    <span className="text-[10px] text-stone-500 font-medium">{formatWeight(m.total)}</span>
                    <div className="w-full relative flex-1 flex items-end">
                      <div
                        className={`w-full rounded-t-md transition-all ${isLast ? 'bg-gold-400' : 'bg-gold-200'} hover:opacity-80`}
                        style={{ height: `${Math.max(heightPct, 3)}%` }}
                        title={`${m.label}: ${formatWeight(m.total)}`}
                      />
                    </div>
                    <span className="text-[10px] text-stone-400">{m.label}</span>
                  </div>
                )
              })}
              {/* Projection bar */}
              <div className="flex-1 flex flex-col items-center gap-1.5 opacity-50">
                <span className="text-[10px] text-stone-400 font-medium">~{formatWeight(projected)}</span>
                <div className="w-full relative flex-1 flex items-end">
                  <div className="w-full rounded-t-md border-2 border-dashed border-gold-300"
                    style={{ height: `${Math.max((projected / maxVal) * 100, 3)}%` }} />
                </div>
                <span className="text-[10px] text-stone-400">Proyeksi</span>
              </div>
            </div>
            <p className="text-xs text-stone-400 text-right">Batang emas = bulan berjalan · Garis putus = proyeksi</p>
          </>
        )}
      </div>

      {/* Performance breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="card">
          <h2 className="section-title mb-4">Analisis konversi</h2>
          <div className="flex flex-col gap-4">
            <div>
              <div className="flex justify-between text-sm mb-1.5">
                <span className="text-stone-500">Rasio maggot dari limbah</span>
                <span className="font-medium text-gold-600">{convRate}%</span>
              </div>
              <div className="w-full bg-stone-100 rounded-full h-2 overflow-hidden">
                <div className="h-full rounded-full bg-gold-300" style={{ width: `${Math.min(parseFloat(convRate) * 5, 100)}%` }} />
              </div>
              <p className="text-xs text-stone-400 mt-1">Target rata-rata industri: 15%</p>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1.5">
                <span className="text-stone-500">Total limbah diproses</span>
                <span className="font-medium text-stone-700">{formatWeight(totalWaste)}</span>
              </div>
              <div className="flex justify-between text-sm mb-1.5">
                <span className="text-stone-500">Total maggot dihasilkan</span>
                <span className="font-medium text-gold-600">{formatWeight(totalMaggot)}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <h2 className="section-title mb-4">Rekomendasi optimasi</h2>
          <div className="flex flex-col gap-3">
            {[
              { tip: 'Kurangi kontaminasi anorganik', detail: 'Pastikan pemisahan sampah sebelum diserahkan untuk meningkatkan rasio konversi.' },
              { tip: 'Konsistensi frekuensi pickup', detail: 'Limbah segar menghasilkan konversi lebih tinggi dibandingkan yang sudah terfermentasi.' },
              { tip: 'Tingkatkan volume per pickup', detail: 'Volume optimal per batch adalah 50–100 kg untuk efisiensi proses biokonversi.' },
            ].map((item, i) => (
              <div key={i} className="flex gap-3">
                <span className="w-5 h-5 rounded-full bg-gold-100 text-gold-600 text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">{i + 1}</span>
                <div>
                  <p className="text-sm font-medium text-stone-700">{item.tip}</p>
                  <p className="text-xs text-stone-400 mt-0.5 leading-relaxed">{item.detail}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
