'use client'

import { useState } from 'react'
import { ShoppingCart } from 'lucide-react'
import { useCart } from '@/lib/cart-context'
import { CartDrawer } from '@/components/ui/CartDrawer'

export function FloatingCart() {
  const { totalItems } = useCart()
  const [open, setOpen] = useState(false)

  return (
    <>
      {/* Floating button — fixed bottom-right */}
      <button
        onClick={() => setOpen(true)}
        aria-label="Buka keranjang belanja"
        className="fixed bottom-6 right-6 z-40 w-14 h-14 rounded-full bg-gold-400 hover:bg-gold-500 active:scale-95 text-white shadow-lg shadow-gold-400/40 flex items-center justify-center transition-all duration-200"
      >
        <ShoppingCart size={22} />

        {/* Badge notifikasi */}
        {totalItems > 0 && (
          <span className="absolute -top-1 -right-1 min-w-[20px] h-5 px-1 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center border-2 border-white animate-bounce-once">
            {totalItems > 99 ? '99+' : totalItems}
          </span>
        )}
      </button>

      <CartDrawer isOpen={open} onClose={() => setOpen(false)} />
    </>
  )
}
