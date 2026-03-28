'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Navbar } from '@/components/layout/Navbar'
import { createClient } from '@/lib/supabase/client'
import { CheckCircle, Loader2, ShoppingBag, Handshake, HelpCircle, MessageSquare } from 'lucide-react'

type Intent = 'mitra' | 'saran' | 'pertanyaan' | null

const intentOptions = [
  { id: 'mitra' as Intent, icon: Handshake, title: 'Daftar sebagai mitra', desc: 'Saya bisnis HoReCa yang ingin bergabung', border: 'border-gold-300', activeBorder: 'border-gold-400 ring-2 ring-gold-200', bg: 'bg-gold-50' },
  { id: 'pertanyaan' as Intent, icon: HelpCircle, title: 'Pertanyaan produk / layanan', desc: 'Saya ingin tahu lebih lanjut tentang ESALOKA', border: 'border-sage-200', activeBorder: 'border-sage-400 ring-2 ring-sage-200', bg: 'bg-sage-50' },
  { id: 'saran' as Intent, icon: MessageSquare, title: 'Kritik & saran', desc: 'Saya ingin memberikan masukan', border: 'border-stone-200', activeBorder: 'border-stone-400 ring-2 ring-stone-200', bg: 'bg-stone-50' },
]

const tierInfo: Record<string, { label: string; benefit: string; free: boolean }> = {
  starter: { label: 'Starter Partner', benefit: 'Antar mandiri ke dropoff · Gratis selamanya', free: true },
  growth:  { label: 'Growth Partner', benefit: 'Penjemputan terjadwal · Laporan ESG bulanan', free: false },
  impact:  { label: 'Impact Partner', benefit: 'Penjemputan prioritas · Insight mendalam · Co-branding', free: false },
}

