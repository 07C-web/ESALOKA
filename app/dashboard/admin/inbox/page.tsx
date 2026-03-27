'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { formatDate } from '@/lib/utils'
import { MessageCircle, Users, Filter } from 'lucide-react'

type Tab = 'messages' | 'applications'
type MsgStatus = 'baru' | 'dibaca' | 'ditindaklanjuti'

const categoryLabel: Record<string, string> = {
  saran_fitur: 'Saran fitur',
  laporan_masalah: 'Laporan masalah',
  pertanyaan: 'Pertanyaan',
  lainnya: 'Lainnya',
}

const appStatusLabel: Record<string, string> = {
  pending: 'Pending',
  reviewed: 'Ditinjau',
  approved: 'Disetujui',
  rejected: 'Ditolak',
}

const appStatusColors: Record<string, string> = {
  pending: 'badge-gold',
  reviewed: 'badge-blue',
  approved: 'badge-sage',
  rejected: 'bg-red-50 text-red-600',
}

export default function AdminInboxPage() {
  const supabase = createClient()

  const [tab, setTab]         = useState<Tab>('messages')
  const [messages, setMessages] = useState<any[]>([])
  const [apps, setApps]       = useState<any[]>([])
  const [filter, setFilter]   = useState<string>('semua')

  useEffect(() => {
    loadMessages()
    loadApps()
  }, [])

  async function loadMessages() {
    const { data } = await supabase
      .from('contact_messages').select('*').order('created_at', { ascending: false })
    setMessages(data || [])
  }

  async function loadApps() {
    const { data } = await supabase
      .from('partner_applications').select('*').order('created_at', { ascending: false })
    setApps(data || [])
  }

  async function updateMessageStatus(id: string, status: MsgStatus) {
    await supabase.from('contact_messages').update({ status }).eq('id', id)
    setMessages(prev => prev.map(m => m.id === id ? { ...m, status } : m))
  }

  async function updateAppStatus(id: string, status: string) {
    await supabase.from('partner_applications').update({ status }).eq('id', id)
    setApps(prev => prev.map(a => a.id === id ? { ...a, status } : a))
  }

  const newCount = messages.filter(m => m.status === 'baru').length
  const pendingCount = apps.filter(a => a.status === 'pending').length

  const filteredMessages = filter === 'semua'
    ? messages
    : messages.filter(m => m.status === filter)

  return (
    <div className="page-enter">
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-stone-800">Inbox get in touch</h1>
        <p className="text-sm text-stone-400 mt-0.5">Pesan masuk & pendaftaran mitra baru</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 border-b border-stone-100 pb-0">
        <button
          onClick={() => setTab('messages')}
          className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${
            tab === 'messages'
              ? 'border-gold-400 text-gold-600'
              : 'border-transparent text-stone-400 hover:text-stone-600'
          }`}
        >
          <MessageCircle size={15} />
          Kritik & saran
          {newCount > 0 && (
            <span className="w-4 h-4 rounded-full bg-gold-400 text-white text-[10px] font-bold flex items-center justify-center">
              {newCount}
            </span>
          )}
        </button>
        <button
          onClick={() => setTab('applications')}
          className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${
            tab === 'applications'
              ? 'border-gold-400 text-gold-600'
              : 'border-transparent text-stone-400 hover:text-stone-600'
          }`}
        >
          <Users size={15} />
          Pendaftaran mitra
          {pendingCount > 0 && (
            <span className="w-4 h-4 rounded-full bg-gold-400 text-white text-[10px] font-bold flex items-center justify-center">
              {pendingCount}
            </span>
          )}
        </button>
      </div>

      {/* Messages tab */}
      {tab === 'messages' && (
        <div>
          {/* Filter */}
          <div className="flex items-center gap-2 mb-4">
            <Filter size={14} className="text-stone-400" />
            {['semua', 'baru', 'dibaca', 'ditindaklanjuti'].map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`text-xs px-3 py-1.5 rounded-full border transition-colors capitalize ${
                  filter === f
                    ? 'bg-gold-50 border-gold-200 text-gold-700'
                    : 'border-stone-200 text-stone-500 hover:border-stone-300'
                }`}
              >
                {f}
              </button>
            ))}
          </div>

          <div className="flex flex-col gap-3">
            {filteredMessages.map((msg: any) => (
              <div key={msg.id} className="card hover:border-stone-200 transition-colors">
                <div className="flex items-start justify-between gap-4 flex-wrap">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <span className="font-medium text-stone-800 text-sm">{msg.sender_name}</span>
                      <span className="text-stone-400 text-xs">{msg.sender_email}</span>
                      <span className="badge badge-gray text-[10px]">
                        {categoryLabel[msg.category] || msg.category}
                      </span>
                    </div>
                    <p className="text-sm text-stone-600 leading-relaxed">{msg.message}</p>
                    <p className="text-xs text-stone-400 mt-2">{formatDate(msg.created_at)}</p>
                  </div>
                  <div className="flex flex-col items-end gap-2 shrink-0">
                    <span className={`badge text-[10px] ${
                      msg.status === 'baru' ? 'badge-gold' :
                      msg.status === 'dibaca' ? 'badge-gray' : 'badge-sage'
                    }`}>
                      {msg.status === 'baru' ? 'Baru' : msg.status === 'dibaca' ? 'Dibaca' : 'Ditindaklanjuti'}
                    </span>
                    <select
                      className="text-xs border border-stone-200 rounded-lg px-2 py-1 bg-white text-stone-600 cursor-pointer"
                      value={msg.status}
                      onChange={e => updateMessageStatus(msg.id, e.target.value as MsgStatus)}
                    >
                      <option value="baru">Tandai: Baru</option>
                      <option value="dibaca">Tandai: Dibaca</option>
                      <option value="ditindaklanjuti">Tandai: Ditindaklanjuti</option>
                    </select>
                  </div>
                </div>
              </div>
            ))}
            {filteredMessages.length === 0 && (
              <div className="text-center py-12 text-stone-400">
                <MessageCircle size={32} className="mx-auto mb-3 opacity-30" />
                <p className="text-sm">Tidak ada pesan</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Applications tab */}
      {tab === 'applications' && (
        <div className="flex flex-col gap-3">
          {apps.map((app: any) => (
            <div key={app.id} className="card hover:border-stone-200 transition-colors">
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <span className="font-medium text-stone-800">{app.business_name}</span>
                    <span className="badge badge-gray text-[10px] capitalize">{app.business_type}</span>
                    <span className={`badge text-[10px] ${
                      app.desired_tier === 'starter' ? 'badge-sage' :
                      app.desired_tier === 'growth' ? 'badge-gold' : 'bg-gold-100 text-gold-800 border border-gold-300'
                    }`}>
                      {app.desired_tier} partner
                    </span>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-1 mt-2">
                    <span className="text-xs text-stone-400">PIC: <span className="text-stone-600">{app.pic_name}</span></span>
                    <span className="text-xs text-stone-400">WA: <span className="text-stone-600">{app.pic_phone}</span></span>
                    <span className="text-xs text-stone-400">Volume: <span className="text-stone-600">{app.estimated_volume}/hari</span></span>
                  </div>
                  <p className="text-xs text-stone-400 mt-2">{formatDate(app.created_at)}</p>
                </div>
                <div className="flex flex-col items-end gap-2 shrink-0">
                  <span className={`badge text-[10px] ${appStatusColors[app.status] || 'badge-gray'}`}>
                    {appStatusLabel[app.status] || app.status}
                  </span>
                  <select
                    className="text-xs border border-stone-200 rounded-lg px-2 py-1 bg-white text-stone-600 cursor-pointer"
                    value={app.status}
                    onChange={e => updateAppStatus(app.id, e.target.value)}
                  >
                    <option value="pending">Pending</option>
                    <option value="reviewed">Ditinjau</option>
                    <option value="approved">Setujui</option>
                    <option value="rejected">Tolak</option>
                  </select>
                </div>
              </div>
            </div>
          ))}
          {apps.length === 0 && (
            <div className="text-center py-12 text-stone-400">
              <Users size={32} className="mx-auto mb-3 opacity-30" />
              <p className="text-sm">Belum ada pendaftaran mitra</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
