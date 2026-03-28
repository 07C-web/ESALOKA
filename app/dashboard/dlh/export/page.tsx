import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { formatWeight, MONTHS_ID } from '@/lib/utils'
import Link from 'next/link'

export default async function DLHExportPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('user_profiles').select('role').eq('id', user.id).single()
  if (profile?.role !== 'dlh' && profile?.role !== 'admin') redirect('/dashboard/mitra')

  const now = new Date()
  const firstOfYear = `${now.getFullYear()}-01-01`

  // YTD by month
  const { data: monthlyData } = await supabase
    .from('monthly_recap').select('*').gte('month_start', firstOfYear).order('month_start')

  // Tier distribution
  const { data: tierData } = await supabase
    .from('mitra').select('subscription_tier').eq('is_active', true)
  const tierCount = { starter: 0, growth: 0, impact: 0 }
  ;(tierData || []).forEach((m: any) => { if (m.subscription_tier in tierCount) (tierCount as any)[m.subscription_tier]++ })
  const totalMitra = (tierData || []).length

  const months    = (monthlyData || [])
  const maxWaste  = Math.max(...months.map(m => Number(m.total_waste_kg)), 1)
  const ytdTotal  = months.reduce((s, m) => s + Number(m.total_waste_kg), 0)

  return (
    <div className="page-enter">
      <div className="flex items-start justify-between mb-6 flex-wrap gap-3">
        <div>
          <h1 className="text-xl font-semibold text-stone-800">Analytics & Export</h1>
          <p className="text-sm text-stone-400 mt-0.5">Data pengelolaan wilayah Parepare · {now.getFullYear()}</p>
        </div>
        <div className="flex gap-2">
          <button className="btn-secondary text-xs py-2 px-3">Export CSV</button>
          <button className="btn-primary text-xs py-2 px-3">Export PDF Laporan</button>
        </div>
      </div>

      {/* Growth chart */}
      <div className="card mb-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="section-title mb-0">Pertumbuhan volume limbah {now.getFullYear()}</h2>
          <span className="badge badge-sage text-xs">{formatWeight(ytdTotal)} YTD</span>
        </div>
        {months.length === 0 ? (
          <p className="text-sm text-stone-400 text-center py-8">Belum ada data tahun ini</p>
        ) : (
          <div className="flex items-end gap-2 h-40">
            {months.map((m: any, i) => {
              const val = Number(m.total_waste_kg)
              const isLast = i === months.length - 1
              const prev = months[i - 1] ? Number(months[i - 1].total_waste_kg) : 0
              const growth = prev > 0 ? Math.round(((val - prev) / prev) * 100) : null
              return (
                <div key={i} className="flex-1 flex flex-col items-center gap-1.5 min-w-0">
                  <div className="text-[9px] text-stone-400 text-center">
                    {growth !== null && (
                      <span className={growth >= 0 ? 'text-sage-600' : 'text-red-400'}>
                        {growth >= 0 ? '+' : ''}{growth}%
                      </span>
                    )}
                  </div>
                  <div
                    className={`w-full rounded-t-md transition-all ${isLast ? 'bg-gold-400' : 'bg-sage-300'} hover:opacity-80`}
                    style={{ height: `${Math.max((val / maxWaste) * 130, 4)}px` }}
                    title={`${m.month_label}: ${formatWeight(val)}`}
                  />
                  <span className="text-[9px] text-stone-400 truncate w-full text-center">
                    {MONTHS_ID[(m.month_number || 1) - 1]}
                  </span>
                </div>
              )
            })}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
        {/* Tier distribution */}
        <div className="card">
          <h2 className="section-title mb-4">Distribusi jenis mitra</h2>
          <div className="flex flex-col gap-3">
            {[
              { key: 'starter', label: 'Starter Partner', color: 'bg-sage-300' },
              { key: 'growth',  label: 'Growth Partner',  color: 'bg-gold-300' },
              { key: 'impact',  label: 'Impact Partner',  color: 'bg-gold-500' },
            ].map(t => {
              const count = (tierCount as any)[t.key] || 0
              const pct   = totalMitra > 0 ? Math.round((count / totalMitra) * 100) : 0
              return (
                <div key={t.key}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-stone-600">{t.label}</span>
                    <span className="font-medium text-stone-700">{count} bisnis ({pct}%)</span>
                  </div>
                  <div className="w-full bg-stone-100 rounded-full h-2 overflow-hidden">
                    <div className={`h-full rounded-full ${t.color} transition-all`} style={{ width: `${pct}%` }} />
                  </div>
                </div>
              )
            })}
            <div className="pt-2 border-t border-stone-100 flex justify-between text-sm">
              <span className="text-stone-500">Total mitra aktif</span>
              <span className="font-semibold text-stone-700">{totalMitra} bisnis</span>
            </div>
          </div>
        </div>

        {/* Export options */}
        <div className="card">
          <h2 className="section-title mb-4">Pilihan export laporan</h2>
          <div className="flex flex-col gap-3">
            {[
              { title: 'Laporan bulanan (PDF)',       desc: 'Ringkasan per bulan, siap dilampirkan ke laporan DLH', btn: 'Export PDF' },
              { title: 'Data mentah (CSV)',            desc: 'Semua data koleksi dalam format spreadsheet', btn: 'Export CSV' },
              { title: 'Laporan tahunan (PDF)',        desc: 'Rekap penuh tahun berjalan dengan grafik', btn: 'Export PDF' },
              { title: 'Data per mitra (CSV)',         desc: 'Breakdown volume per bisnis HoReCa', btn: 'Export CSV' },
            ].map((item, i) => (
              <div key={i} className="flex items-center justify-between gap-3 p-3 rounded-xl bg-stone-50 border border-stone-100">
                <div>
                  <p className="text-sm font-medium text-stone-700">{item.title}</p>
                  <p className="text-xs text-stone-400">{item.desc}</p>
                </div>
                <button className="btn-secondary text-xs py-1.5 px-3 shrink-0">{item.btn}</button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Detailed table */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h2 className="section-title mb-0">Tabel rincian bulanan {now.getFullYear()}</h2>
          <Link href="/dashboard/dlh" className="text-xs text-gold-600 hover:text-gold-700">
            ← Kembali ke rekapitulasi
          </Link>
        </div>
        <div className="table-wrapper">
          <table className="table">
            <thead>
              <tr>
                <th>Bulan</th>
                <th>Volume (Kg)</th>
                <th>Jumlah mitra</th>
                <th>Jumlah pickup</th>
                <th>Pertumbuhan</th>
              </tr>
            </thead>
            <tbody>
              {months.map((row: any, i: number) => {
                const prev = months[i - 1]
                const growth = prev
                  ? Math.round(((Number(row.total_waste_kg) - Number(prev.total_waste_kg)) / Number(prev.total_waste_kg)) * 100)
                  : null
                return (
                  <tr key={i}>
                    <td className="font-medium">{row.month_label}</td>
                    <td className="font-semibold text-stone-800">{Number(row.total_waste_kg).toLocaleString('id-ID')} Kg</td>
                    <td>{row.mitra_count}</td>
                    <td>{row.pickup_count} kali</td>
                    <td>
                      {growth !== null ? (
                        <span className={`badge text-xs ${growth >= 0 ? 'badge-sage' : 'bg-red-50 text-red-600'}`}>
                          {growth >= 0 ? '+' : ''}{growth}%
                        </span>
                      ) : <span className="text-stone-300 text-xs">—</span>}
                    </td>
                  </tr>
                )
              })}
              {months.length === 0 && (
                <tr><td colSpan={5} className="text-center text-stone-400 py-8">Belum ada data tahun ini</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
