import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { LockedSection } from '@/components/ui/LockedSection'
import { StatCard } from '@/components/ui/StatCard'
import { formatWeight, formatDate, MONTHS_ID } from '@/lib/utils'
import { SubscriptionTier } from '@/types'

export default async function MitraKonversiPage() {
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
          <h1 className="text-xl font-semibold text-stone-800">Hasil konversi</h1>
          <p className="text-sm text-stone-400 mt-0.5">Data maggot & kasgot dari limbah yang Anda serahkan</p>
        </div>
        <LockedSection
          title="Fitur ini memerlukan Growth Partner"
          description="Upgrade tier Anda untuk mengakses data hasil konversi maggot dan kasgot secara real-time"
          requiredTier="growth"
        />
      </div>
    )
  }

  const now = new Date()
  const firstOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0]

  const { data: allBio } = await supabase
    .from('bioconversions')
    .select('*, collection:collection_id(collection_date, weight_kg)')
    .eq('mitra_id', mitra.id)
    .order('conversion_date', { ascending: false })

  const { data: thisBio } = await supabase
    .from('bioconversions')
    .select('maggot_kg, kasgot_kg')
    .eq('mitra_id', mitra.id)
    .gte('conversion_date', firstOfMonth)

  const totalMaggotAll   = (allBio || []).reduce((s, b) => s + Number(b.maggot_kg), 0)
  const totalKasgotAll   = (allBio || []).reduce((s, b) => s + Number(b.kasgot_kg), 0)
  const thisMaggot       = (thisBio || []).reduce((s, b) => s + Number(b.maggot_kg), 0)
  const thisKasgot       = (thisBio || []).reduce((s, b) => s + Number(b.kasgot_kg), 0)

  // Monthly trend for impact tier
  const byMonth: Record<string, { maggot: number; kasgot: number; waste: number }> = {}
  ;(allBio || []).forEach((b: any) => {
    const key = b.conversion_date.slice(0, 7)
    if (!byMonth[key]) byMonth[key] = { maggot: 0, kasgot: 0, waste: 0 }
    byMonth[key].maggot += Number(b.maggot_kg)
    byMonth[key].kasgot += Number(b.kasgot_kg)
    byMonth[key].waste  += Number(b.collection?.weight_kg || 0)
  })

  const monthlyData = Object.entries(byMonth)
    .sort(([a], [b]) => a.localeCompare(b))
    .slice(-6)
    .map(([key, val]) => {
      const [yr, mo] = key.split('-')
      return { label: MONTHS_ID[parseInt(mo) - 1], ...val }
    })

  const maxMaggot = Math.max(...monthlyData.map(m => m.maggot), 1)

  return (
    <div className="page-enter">
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-stone-800">Hasil konversi</h1>
        <p className="text-sm text-stone-400 mt-0.5">
          Data maggot & kasgot dari limbah {mitra.business_name}
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <StatCard label="Maggot bulan ini"  value={formatWeight(thisMaggot)}   sub="Protein series" highlight />
        <StatCard label="Kasgot bulan ini"  value={formatWeight(thisKasgot)}   sub="Soil series" />
        <StatCard label="Total maggot"       value={formatWeight(totalMaggotAll)} sub="Kumulatif semua waktu" />
        <StatCard label="Total kasgot"       value={formatWeight(totalKasgotAll)} sub="Kumulatif semua waktu" />
      </div>

      {/* Conversion ratio */}
      <div className="card mb-6">
        <h2 className="section-title mb-4">Rasio konversi dari limbah</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span className="text-stone-500">Maggot (protein)</span>
              <span className="font-medium text-gold-600">~15% dari berat limbah</span>
            </div>
            <div className="w-full bg-stone-100 rounded-full h-3 overflow-hidden">
              <div className="h-full rounded-full bg-gold-300" style={{ width: '15%' }} />
            </div>
          </div>
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span className="text-stone-500">Kasgot (pupuk)</span>
              <span className="font-medium text-sage-600">~6.5% dari berat limbah</span>
            </div>
            <div className="w-full bg-stone-100 rounded-full h-3 overflow-hidden">
              <div className="h-full rounded-full bg-sage-300" style={{ width: '6.5%' }} />
            </div>
          </div>
        </div>
      </div>

      {/* Monthly chart (impact only) */}
      {tier === 'impact' && monthlyData.length > 0 && (
        <div className="card mb-6">
          <h2 className="section-title mb-4">Tren konversi 6 bulan terakhir</h2>
          <div className="flex items-end gap-3 h-36">
            {monthlyData.map((m, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-1.5">
                <div className="w-full flex gap-1 items-end justify-center" style={{ height: 100 }}>
                  <div className="flex-1 rounded-t-md bg-gold-200 hover:bg-gold-400 transition-colors"
                    style={{ height: `${(m.maggot / maxMaggot) * 100}%`, minHeight: 3 }} title={`Maggot: ${formatWeight(m.maggot)}`} />
                  <div className="flex-1 rounded-t-md bg-sage-200 hover:bg-sage-400 transition-colors"
                    style={{ height: `${(m.kasgot / maxMaggot) * 100}%`, minHeight: 3 }} title={`Kasgot: ${formatWeight(m.kasgot)}`} />
                </div>
                <span className="text-[10px] text-stone-400">{m.label}</span>
              </div>
            ))}
          </div>
          <div className="flex gap-4 mt-3">
            <span className="flex items-center gap-1.5 text-xs text-stone-500"><span className="w-3 h-2 rounded bg-gold-300 inline-block" />Maggot</span>
            <span className="flex items-center gap-1.5 text-xs text-stone-500"><span className="w-3 h-2 rounded bg-sage-300 inline-block" />Kasgot</span>
          </div>
        </div>
      )}

      {tier === 'growth' && (
        <div className="mb-6">
          <LockedSection title="Tren konversi bulanan" description="Grafik analitik tren tersedia untuk tier Impact Partner" requiredTier="impact" />
        </div>
      )}

      {/* History table */}
      <div className="card">
        <h2 className="section-title mb-4">Riwayat konversi</h2>
        {(allBio || []).length === 0 ? (
          <p className="text-sm text-stone-400 text-center py-8">Belum ada data konversi</p>
        ) : (
          <div className="table-wrapper">
            <table className="table">
              <thead>
                <tr>
                  <th>Tanggal</th>
                  <th>Limbah asal</th>
                  <th>Maggot</th>
                  <th>Kasgot</th>
                </tr>
              </thead>
              <tbody>
                {(allBio || []).map((b: any) => (
                  <tr key={b.id}>
                    <td className="font-medium">{formatDate(b.conversion_date)}</td>
                    <td className="text-stone-400 text-xs">{b.collection ? formatWeight(Number(b.collection.weight_kg)) : '—'}</td>
                    <td><span className="badge badge-gold text-xs">{formatWeight(Number(b.maggot_kg))}</span></td>
                    <td><span className="badge badge-sage text-xs">{formatWeight(Number(b.kasgot_kg))}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
