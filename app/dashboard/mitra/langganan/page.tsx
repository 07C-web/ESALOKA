import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { TierBadge } from '@/components/ui/TierBadge'
import { SubscriptionTier } from '@/types'
import { Check, Lock } from 'lucide-react'
import Link from 'next/link'

const tiers: {
  id: SubscriptionTier
  name: string
  tagline: string
  features: { label: string; included: boolean }[]
}[] = [
  {
    id: 'starter',
    name: 'Starter Partner',
    tagline: 'Mulai perjalananmu — gratis selamanya',
    features: [
      { label: 'Pengantaran mandiri ke titik dropoff', included: true },
      { label: 'Pencatatan digital berat limbah', included: true },
      { label: 'Dashboard volume basic (bulanan)', included: true },
      { label: 'Sertifikat kontribusi digital', included: true },
      { label: 'Penjemputan terjadwal', included: false },
      { label: 'Data konversi maggot & kasgot', included: false },
      { label: 'Laporan dampak bulanan PDF', included: false },
      { label: 'Metrik ESG', included: false },
    ],
  },
  {
    id: 'growth',
    name: 'Growth Partner',
    tagline: 'Tumbuh bersama dampak',
    features: [
      { label: 'Semua fitur Starter', included: true },
      { label: 'Penjemputan terjadwal', included: true },
      { label: 'Dashboard volume real-time', included: true },
      { label: 'Data konversi maggot & kasgot', included: true },
      { label: 'Laporan dampak bulanan PDF', included: true },
      { label: 'Metrik ESG basic (CO₂, waste diverted)', included: true },
      { label: 'Insight mendalam & analitik lanjutan', included: false },
      { label: 'Laporan ESG siap submit DLH', included: false },
    ],
  },
  {
    id: 'impact',
    name: 'Impact Partner',
    tagline: 'Pemimpin perubahan',
    features: [
      { label: 'Semua fitur Growth', included: true },
      { label: 'Penjemputan prioritas & frekuensi tinggi', included: true },
      { label: 'Insight mendalam & analitik lanjutan', included: true },
      { label: 'Laporan ESG siap submit DLH', included: true },
      { label: 'Eksposur premium & co-branding', included: true },
      { label: 'Peluang kolaborasi & program mitra', included: true },
    ],
  },
]

export default async function MitraLanggananPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: mitra } = await supabase
    .from('mitra').select('*').eq('user_id', user.id).single()
  if (!mitra) redirect('/login')

  const currentTier = mitra.subscription_tier as SubscriptionTier
  const tierOrder: Record<SubscriptionTier, number> = { starter: 0, growth: 1, impact: 2 }

  return (
    <div className="page-enter">
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-stone-800">Profil & langganan</h1>
        <p className="text-sm text-stone-400 mt-0.5">Informasi akun dan paket kemitraan aktif</p>
      </div>

      {/* Profile info */}
      <div className="card mb-6">
        <h2 className="section-title mb-4">Informasi bisnis</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {[
            { label: 'Nama bisnis', value: mitra.business_name },
            { label: 'Tipe bisnis', value: mitra.business_type },
            { label: 'PIC', value: mitra.pic_name },
            { label: 'No. WhatsApp', value: mitra.pic_phone },
            { label: 'Bergabung sejak', value: new Date(mitra.joined_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }) },
            { label: 'Paket aktif', value: <TierBadge tier={currentTier} size="md" /> },
          ].map((item, i) => (
            <div key={i}>
              <p className="text-xs text-stone-400 mb-1">{item.label}</p>
              <p className="text-sm font-medium text-stone-700">{item.value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Tier comparison */}
      <h2 className="section-title mb-4">Paket kemitraan</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {tiers.map(tier => {
          const isCurrent = tier.id === currentTier
          const isUpgrade = tierOrder[tier.id] > tierOrder[currentTier]

          return (
            <div
              key={tier.id}
              className={`card flex flex-col ${isCurrent ? 'border-2 border-gold-300' : ''}`}
            >
              {isCurrent && (
                <span className="inline-block text-[10px] font-semibold bg-gold-400 text-white px-2.5 py-0.5 rounded-full mb-3 self-start">
                  Paket aktif
                </span>
              )}
              <TierBadge tier={tier.id} size="md" className="mb-2 self-start" />
              <p className="text-xs text-stone-400 mb-4">{tier.tagline}</p>

              <ul className="flex flex-col gap-2 flex-1 mb-5">
                {tier.features.map((f, i) => (
                  <li key={i} className="flex items-start gap-2">
                    {f.included ? (
                      <Check size={13} className="text-gold-500 shrink-0 mt-0.5" />
                    ) : (
                      <Lock size={13} className="text-stone-300 shrink-0 mt-0.5" />
                    )}
                    <span className={`text-xs ${f.included ? 'text-stone-600' : 'text-stone-300'}`}>
                      {f.label}
                    </span>
                  </li>
                ))}
              </ul>

              {isCurrent ? (
                <div className="text-center text-xs text-stone-400 py-2 border border-stone-100 rounded-xl">
                  Paket saat ini
                </div>
              ) : isUpgrade ? (
                <Link
                  href="/get-in-touch#daftar"
                  className="btn-primary text-center text-sm"
                >
                  Upgrade ke {tier.name}
                </Link>
              ) : (
                <div className="text-center text-xs text-stone-300 py-2">
                  —
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
