import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { DashboardSidebar } from '@/components/layout/DashboardSidebar'
import { UserRole, SubscriptionTier } from '@/types'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('user_profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  if (!profile) redirect('/login')

  let businessName: string | undefined
  let tier: SubscriptionTier | undefined

  if (profile.role === 'mitra') {
    const { data: mitra } = await supabase
      .from('mitra')
      .select('business_name, subscription_tier')
      .eq('user_id', user.id)
      .single()
    businessName = mitra?.business_name
    tier = mitra?.subscription_tier as SubscriptionTier
  }

  return (
    <div className="flex min-h-screen bg-cream">
      <DashboardSidebar
        role={profile.role as UserRole}
        userName={profile.full_name}
        businessName={businessName}
        tier={tier}
      />
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-6xl mx-auto px-6 py-8">
          {children}
        </div>
      </main>
    </div>
  )
}