export default function GetInTouchPage() {
  const supabase = createClient()
  const [intent, setIntent] = useState<Intent>(null)
  const [mitraForm, setMitraForm] = useState({ business_name: '', business_type: '', desired_tier: 'starter', estimated_volume: '', pic_name: '', pic_phone: '' })
  const [mitraLoading, setMitraLoading] = useState(false)
  const [mitraResult, setMitraResult]   = useState<{ app_number: string; tier: string } | null>(null)
  const [mitraError, setMitraError]     = useState<string | null>(null)
  const [contactForm, setContactForm]   = useState({ sender_name: '', sender_email: '', category: '', message: '' })
  const [contactLoading, setContactLoading] = useState(false)
  const [contactDone, setContactDone]       = useState(false)
  const [contactError, setContactError]     = useState<string | null>(null)

  async function handleMitraSubmit(e: React.FormEvent) {
    e.preventDefault()
    setMitraLoading(true)
    setMitraError(null)
    const { data, error } = await supabase.from('partner_applications').insert([{
      business_name: mitraForm.business_name, business_type: mitraForm.business_type,
      desired_tier: mitraForm.desired_tier, estimated_volume: mitraForm.estimated_volume,
      pic_name: mitraForm.pic_name, pic_phone: mitraForm.pic_phone,
    }]).select('app_number, desired_tier').single()
    setMitraLoading(false)
    if (error || !data) setMitraError('Gagal mengirim. Silakan coba lagi.')
    else setMitraResult({ app_number: data.app_number, tier: data.desired_tier })
  }

  async function handleContactSubmit(e: React.FormEvent) {
    e.preventDefault()
    setContactLoading(true)
    setContactError(null)
    const { error } = await supabase.from('contact_messages').insert([{
      sender_name: contactForm.sender_name, sender_email: contactForm.sender_email,
      category: contactForm.category || (intent === 'pertanyaan' ? 'pertanyaan' : 'lainnya'),
      message: contactForm.message,
    }])
    setContactLoading(false)
    if (error) setContactError('Gagal mengirim. Silakan coba lagi.')
    else setContactDone(true)
  }

  return (
    <>
      <Navbar />
      <main className="pt-24 pb-20 max-w-5xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-semibold text-stone-800 mb-3">Hubungi ESALOKA</h1>
          <p className="text-stone-500 max-w-lg mx-auto mb-4">Pilih kebutuhan Anda, kami siapkan form yang tepat.</p>
          <div className="inline-flex items-center gap-2 bg-stone-50 border border-stone-100 rounded-xl px-4 py-2">
            <ShoppingBag size={13} className="text-gold-400" />
            <p className="text-xs text-stone-500">
              Ingin memesan produk?{' '}
              <Link href="/product" className="text-gold-600 font-medium hover:underline">Ke halaman produk →</Link>
            </p>
          </div>
        </div>

        {/* Intent selector */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
          {intentOptions.map(opt => {
            const Icon = opt.icon
            const isActive = intent === opt.id
            return (
              <button key={String(opt.id)} onClick={() => setIntent(opt.id)}
                className={`text-left p-5 rounded-2xl border-2 transition-all duration-200 ${isActive ? opt.activeBorder + ' ' + opt.bg : 'border-stone-200 bg-white hover:border-stone-300'}`}>
                <Icon size={20} className={`mb-3 ${isActive ? 'text-gold-500' : 'text-stone-400'}`} />
                <p className="font-semibold text-stone-800 text-sm mb-1">{opt.title}</p>
                <p className="text-xs text-stone-500">{opt.desc}</p>
              </button>
            )
          })}
        </div>

        {/* Mitra form */}
        {intent === 'mitra' && !mitraResult && (
          <div className="max-w-2xl mx-auto">
            <div className="card border-2 border-gold-200">
              <h2 className="text-lg font-semibold text-stone-800 mb-1">Formulir pendaftaran mitra</h2>
              <p className="text-sm text-stone-400 mb-6">Isi data bisnis Anda untuk memulai kemitraan</p>
              <form onSubmit={handleMitraSubmit} className="flex flex-col gap-4">
                <div><label className="label">Nama bisnis</label>
                  <input className="input" placeholder="Hotel / Restoran / Catering Anda" required value={mitraForm.business_name} onChange={e => setMitraForm(f => ({ ...f, business_name: e.target.value }))} /></div>
                <div className="grid grid-cols-2 gap-3">
                  <div><label className="label">Tipe bisnis</label>
                    <select className="select" required value={mitraForm.business_type} onChange={e => setMitraForm(f => ({ ...f, business_type: e.target.value }))}>
                      <option value="">Pilih tipe...</option>
                      <option value="hotel">Hotel</option><option value="restoran">Restoran</option>
                      <option value="catering">Catering</option><option value="lainnya">Lainnya</option>
                    </select></div>
                  <div><label className="label">Estimasi volume/hari</label>
                    <select className="select" required value={mitraForm.estimated_volume} onChange={e => setMitraForm(f => ({ ...f, estimated_volume: e.target.value }))}>
                      <option value="">Pilih estimasi...</option>
                      <option value="<20kg">Kurang dari 20 Kg</option><option value="20-50kg">20 — 50 Kg</option>
                      <option value="50-100kg">50 — 100 Kg</option><option value=">100kg">Lebih dari 100 Kg</option>
                    </select></div>
                </div>
                <div><label className="label">Paket kemitraan</label>
                  <div className="flex flex-col gap-2">
                    {Object.entries(tierInfo).map(([key, info]) => (
                      <label key={key} className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-all ${mitraForm.desired_tier === key ? 'border-gold-400 bg-gold-50' : 'border-stone-200 bg-white hover:border-stone-300'}`}>
                        <input type="radio" name="tier" value={key} checked={mitraForm.desired_tier === key} onChange={e => setMitraForm(f => ({ ...f, desired_tier: e.target.value }))} className="mt-0.5 accent-amber-500" />
                        <div><p className="text-sm font-medium text-stone-800">{info.label}{info.free && <span className="ml-2 text-xs text-sage-600">(Gratis)</span>}</p>
                          <p className="text-xs text-stone-400 mt-0.5">{info.benefit}</p></div>
                      </label>
                    ))}
                  </div></div>
                <div className="grid grid-cols-2 gap-3">
                  <div><label className="label">Penanggung jawab</label>
                    <input className="input" placeholder="Nama lengkap" required value={mitraForm.pic_name} onChange={e => setMitraForm(f => ({ ...f, pic_name: e.target.value }))} /></div>
                  <div><label className="label">Nomor WhatsApp</label>
                    <input className="input" placeholder="08xx-xxxx-xxxx" required value={mitraForm.pic_phone} onChange={e => setMitraForm(f => ({ ...f, pic_phone: e.target.value }))} /></div>
                </div>
                {mitraError && <p className="text-sm text-red-500 bg-red-50 px-4 py-3 rounded-xl">{mitraError}</p>}
                <button type="submit" disabled={mitraLoading} className="btn-primary flex items-center justify-center gap-2">
                  {mitraLoading && <Loader2 size={16} className="animate-spin" />}
                  {mitraLoading ? 'Mengirim...' : 'Ajukan pendaftaran'}
                </button>
                <p className="text-xs text-stone-400 text-center">Dengan mendaftar, Anda menyetujui untuk dihubungi oleh tim ESALOKA.</p>
              </form>
            </div>
          </div>
        )}

        {/* Mitra confirmation */}
        {intent === 'mitra' && mitraResult && (
          <div className="max-w-2xl mx-auto">
            <div className="card text-center">
              <div className="w-14 h-14 rounded-full bg-gold-50 flex items-center justify-center mx-auto mb-4">
                <CheckCircle size={28} className="text-gold-400" />
              </div>
              <h2 className="text-xl font-semibold text-stone-800 mb-2">Pendaftaran diterima!</h2>
              <p className="text-stone-500 text-sm mb-6">Tim ESALOKA akan menghubungi Anda dalam 1×24 jam.</p>
              <div className="bg-gold-50 border border-gold-200 rounded-xl px-6 py-4 mb-5">
                <p className="text-xs text-stone-400 mb-1">Nomor Aplikasi Anda</p>
                <p className="text-3xl font-bold text-gold-600 font-mono tracking-widest">{mitraResult.app_number}</p>
                <p className="text-xs text-stone-400 mt-1">Simpan nomor ini untuk konfirmasi proses selanjutnya</p>
              </div>
              {mitraResult.tier !== 'starter' ? (
                <div className="bg-amber-50 border border-amber-200 rounded-xl px-5 py-4 mb-5 text-left">
                  <p className="text-sm font-semibold text-amber-800 mb-2">Informasi Pembayaran — {tierInfo[mitraResult.tier]?.label}</p>
                  <p className="text-xs text-amber-700 mb-3">Untuk mengaktifkan paket ini, lakukan transfer ke:</p>
                  <div className="bg-white rounded-lg p-3 border border-amber-100 text-xs space-y-1.5 mb-3">
                    <div className="flex justify-between"><span className="text-stone-500">Bank</span><span className="font-medium text-stone-800">BCA / BRI / Mandiri</span></div>
                    <div className="flex justify-between"><span className="text-stone-500">No. Rekening</span><span className="font-mono font-medium text-stone-800">XXXX-XXXX-XXXX</span></div>
                    <div className="flex justify-between"><span className="text-stone-500">Atas Nama</span><span className="font-medium text-stone-800">ESALOKA</span></div>
                  </div>
                  <p className="text-xs text-amber-700">Kirim bukti transfer ke WA kami. Sertakan nomor aplikasi <strong>{mitraResult.app_number}</strong>.</p>
                </div>
              ) : (
                <div className="bg-sage-50 border border-sage-200 rounded-xl px-5 py-4 mb-5 text-left">
                  <p className="text-sm font-semibold text-sage-700 mb-1">Starter Partner — Gratis!</p>
                  <p className="text-xs text-sage-600">Tidak ada pembayaran diperlukan. Tim kami akan menghubungi Anda untuk onboarding dan info dropoff terdekat.</p>
                </div>
              )}
              <div className="flex gap-3">
                <a href={`https://wa.me/6281234567890?text=${encodeURIComponent('Halo ESALOKA! Saya baru mendaftar mitra dengan nomor aplikasi ' + mitraResult.app_number)}`}
                  target="_blank" rel="noopener noreferrer" className="btn-primary flex-1 text-center text-sm">
                  Konfirmasi via WhatsApp
                </a>
                <Link href="/" className="btn-secondary text-sm px-4">Kembali</Link>
              </div>
            </div>
          </div>
        )}

        {/* Contact / Saran form */}
        {(intent === 'pertanyaan' || intent === 'saran') && (
          <div className="max-w-2xl mx-auto">
            <div className="card">
              <h2 className="text-lg font-semibold text-stone-800 mb-1">{intent === 'pertanyaan' ? 'Kirim pertanyaan' : 'Sampaikan kritik & saran'}</h2>
              <p className="text-sm text-stone-400 mb-6">Kami akan merespons dalam 1×24 jam di hari kerja</p>
              {contactDone ? (
                <div className="flex flex-col items-center gap-3 py-10 text-center">
                  <CheckCircle size={40} className="text-sage-500" />
                  <p className="font-medium text-stone-700">Pesan terkirim!</p>
                  <p className="text-sm text-stone-400">Terima kasih. Tim kami akan segera menghubungi Anda.</p>
                  <button onClick={() => { setContactDone(false); setContactForm({ sender_name: '', sender_email: '', category: '', message: '' }) }} className="btn-ghost text-sm mt-2">Kirim pesan lain</button>
                </div>
              ) : (
                <form onSubmit={handleContactSubmit} className="flex flex-col gap-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div><label className="label">Nama lengkap</label>
                      <input className="input" placeholder="Nama Anda" required value={contactForm.sender_name} onChange={e => setContactForm(f => ({ ...f, sender_name: e.target.value }))} /></div>
                    <div><label className="label">Email</label>
                      <input className="input" type="email" placeholder="email@contoh.com" required value={contactForm.sender_email} onChange={e => setContactForm(f => ({ ...f, sender_email: e.target.value }))} /></div>
                  </div>
                  {intent === 'saran' && (
                    <div><label className="label">Kategori</label>
                      <select className="select" required value={contactForm.category} onChange={e => setContactForm(f => ({ ...f, category: e.target.value }))}>
                        <option value="">Pilih kategori...</option>
                        <option value="saran_fitur">Saran fitur</option>
                        <option value="laporan_masalah">Laporan masalah</option>
                        <option value="lainnya">Lainnya</option>
                      </select></div>
                  )}
                  <div><label className="label">{intent === 'pertanyaan' ? 'Pertanyaan Anda' : 'Pesan Anda'}</label>
                    <textarea className="textarea" required placeholder={intent === 'pertanyaan' ? 'Tuliskan pertanyaan Anda...' : 'Tuliskan masukan Anda...'} value={contactForm.message} onChange={e => setContactForm(f => ({ ...f, message: e.target.value }))} /></div>
                  {contactError && <p className="text-sm text-red-500 bg-red-50 px-4 py-3 rounded-xl">{contactError}</p>}
                  <button type="submit" disabled={contactLoading} className="btn-primary flex items-center justify-center gap-2">
                    {contactLoading && <Loader2 size={16} className="animate-spin" />}
                    {contactLoading ? 'Mengirim...' : 'Kirim pesan'}
                  </button>
                </form>
              )}
            </div>
          </div>
        )}

        <div className="mt-10 text-center">
          <p className="text-xs text-stone-400 mb-2">Atau hubungi langsung</p>
          <div className="flex gap-4 justify-center">
            <a href="https://wa.me/6281234567890" target="_blank" rel="noopener noreferrer" className="text-sm text-sage-600 hover:text-sage-700 font-medium">WhatsApp →</a>
            <a href="mailto:hello@esaloka.com" className="text-sm text-gold-600 hover:text-gold-700 font-medium">hello@esaloka.com →</a>
          </div>
        </div>
      </main>
    </>
  )
}
