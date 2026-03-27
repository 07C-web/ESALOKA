'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { TierBadge } from '@/components/ui/TierBadge'
import { formatWeight, formatDate } from '@/lib/utils'
import { CollectionStatus, SubscriptionTier } from '@/types'
import { Loader2, CheckCircle } from 'lucide-react'

interface MitraOption { id: string; business_name: string; subscription_tier: SubscriptionTier }

export default function InputDataPage() {
  const supabase = createClient()

  const [mitraList, setMitraList]   = useState<MitraOption[]>([])
  const [recentData, setRecentData] = useState<any[]>([])
  const [loading, setLoading]       = useState(false)
  const [success, setSuccess]       = useState(false)
  const [error, setError]           = useState<string | null>(null)

  const [form, setForm] = useState({
    mitra_id: '',
    weight_kg: '',
    collection_date: new Date().toISOString().split('T')[0],
    status: 'collected' as CollectionStatus,
    notes: '',
  })

  useEffect(() => {
    async function load() {
      const { data: mitra } = await supabase
        .from('mitra').select('id, business_name, subscription_tier').eq('is_active', true).order('business_name')
      setMitraList(mitra || [])

      await refreshRecent()
    }
    load()
  }, [])

  async function refreshRecent() {
    const { data } = await supabase
      .from('waste_collections')
      .select('*, mitra:mitra_id(business_name), operator:operator_id(full_name)')
      .order('created_at', { ascending: false })
      .limit(8)
    setRecentData(data || [])
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setSuccess(false)

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { setError('Sesi habis, silakan login ulang.'); setLoading(false); return }

    const { error: insertError } = await supabase.from('waste_collections').insert([{
      mitra_id:        form.mitra_id,
      operator_id:     user.id,
      weight_kg:       parseFloat(form.weight_kg),
      collection_date: form.collection_date,
      status:          form.status,
      notes:           form.notes || null,
    }])

    setLoading(false)
    if (insertError) {
      setError('Gagal menyimpan data. Pastikan semua field terisi dengan benar.')
    } else {
      setSuccess(true)
      setForm(f => ({ ...f, mitra_id: '', weight_kg: '', notes: '' }))
      await refreshRecent()
      setTimeout(() => setSuccess(false), 3000)
    }
  }

  return (
    <div className="page-enter">
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-stone-800">Input data operator</h1>
        <p className="text-sm text-stone-400 mt-0.5">Catat hasil pengumpulan limbah dari mitra</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">

        {/* Form */}
        <div className="lg:col-span-2">
          <div className="card">
            <h2 className="section-title mb-4">Form input pengumpulan</h2>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">

              <div>
                <label className="label">Mitra</label>
                <select className="select" required
                  value={form.mitra_id}
                  onChange={e => setForm(f => ({ ...f, mitra_id: e.target.value }))}>
                  <option value="">Pilih mitra...</option>
                  {mitraList.map(m => (
                    <option key={m.id} value={m.id}>{m.business_name}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="label">Berat (Kg)</label>
                  <input type="number" className="input" placeholder="0.00" step="0.01" min="0.1" required
                    value={form.weight_kg}
                    onChange={e => setForm(f => ({ ...f, weight_kg: e.target.value }))} />
                </div>
                <div>
                  <label className="label">Tanggal</label>
                  <input type="date" className="input" required
                    value={form.collection_date}
                    onChange={e => setForm(f => ({ ...f, collection_date: e.target.value }))} />
                </div>
              </div>

              <div>
                <label className="label">Status</label>
                <select className="select"
                  value={form.status}
                  onChange={e => setForm(f => ({ ...f, status: e.target.value as CollectionStatus }))}>
                  <option value="collected">Collected</option>
                  <option value="processed">Processed</option>
                  <option value="converted">Converted</option>
                </select>
              </div>

              <div>
                <label className="label">Catatan (opsional)</label>
                <textarea className="textarea" placeholder="Catatan tambahan..." style={{ minHeight: 72 }}
                  value={form.notes}
                  onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} />
              </div>

              {error && (
                <div className="bg-red-50 border border-red-100 rounded-xl px-4 py-3">
                  <p className="text-sm text-red-600">{error}</p>
                </div>
              )}

              {success && (
                <div className="bg-sage-50 border border-sage-200 rounded-xl px-4 py-3 flex items-center gap-2">
                  <CheckCircle size={16} className="text-sage-500 shrink-0" />
                  <p className="text-sm text-sage-700">Data berhasil disimpan dan dipublish ke dashboard mitra.</p>
                </div>
              )}

              <button type="submit" disabled={loading}
                className="btn-primary flex items-center justify-center gap-2">
                {loading && <Loader2 size={16} className="animate-spin" />}
                {loading ? 'Menyimpan...' : 'Simpan & publish'}
              </button>
            </form>
          </div>
        </div>

        {/* Recent entries */}
        <div className="lg:col-span-3">
          <div className="card">
            <h2 className="section-title mb-4">Entri terbaru</h2>
            <div className="table-wrapper">
              <table className="table">
                <thead>
                  <tr>
                    <th>Mitra</th>
                    <th>Berat</th>
                    <th>Tanggal</th>
                    <th>Operator</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {recentData.map((c: any) => (
                    <tr key={c.id}>
                      <td className="font-medium text-sm">{c.mitra?.business_name || '—'}</td>
                      <td>{formatWeight(Number(c.weight_kg))}</td>
                      <td className="text-stone-400 text-xs">{formatDate(c.collection_date)}</td>
                      <td className="text-stone-400 text-xs">{c.operator?.full_name || '—'}</td>
                      <td><StatusBadge status={c.status as CollectionStatus} /></td>
                    </tr>
                  ))}
                  {recentData.length === 0 && (
                    <tr><td colSpan={5} className="text-center text-stone-400 py-6">Belum ada data</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
