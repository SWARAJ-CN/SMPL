import { tournamentConfig } from "../config/tournament"
import type { FormData } from "../types/tournament"

export type Errors = Record<string, string>

export function validateTeam(data: FormData): Errors {
  const errors: Errors = {}
  if (data.teamName.trim().length < 3)
    errors.teamName = "Enter a team name with at least 3 characters."
  if (data.captainName.trim().length < 2)
    errors.captainName = "Enter your captain's full name."
  if (
    !/^(?:\+91[\s-]?)?[6-9]\d{9}$/.test(
      data.contactNumber.replace(/[\s-]/g, ""),
    )
  )
    errors.contactNumber = "Enter a valid 10-digit Indian mobile number."
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email.trim()))
    errors.email = "Enter a valid email address."
  return errors
}

export function validateSquad(data: FormData): Errors {
  const errors: Errors = {}
  if (data.players.length !== 8)
    errors.squad = "A squad must have exactly 8 players."
  const seen = new Set<string>()
  data.players.forEach((name, index) => {
    const normalized = name.trim().replace(/\s+/g, " ").toLowerCase()
    if (normalized.length < 2)
      errors[`player${index}`] = "Enter this player's name."
    else if (seen.has(normalized))
      errors[`player${index}`] = "This player is already in the squad."
    else seen.add(normalized)
  })
  return errors
}

export function validatePayment(data: FormData): Errors {
  const errors: Errors = {}
  const hasProof = Boolean(data.paymentProof)
  const reference = data.transactionId.trim()
  const hasReference = reference.length > 0
  if (hasReference && !/^[A-Za-z0-9-]{6,35}$/.test(reference))
    errors.transactionId = "Use 6–35 letters, numbers or hyphens."
  const requirement = tournamentConfig.paymentRequirement
  if ((requirement === "proof" || requirement === "both") && !hasProof)
    errors.paymentProof = "Upload a payment screenshot to continue."
  if (
    (requirement === "transaction" || requirement === "both") &&
    !hasReference
  )
    errors.transactionId = "Enter the transaction ID or UTR number."
  if (requirement === "either" && !hasProof && !hasReference)
    errors.paymentProof =
      "Add a screenshot or a transaction reference to continue."
  return errors
}
