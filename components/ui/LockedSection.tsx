import Link from 'next/link'
import { Lock } from 'lucide-react'
import { SubscriptionTier } from '@/types'

interface LockedSectionProps {
  title: string
  description: string
  requiredTier: SubscriptionTier
}

const tierNames: Record<SubscriptionTier, string> = {
  starter: 'Starter',
  growth: 'Growth',
  impact: 'Impact',
}

const tierColors: Record<SubscriptionTier, string> = {
  starter: '',
  growth: 'border-gold-300',
  impact: 'border-gold-400',
}

const btnColors: Record<SubscriptionTier, string> = {
  starter: '',
  growth: 'bg-gold-400 hover:bg-gold-500',
  impact: 'bg-gold-500 hover:bg-gold-600',
}

export function LockedSection({ title, description, requiredTier }: LockedSectionProps) {
  return (
    <div className={`locked-section ${tierColors[requiredTier]}`}>
      <div className="flex flex-col items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-stone-200 flex items-center justify-center">
          <Lock size={18} className="text-stone-400" />
        </div>
        <div>
          <p className="font-semibold text-stone-700 mb-1">{title}</p>
          <p className="text-sm text-stone-400 max-w-xs mx-auto">{description}</p>
        </div>
        <Link
          href="/dashboard/mitra/langganan"
          className={`inline-flex items-center gap-2 text-white text-sm font-medium px-5 py-2 rounded-xl transition-all ${btnColors[requiredTier]}`}
        >
          Upgrade ke {tierNames[requiredTier]} Partner
        </Link>
      </div>
    </div>
  )
}
