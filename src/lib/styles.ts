// src/lib/styles.ts
import type { RegistrationStatus } from "../types/tournament"

export const fieldClass =
  "w-full rounded-xl border border-[#d9dfd5] bg-white px-4 py-3.5 text-[15px] text-[#17291e] outline-none transition placeholder:text-[#9aa59a] focus:border-[#537d48] focus:ring-4 focus:ring-[#dbe9d2]"

export const buttonBase =
  "inline-flex items-center justify-center gap-2 rounded-xl px-6 py-3.5 font-bold transition focus-visible:outline-2 focus-visible:outline-offset-2 disabled:cursor-not-allowed disabled:opacity-50"

export const primaryClass = `${buttonBase} bg-[#d9f36a] text-[#183222] hover:bg-[#c8ea4c] focus-visible:outline-[#d9f36a]`

export const darkClass = `${buttonBase} bg-[#1c3e2b] text-white hover:bg-[#31573b] focus-visible:outline-[#1c3e2b]`

export const outlineClass = `${buttonBase} border border-[#c9d5c7] bg-white text-[#23462f] hover:bg-[#f1f6ec] focus-visible:outline-[#c9d5c7]`

export const ghostClass =
  "inline-flex items-center gap-2 rounded-lg px-2 py-3 text-sm font-bold text-[#576f5b] hover:text-[#1a3b29]"

export const eyebrowClass =
  "text-[11px] font-bold uppercase tracking-[.2em] text-[#6f8a5f]"

export function statusBadgeClass(status: RegistrationStatus) {
  if (status === "Verified") return "bg-[#e8f5e4] text-[#397043]"
  if (status === "Needs attention") return "bg-[#fce9e5] text-[#a6513d]"
  return "bg-[#fff2dc] text-[#906d32]"
}