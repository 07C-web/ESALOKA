// ─── User & Auth ───────────────────────────────────────────────────────────────

export type UserRole = 'admin' | 'mitra' | 'dlh'

export type SubscriptionTier = 'starter' | 'growth' | 'impact'

export interface UserProfile {
  id: string
  email: string
  full_name: string
  role: UserRole
  created_at: string
}

// ─── Mitra ─────────────────────────────────────────────────────────────────────

export type BusinessType = 'hotel' | 'restoran' | 'catering' | 'lainnya'

export interface Mitra {
  id: string
  user_id: string
  business_name: string
  business_type: BusinessType
  subscription_tier: SubscriptionTier
  pic_name: string
  pic_phone: string
  address: string
  estimated_volume_kg_per_day: number
  is_active: boolean
  joined_at: string
  created_at: string
}

// ─── Waste Collection ──────────────────────────────────────────────────────────

export type CollectionStatus = 'collected' | 'processed' | 'converted'

export interface WasteCollection {
  id: string
  mitra_id: string
  operator_id: string
  weight_kg: number
  collection_date: string
  status: CollectionStatus
  notes?: string
  created_at: string
  mitra?: Mitra
  operator?: UserProfile
}

// ─── Bioconversion ─────────────────────────────────────────────────────────────

export interface Bioconversion {
  id: string
  collection_id: string
  mitra_id: string
  maggot_kg: number
  kasgot_kg: number
  conversion_date: string
  created_at: string
}

// ─── ESG Metrics (computed) ────────────────────────────────────────────────────

export interface ESGMetrics {
  mitra_id: string
  period_month: number
  period_year: number
  total_waste_kg: number
  total_maggot_kg: number
  total_kasgot_kg: number
  co2_avoided_kg: number
  waste_diverted_from_landfill_kg: number
  pickup_count: number
}

// ─── Get In Touch ──────────────────────────────────────────────────────────────

export type MessageCategory = 'saran_fitur' | 'laporan_masalah' | 'pertanyaan' | 'lainnya'
export type MessageStatus = 'baru' | 'dibaca' | 'ditindaklanjuti'

export interface ContactMessage {
  id: string
  sender_name: string
  sender_email: string
  category: MessageCategory
  message: string
  status: MessageStatus
  created_at: string
}

export type VolumeEstimate = '<20kg' | '20-50kg' | '50-100kg' | '>100kg'

export interface PartnerApplication {
  id: string
  business_name: string
  business_type: BusinessType
  desired_tier: SubscriptionTier
  estimated_volume: VolumeEstimate
  pic_name: string
  pic_phone: string
  status: 'pending' | 'reviewed' | 'approved' | 'rejected'
  created_at: string
}

// ─── Dashboard Stats ───────────────────────────────────────────────────────────

export interface GlobalStats {
  total_waste_managed_kg: number
  total_maggot_kg: number
  total_kasgot_kg: number
  co2_avoided_kg: number
  active_mitra_count: number
}

export interface MitraOverview {
  this_month_waste_kg: number
  this_month_pickup_count: number
  last_pickup_date: string
  last_pickup_status: CollectionStatus
  this_month_maggot_kg?: number
  this_month_kasgot_kg?: number
  co2_avoided_kg?: number
}

export interface MonthlyTrend {
  month: string
  year: number
  month_number: number
  total_waste_kg: number
}
