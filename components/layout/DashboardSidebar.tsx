'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { UserRole, SubscriptionTier } from '@/types'
import { TIER_LABELS } from '@/lib/utils'
import { createClient } from '@/lib/supabase/client'
import {
  LayoutDashboard, Package, RefreshCw, Leaf,
  TrendingUp, Award, Settings, Users, ClipboardList,
  Mail, LogOut, BarChart2, Download, ChevronRight,
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface SidebarProps {
  role: UserRole
  userName: string
  businessName?: string
  tier?: SubscriptionTier
}

const mitraNav = [
  { href: '/dashboard/mitra',            label: 'Overview',           icon: LayoutDashboard },
  { href: '/dashboard/mitra/riwayat',    label: 'Riwayat pengumpulan', icon: Package },
  { href: '/dashboard/mitra/konversi',   label: 'Hasil konversi',     icon: RefreshCw, minTier: 'growth' },
  { href: '/dashboard/mitra/esg',        label: 'ESG metrics',        icon: Leaf, minTier: 'growth' },
  { href: '/dashboard/mitra/insight',    label: 'Insight mendalam',   icon: TrendingUp, minTier: 'impact' },
  { href: '/dashboard/mitra/sertifikat', label: 'Sertifikat & badge', icon: Award },
  { href: '/dashboard/mitra/langganan',  label: 'Profil & langganan', icon: Settings },
]

const adminNav = [
  { href: '/dashboard/admin',            label: 'Overview global',    icon: LayoutDashboard },
  { href: '/dashboard/admin/mitra',      label: 'Manajemen mitra',    icon: Users },
  { href: '/dashboard/admin/input',      label: 'Input data operator',icon: ClipboardList },
  { href: '/dashboard/admin/inbox',      label: 'Inbox get in touch', icon: Mail },
  { href: '/dashboard/admin/pengaturan', label: 'Pengaturan sistem',  icon: Settings },
]

const dlhNav = [
  { href: '/dashboard/dlh',        label: 'Rekapitulasi bulanan', icon: BarChart2 },
  { href: '/dashboard/dlh/export', label: 'Export data',          icon: Download },
]

const tierOrder: Record<SubscriptionTier, number> = { starter: 0, growth: 1, impact: 2 }

export function DashboardSidebar({ role, userName, businessName, tier }: SidebarProps) {
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClient()

  const navItems = role === 'admin' ? adminNav : role === 'dlh' ? dlhNav : mitraNav

  async function handleLogout() {
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }

  function isLocked(minTier?: string) {
    if (!minTier || !tier) return false
    return tierOrder[tier] < tierOrder[minTier as SubscriptionTier]
  }

  const tierColors: Record<SubscriptionTier, string> = {
    starter: 'bg-sage-50 text-sage-700 border-sage-200',
    growth:  'bg-gold-50 text-gold-700 border-gold-200',
    impact:  'bg-gold-100 text-gold-800 border-gold-300',
  }

  return (
    <aside className="w-60 min-h-screen flex flex-col border-r border-stone-100 bg-white shrink-0">
      {/* Brand */}
      <div className="px-5 py-5 border-b border-stone-100">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-gold-400 flex items-center justify-center shrink-0">
            <span className="text-white font-bold text-sm">E</span>
          </div>
          <span className="font-semibold text-stone-800 tracking-tight">ESALOKA</span>
        </Link>
      </div>

      {/* User info */}
      <div className="px-4 py-3 mx-3 mt-3 rounded-xl bg-stone-50 border border-stone-100">
        <p className="text-xs text-stone-400 mb-0.5">
          {role === 'admin' ? 'Admin internal' : role === 'dlh' ? 'DLH' : 'Mitra HoReCa'}
        </p>
        <p className="text-sm font-medium text-stone-800 truncate">
          {businessName || userName}
        </p>
        {tier && (
          <span className={cn(
            'inline-flex mt-1.5 text-[10px] font-medium px-2 py-0.5 rounded-full border',
            tierColors[tier]
          )}>
            {TIER_LABELS[tier]}
          </span>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-3 flex flex-col gap-0.5 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon
          const locked = isLocked((item as { minTier?: string }).minTier)
          const active = pathname === item.href

          return (
            <Link
              key={item.href}
              href={locked ? '/dashboard/mitra/langganan' : item.href}
              className={cn(
                'sidebar-item group',
                active && 'active',
                locked && 'opacity-50'
              )}
            >
              <Icon size={16} className="shrink-0" />
              <span className="flex-1 text-sm">{item.label}</span>
              {locked && (
                <span className="text-[10px] bg-stone-200 text-stone-500 px-1.5 py-0.5 rounded-full">
                  Lock
                </span>
              )}
              {!locked && !active && (
                <ChevronRight size={14} className="opacity-0 group-hover:opacity-40 transition-opacity" />
              )}
            </Link>
          )
        })}
      </nav>

      {/* Logout */}
      <div className="px-3 py-3 border-t border-stone-100">
        <button
          onClick={handleLogout}
          className="sidebar-item w-full text-red-400 hover:text-red-600 hover:bg-red-50"
        >
          <LogOut size={16} />
          <span className="text-sm">Keluar</span>
        </button>
      </div>
    </aside>
  )
}
