'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { formatDate, formatWeight } from '@/lib/utils'
import { CheckCircle, Loader2, Bug } from 'lucide-react'

export default function AdminBioconversionPage() {
  const supabase = createClient()
  const [collections, setCollections] = useState<any[]>([])
  const [recent, setRecent]           = useState<any[]>([])
  const [loading, setLoading]         = useState(false)
  const [success, setSuccess]         = useState(false)
  const [error, setError]             = useState<string | null>(null)

  const [form, setForm] = useState({
    collection_id: '',
    mitra_id: '',
    maggot_kg: '',
    kasgot_kg: '',
    conversion_date: new Date().toISOString().split('T')[0],
  })

  useEffect(() => { loadData() }, [])

  async function loadData() {
    // Collections that don't have a bioconversion yet (status = processed)
    const { data: cols } = await supabase
      .from('waste_collections')
      .select('*, mitra:mitra_id(business_name)')
      .eq('status', 'processed')
      .order('collection_date', { ascending: false })
      .limit(50)
    setCollections(cols || [])

    const { data: rec } = await supabase
      .from('bioconversions')
      .select('*, mitra:mitra_id(business_name), collection:collection_id(collection_date, weight_kg)')
      .order('created_at', { ascending: false })
      .limit(8)
    setRecent(rec || [])
  }

  function handleCollectionChange(collectionId: string) {
    const col = collections.find(c => c.id === collectionId)
    if (col) {
      // Auto-suggest: maggot ~15%, kasgot ~6.5% of waste weight
      const weight = Number(col.weight_kg)
      setForm(f => ({
        ...f,
        collection_id: collectionId,
        mitra_id: col.mitra_id,
        maggot_kg: (weight * 0.15).toFixed(2),
        kasgot_kg: (weight * 0.065).toFixed(2),
      }))
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setSuccess(false)

    const { error: insertErr } = await supabase.from('bioconversions').insert([{
      collection_id:   form.collection_id,
      mitra_id:        form.mitra_id,
      maggot_kg:       parseFloat(form.maggot_kg),
      kasgot_kg:       parseFloat(form.kasgot_kg),
      conversion_date: form.conversion_date,
    }])

    if (insertErr) {
      setError('Gagal menyimpan data biokonversi.')
      setLoading(false)
      return
    }

    // Update collection status to converted
    await supabase.from('waste_collections')
      .update({ status: 'converted' })
      .eq('id', form.collection_id)

    setLoading(false)
    setSuccess(true)
    setForm(f => ({ ...f, collection_id: '', mitra_id: '', maggot_kg: '', kasgot_kg: '' }))
    await loadData()
    setTimeout(() => setSuccess(false), 3000)
  }

  return (
    <div className="page-enter">
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-stone-800">Input biokonversi</h1>
        <p className="text-sm text-stone-400 mt-0.5">Catat hasil konversi maggot & kasgot dari limbah yang diproses</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">

        {/* Form */}
        <div className="lg:col-span-2">
          <div className="card">
            <div className="flex items-center gap-2 mb-4">
              <Bug size={18} className="text-gold-400" />
              <h2 className="section-title mb-0">Form input konversi</h2>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div>
                <label className="label">Pilih koleksi limbah (status: Processed)</label>
                <select className="select" required
                  value={form.collection_id}
                  onChange={e => handleCollectionChange(e.target.value)}>
                  <option value="">Pilih koleksi...</option>
                  {collections.map(c => (
                    <option key={c.id} value={c.id}>
                      {c.mitra?.business_name} — {formatWeight(Number(c.weight_kg))} ({formatDate(c.collection_date)})
                    </option>
                  ))}
                </select>
                {collections.length === 0 && (
                  <p className="text-xs text-stone-400 mt-1">Tidak ada koleksi dengan status "Processed". Update status koleksi di halaman Input Data.</p>
                )}
              </div>

              <div>
                <label className="label">Tanggal konversi</label>
                <input type="date" className="input" required
                  value={form.conversion_date}
                  onChange={e => setForm(f => ({ ...f, conversion_date: e.target.value }))} />
              </div>

              <div className="bg-gold-50 border border-gold-200 rounded-xl p-3">
                <p className="text-xs text-gold-700 font-medium mb-1">Nilai otomatis disarankan</p>
                <p className="text-xs text-gold-600">Berdasarkan rasio konversi rata-rata: Maggot 15%, Kasgot 6.5% dari berat limbah</p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="label">Maggot dihasilkan (Kg)</label>
                  <input type="number" className="input" placeholder="0.00" step="0.01" min="0" required
                    value={form.maggot_kg}
                    onChange={e => setForm(f => ({ ...f, maggot_kg: e.target.value }))} />
                </div>
                <div>
                  <label className="label">Kasgot dihasilkan (Kg)</label>
                  <input type="number" className="input" placeholder="0.00" step="0.01" min="0" required
                    value={form.kasgot_kg}
                    onChange={e => setForm(f => ({ ...f, kasgot_kg: e.target.value }))} />
                </div>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-100 rounded-xl px-4 py-3">
                  <p className="text-sm text-red-600">{error}</p>
                </div>
              )}
              {success && (
                <div className="bg-sage-50 border border-sage-200 rounded-xl px-4 py-3 flex items-center gap-2">
                  <CheckCircle size={16} className="text-sage-500 shrink-0" />
                  <p className="text-sm text-sage-700">Data biokonversi berhasil disimpan. Status koleksi diupdate ke Converted.</p>
                </div>
              )}

              <button type="submit" disabled={loading || !form.collection_id}
                className="btn-primary flex items-center justify-center gap-2">
                {loading && <Loader2 size={16} className="animate-spin" />}
                {loading ? 'Menyimpan...' : 'Simpan hasil konversi'}
              </button>
            </form>
          </div>
        </div>

        {/* Recent */}
        <div className="lg:col-span-3">
          <div className="card">
            <h2 className="section-title mb-4">Riwayat biokonversi terbaru</h2>
            <div className="table-wrapper">
              <table className="table">
                <thead>
                  <tr>
                    <th>Mitra</th>
                    <th>Tgl konversi</th>
                    <th>Maggot</th>
                    <th>Kasgot</th>
                    <th>Limbah asal</th>
                  </tr>
                </thead>
                <tbody>
                  {recent.map((b: any) => (
                    <tr key={b.id}>
                      <td className="font-medium text-sm">{b.mitra?.business_name || '—'}</td>
                      <td className="text-xs text-stone-400">{formatDate(b.conversion_date)}</td>
                      <td><span className="badge badge-gold text-xs">{formatWeight(Number(b.maggot_kg))}</span></td>
                      <td><span className="badge badge-sage text-xs">{formatWeight(Number(b.kasgot_kg))}</span></td>
                      <td className="text-xs text-stone-400">
                        {b.collection ? formatWeight(Number(b.collection.weight_kg)) : '—'}
                      </td>
                    </tr>
                  ))}
                  {recent.length === 0 && (
                    <tr><td colSpan={5} className="text-center text-stone-400 py-8">Belum ada data biokonversi</td></tr>
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
