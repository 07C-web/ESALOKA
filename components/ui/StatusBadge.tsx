import { CollectionStatus } from '@/types'
import { STATUS_COLORS, STATUS_LABELS } from '@/lib/utils'
import { cn } from '@/lib/utils'

interface StatusBadgeProps {
  status: CollectionStatus
  className?: string
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const { bg, text } = STATUS_COLORS[status]
  return (
    <span className={cn('badge', bg, text, className)}>
      {STATUS_LABELS[status]}
    </span>
  )
}
