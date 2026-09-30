// src/lib/tournamentSettings.ts
import { useSyncExternalStore } from "react"
import { tournamentConfig as defaults } from "../config/tournament"

export type PaymentRequirement = "either" | "proof" | "transaction" | "both"

export type TournamentSettings = {
  title: string
  shortName: string
  date: string
  venue: string
  registrationFee: number | null
  prizeMoney: string
  contactName: string
  contactNumbers: string[]
  upiId: string
  /** Base64 data URL of the uploaded QR image, or null to auto-generate. */
  upiQr: string | null
  paymentRequirement: PaymentRequirement
  registrationPrefix: string
  maxProofSize: number
  maxPlayerProofSize: number
}

export const defaultSettings: TournamentSettings = {
  title: defaults.title,
  shortName: defaults.shortName,
  date: defaults.date,
  venue: defaults.venue,
  registrationFee: defaults.registrationFee,
  prizeMoney: defaults.prizeMoney,
  contactName: "",
  contactNumbers: [...defaults.contactNumbers],
  upiId: defaults.upiId,
  upiQr: null,
  paymentRequirement: defaults.paymentRequirement,
  registrationPrefix: defaults.registrationPrefix,
  maxProofSize: defaults.maxProofSize,
  maxPlayerProofSize: defaults.maxPlayerProofSize,
}

const STORAGE_KEY = "smpl5s:tournament-settings:v1"
const listeners = new Set<() => void>()
let snapshot: TournamentSettings | null = null

function readFromStorage(): TournamentSettings {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return defaultSettings
    const parsed = JSON.parse(raw) as Partial<TournamentSettings>
    return { ...defaultSettings, ...parsed }
  } catch {
    return defaultSettings
  }
}

export function getSettings(): TournamentSettings {
  if (!snapshot) snapshot = readFromStorage()
  return snapshot
}

export function saveSettings(next: TournamentSettings): void {
  snapshot = next
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
  } catch {
    throw new Error("Unable to save settings to browser storage.")
  }
  listeners.forEach((fn) => fn())
}

export function resetSettings(): void {
  snapshot = defaultSettings
  try {
    localStorage.removeItem(STORAGE_KEY)
  } catch {
    /* ignore */
  }
  listeners.forEach((fn) => fn())
}

function subscribe(fn: () => void): () => void {
  listeners.add(fn)
  return () => {
    listeners.delete(fn)
  }
}

/** Live settings, re-renders callers on save/reset. */
export function useTournamentSettings(): TournamentSettings {
  return useSyncExternalStore(subscribe, getSettings, () => defaultSettings)
}

/** Cross-tab sync: another tab editing settings updates this tab too. */
if (typeof window !== "undefined") {
  window.addEventListener("storage", (event) => {
    if (event.key === STORAGE_KEY) {
      snapshot = readFromStorage()
      listeners.forEach((fn) => fn())
    }
  })
}

export function formatFee(fee: number | null): string {
  return fee === null ? "To be announced" : `₹${fee.toLocaleString("en-IN")}`
}

/** Builds the standard UPI deep-link URI (`upi://pay?pa=...&pn=...&am=...`). */
export function buildUpiUri(settings: TournamentSettings): string {
  if (!settings.upiId) return ""
  const parts = [
    `pa=${encodeURIComponent(settings.upiId)}`,
    `pn=${encodeURIComponent(settings.shortName)}`,
    `cu=INR`,
  ]
  if (settings.registrationFee !== null) {
    parts.push(`am=${settings.registrationFee}`)
  }
  return `upi://pay?${parts.join("&")}`
}

/** Loose UPI ID shape check: `user@provider`. */
export function isValidUpiId(value: string): boolean {
  if (!value) return true // optional
  return /^[\w.\-]{2,}@[a-zA-Z][a-zA-Z0-9]{1,}$/.test(value)
}