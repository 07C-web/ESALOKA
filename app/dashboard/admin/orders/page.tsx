'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { formatDate } from '@/lib/utils'
import { ShoppingBag, Search } from 'lucide-react'

function formatRupiah(n: number) {
  return 'Rp ' + Number(n).toLocaleString('id-ID')
}

const statusColors: Record<string, string> = {
  pending:   'badge bg-gold-50 text-gold-700 border border-gold-200',
  confirmed: 'badge bg-blue-50 text-blue-700',
  completed: 'badge bg-sage-50 text-sage-700 border border-sage-200',
  cancelled: 'badge bg-red-50 text-red-600',
}

const statusLabel: Record<string, string> = {
  pending:   'Pending',
  confirmed: 'Dikonfirmasi',
  completed: 'Selesai',
  cancelled: 'Dibatalkan',
}

export default function AdminOrdersPage() {
  const supabase = createClient()
  const [orders, setOrders]   = useState<any[]>([])
  const [search, setSearch]   = useState('')
  const [filter, setFilter]   = useState('semua')
  const [expanded, setExpanded] = useState<string | null>(null)
  const [items, setItems]     = useState<Record<string, any[]>>({})
  const [loading, setLoading] = useState(true)

  useEffect(() => { loadOrders() }, [])

  async function loadOrders() {
    const { data } = await supabase
      .from('orders').select('*').order('created_at', { ascending: false })
    setOrders(data || [])
    setLoading(false)
  }

  async function loadItems(orderId: string) {
    if (items[orderId]) { setExpanded(orderId === expanded ? null : orderId); return }
    const { data } = await supabase
      .from('order_items').select('*').eq('order_id', orderId)
    setItems(prev => ({ ...prev, [orderId]: data || [] }))
    setExpanded(orderId === expanded ? null : orderId)
  }

  async function updateStatus(id: string, status: string) {
    await supabase.from('orders').update({ status }).eq('id', id)
    setOrders(prev => prev.map(o => o.id === id ? { ...o, status } : o))
  }

  const filtered = orders.filter(o => {
    const matchSearch = o.order_number.toLowerCase().includes(search.toLowerCase()) ||
                        o.customer_name.toLowerCase().includes(search.toLowerCase())
    const matchFilter = filter === 'semua' || o.status === filter
    return matchSearch && matchFilter
  })

  const totalRevenue = orders.filter(o => o.status !== 'cancelled').reduce((s, o) => s + Number(o.total_amount), 0)
  const pendingCount = orders.filter(o => o.status === 'pending').length

  if (loading) return <div className="flex items-center justify-center h-64 text-stone-400 text-sm">Memuat data...</div>

  return (
    <div className="page-enter">
      <div className="flex items-start justify-between mb-6 flex-wrap gap-3">
        <div>
          <h1 className="text-xl font-semibold text-stone-800">Pesanan produk</h1>
          <p className="text-sm text-stone-400 mt-0.5">{orders.length} total order · {formatRupiah(totalRevenue)} revenue</p>
        </div>
        {pendingCount > 0 && (
          <div className="flex items-center gap-2 bg-gold-50 border border-gold-200 px-3 py-2 rounded-xl">
            <span className="w-2 h-2 rounded-full bg-gold-400 animate-pulse" />
            <span className="text-xs text-gold-700 font-medium">{pendingCount} pesanan menunggu konfirmasi</span>
          </div>
        )}
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-5">
        {[
          { label: 'Total order', value: orders.length },
          { label: 'Pending', value: orders.filter(o => o.status === 'pending').length },
          { label: 'Selesai', value: orders.filter(o => o.status === 'completed').length },
          { label: 'Revenue (non-cancelled)', value: formatRupiah(totalRevenue) },
        ].map((s, i) => (
          <div key={i} className="stat-card">
            <p className="stat-label">{s.label}</p>
            <p className="stat-value text-lg">{s.value}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-5">
        <div className="relative flex-1 min-w-48">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
          <input className="input pl-9 text-sm" placeholder="Cari nomor order / nama pelanggan..."
            value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <div className="flex gap-2 flex-wrap">
          {['semua', 'pending', 'confirmed', 'completed', 'cancelled'].map(f => (
            <button key={f} onClick={() => setFilter(f)}
              className={`text-xs px-3 py-2 rounded-xl border transition-colors capitalize ${filter === f ? 'bg-gold-50 border-gold-300 text-gold-700' : 'border-stone-200 text-stone-500 hover:border-stone-300'}`}>
              {statusLabel[f] || f}
            </button>
          ))}
        </div>
      </div>

      {/* Orders */}
      <div className="flex flex-col gap-3">
        {filtered.map(order => (
          <div key={order.id} className="card p-0 overflow-hidden">
            <div
              className="flex items-center gap-4 p-4 cursor-pointer hover:bg-stone-50 transition-colors flex-wrap"
              onClick={() => loadItems(order.id)}
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <span className="font-bold text-stone-800 font-mono text-sm">{order.order_number}</span>
                  <span className={statusColors[order.status] || 'badge badge-gray'}>
                    {statusLabel[order.status] || order.status}
                  </span>
                </div>
                <p className="text-sm text-stone-600">{order.customer_name}</p>
                <p className="text-xs text-stone-400">{order.customer_phone} · {formatDate(order.created_at)}</p>
                {order.notes && <p className="text-xs text-stone-400 mt-0.5 italic">Catatan: {order.notes}</p>}
              </div>
              <div className="flex items-center gap-4 shrink-0">
                <div className="text-right">
                  <p className="font-semibold text-stone-800">{formatRupiah(Number(order.total_amount))}</p>
                  <p className="text-xs text-stone-400">via WhatsApp</p>
                </div>
                <select
                  className="text-xs border border-stone-200 rounded-lg px-2 py-1.5 bg-white text-stone-700 cursor-pointer"
                  value={order.status}
                  onClick={e => e.stopPropagation()}
                  onChange={e => updateStatus(order.id, e.target.value)}
                >
                  <option value="pending">Pending</option>
                  <option value="confirmed">Konfirmasi</option>
                  <option value="completed">Selesai</option>
                  <option value="cancelled">Batalkan</option>
                </select>
                <span className={`text-stone-400 text-xs transition-transform ${expanded === order.id ? 'rotate-180' : ''}`}>▾</span>
              </div>
            </div>

            {/* Order items */}
            {expanded === order.id && (
              <div className="border-t border-stone-100 bg-stone-50 px-4 py-3">
                <p className="text-xs font-medium text-stone-500 uppercase tracking-wide mb-2">Detail pesanan</p>
                {(items[order.id] || []).map((item, i) => (
                  <div key={i} className="flex justify-between text-sm py-1.5 border-b border-stone-100 last:border-0">
                    <span className="text-stone-600">{item.product_name} × {item.quantity} kg</span>
                    <span className="font-medium text-stone-700">{formatRupiah(Number(item.subtotal))}</span>
                  </div>
                ))}
                <div className="flex justify-between text-sm pt-2 font-semibold">
                  <span className="text-stone-700">Total</span>
                  <span className="text-gold-600">{formatRupiah(Number(order.total_amount))}</span>
                </div>
              </div>
            )}
          </div>
        ))}

        {filtered.length === 0 && (
          <div className="text-center py-16">
            <ShoppingBag size={36} className="mx-auto text-stone-200 mb-3" />
            <p className="text-stone-400 text-sm">Tidak ada pesanan ditemukan</p>
          </div>
        )}
      </div>
    </div>
  )
}
