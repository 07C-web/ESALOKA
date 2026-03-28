'use client'

import { useState } from 'react'
import { ShoppingCart, Check } from 'lucide-react'
import { useCart } from '@/lib/cart-context'

interface Product {
  id: string
  name: string
  slug: string
  category: string
  description: string
  price: number
  unit: string
}

function formatRupiah(n: number) {
  return 'Rp ' + n.toLocaleString('id-ID')
}

export function ProductCard({ product }: { product: Product }) {
  const { addItem } = useCart()
  const [added, setAdded] = useState(false)

  function handleAdd() {
    addItem({
      id:       product.id,
      name:     product.name,
      slug:     product.slug,
      category: product.category,
      price:    product.price,
      unit:     product.unit,
    })
    setAdded(true)
    setTimeout(() => setAdded(false), 1800)
  }

  const isProtein = product.category === 'protein_series'

  return (
    <div className="card flex flex-col hover:border-stone-200 transition-colors">
      {/* Product icon */}
      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-4 ${
        isProtein ? 'bg-gold-50' : 'bg-sage-50'
      }`}>
        <span className="text-2xl">{isProtein ? '🐛' : '🌱'}</span>
      </div>

      {/* Category badge */}
      <span className={`badge text-[10px] mb-3 self-start ${
        isProtein ? 'badge-gold' : 'badge-sage'
      }`}>
        {isProtein ? 'Protein Series' : 'Soil Series'}
      </span>

      {/* Name & desc */}
      <h3 className="font-semibold text-stone-800 mb-2">{product.name}</h3>
      <p className="text-sm text-stone-500 leading-relaxed flex-1 mb-4">
        {product.description}
      </p>

      {/* Price & CTA */}
      <div className="flex items-center justify-between pt-3 border-t border-stone-100">
        <div>
          <p className="text-lg font-bold text-stone-800">{formatRupiah(product.price)}</p>
          <p className="text-xs text-stone-400">per {product.unit}</p>
        </div>
        <button
          onClick={handleAdd}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
            added
              ? 'bg-sage-100 text-sage-700 border border-sage-200'
              : 'bg-gold-400 text-white hover:bg-gold-500 active:scale-95'
          }`}
        >
          {added ? (
            <><Check size={14} /> Ditambahkan</>
          ) : (
            <><ShoppingCart size={14} /> Tambah</>
          )}
        </button>
      </div>
    </div>
  )
}
