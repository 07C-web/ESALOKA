'use client'

import { useState } from 'react'
import { ProductCard } from '@/components/ui/ProductCard'

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

type Filter = 'all' | 'protein_series' | 'soil_series'

const FILTERS: { key: Filter; label: string; emoji: string }[] = [
  { key: 'all',            label: 'Semua Produk',   emoji: '🌿' },
  { key: 'protein_series', label: 'Protein Series', emoji: '🐛' },
  { key: 'soil_series',    label: 'Soil Series',    emoji: '🌱' },
]

export function ProductGrid({ products }: { products: Product[] }) {
  const [active, setActive] = useState<Filter>('all')

  const filtered = active === 'all'
    ? products
    : products.filter(p => p.category === active)

  const proteinCount = products.filter(p => p.category === 'protein_series').length
  const soilCount    = products.filter(p => p.category === 'soil_series').length

  const counts: Record<Filter, number> = {
    all:            products.length,
    protein_series: proteinCount,
    soil_series:    soilCount,
  }

  return (
    <div>
      {/* ── Filter tabs ── */}
      <div className="sticky top-16 z-30 bg-cream/95 backdrop-blur-sm border-b border-stone-100 -mx-4 sm:-mx-6 px-4 sm:px-6 mb-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex gap-1 py-3 overflow-x-auto scrollbar-none">
            {FILTERS.map(f => (
              <button
                key={f.key}
                onClick={() => setActive(f.key)}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all duration-200 ${
                  active === f.key
                    ? 'bg-gold-400 text-white shadow-sm'
                    : 'text-stone-500 hover:text-stone-800 hover:bg-stone-100'
                }`}
              >
                <span>{f.emoji}</span>
                {f.label}
                <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-semibold ${
                  active === f.key
                    ? 'bg-white/25 text-white'
                    : 'bg-stone-100 text-stone-500'
                }`}>
                  {counts[f.key]}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Product grid ── */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filtered.map(p => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 text-stone-400">
          <span className="text-4xl mb-3">📦</span>
          <p className="text-sm">Belum ada produk di kategori ini</p>
        </div>
      )}
    </div>
  )
}
