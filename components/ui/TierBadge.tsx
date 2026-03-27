import { SubscriptionTier } from '@/types'
import { TIER_LABELS } from '@/lib/utils'
import { cn } from '@/lib/utils'

interface TierBadgeProps {
  tier: SubscriptionTier
  size?: 'sm' | 'md'
  className?: string
}

const tierStyles: Record<SubscriptionTier, string> = {
  starter: 'bg-sage-50 text-sage-700 border border-sage-200',
  growth:  'bg-gold-50 text-gold-700 border border-gold-200',
  impact:  'bg-gold-100 text-gold-800 border border-gold-300',
}

export function TierBadge({ tier, size = 'sm', className }: TierBadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full font-medium',
        size === 'sm' ? 'text-xs px-2.5 py-0.5' : 'text-sm px-3 py-1',
        tierStyles[tier],
        className
      )}
    >
      {TIER_LABELS[tier]}
    </span>
  )
}
