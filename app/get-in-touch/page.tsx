'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Navbar } from '@/components/layout/Navbar'
import { createClient } from '@/lib/supabase/client'
import { CheckCircle, Loader2 } from 'lucide-react'

export default function GetInTouchPage() {
  const supabase = createClient()

  // ── Contact form state ────────────────────────────
  const [contact, setContact] = useState({
    sender_name: '', sender_email: '', category: '', message: '',
  })
  const [contactLoading, setContactLoading] = useState(false)
  const [contactDone, setContactDone]       = useState(false)
  const [contactError, setContactError]     = useState<string | null>(null)

  // ── Partner application state ─────────────────────
  const [app, setApp] = useState({
    business_name: '', business_type: '', desired_tier: 'starter',
    estimated_volume: '', pic_name: '', pic_phone: '',
  })
  const [appLoading, setAppLoading] = useState(false)
  const [appDone, setAppDone]       = useState(false)
  const [appError, setAppError]     = useState<string | null>(null)

  async function handleContact(e: React.FormEvent) {
    e.preventDefault()
    setContactLoading(true)
    setContactError(null)

    const { error } = await supabase.from('contact_messages').insert([{
      sender_name:  contact.sender_name,
      sender_email: contact.sender_email,
      category:     contact.category,
      message:      contact.message,
    }])

    setContactLoading(false)
    if (error) {
      setContactError('Gagal mengirim pesan. Silakan coba lagi.')
    } else {
      setContactDone(true)
    }
  }

  async function handleApp(e: React.FormEvent) {
    e.preventDefault()
    setAppLoading(true)
    setAppError(null)

    const { error } = await supabase.from('partner_applications').insert([{
      business_name:    app.business_name,
      business_type:    app.business_type,
      desired_tier:     app.desired_tier,
      estimated_volume: app.estimated_volume,
      pic_name:         app.pic_name,
      pic_phone:        app.pic_phone,
    }])

    setAppLoading(false)
    if (error) {
      setAppError('Gagal mengirim pendaftaran. Silakan coba lagi.')
    } else {
      setAppDone(true)
    }
  }

  return (
    <>
      <Navbar />
      <main className="pt-24 pb-20 max-w-6xl mx-auto px-4 sm:px-6">

        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-semibold text-stone-800 mb-3">
            Hubungi ESALOKA
          </h1>
          <p className="text-stone-500 max-w-lg mx-auto">
            Sampaikan saran atau kritik, atau mulai perjalanan kemitraan bersama kami.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

          {/* ── Kritik & Saran ─────────────────────────────── */}
          <div className="card">
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-stone-800 mb-1">Kritik & saran</h2>
              <p className="text-sm text-stone-400">Bantu kami berkembang lebih baik</p>
            </div>

            {contactDone ? (
              <div className="flex flex-col items-center gap-3 py-10 text-center">
                <CheckCircle size={40} className="text-sage-500" />
                <p className="font-medium text-stone-700">Pesan terkirim!</p>
                <p className="text-sm text-stone-400">Terima kasih atas masukan Anda. Tim kami akan meninjau pesan ini.</p>
                <button
                  onClick={() => { setContactDone(false); setContact({ sender_name: '', sender_email: '', category: '', message: '' }) }}
                  className="btn-ghost text-sm mt-2"
                >
                  Kirim pesan lain
                </button>
              </div>
            ) : (
              <form onSubmit={handleContact} className="flex flex-col gap-4">
                <div>
                  <label className="label">Nama lengkap</label>
                  <input className="input" placeholder="Nama Anda" required
                    value={contact.sender_name}
                    onChange={e => setContact(p => ({ ...p, sender_name: e.target.value }))} />
                </div>
                <div>
                  <label className="label">Email</label>
                  <input className="input" type="email" placeholder="email@contoh.com" required
                    value={contact.sender_email}
                    onChange={e => setContact(p => ({ ...p, sender_email: e.target.value }))} />
                </div>
                <div>
                  <label className="label">Kategori pesan</label>
                  <select className="select" required
                    value={contact.category}
                    onChange={e => setContact(p => ({ ...p, category: e.target.value }))}>
                    <option value="">Pilih kategori...</option>
                    <option value="saran_fitur">Saran fitur</option>
                    <option value="laporan_masalah">Laporan masalah</option>
                    <option value="pertanyaan">Pertanyaan umum</option>
                    <option value="lainnya">Lainnya</option>
                  </select>
                </div>
                <div>
                  <label className="label">Pesan</label>
                  <textarea className="textarea" placeholder="Tuliskan pesan Anda di sini..." required
                    value={contact.message}
                    onChange={e => setContact(p => ({ ...p, message: e.target.value }))} />
                </div>
                {contactError && (
                  <p className="text-sm text-red-500 bg-red-50 px-4 py-3 rounded-xl">{contactError}</p>
                )}
                <button type="submit" disabled={contactLoading} className="btn-primary flex items-center justify-center gap-2">
                  {contactLoading && <Loader2 size={16} className="animate-spin" />}
                  {contactLoading ? 'Mengirim...' : 'Kirim pesan'}
                </button>
              </form>
            )}
          </div>

          {/* ── Daftar Mitra ───────────────────────────────── */}
          <div id="daftar" className="card border-2 border-gold-200">
            <div className="mb-6">
              <div className="inline-block text-xs font-medium bg-gold-50 text-gold-700 px-2.5 py-1 rounded-full mb-2">
                Kemitraan
              </div>
              <h2 className="text-lg font-semibold text-stone-800 mb-1">Daftar sebagai mitra</h2>
              <p className="text-sm text-stone-400">Mulai kelola limbah organik bisnis Anda bersama ESALOKA</p>
            </div>

            {appDone ? (
              <div className="flex flex-col items-center gap-3 py-10 text-center">
                <CheckCircle size={40} className="text-gold-400" />
                <p className="font-medium text-stone-700">Pendaftaran diterima!</p>
                <p className="text-sm text-stone-400 max-w-xs">
                  Tim ESALOKA akan menghubungi Anda dalam 1×24 jam untuk proses selanjutnya.
                </p>
              </div>
            ) : (
              <form onSubmit={handleApp} className="flex flex-col gap-4">
                <div>
                  <label className="label">Nama bisnis</label>
                  <input className="input" placeholder="Hotel / Restoran / Catering Anda" required
                    value={app.business_name}
                    onChange={e => setApp(p => ({ ...p, business_name: e.target.value }))} />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="label">Tipe bisnis</label>
                    <select className="select" required
                      value={app.business_type}
                      onChange={e => setApp(p => ({ ...p, business_type: e.target.value }))}>
                      <option value="">Pilih tipe...</option>
                      <option value="hotel">Hotel</option>
                      <option value="restoran">Restoran</option>
                      <option value="catering">Catering</option>
                      <option value="lainnya">Lainnya</option>
                    </select>
                  </div>
                  <div>
                    <label className="label">Paket diminati</label>
                    <select className="select"
                      value={app.desired_tier}
                      onChange={e => setApp(p => ({ ...p, desired_tier: e.target.value }))}>
                      <option value="starter">Starter (gratis)</option>
                      <option value="growth">Growth partner</option>
                      <option value="impact">Impact partner</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="label">Estimasi volume limbah per hari</label>
                  <select className="select" required
                    value={app.estimated_volume}
                    onChange={e => setApp(p => ({ ...p, estimated_volume: e.target.value }))}>
                    <option value="">Pilih estimasi...</option>
                    <option value="<20kg">Kurang dari 20 Kg</option>
                    <option value="20-50kg">20 — 50 Kg</option>
                    <option value="50-100kg">50 — 100 Kg</option>
                    <option value=">100kg">Lebih dari 100 Kg</option>
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="label">Penanggung jawab</label>
                    <input className="input" placeholder="Nama lengkap" required
                      value={app.pic_name}
                      onChange={e => setApp(p => ({ ...p, pic_name: e.target.value }))} />
                  </div>
                  <div>
                    <label className="label">Nomor WhatsApp</label>
                    <input className="input" placeholder="08xx-xxxx-xxxx" required
                      value={app.pic_phone}
                      onChange={e => setApp(p => ({ ...p, pic_phone: e.target.value }))} />
                  </div>
                </div>
                {appError && (
                  <p className="text-sm text-red-500 bg-red-50 px-4 py-3 rounded-xl">{appError}</p>
                )}
                <button type="submit" disabled={appLoading} className="btn-primary flex items-center justify-center gap-2">
                  {appLoading && <Loader2 size={16} className="animate-spin" />}
                  {appLoading ? 'Mengirim...' : 'Ajukan kemitraan'}
                </button>
                <p className="text-xs text-stone-400 text-center">
                  Dengan mendaftar, Anda menyetujui untuk dihubungi oleh tim ESALOKA.
                </p>
              </form>
            )}
          </div>
        </div>

        <div className="text-center mt-8">
          <Link href="/" className="text-sm text-stone-400 hover:text-stone-600">← Kembali ke beranda</Link>
        </div>
      </main>
    </>
  )
}
