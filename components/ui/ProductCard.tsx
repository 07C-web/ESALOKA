'use client'

import { useState } from 'react'
import { Minus, Plus, ShoppingCart, Check } from 'lucide-react'
import { useCart } from '@/lib/cart-context'

interface Product {
  id: string
  name: string
  slug: string
  category: string
  description: string
  price: number
  unit: string
  stock_kg?: number | null
}

function formatRupiah(n: number) {
  return 'Rp ' + n.toLocaleString('id-ID')
}

const SPECS: Record<string, string[]> = {
  protein_series: ['🧬 Protein 40–55%', '📦 Min. 1 kg', '🌿 Organik BSF'],
  soil_series:    ['🌾 Kaya N-P-K', '📦 Min. 1 kg', '🌿 Organik'],
}

const BG_GRADIENT: Record<string, string> = {
  protein_series: 'from-gold-50 to-gold-100',
  soil_series:    'from-sage-50 to-sage-100',
}

export function ProductCard({ product }: { product: Product }) {
  const { addItem } = useCart()
  const [qty, setQty]     = useState(1)
  const [added, setAdded] = useState(false)

  const isProtein = product.category === 'protein_series'
  const specs     = SPECS[product.category] ?? []
  const bgGrad    = BG_GRADIENT[product.category] ?? 'from-stone-50 to-stone-100'

  const inStock   = product.stock_kg == null || product.stock_kg > 0
  const stockText = product.stock_kg != null
    ? `Stok: ${product.stock_kg} kg`
    : 'Tersedia'

  function dec() { setQty(q => Math.max(1, q - 1)) }
  function inc() { setQty(q => q + 1) }

  function handleAdd() {
    addItem({
      id:       product.id,
      name:     product.name,
      slug:     product.slug,
      category: product.category,
      price:    product.price,
      unit:     product.unit,
    })
    // bump by selected qty (context already adds 1, so add qty-1 more)
    for (let i = 1; i < qty; i++) {
      addItem({
        id:       product.id,
        name:     product.name,
        slug:     product.slug,
        category: product.category,
        price:    product.price,
        unit:     product.unit,
      })
    }
    setAdded(true)
    setTimeout(() => { setAdded(false); setQty(1) }, 2000)
  }

  return (
    <div className="bg-white rounded-2xl border border-stone-100 flex flex-col overflow-hidden hover:border-stone-200 hover:shadow-sm transition-all duration-200">

      {/* ── Image area ── */}
      <div className={`relative bg-gradient-to-br ${bgGrad} h-44 flex items-center justify-center`}>
        <span className="text-6xl select-none">{isProtein ? '🐛' : '🌱'}</span>

        {/* Category badge */}
        <span className={`absolute top-3 left-3 badge text-[10px] ${
          isProtein ? 'badge-gold' : 'badge-sage'
        }`}>
          {isProtein ? 'Protein Series' : 'Soil Series'}
        </span>

        {/* Stock badge */}
        <span className={`absolute top-3 right-3 text-[10px] font-medium px-2 py-0.5 rounded-full ${
          inStock
            ? 'bg-white/80 text-sage-700 border border-sage-200'
            : 'bg-red-50 text-red-500 border border-red-200'
        }`}>
          {inStock ? stockText : 'Habis'}
        </span>
      </div>

      {/* ── Body ── */}
      <div className="flex flex-col flex-1 p-4">

        {/* Name */}
        <h3 className="font-semibold text-stone-800 text-sm mb-1 leading-snug">
          {product.name}
        </h3>

        {/* Description */}
        <p className="text-xs text-stone-400 leading-relaxed mb-3 flex-1">
          {product.description}
        </p>

        {/* Spec chips */}
        <div className="flex flex-wrap gap-1.5 mb-3">
          {specs.map(s => (
            <span key={s} className="text-[10px] px-2 py-0.5 rounded-md bg-stone-50 border border-stone-100 text-stone-500">
              {s}
            </span>
          ))}
        </div>

        {/* Rating */}
        <div className="flex items-center gap-1.5 mb-3">
          <span className="text-gold-400 text-xs tracking-tighter">★★★★★</span>
          <span className="text-[10px] text-stone-400">5.0 · Terverifikasi</span>
        </div>

        {/* Price */}
        <div className="mb-3">
          <p className="text-lg font-bold text-stone-800 leading-none">
            {formatRupiah(product.price)}
          </p>
          <p className="text-[10px] text-stone-400 mt-0.5">per {product.unit}</p>
        </div>

        {/* Divider */}
        <div className="border-t border-stone-100 pt-3">

          {/* Qty control + Add button */}
          <div className="flex items-center gap-2">

            {/* − qty + */}
            <div className="flex items-center border border-stone-200 rounded-xl overflow-hidden">
              <button
                onClick={dec}
                disabled={qty <= 1 || !inStock}
                className="w-8 h-8 flex items-center justify-center text-stone-500 hover:bg-stone-50 disabled:opacity-30 transition-colors"
              >
                <Minus size={12} />
              </button>
              <span className="w-8 text-center text-sm font-semibold text-stone-800 select-none">
                {qty}
              </span>
              <button
                onClick={inc}
                disabled={!inStock}
                className="w-8 h-8 flex items-center justify-center text-stone-500 hover:bg-stone-50 disabled:opacity-30 transition-colors"
              >
                <Plus size={12} />
              </button>
            </div>

            {/* Add to cart */}
            <button
              onClick={handleAdd}
              disabled={!inStock || added}
              className={`flex-1 h-8 flex items-center justify-center gap-1.5 rounded-xl text-xs font-medium transition-all duration-200 active:scale-95 ${
                added
                  ? 'bg-sage-100 text-sage-700 border border-sage-200'
                  : inStock
                    ? 'bg-gold-400 text-white hover:bg-gold-500'
                    : 'bg-stone-100 text-stone-400 cursor-not-allowed'
              }`}
            >
              {added ? (
                <><Check size={13} /> Ditambahkan!</>
              ) : (
                <><ShoppingCart size={13} /> Tambah {qty > 1 ? `(${qty})` : ''}</>
              )}
            </button>
          </div>

          {/* Subtotal hint */}
          {qty > 1 && (
            <p className="text-[10px] text-stone-400 text-right mt-1.5">
              Subtotal: <span className="font-semibold text-stone-600">{formatRupiah(product.price * qty)}</span>
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
