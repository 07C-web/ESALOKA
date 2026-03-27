import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { StatCard } from '@/components/ui/StatCard'
import { TierBadge } from '@/components/ui/TierBadge'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { formatWeight, formatDate, MONTHS_ID } from '@/lib/utils'
import { SubscriptionTier, CollectionStatus } from '@/types'
import Link from 'next/link'
import { Users, Package, ArrowUpRight } from 'lucide-react'

export default async function AdminDashboard() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('user_profiles').select('role').eq('id', user.id).single()
  if (profile?.role !== 'admin') redirect('/dashboard/mitra')

  const now = new Date()
  const firstOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0]

  // Global stats
  const { data: globalStats } = await supabase.from('global_stats').select('*').single()

  // This month collections
  const { data: thisMonthCollections } = await supabase
    .from('waste_collections')
    .select('weight_kg')
    .gte('collection_date', firstOfMonth)
  const totalThisMonth = (thisMonthCollections || []).reduce((s, c) => s + Number(c.weight_kg), 0)

  // Previous month
  const firstOfPrevMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1).toISOString().split('T')[0]
  const { data: prevMonthCollections } = await supabase
    .from('waste_collections')
    .select('weight_kg')
    .gte('collection_date', firstOfPrevMonth)
    .lt('collection_date', firstOfMonth)
  const totalPrevMonth = (prevMonthCollections || []).reduce((s, c) => s + Number(c.weight_kg), 0)
  const growthPct = totalPrevMonth > 0
    ? Math.round(((totalThisMonth - totalPrevMonth) / totalPrevMonth) * 100)
    : 0

  // Top mitra this month
  const { data: topMitraRaw } = await supabase
    .from('waste_collections')
    .select('mitra_id, weight_kg, mitra:mitra_id(business_name, subscription_tier)')
    .gte('collection_date', firstOfMonth)
  const topMap: Record<string, { name: string; tier: SubscriptionTier; total: number }> = {}
  ;(topMitraRaw || []).forEach((c: any) => {
    const id = c.mitra_id
    if (!topMap[id]) topMap[id] = { name: c.mitra?.business_name || '—', tier: c.mitra?.subscription_tier, total: 0 }
    topMap[id].total += Number(c.weight_kg)
  })
  const topMitra = Object.values(topMap).sort((a, b) => b.total - a.total).slice(0, 5)

  // Recent input data
  const { data: recentInputs } = await supabase
    .from('waste_collections')
    .select('*, mitra:mitra_id(business_name), operator:operator_id(full_name)')
    .order('created_at', { ascending: false })
    .limit(6)

  // Tier distribution
  const { data: tierDist } = await supabase
    .from('mitra')
    .select('subscription_tier')
    .eq('is_active', true)
  const tierCount = { starter: 0, growth: 0, impact: 0 }
  ;(tierDist || []).forEach(m => {
    if (m.subscription_tier in tierCount) tierCount[m.subscription_tier as SubscriptionTier]++
  })
  const totalMitra = tierDist?.length || 0

  // Unread inbox
  const { count: unreadCount } = await supabase
    .from('contact_messages')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'baru')

  // Recent inbox
  const { data: recentInbox } = await supabase
    .from('contact_messages')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(4)

  const tierOrder: SubscriptionTier[] = ['starter', 'growth', 'impact']
  const tierLabel: Record<SubscriptionTier, string> = {
    starter: 'Starter Partner',
    growth: 'Growth Partner',
    impact: 'Impact Partner',
  }
  const tierBarColors: Record<SubscriptionTier, string> = {
    starter: 'bg-sage-300',
    growth: 'bg-gold-300',
    impact: 'bg-gold-500',
  }

  return (
    <div className="page-enter">
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-stone-800">Overview global</h1>
        <p className="text-sm text-stone-400 mt-0.5">
          Semua data operasional · {MONTHS_ID[now.getMonth()]} {now.getFullYear()}
        </p>
      </div>

      {/* Top stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <StatCard
          label="Limbah bulan ini"
          value={formatWeight(totalThisMonth)}
          badge={
            <span className={`badge text-xs ${growthPct >= 0 ? 'badge-sage' : 'bg-red-50 text-red-600'}`}>
              {growthPct >= 0 ? '+' : ''}{growthPct}% vs bulan lalu
            </span>
          }
        />
        <StatCard
          label="Total mitra aktif"
          value={totalMitra}
          sub="Bisnis HoReCa"
          icon={<Users size={16} />}
        />
        <StatCard
          label="Total maggot"
          value={formatWeight(Number(globalStats?.total_maggot_kg || 0))}
          sub="Kumulatif semua waktu"
          icon={<Package size={16} />}
        />
        <StatCard
          label="CO₂ dihindari"
          value={formatWeight(Number(globalStats?.co2_avoided_kg || 0))}
          sub="Kumulatif semua waktu"
          highlight
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Left column */}
        <div className="flex flex-col gap-5">

          {/* Top mitra */}
          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <h2 className="section-title">Top kontributor bulan ini</h2>
              <Link href="/dashboard/admin/mitra" className="text-xs text-gold-600 hover:text-gold-700 flex items-center gap-1">
                Semua mitra <ArrowUpRight size={12} />
              </Link>
            </div>
            {topMitra.length === 0 ? (
              <p className="text-sm text-stone-400 text-center py-4">Belum ada data bulan ini</p>
            ) : (
              <div className="flex flex-col gap-2">
                {topMitra.map((m, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <span className={`text-xs font-bold w-5 ${i === 0 ? 'text-gold-500' : 'text-stone-300'}`}>
                      {i + 1}
                    </span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-medium text-stone-700 truncate">{m.name}</span>
                        {m.tier && <TierBadge tier={m.tier} />}
                      </div>
                      <div className="w-full bg-stone-100 rounded-full h-1.5 overflow-hidden">
                        <div
                          className="h-full rounded-full bg-gold-300"
                          style={{ width: `${(m.total / (topMitra[0]?.total || 1)) * 100}%` }}
                        />
                      </div>
                    </div>
                    <span className="text-sm font-medium text-stone-600 shrink-0">{formatWeight(m.total)}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Tier distribution */}
          <div className="card">
            <h2 className="section-title mb-4">Distribusi tier mitra</h2>
            <div className="flex flex-col gap-3">
              {tierOrder.map(t => {
                const count = tierCount[t]
                const pct = totalMitra > 0 ? Math.round((count / totalMitra) * 100) : 0
                return (
                  <div key={t}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-stone-600">{tierLabel[t]}</span>
                      <span className="font-medium text-stone-700">{count} mitra</span>
                    </div>
                    <div className="w-full bg-stone-100 rounded-full h-2 overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all ${tierBarColors[t]}`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* Right column */}
        <div className="flex flex-col gap-5">

          {/* Recent inputs */}
          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <h2 className="section-title">Input data terbaru</h2>
              <Link href="/dashboard/admin/input" className="text-xs text-gold-600 hover:text-gold-700 flex items-center gap-1">
                Input baru <ArrowUpRight size={12} />
              </Link>
            </div>
            <div className="table-wrapper">
              <table className="table">
                <thead>
                  <tr>
                    <th>Mitra</th>
                    <th>Berat</th>
                    <th>Operator</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {(recentInputs || []).map((c: any) => (
                    <tr key={c.id}>
                      <td className="font-medium text-sm">{c.mitra?.business_name || '—'}</td>
                      <td>{formatWeight(Number(c.weight_kg))}</td>
                      <td className="text-stone-400 text-xs">{c.operator?.full_name || '—'}</td>
                      <td><StatusBadge status={c.status as CollectionStatus} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Inbox preview */}
          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <h2 className="section-title mb-0">Inbox get in touch</h2>
                {(unreadCount || 0) > 0 && (
                  <span className="w-5 h-5 rounded-full bg-gold-400 text-white text-[10px] font-bold flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </div>
              <Link href="/dashboard/admin/inbox" className="text-xs text-gold-600 hover:text-gold-700 flex items-center gap-1">
                Semua pesan <ArrowUpRight size={12} />
              </Link>
            </div>
            <div className="flex flex-col gap-2">
              {(recentInbox || []).map((msg: any) => (
                <div key={msg.id} className="flex items-start justify-between gap-3 p-3 rounded-xl bg-stone-50 hover:bg-stone-100 transition-colors">
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-stone-700 truncate">{msg.sender_name}</p>
                    <p className="text-xs text-stone-400 truncate mt-0.5">{msg.message}</p>
                  </div>
                  <span className={`badge shrink-0 text-[10px] ${msg.status === 'baru' ? 'badge-gold' : 'badge-gray'}`}>
                    {msg.status === 'baru' ? 'Baru' : msg.status === 'dibaca' ? 'Dibaca' : 'Ditindak'}
                  </span>
                </div>
              ))}
              {(recentInbox || []).length === 0 && (
                <p className="text-sm text-stone-400 text-center py-4">Belum ada pesan masuk</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
