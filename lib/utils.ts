import { clsx, type ClassValue } from 'clsx'
import { SubscriptionTier, UserRole } from '@/types'

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs)
}

// CO2 conversion factor: 1 kg organic waste ≈ 0.7 kg CO2 equivalent avoided
export const CO2_FACTOR = 0.7

export function calcCO2(wasteKg: number): number {
  return Math.round(wasteKg * CO2_FACTOR * 10) / 10
}

export function formatWeight(kg: number): string {
  if (kg >= 1000) return `${(kg / 1000).toFixed(1)} T`
  return `${Math.round(kg)} Kg`
}

export function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

export function formatMonth(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('id-ID', {
    month: 'long',
    year: 'numeric',
  })
}

export const TIER_LABELS: Record<SubscriptionTier, string> = {
  starter: 'Starter Partner',
  growth: 'Growth Partner',
  impact: 'Impact Partner',
}

export const TIER_COLORS: Record<SubscriptionTier, { bg: string; text: string; border: string }> = {
  starter: { bg: 'bg-sage-50', text: 'text-sage-700', border: 'border-sage-200' },
  growth:  { bg: 'bg-gold-50', text: 'text-gold-700', border: 'border-gold-200' },
  impact:  { bg: 'bg-gold-100', text: 'text-gold-800', border: 'border-gold-400' },
}

export const ROLE_LABELS: Record<UserRole, string> = {
  admin: 'Admin Internal',
  mitra: 'Mitra HoReCa',
  dlh: 'DLH',
}

export const STATUS_COLORS = {
  collected: { bg: 'bg-blue-50', text: 'text-blue-700' },
  processed:  { bg: 'bg-gold-50', text: 'text-gold-700' },
  converted:  { bg: 'bg-sage-50', text: 'text-sage-700' },
}

export const STATUS_LABELS = {
  collected: 'Collected',
  processed: 'Processed',
  converted: 'Converted',
}

export const MONTHS_ID = [
  'Jan','Feb','Mar','Apr','Mei','Jun',
  'Jul','Ags','Sep','Okt','Nov','Des',
]
