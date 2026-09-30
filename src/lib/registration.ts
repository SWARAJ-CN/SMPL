import { tournamentConfig } from "../config/tournament"
import type {
  FormData,
  Registration,
  RegistrationStatus,
} from "../types/tournament"

const STORAGE_KEY = "smpl5s-registrations-v1"

export function getRegistrations(): Registration[] {
  try {
    const parsed: unknown = JSON.parse(
      localStorage.getItem(STORAGE_KEY) || "[]",
    )
    return Array.isArray(parsed) ? parsed as Registration[] : []
  } catch {
    return []
  }
}

export function submitRegistration(data: FormData): Registration {
  const existing = getRegistrations()
  let id: string
  do {
    id = `${tournamentConfig.registrationPrefix}-${new Date().getFullYear()}-${crypto.randomUUID().slice(0, 8).toUpperCase()}`
  } while (existing.some((item) => item.registrationId === id))
  const registration: Registration = {
    registrationId: id,
    teamName: data.teamName.trim(),
    captainName: data.captainName.trim(),
    contactNumber: data.contactNumber.trim(),
    email: data.email.trim(),
    players: {
      starting: data.players.slice(0, 5).map((p) => p.trim()),
      substitutes: data.players.slice(5, 8).map((p) => p.trim()),
    },
    payment: {
      transactionId: data.transactionId.trim(),
      paymentProof: data.paymentProof,
      paymentProofName: data.paymentProofName,
    },
    createdAt: new Date().toISOString(),
    status: "Pending verification",
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify([registration, ...existing]))
  return registration
}

export function updateRegistrationStatus(
  id: string,
  status: RegistrationStatus,
): Registration[] {
  const updated = getRegistrations().map((item) =>
    item.registrationId === id ? { ...item, status } : item,
  )
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
  return updated
}

export function downloadFile(contents: string, filename: string, type: string) {
  const url = URL.createObjectURL(new Blob([contents], { type }))
  const link = document.createElement("a")
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  link.remove()
  setTimeout(() => URL.revokeObjectURL(url), 1000)
}
