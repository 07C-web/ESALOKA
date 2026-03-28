'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { TierBadge } from '@/components/ui/TierBadge'
import { formatDate, formatWeight } from '@/lib/utils'
import { SubscriptionTier } from '@/types'
import { Search, Users } from 'lucide-react'

export default function AdminMitraPage() {
  const supabase = createClient()
  const [mitra, setMitra]       = useState<any[]>([])
  const [search, setSearch]     = useState('')
  const [filter, setFilter]     = useState<string>('semua')
  const [loading, setLoading]   = useState(true)
  const [updating, setUpdating] = useState<string | null>(null)

  useEffect(() => { loadMitra() }, [])

  async function loadMitra() {
    const { data } = await supabase
      .from('mitra')
      .select('*, user:user_id(email)')
      .order('joined_at', { ascending: false })
    setMitra(data || [])
    setLoading(false)
  }

  async function updateTier(id: string, tier: SubscriptionTier) {
    setUpdating(id)
    await supabase.from('mitra').update({ subscription_tier: tier }).eq('id', id)
    setMitra(prev => prev.map(m => m.id === id ? { ...m, subscription_tier: tier } : m))
    setUpdating(null)
  }

  async function toggleActive(id: string, current: boolean) {
    setUpdating(id)
    await supabase.from('mitra').update({ is_active: !current }).eq('id', id)
    setMitra(prev => prev.map(m => m.id === id ? { ...m, is_active: !current } : m))
    setUpdating(null)
  }

  const filtered = mitra.filter(m => {
    const matchSearch = m.business_name.toLowerCase().includes(search.toLowerCase())
    const matchFilter = filter === 'semua' || m.subscription_tier === filter || (filter === 'nonaktif' && !m.is_active)
    return matchSearch && matchFilter
  })

  if (loading) return <div className="flex items-center justify-center h-64 text-stone-400 text-sm">Memuat data mitra...</div>

  return (
    <div className="page-enter">
      <div className="flex items-start justify-between mb-6 flex-wrap gap-3">
        <div>
          <h1 className="text-xl font-semibold text-stone-800">Manajemen mitra</h1>
          <p className="text-sm text-stone-400 mt-0.5">{mitra.length} mitra terdaftar</p>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <span className="text-stone-400">Aktif:</span>
          <span className="font-semibold text-stone-700">{mitra.filter(m => m.is_active).length}</span>
          <span className="text-stone-300 mx-1">|</span>
          <span className="text-stone-400">Nonaktif:</span>
          <span className="font-semibold text-stone-700">{mitra.filter(m => !m.is_active).length}</span>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-5">
        <div className="relative flex-1 min-w-48">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
          <input
            className="input pl-9 text-sm"
            placeholder="Cari nama bisnis..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {['semua', 'starter', 'growth', 'impact', 'nonaktif'].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`text-xs px-3 py-2 rounded-xl border transition-colors capitalize ${
                filter === f ? 'bg-gold-50 border-gold-300 text-gold-700' : 'border-stone-200 text-stone-500 hover:border-stone-300'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="card p-0 overflow-hidden">
        <div className="table-wrapper">
          <table className="table">
            <thead>
              <tr>
                <th>Bisnis</th>
                <th>Tipe</th>
                <th>PIC</th>
                <th>Bergabung</th>
                <th>Tier</th>
                <th>Status</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(m => (
                <tr key={m.id} className={!m.is_active ? 'opacity-50' : ''}>
                  <td>
                    <div>
                      <p className="font-medium text-stone-800">{m.business_name}</p>
                      <p className="text-xs text-stone-400">{m.user?.email || '—'}</p>
                    </div>
                  </td>
                  <td className="capitalize text-stone-500 text-xs">{m.business_type}</td>
                  <td>
                    <div>
                      <p className="text-sm text-stone-700">{m.pic_name}</p>
                      <p className="text-xs text-stone-400">{m.pic_phone}</p>
                    </div>
                  </td>
                  <td className="text-xs text-stone-400">{formatDate(m.joined_at)}</td>
                  <td>
                    <select
                      className="text-xs border border-stone-200 rounded-lg px-2 py-1.5 bg-white text-stone-700 cursor-pointer"
                      value={m.subscription_tier}
                      disabled={updating === m.id}
                      onChange={e => updateTier(m.id, e.target.value as SubscriptionTier)}
                    >
                      <option value="starter">Starter</option>
                      <option value="growth">Growth</option>
                      <option value="impact">Impact</option>
                    </select>
                  </td>
                  <td>
                    <span className={`badge text-[10px] ${m.is_active ? 'badge-sage' : 'badge-gray'}`}>
                      {m.is_active ? 'Aktif' : 'Nonaktif'}
                    </span>
                  </td>
                  <td>
                    <button
                      onClick={() => toggleActive(m.id, m.is_active)}
                      disabled={updating === m.id}
                      className={`text-xs px-3 py-1.5 rounded-lg border transition-colors ${
                        m.is_active
                          ? 'border-red-200 text-red-500 hover:bg-red-50'
                          : 'border-sage-200 text-sage-600 hover:bg-sage-50'
                      }`}
                    >
                      {updating === m.id ? '...' : m.is_active ? 'Nonaktifkan' : 'Aktifkan'}
                    </button>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={7} className="text-center py-12">
                    <Users size={28} className="mx-auto text-stone-200 mb-2" />
                    <p className="text-stone-400 text-sm">Tidak ada mitra ditemukan</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
