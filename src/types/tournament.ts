// src/types/tournament.ts

export type RegistrationStatus =
  | "Pending verification"
  | "Verified"
  | "Needs attention"

export type PlayerProofKind = "image" | "pdf"

export type PlayerProof = {
  /** Base64 data URL, or null when nothing is uploaded. */
  data: string | null
  /** Original filename, used for display and download. */
  name: string | null
  /** Discriminator so the UI can render an image preview or a file icon. */
  kind: PlayerProofKind | null
}

export type Registration = {
  registrationId: string
  teamName: string
  captainName: string
  contactNumber: string
  email: string
  players: {
    starting: string[]
    substitutes: string[]
  }
  /** Parallel to `players.starting` then `players.substitutes` (length 8). */
  playerProofs: PlayerProof[]
  payment: {
    transactionId: string
    paymentProof: string | null
    paymentProofName: string | null
  }
  createdAt: string
  status: RegistrationStatus
}

export type FormData = {
  teamName: string
  captainName: string
  contactNumber: string
  email: string
  /** Length 8: indices 0–4 are starters, 5–7 are substitutes. */
  players: string[]
  /** Parallel to `players` (length 8). */
  playerProofs: PlayerProof[]
  transactionId: string
  paymentProof: string | null
  paymentProofName: string | null
}

export const emptyPlayerProof = (): PlayerProof => ({
  data: null,
  name: null,
  kind: null,
})

export const emptyForm = (): FormData => ({
  teamName: "",
  captainName: "",
  contactNumber: "",
  email: "",
  players: Array(8).fill(""),
  playerProofs: Array.from({ length: 8 }, emptyPlayerProof),
  transactionId: "",
  paymentProof: null,
  paymentProofName: null,
})