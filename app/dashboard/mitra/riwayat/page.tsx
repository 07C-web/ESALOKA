import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { formatWeight, formatDate, MONTHS_ID } from '@/lib/utils'
import { WasteCollection } from '@/types'

export default async function MitraRiwayatPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: mitra } = await supabase
    .from('mitra').select('id, business_name').eq('user_id', user.id).single()
  if (!mitra) redirect('/login')

  const now = new Date()
  const { data: collections } = await supabase
    .from('waste_collections')
    .select('*')
    .eq('mitra_id', mitra.id)
    .order('collection_date', { ascending: false })

  const byMonth: Record<string, WasteCollection[]> = {}
  ;(collections || []).forEach((c: any) => {
    const key = c.collection_date.slice(0, 7)
    if (!byMonth[key]) byMonth[key] = []
    byMonth[key].push(c)
  })

  return (
    <div className="page-enter">
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-stone-800">Riwayat pengumpulan</h1>
        <p className="text-sm text-stone-400 mt-0.5">Semua data pengumpulan limbah · {mitra.business_name}</p>
      </div>

      {Object.keys(byMonth).length === 0 && (
        <div className="card text-center py-16">
          <p className="text-stone-400 text-sm">Belum ada riwayat pengumpulan</p>
        </div>
      )}

      {Object.entries(byMonth).map(([key, items]) => {
        const [yr, mo] = key.split('-')
        const label = `${MONTHS_ID[parseInt(mo) - 1]} ${yr}`
        const total = items.reduce((s, c) => s + Number(c.weight_kg), 0)
        return (
          <div key={key} className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-semibold text-stone-700">{label}</h2>
              <span className="badge-gold badge">{formatWeight(total)}</span>
            </div>
            <div className="card p-0 overflow-hidden">
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
                  {items.map(c => (
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
          </div>
        )
      })}
    </div>
  )
}
