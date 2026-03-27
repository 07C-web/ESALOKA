import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { StatCard } from '@/components/ui/StatCard'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { TierBadge } from '@/components/ui/TierBadge'
import { LockedSection } from '@/components/ui/LockedSection'
import { SubscriptionTier, WasteCollection } from '@/types'
import { formatWeight, formatDate, MONTHS_ID } from '@/lib/utils'
import { Package, TrendingUp, Calendar } from 'lucide-react'

export default async function MitraDashboard() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: mitra } = await supabase
    .from('mitra')
    .select('*')
    .eq('user_id', user.id)
    .single()

  if (!mitra) redirect('/login')

  const tier = mitra.subscription_tier as SubscriptionTier

  const now = new Date()
  const firstOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0]

  // This month collections
  const { data: thisMonthCollections } = await supabase
    .from('waste_collections')
    .select('*')
    .eq('mitra_id', mitra.id)
    .gte('collection_date', firstOfMonth)
    .order('collection_date', { ascending: false })

  const totalThisMonth = (thisMonthCollections || []).reduce((s, c) => s + Number(c.weight_kg), 0)
  const pickupCount    = (thisMonthCollections || []).length
  const lastPickup     = thisMonthCollections?.[0]

  // Recent collections (last 5)
  const { data: recentCollections } = await supabase
    .from('waste_collections')
    .select('*')
    .eq('mitra_id', mitra.id)
    .order('collection_date', { ascending: false })
    .limit(5)

  // Bioconversion this month (growth+)
  let maggotThisMonth = 0
  let kasgotThisMonth = 0
  if (tier !== 'starter') {
    const { data: bioData } = await supabase
      .from('bioconversions')
      .select('maggot_kg, kasgot_kg')
      .eq('mitra_id', mitra.id)
      .gte('conversion_date', firstOfMonth)
    maggotThisMonth = (bioData || []).reduce((s, b) => s + Number(b.maggot_kg), 0)
    kasgotThisMonth = (bioData || []).reduce((s, b) => s + Number(b.kasgot_kg), 0)
  }

  // Monthly trend last 6 months (impact+)
  let monthlyTrend: { month: string; total: number }[] = []
  if (tier === 'impact') {
    const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 5, 1).toISOString().split('T')[0]
    const { data: trendData } = await supabase
      .from('waste_collections')
      .select('collection_date, weight_kg')
      .eq('mitra_id', mitra.id)
      .gte('collection_date', sixMonthsAgo)

    const grouped: Record<string, number> = {}
    ;(trendData || []).forEach(c => {
      const key = c.collection_date.slice(0, 7)
      grouped[key] = (grouped[key] || 0) + Number(c.weight_kg)
    })
    monthlyTrend = Object.entries(grouped)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([key, total]) => {
        const [yr, mo] = key.split('-')
        return { month: MONTHS_ID[parseInt(mo) - 1] + ' ' + yr, total }
      })
  }

  const co2Avoided = Math.round(totalThisMonth * 0.7)
  const maxBar     = Math.max(...monthlyTrend.map(m => m.total), 1)

  return (
    <div className="page-enter">
      {/* Header */}
      <div className="flex items-start justify-between mb-6 flex-wrap gap-3">
        <div>
          <h1 className="text-xl font-semibold text-stone-800">{mitra.business_name}</h1>
          <p className="text-sm text-stone-400 mt-0.5">
            Overview · {MONTHS_ID[now.getMonth()]} {now.getFullYear()}
          </p>
        </div>
        <TierBadge tier={tier} size="md" />
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
        <StatCard
          label="Total limbah bulan ini"
          value={formatWeight(totalThisMonth)}
          icon={<Package size={16} />}
          badge={totalThisMonth > 0 ? <span className="badge-sage text-xs">Bulan berjalan</span> : undefined}
        />
        <StatCard
          label="Jumlah pickup"
          value={pickupCount}
          sub="Kali pengambilan"
          icon={<TrendingUp size={16} />}
        />
        <StatCard
          label="Pickup terakhir"
          value={lastPickup ? formatDate(lastPickup.collection_date) : '—'}
          badge={lastPickup ? <StatusBadge status={lastPickup.status} /> : undefined}
          icon={<Calendar size={16} />}
        />
      </div>

      {/* Conversion stats (growth+) */}
      {tier !== 'starter' && (
        <div className="grid grid-cols-2 gap-4 mb-6">
          <StatCard
            label="Maggot dihasilkan"
            value={formatWeight(maggotThisMonth)}
            sub={`dari ${formatWeight(totalThisMonth)} limbah`}
            highlight
          />
          <StatCard
            label="Kasgot dihasilkan"
            value={formatWeight(kasgotThisMonth)}
            sub={`dari ${formatWeight(totalThisMonth)} limbah`}
            highlight
          />
        </div>
      )}

      {/* ESG quick view (growth+) */}
      {tier !== 'starter' && (
        <div className="card mb-6">
          <div className="flex items-center justify-between mb-3">
            <h2 className="section-title">CO₂ dihindari bulan ini</h2>
            <span className="badge-sage">{formatWeight(co2Avoided)} CO₂</span>
          </div>
          <div className="bg-stone-50 rounded-xl p-4">
            <div className="flex items-center gap-3">
              <div className="flex-1 bg-stone-200 rounded-full h-2 overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-sage-300 to-sage-500 transition-all duration-500"
                  style={{ width: `${Math.min((totalThisMonth / 1000) * 100, 100)}%` }}
                />
              </div>
              <span className="text-xs text-stone-500 shrink-0">{formatWeight(totalThisMonth)} dialihkan dari TPA</span>
            </div>
          </div>
        </div>
      )}

      {/* Insight chart (impact only) */}
      {tier === 'impact' && monthlyTrend.length > 0 && (
        <div className="card mb-6">
          <h2 className="section-title mb-4">Tren volume 6 bulan terakhir</h2>
          <div className="flex items-end gap-2 h-32">
            {monthlyTrend.map((m, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-1">
                <span className="text-[10px] text-stone-500">{formatWeight(m.total)}</span>
                <div
                  className="w-full rounded-t-md bg-gold-200 hover:bg-gold-400 transition-colors"
                  style={{ height: `${(m.total / maxBar) * 80}px`, minHeight: 4 }}
                  title={`${m.month}: ${formatWeight(m.total)}`}
                />
                <span className="text-[10px] text-stone-400">{m.month.split(' ')[0]}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Locked sections */}
      {tier === 'starter' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <LockedSection
            title="Hasil konversi"
            description="Data maggot & kasgot tersedia untuk tier Growth ke atas"
            requiredTier="growth"
          />
          <LockedSection
            title="ESG metrics"
            description="Laporan dampak ESG tersedia untuk tier Growth ke atas"
            requiredTier="growth"
          />
        </div>
      )}
      {tier === 'growth' && (
        <div className="mb-6">
          <LockedSection
            title="Insight mendalam & analitik lanjutan"
            description="Tren bulanan, proyeksi, dan analitik lanjutan tersedia untuk tier Impact"
            requiredTier="impact"
          />
        </div>
      )}

      {/* Recent collections */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h2 className="section-title">Pengumpulan terbaru</h2>
          <a href="/dashboard/mitra/riwayat" className="text-xs text-gold-600 hover:text-gold-700">
            Lihat semua →
          </a>
        </div>
        {(recentCollections || []).length === 0 ? (
          <p className="text-sm text-stone-400 py-4 text-center">Belum ada data pengumpulan</p>
        ) : (
          <div className="table-wrapper">
            <table className="table">
              <thead>
                <tr>
                  <th>Tanggal</th>
                  <th>Berat</th>
                  <th>Catatan</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {(recentCollections as WasteCollection[]).map(c => (
                  <tr key={c.id}>
                    <td className="font-medium">{formatDate(c.collection_date)}</td>
                    <td>{formatWeight(Number(c.weight_kg))}</td>
                    <td className="text-stone-400 text-xs">{c.notes || '—'}</td>
                    <td><StatusBadge status={c.status} /></td>
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
