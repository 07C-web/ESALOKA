import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { TierBadge } from '@/components/ui/TierBadge'
import { formatWeight, calcCO2, MONTHS_ID } from '@/lib/utils'
import { SubscriptionTier } from '@/types'
import { Award, Download } from 'lucide-react'

export default async function MitraSertifikatPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: mitra } = await supabase
    .from('mitra').select('*').eq('user_id', user.id).single()
  if (!mitra) redirect('/login')

  const tier = mitra.subscription_tier as SubscriptionTier
  const now  = new Date()

  // Monthly summaries for certificates
  const { data: collections } = await supabase
    .from('waste_collections')
    .select('collection_date, weight_kg')
    .eq('mitra_id', mitra.id)
    .order('collection_date', { ascending: false })

  const byMonth: Record<string, number> = {}
  ;(collections || []).forEach(c => {
    const key = c.collection_date.slice(0, 7)
    byMonth[key] = (byMonth[key] || 0) + Number(c.weight_kg)
  })

  const certificates = Object.entries(byMonth)
    .sort(([a], [b]) => b.localeCompare(a))
    .slice(0, 6)
    .map(([key, total]) => {
      const [yr, mo] = key.split('-')
      return {
        key,
        label: `${MONTHS_ID[parseInt(mo) - 1]} ${yr}`,
        total,
        co2: calcCO2(total),
      }
    })

  const tierBadges: Record<SubscriptionTier, string> = {
    starter: '🌿',
    growth:  '🌊',
    impact:  '⚡',
  }

  return (
    <div className="page-enter">
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-stone-800">Sertifikat & badge</h1>
        <p className="text-sm text-stone-400 mt-0.5">Bukti kontribusi nyata terhadap lingkungan</p>
      </div>

      {/* Badge aktif */}
      <div className="card mb-6 bg-gradient-to-br from-gold-50 to-sage-50 border-gold-200">
        <div className="flex items-center gap-5">
          <div className="w-16 h-16 rounded-2xl bg-white border-2 border-gold-300 flex items-center justify-center text-3xl shadow-sm">
            {tierBadges[tier]}
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <p className="font-semibold text-stone-800">{mitra.business_name}</p>
              <TierBadge tier={tier} />
            </div>
            <p className="text-sm text-stone-500 mb-2">
              Mitra ESALOKA · Bergabung sejak {new Date(mitra.joined_at).toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })}
            </p>
            <p className="text-xs text-stone-400">
              Badge ini dapat dipasang di materi promosi dan website bisnis Anda
            </p>
          </div>
        </div>
      </div>

      {/* Certificates list */}
      <div className="card">
        <div className="flex items-center gap-2 mb-5">
          <Award size={18} className="text-gold-400" />
          <h2 className="section-title mb-0">Sertifikat kontribusi bulanan</h2>
        </div>

        {certificates.length === 0 ? (
          <div className="text-center py-12">
            <Award size={36} className="mx-auto text-stone-200 mb-3" />
            <p className="text-stone-400 text-sm">Belum ada sertifikat. Mulai berkontribusi untuk mendapatkan sertifikat pertama Anda!</p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {certificates.map(cert => (
              <div key={cert.key}
                className="flex items-center justify-between p-4 rounded-xl bg-stone-50 hover:bg-stone-100 border border-stone-100 transition-colors gap-4 flex-wrap">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-gold-50 border border-gold-200 flex items-center justify-center shrink-0">
                    <Award size={18} className="text-gold-400" />
                  </div>
                  <div>
                    <p className="font-medium text-stone-800 text-sm">Sertifikat {cert.label}</p>
                    <p className="text-xs text-stone-400 mt-0.5">
                      {formatWeight(cert.total)} limbah · {formatWeight(cert.co2)} CO₂ dihindari
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right hidden sm:block">
                    <p className="text-lg font-bold text-gold-600">{formatWeight(cert.total)}</p>
                    <p className="text-xs text-stone-400">limbah dikelola</p>
                  </div>
                  <button className="flex items-center gap-1.5 text-xs font-medium text-stone-500 border border-stone-200 px-3 py-2 rounded-xl hover:bg-white hover:text-stone-700 transition-colors">
                    <Download size={13} /> PDF
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-5 pt-4 border-t border-stone-100">
          <p className="text-xs text-stone-400 text-center">
            Sertifikat baru digenerate otomatis setiap awal bulan.
            Download tersedia dalam format PDF berlogo ESALOKA + nama bisnis Anda.
          </p>
        </div>
      </div>
    </div>
  )
}
