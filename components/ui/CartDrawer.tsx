'use client'

import { useState } from 'react'
import { X, Minus, Plus, Trash2, ShoppingBag, Loader2, CheckCircle } from 'lucide-react'
import { useCart } from '@/lib/cart-context'
import { createClient } from '@/lib/supabase/client'

function formatRupiah(n: number) {
  return 'Rp ' + n.toLocaleString('id-ID')
}

interface CheckoutForm {
  customer_name: string
  customer_phone: string
  notes: string
}

type Step = 'cart' | 'checkout' | 'success'

interface OrderResult {
  order_number: string
  total_amount: number
}

export function CartDrawer({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const { items, totalAmount, updateQuantity, removeItem, clearCart } = useCart()
  const [step, setStep] = useState<Step>('cart')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [orderResult, setOrderResult] = useState<OrderResult | null>(null)
  const [form, setForm] = useState<CheckoutForm>({
    customer_name: '', customer_phone: '', notes: '',
  })

  const supabase = createClient()

  function buildWAMessage(orderNumber: string) {
    const lines = items.map(i =>
      `• ${i.name} ${i.quantity}kg = ${formatRupiah(i.price * i.quantity)}`
    )
    return encodeURIComponent(
      `Halo ESALOKA! 👋\n\nSaya ingin memesan:\n${lines.join('\n')}\n\n` +
      `Total: ${formatRupiah(totalAmount)}\n` +
      `No. Order: *${orderNumber}*\n\n` +
      `Nama: ${form.customer_name}\n` +
      `No. WA: ${form.customer_phone}` +
      (form.notes ? `\nCatatan: ${form.notes}` : '')
    )
  }

  async function handleCheckout(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      // 1. Generate order number via RPC
      const { data: orderNumData } = await supabase.rpc('generate_order_number')
      const orderNumber = orderNumData as string

      // 2. Insert order
      const { data: orderData, error: orderErr } = await supabase
        .from('orders')
        .insert([{
          order_number:   orderNumber,
          customer_name:  form.customer_name,
          customer_phone: form.customer_phone,
          notes:          form.notes || null,
          channel:        'whatsapp',
          status:         'pending',
          total_amount:   totalAmount,
        }])
        .select('id')
        .single()

      if (orderErr || !orderData) throw new Error('Gagal membuat order')

      // 3. Insert order items
      const orderItems = items.map(i => ({
        order_id:     orderData.id,
        product_id:   i.id,
        product_name: i.name,
        quantity:     i.quantity,
        unit_price:   i.price,
        subtotal:     i.price * i.quantity,
      }))

      const { error: itemsErr } = await supabase
        .from('order_items')
        .insert(orderItems)

      if (itemsErr) throw new Error('Gagal menyimpan item order')

      // 4. Success — open WA
      setOrderResult({ order_number: orderNumber, total_amount: totalAmount })
      const waNumber = '6281234567890' // ganti dengan nomor WA ESALOKA
      const waMsg = buildWAMessage(orderNumber)
      window.open(`https://wa.me/${waNumber}?text=${waMsg}`, '_blank')

      clearCart()
      setStep('success')
    } catch (err: any) {
      setError(err.message || 'Terjadi kesalahan. Silakan coba lagi.')
    } finally {
      setLoading(false)
    }
  }

  function handleClose() {
    onClose()
    if (step === 'success') {
      setTimeout(() => { setStep('cart'); setOrderResult(null) }, 300)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/30 backdrop-blur-sm"
        onClick={handleClose}
      />

      {/* Drawer */}
      <div className="relative w-full max-w-md bg-cream flex flex-col shadow-2xl animate-slide-in">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-stone-100 bg-white">
          <div className="flex items-center gap-2">
            {step === 'checkout' && (
              <button onClick={() => setStep('cart')} className="p-1 rounded-lg hover:bg-stone-100 mr-1">
                <span className="text-stone-500 text-sm">←</span>
              </button>
            )}
            <ShoppingBag size={18} className="text-gold-500" />
            <span className="font-semibold text-stone-800">
              {step === 'cart' ? 'Keranjang Belanja' : step === 'checkout' ? 'Konfirmasi Pesanan' : 'Pesanan Dikirim!'}
            </span>
          </div>
          <button onClick={handleClose} className="p-2 rounded-lg hover:bg-stone-100">
            <X size={18} className="text-stone-500" />
          </button>
        </div>

        {/* ── STEP: CART ── */}
        {step === 'cart' && (
          <>
            <div className="flex-1 overflow-y-auto px-5 py-4">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-48 gap-3">
                  <ShoppingBag size={36} className="text-stone-200" />
                  <p className="text-sm text-stone-400">Keranjang masih kosong</p>
                  <button onClick={handleClose} className="btn-ghost text-sm">
                    Lihat produk →
                  </button>
                </div>
              ) : (
                <div className="flex flex-col gap-3">
                  {items.map(item => (
                    <div key={item.id} className="card-sm flex gap-3">
                      <div className="w-10 h-10 rounded-lg bg-gold-50 flex items-center justify-center shrink-0">
                        <span className="text-lg">
                          {item.category === 'protein_series' ? '🐛' : '🌱'}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-stone-800 truncate">{item.name}</p>
                        <p className="text-xs text-stone-400">{formatRupiah(item.price)}/{item.unit}</p>
                        <div className="flex items-center justify-between mt-2">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="w-6 h-6 rounded-md border border-stone-200 flex items-center justify-center hover:bg-stone-100 transition-colors"
                            >
                              <Minus size={12} />
                            </button>
                            <span className="text-sm font-medium w-6 text-center">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="w-6 h-6 rounded-md border border-stone-200 flex items-center justify-center hover:bg-stone-100 transition-colors"
                            >
                              <Plus size={12} />
                            </button>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-semibold text-stone-700">
                              {formatRupiah(item.price * item.quantity)}
                            </span>
                            <button
                              onClick={() => removeItem(item.id)}
                              className="p-1 rounded hover:bg-red-50 text-stone-300 hover:text-red-400 transition-colors"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {items.length > 0 && (
              <div className="px-5 py-4 border-t border-stone-100 bg-white">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-sm text-stone-500">Total</span>
                  <span className="text-lg font-semibold text-stone-800">{formatRupiah(totalAmount)}</span>
                </div>
                <button
                  onClick={() => setStep('checkout')}
                  className="btn-primary w-full"
                >
                  Lanjut ke checkout
                </button>
              </div>
            )}
          </>
        )}

        {/* ── STEP: CHECKOUT ── */}
        {step === 'checkout' && (
          <form onSubmit={handleCheckout} className="flex flex-col flex-1 overflow-hidden">
            <div className="flex-1 overflow-y-auto px-5 py-4 flex flex-col gap-4">
              {/* Order summary */}
              <div className="bg-stone-50 rounded-xl p-4">
                <p className="text-xs font-medium text-stone-500 uppercase tracking-wide mb-3">Ringkasan Pesanan</p>
                {items.map(item => (
                  <div key={item.id} className="flex justify-between text-sm py-1">
                    <span className="text-stone-600">{item.name} × {item.quantity}{item.unit}</span>
                    <span className="font-medium text-stone-700">{formatRupiah(item.price * item.quantity)}</span>
                  </div>
                ))}
                <div className="border-t border-stone-200 mt-2 pt-2 flex justify-between">
                  <span className="text-sm font-semibold text-stone-700">Total</span>
                  <span className="text-sm font-bold text-gold-600">{formatRupiah(totalAmount)}</span>
                </div>
              </div>

              {/* Contact form */}
              <div>
                <label className="label">Nama lengkap</label>
                <input
                  className="input" required placeholder="Nama Anda"
                  value={form.customer_name}
                  onChange={e => setForm(f => ({ ...f, customer_name: e.target.value }))}
                />
              </div>
              <div>
                <label className="label">Nomor WhatsApp</label>
                <input
                  className="input" required placeholder="08xx-xxxx-xxxx" type="tel"
                  value={form.customer_phone}
                  onChange={e => setForm(f => ({ ...f, customer_phone: e.target.value }))}
                />
              </div>
              <div>
                <label className="label">Catatan (opsional)</label>
                <textarea
                  className="textarea" placeholder="Alamat pengiriman, instruksi khusus, dll."
                  value={form.notes}
                  onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
                />
              </div>

              {error && (
                <div className="bg-red-50 border border-red-100 rounded-xl px-4 py-3">
                  <p className="text-sm text-red-600">{error}</p>
                </div>
              )}
            </div>

            <div className="px-5 py-4 border-t border-stone-100 bg-white">
              <p className="text-xs text-stone-400 text-center mb-3">
                Pesanan akan dikirim via WhatsApp. Tim kami akan menghubungi Anda untuk konfirmasi.
              </p>
              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full flex items-center justify-center gap-2"
              >
                {loading && <Loader2 size={16} className="animate-spin" />}
                {loading ? 'Memproses...' : 'Pesan via WhatsApp'}
              </button>
            </div>
          </form>
        )}

        {/* ── STEP: SUCCESS ── */}
        {step === 'success' && orderResult && (
          <div className="flex-1 flex flex-col items-center justify-center px-6 text-center gap-4">
            <div className="w-16 h-16 rounded-full bg-sage-50 flex items-center justify-center">
              <CheckCircle size={32} className="text-sage-500" />
            </div>
            <div>
              <p className="font-semibold text-stone-800 text-lg mb-1">Pesanan Terkirim!</p>
              <p className="text-sm text-stone-500 mb-3">
                WhatsApp sudah terbuka dengan detail pesanan Anda.
              </p>
              <div className="bg-gold-50 border border-gold-200 rounded-xl px-4 py-3 mb-1">
                <p className="text-xs text-stone-400 mb-0.5">Nomor Order</p>
                <p className="text-xl font-bold text-gold-600 font-mono">{orderResult.order_number}</p>
              </div>
              <p className="text-xs text-stone-400">Simpan nomor ini untuk konfirmasi pesanan</p>
            </div>
            <button onClick={handleClose} className="btn-primary w-full mt-4">
              Selesai
            </button>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes slide-in {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
        .animate-slide-in {
          animation: slide-in 0.25s ease-out;
        }
      `}</style>
    </div>
  )
}
