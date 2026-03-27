import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { StatCard } from '@/components/ui/StatCard'
import { formatWeight, MONTHS_ID } from '@/lib/utils'

export default async function DLHDashboard() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('user_profiles').select('role').eq('id', user.id).single()
  if (profile?.role !== 'dlh' && profile?.role !== 'admin') redirect('/dashboard/mitra')

  // Monthly recap
  const { data: recap } = await supabase
    .from('monthly_recap')
    .select('*')
    .order('month_start', { ascending: false })
    .limit(12)

  const now = new Date()
  const ytdStart = `${now.getFullYear()}-01-01`
  const { data: ytdData } = await supabase
    .from('waste_collections')
    .select('weight_kg')
    .gte('collection_date', ytdStart)
  const ytdTotal = (ytdData || []).reduce((s, c) => s + Number(c.weight_kg), 0)

  const { data: mitraCount } = await supabase
    .from('mitra').select('*', { count: 'exact', head: true }).eq('is_active', true)

  const months = (recap || []).slice(0, 8).reverse()
  const maxVal = Math.max(...months.map(m => Number(m.total_waste_kg)), 1)

  return (
    <div className="page-enter">
      <div className="flex items-start justify-between mb-6 flex-wrap gap-3">
        <div>
          <h1 className="text-xl font-semibold text-stone-800">Rekapitulasi limbah organik</h1>
          <p className="text-sm text-stone-400 mt-0.5">
            Data pengelolaan ESALOKA — Wilayah Parepare · Akses: View only
          </p>
        </div>
        <div className="flex gap-2">
          <button className="btn-secondary text-xs py-2 px-3">Export CSV</button>
          <button className="btn-primary text-xs py-2 px-3">Export PDF</button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <StatCard
          label={`Total tercollect (${now.getFullYear()})`}
          value={formatWeight(ytdTotal)}
          sub={`Jan — ${MONTHS_ID[now.getMonth()]} ${now.getFullYear()}`}
          highlight
        />
        <StatCard
          label="Mitra terdaftar"
          value={mitraCount?.length !== undefined ? String(mitraCount) : '—'}
          sub="Bisnis HoReCa aktif"
        />
        <StatCard
          label="Rata-rata per bulan"
          value={formatWeight(ytdTotal / Math.max(now.getMonth() + 1, 1))}
          sub="Tahun berjalan"
        />
      </div>

      {/* Bar chart */}
      <div className="card mb-6">
        <h2 className="section-title mb-5">Volume limbah per bulan (Kg)</h2>
        {months.length === 0 ? (
          <p className="text-sm text-stone-400 text-center py-8">Belum ada data</p>
        ) : (
          <div className="flex items-end gap-3 h-40">
            {months.map((m: any, i) => {
              const val = Number(m.total_waste_kg)
              const isLast = i === months.length - 1
              return (
                <div key={i} className="flex-1 flex flex-col items-center gap-1.5 min-w-0">
                  <span className="text-[10px] text-stone-500 font-medium">{formatWeight(val)}</span>
                  <div
                    title={`${m.month_label}: ${formatWeight(val)}`}
                    className={`w-full rounded-t-md transition-all ${isLast ? 'bg-gold-400' : 'bg-sage-300'} hover:opacity-80`}
                    style={{ height: `${Math.max((val / maxVal) * 100, 4)}%` }}
                  />
                  <span className="text-[10px] text-stone-400 truncate w-full text-center">
                    {MONTHS_ID[m.month_number - 1]}
                  </span>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Table */}
      <div className="card">
        <h2 className="section-title mb-4">Rincian per bulan</h2>
        <div className="table-wrapper">
          <table className="table">
            <thead>
              <tr>
                <th>Bulan</th>
                <th>Volume (Kg)</th>
                <th>Jumlah mitra</th>
                <th>Jumlah pickup</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {(recap || []).map((row: any, i: number) => (
                <tr key={i}>
                  <td className="font-medium">{row.month_label}</td>
                  <td className="font-semibold text-stone-800">{Number(row.total_waste_kg).toLocaleString('id-ID')} Kg</td>
                  <td>{row.mitra_count}</td>
                  <td>{row.pickup_count} kali</td>
                  <td>
                    <span className="badge badge-sage text-[10px]">Terverifikasi</span>
                  </td>
                </tr>
              ))}
              {(recap || []).length === 0 && (
                <tr>
                  <td colSpan={5} className="text-center text-stone-400 py-8">Belum ada data rekap</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
