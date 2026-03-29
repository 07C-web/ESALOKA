"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { formatDate } from "@/lib/utils";
import {
  MessageCircle,
  Users,
  Filter,
  Check,
  X,
  ChevronRight,
  Loader2,
  Copy,
  Phone,
} from "lucide-react";

type Tab = "messages" | "applications";
type MsgStatus = "baru" | "dibaca" | "ditindaklanjuti";
type AppStatus = "pending" | "reviewed" | "approved" | "rejected";

// ── Status flow: hanya bisa maju, tidak bisa mundur ──────────
const STATUS_ORDER: Record<AppStatus, number> = {
  pending: 0,
  reviewed: 1,
  approved: 2,
  rejected: 2,
};

const categoryLabel: Record<string, string> = {
  saran_fitur: "Saran fitur",
  laporan_masalah: "Laporan masalah",
  pertanyaan: "Pertanyaan",
  lainnya: "Lainnya",
};

// ── Modal konfirmasi approve ─────────────────────────────────
function ApproveModal({
  app,
  onConfirm,
  onClose,
}: {
  app: any;
  onConfirm: () => void;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-white rounded-2xl p-6 w-full max-w-sm shadow-xl">
        <div className="w-12 h-12 rounded-full bg-sage-50 flex items-center justify-center mx-auto mb-4">
          <Check size={22} className="text-sage-600" />
        </div>
        <h3 className="font-semibold text-stone-800 text-center mb-2">
          Setujui pendaftaran?
        </h3>
        <p className="text-sm text-stone-500 text-center mb-1">
          <span className="font-medium text-stone-700">
            {app.business_name}
          </span>{" "}
          akan didaftarkan sebagai mitra.
        </p>
        <p className="text-xs text-stone-400 text-center mb-5">
          Sistem akan otomatis membuat akun login untuk mitra ini.
        </p>
        {!app.pic_email && (
          <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 mb-4">
            <p className="text-xs text-amber-700 font-medium">
              ⚠️ Email tidak tersedia
            </p>
            <p className="text-xs text-amber-600 mt-0.5">
              Calon mitra mendaftar tanpa email. Akun tidak dapat dibuat
              otomatis. Hubungi mitra untuk mendaftar ulang dengan email.
            </p>
          </div>
        )}
        <div className="flex gap-2">
          <button onClick={onClose} className="btn-secondary flex-1 text-sm">
            Batal
          </button>
          <button
            onClick={onConfirm}
            disabled={!app.pic_email}
            className="btn-primary flex-1 text-sm disabled:opacity-40"
          >
            Ya, Setujui
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Modal reject ─────────────────────────────────────────────
function RejectModal({
  app,
  onConfirm,
  onClose,
}: {
  app: any;
  onConfirm: (note: string) => void;
  onClose: () => void;
}) {
  const [note, setNote] = useState("");
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-white rounded-2xl p-6 w-full max-w-sm shadow-xl">
        <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-4">
          <X size={22} className="text-red-500" />
        </div>
        <h3 className="font-semibold text-stone-800 text-center mb-2">
          Tolak pendaftaran?
        </h3>
        <p className="text-sm text-stone-500 text-center mb-4">
          <span className="font-medium text-stone-700">
            {app.business_name}
          </span>
        </p>
        <div className="mb-4">
          <label className="label">Alasan penolakan (opsional)</label>
          <textarea
            className="textarea"
            placeholder="Contoh: Volume tidak memenuhi syarat minimum..."
            value={note}
            onChange={(e) => setNote(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <button onClick={onClose} className="btn-secondary flex-1 text-sm">
            Batal
          </button>
          <button
            onClick={() => onConfirm(note)}
            className="flex-1 bg-red-500 hover:bg-red-600 text-white font-medium px-5 py-2.5 rounded-xl text-sm transition-colors"
          >
            Tolak
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Modal hasil approve (temp password) ─────────────────────
function SuccessModal({
  result,
  onClose,
}: {
  result: { email: string; temp_password: string; business_name: string };
  onClose: () => void;
}) {
  const [copied, setCopied] = useState(false);

  function copyPassword() {
    navigator.clipboard.writeText(result.temp_password);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  const waText = encodeURIComponent(
    `Halo! Pendaftaran *${result.business_name}* sebagai mitra ESALOKA telah disetujui 🎉\n\n` +
      `Berikut kredensial login dashboard Anda:\n` +
      `Email: *${result.email}*\n` +
      `Password: *${result.temp_password}*\n\n` +
      `Login di: ${window.location.origin}/login\n\n` +
      `Segera ganti password setelah login pertama.`,
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-white rounded-2xl p-6 w-full max-w-sm shadow-xl">
        <div className="w-12 h-12 rounded-full bg-sage-50 flex items-center justify-center mx-auto mb-3">
          <Check size={22} className="text-sage-600" />
        </div>
        <h3 className="font-semibold text-stone-800 text-center mb-1">
          Mitra berhasil didaftarkan!
        </h3>
        <p className="text-xs text-stone-400 text-center mb-5">
          Kirimkan kredensial berikut ke mitra via WhatsApp
        </p>

        <div className="bg-stone-50 rounded-xl p-4 mb-4 border border-stone-100">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs text-stone-400">Email login</span>
            <span className="text-sm font-medium text-stone-700">
              {result.email}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-xs text-stone-400">Password sementara</span>
            <div className="flex items-center gap-2">
              <span className="text-sm font-mono font-bold text-stone-800">
                {result.temp_password}
              </span>
              <button
                onClick={copyPassword}
                className="p-1 hover:bg-stone-200 rounded-md transition-colors"
              >
                {copied ? (
                  <Check size={13} className="text-sage-500" />
                ) : (
                  <Copy size={13} className="text-stone-400" />
                )}
              </button>
            </div>
          </div>
        </div>

        <a
          href={`https://wa.me/${result.email}?text=${waText}`}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-primary w-full text-center flex items-center justify-center gap-2 mb-3"
        >
          <Phone size={15} /> Kirim via WhatsApp
        </a>
        <button onClick={onClose} className="btn-secondary w-full text-sm">
          Selesai
        </button>
      </div>
    </div>
  );
}

// ── Tombol aksi per status (linear, tidak bisa mundur) ───────
function AppActionButtons({
  app,
  onAction,
}: {
  app: any;
  onAction: (
    id: string,
    action: "review" | "approve" | "reject",
    app: any,
  ) => void;
}) {
  const status: AppStatus = app.status;

  const waLink = `https://wa.me/${app.pic_phone?.replace(/\D/g, "")}`;

  if (status === "pending") {
    return (
      <div className="flex items-center gap-2 flex-wrap">
        <button
          onClick={() => onAction(app.id, "review", app)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100 transition-colors"
        >
          <ChevronRight size={13} /> Tinjau
        </button>
        <a
          href={waLink}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium bg-stone-50 text-stone-600 border border-stone-200 hover:bg-stone-100 transition-colors"
        >
          <Phone size={13} /> WA
        </a>
      </div>
    );
  }

  if (status === "reviewed") {
    return (
      <div className="flex items-center gap-2 flex-wrap">
        <button
          onClick={() => onAction(app.id, "approve", app)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium bg-sage-500 text-white hover:bg-sage-600 transition-colors active:scale-95"
        >
          <Check size={13} /> Setujui
        </button>
        <button
          onClick={() => onAction(app.id, "reject", app)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium bg-red-500 text-white hover:bg-red-600 transition-colors active:scale-95"
        >
          <X size={13} /> Tolak
        </button>
        <a
          href={waLink}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium bg-stone-50 text-stone-600 border border-stone-200 hover:bg-stone-100 transition-colors"
        >
          <Phone size={13} /> WA
        </a>
      </div>
    );
  }

  // approved / rejected — final, tidak ada aksi
  return null;
}

// ── Main component ───────────────────────────────────────────
export default function AdminInboxPage() {
  const supabase = createClient();

  const [tab, setTab] = useState<Tab>("messages");
  const [messages, setMessages] = useState<any[]>([]);
  const [apps, setApps] = useState<any[]>([]);
  const [filter, setFilter] = useState<string>("semua");
  const [loading, setLoading] = useState<string | null>(null);

  // Modal states
  const [approveTarget, setApproveTarget] = useState<any | null>(null);
  const [rejectTarget, setRejectTarget] = useState<any | null>(null);
  const [successResult, setSuccessResult] = useState<any | null>(null);

  useEffect(() => {
    loadMessages();
    loadApps();
  }, []);

  async function loadMessages() {
    const { data } = await supabase
      .from("contact_messages")
      .select("*")
      .order("created_at", { ascending: false });
    setMessages(data || []);
  }

  async function loadApps() {
    const { data } = await supabase
      .from("partner_applications")
      .select("*")
      .order("created_at", { ascending: false });
    setApps(data || []);
  }

  async function updateMessageStatus(id: string, status: MsgStatus) {
    await supabase.from("contact_messages").update({ status }).eq("id", id);
    setMessages((prev) =>
      prev.map((m) => (m.id === id ? { ...m, status } : m)),
    );
  }

  // ── Handle tombol aksi ────────────────────────────────────
  function handleAction(
    id: string,
    action: "review" | "approve" | "reject",
    app: any,
  ) {
    if (action === "review") {
      moveToReviewed(id);
    } else if (action === "approve") {
      setApproveTarget(app);
    } else if (action === "reject") {
      setRejectTarget(app);
    }
  }

  async function moveToReviewed(id: string) {
    setLoading(id);
    await supabase
      .from("partner_applications")
      .update({ status: "reviewed" })
      .eq("id", id);
    setApps((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status: "reviewed" } : a)),
    );
    setLoading(null);
  }

  async function confirmApprove() {
    if (!approveTarget) return;
    setLoading(approveTarget.id);
    setApproveTarget(null);

    const res = await fetch("/api/approve-mitra", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        application_id: approveTarget.id,
        action: "approve",
      }),
    });
    const data = await res.json();
    setLoading(null);

    if (!res.ok) {
      alert(`Gagal: ${data.error}`);
      return;
    }

    setApps((prev) =>
      prev.map((a) =>
        a.id === approveTarget.id ? { ...a, status: "approved" } : a,
      ),
    );
    setSuccessResult({
      email: data.email,
      temp_password: data.temp_password,
      business_name: data.business_name,
    });
  }

  async function confirmReject(note: string) {
    if (!rejectTarget) return;
    setLoading(rejectTarget.id);
    setRejectTarget(null);

    const res = await fetch("/api/approve-mitra", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        application_id: rejectTarget.id,
        action: "reject",
        rejection_note: note,
      }),
    });
    const data = await res.json();
    setLoading(null);

    if (!res.ok) {
      alert(`Gagal: ${data.error}`);
      return;
    }

    setApps((prev) =>
      prev.map((a) =>
        a.id === rejectTarget.id ? { ...a, status: "rejected" } : a,
      ),
    );
  }

  const newCount = messages.filter((m) => m.status === "baru").length;
  const pendingCount = apps.filter((a) => a.status === "pending").length;

  const filteredMessages =
    filter === "semua" ? messages : messages.filter((m) => m.status === filter);

  return (
    <div className="page-enter">
      {/* Modals */}
      {approveTarget && (
        <ApproveModal
          app={approveTarget}
          onConfirm={confirmApprove}
          onClose={() => setApproveTarget(null)}
        />
      )}
      {rejectTarget && (
        <RejectModal
          app={rejectTarget}
          onConfirm={confirmReject}
          onClose={() => setRejectTarget(null)}
        />
      )}
      {successResult && (
        <SuccessModal
          result={successResult}
          onClose={() => setSuccessResult(null)}
        />
      )}

      <div className="mb-6">
        <h1 className="text-xl font-semibold text-stone-800">Inbox</h1>
        <p className="text-sm text-stone-400 mt-0.5">
          Pesan masuk & pendaftaran mitra baru
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 border-b border-stone-100">
        <button
          onClick={() => setTab("messages")}
          className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${
            tab === "messages"
              ? "border-gold-400 text-gold-600"
              : "border-transparent text-stone-400 hover:text-stone-600"
          }`}
        >
          <MessageCircle size={15} />
          Pesan masuk
          {newCount > 0 && (
            <span className="w-4 h-4 rounded-full bg-gold-400 text-white text-[10px] font-bold flex items-center justify-center">
              {newCount}
            </span>
          )}
        </button>
        <button
          onClick={() => setTab("applications")}
          className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${
            tab === "applications"
              ? "border-gold-400 text-gold-600"
              : "border-transparent text-stone-400 hover:text-stone-600"
          }`}
        >
          <Users size={15} />
          Pendaftaran mitra
          {pendingCount > 0 && (
            <span className="w-4 h-4 rounded-full bg-red-400 text-white text-[10px] font-bold flex items-center justify-center">
              {pendingCount}
            </span>
          )}
        </button>
      </div>

      {/* ── Messages tab ── */}
      {tab === "messages" && (
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Filter size={14} className="text-stone-400" />
            {["semua", "baru", "dibaca", "ditindaklanjuti"].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`text-xs px-3 py-1.5 rounded-full border transition-colors capitalize ${
                  filter === f
                    ? "bg-gold-50 border-gold-200 text-gold-700"
                    : "border-stone-200 text-stone-500 hover:border-stone-300"
                }`}
              >
                {f}
              </button>
            ))}
          </div>

          <div className="flex flex-col gap-3">
            {filteredMessages.map((msg: any) => (
              <div
                key={msg.id}
                className="card hover:border-stone-200 transition-colors"
              >
                <div className="flex items-start justify-between gap-4 flex-wrap">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <span className="font-medium text-stone-800 text-sm">
                        {msg.sender_name}
                      </span>
                      <span className="text-stone-400 text-xs">
                        {msg.sender_email}
                      </span>
                      <span className="badge badge-gray text-[10px]">
                        {categoryLabel[msg.category] || msg.category}
                      </span>
                    </div>
                    <p className="text-sm text-stone-600 leading-relaxed">
                      {msg.message}
                    </p>
                    <p className="text-xs text-stone-400 mt-2">
                      {formatDate(msg.created_at)}
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-2 shrink-0">
                    <span
                      className={`badge text-[10px] ${
                        msg.status === "baru"
                          ? "badge-gold"
                          : msg.status === "dibaca"
                            ? "badge-gray"
                            : "badge-sage"
                      }`}
                    >
                      {msg.status === "baru"
                        ? "Baru"
                        : msg.status === "dibaca"
                          ? "Dibaca"
                          : "Ditindaklanjuti"}
                    </span>
                    <select
                      className="text-xs border border-stone-200 rounded-lg px-2 py-1 bg-white text-stone-600 cursor-pointer"
                      value={msg.status}
                      onChange={(e) =>
                        updateMessageStatus(msg.id, e.target.value as MsgStatus)
                      }
                    >
                      <option value="baru">Tandai: Baru</option>
                      <option value="dibaca">Tandai: Dibaca</option>
                      <option value="ditindaklanjuti">
                        Tandai: Ditindaklanjuti
                      </option>
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

      {/* ── Applications tab ── */}
      {tab === "applications" && (
        <div className="flex flex-col gap-3">
          {apps.map((app: any) => {
            const status: AppStatus = app.status;
            const isFinal = status === "approved" || status === "rejected";
            const isLoading = loading === app.id;

            return (
              <div
                key={app.id}
                className={`card transition-colors ${
                  isFinal ? "opacity-70" : "hover:border-stone-200"
                }`}
              >
                <div className="flex items-start justify-between gap-4 flex-wrap">
                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span className="font-medium text-stone-800">
                        {app.business_name}
                      </span>
                      <span className="badge badge-gray text-[10px] capitalize">
                        {app.business_type}
                      </span>
                      <span
                        className={`badge text-[10px] ${
                          app.desired_tier === "starter"
                            ? "badge-sage"
                            : app.desired_tier === "growth"
                              ? "badge-gold"
                              : "bg-gold-100 text-gold-800 border border-gold-300"
                        }`}
                      >
                        {app.desired_tier} partner
                      </span>
                      {app.app_number && (
                        <span className="text-[10px] text-stone-400 font-mono">
                          {app.app_number}
                        </span>
                      )}
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-1 mt-2">
                      <span className="text-xs text-stone-400">
                        PIC:{" "}
                        <span className="text-stone-600">{app.pic_name}</span>
                      </span>
                      <span className="text-xs text-stone-400">
                        WA:{" "}
                        <span className="text-stone-600">{app.pic_phone}</span>
                      </span>
                      <span className="text-xs text-stone-400">
                        Volume:{" "}
                        <span className="text-stone-600">
                          {app.estimated_volume}/hari
                        </span>
                      </span>
                      <span className="text-xs text-stone-400">
                        Email:{" "}
                        <span
                          className={
                            app.pic_email ? "text-stone-600" : "text-amber-500"
                          }
                        >
                          {app.pic_email || "⚠️ tidak ada"}
                        </span>
                      </span>
                    </div>

                    {app.rejection_note && (
                      <p className="text-xs text-red-500 mt-2 bg-red-50 px-3 py-1.5 rounded-lg">
                        Alasan tolak: {app.rejection_note}
                      </p>
                    )}

                    <p className="text-xs text-stone-400 mt-2">
                      {formatDate(app.created_at)}
                    </p>
                  </div>

                  {/* Status + Actions */}
                  <div className="flex flex-col items-end gap-2.5 shrink-0">
                    {/* Status badge */}
                    <span
                      className={`badge text-[10px] ${
                        status === "pending"
                          ? "badge-gold"
                          : status === "reviewed"
                            ? "badge-blue"
                            : status === "approved"
                              ? "badge-sage"
                              : "bg-red-50 text-red-600 border border-red-200"
                      }`}
                    >
                      {status === "pending"
                        ? "⏳ Pending"
                        : status === "reviewed"
                          ? "🔍 Ditinjau"
                          : status === "approved"
                            ? "✓ Disetujui"
                            : "✗ Ditolak"}
                    </span>

                    {/* Action buttons */}
                    {isLoading ? (
                      <div className="flex items-center gap-1.5 text-xs text-stone-400">
                        <Loader2 size={13} className="animate-spin" />{" "}
                        Memproses...
                      </div>
                    ) : (
                      <AppActionButtons app={app} onAction={handleAction} />
                    )}
                  </div>
                </div>
              </div>
            );
          })}

          {apps.length === 0 && (
            <div className="text-center py-12 text-stone-400">
              <Users size={32} className="mx-auto mb-3 opacity-30" />
              <p className="text-sm">Belum ada pendaftaran mitra</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
