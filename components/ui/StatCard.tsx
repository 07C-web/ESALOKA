import { cn } from '@/lib/utils'
import { ReactNode } from 'react'

interface StatCardProps {
  label: string
  value: string | number
  sub?: string
  badge?: ReactNode
  icon?: ReactNode
  className?: string
  highlight?: boolean
}

export function StatCard({
  label,
  value,
  sub,
  badge,
  icon,
  className,
  highlight = false,
}: StatCardProps) {
  return (
    <div
      className={cn(
        'stat-card',
        highlight && 'border-gold-200 bg-gradient-to-br from-gold-50 to-white',
        className
      )}
    >
      <div className="flex items-start justify-between mb-1">
        <p className="stat-label">{label}</p>
        {icon && (
          <span className="text-stone-300">{icon}</span>
        )}
      </div>
      <p className="stat-value">{value}</p>
      {sub && <p className="stat-sub">{sub}</p>}
      {badge && <div className="mt-2">{badge}</div>}
    </div>
  )
}
