export default function AdminPengaturanPage() {
  return (
    <div className="page-enter">
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-stone-800">Pengaturan sistem</h1>
        <p className="text-sm text-stone-400 mt-0.5">Konfigurasi platform ESALOKA</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {[
          { title: 'Manajemen user & role', desc: 'Tambah, edit, atau nonaktifkan akun pengguna. Kelola role admin, mitra, dan DLH.', badge: 'Segera' },
          { title: 'Konfigurasi tier & benefit', desc: 'Atur fitur yang tersedia per subscription tier dan harga kemitraan.', badge: 'Segera' },
          { title: 'Informasi kontak bisnis', desc: 'Nomor WhatsApp, email, dan rekening bank yang tampil di halaman publik.', badge: 'Segera' },
          { title: 'Integrasi IoT', desc: 'Konfigurasi koneksi sensor timbang otomatis untuk pencatatan berat real-time.', badge: 'Fase 3' },
        ].map((item, i) => (
          <div key={i} className="card opacity-60">
            <div className="flex items-start justify-between mb-2">
              <h3 className="font-semibold text-stone-700">{item.title}</h3>
              <span className="badge badge-gray text-[10px]">{item.badge}</span>
            </div>
            <p className="text-sm text-stone-400 leading-relaxed">{item.desc}</p>
          </div>
        ))}
      </div>

      <div className="mt-6 p-4 bg-gold-50 border border-gold-200 rounded-xl">
        <p className="text-sm text-gold-700 font-medium mb-1">Halaman ini sedang dikembangkan</p>
        <p className="text-xs text-gold-600">
          Fitur pengaturan sistem akan tersedia pada Fase 2. Untuk kebutuhan konfigurasi saat ini,
          lakukan langsung melalui Supabase dashboard.
        </p>
      </div>
    </div>
  )
}
