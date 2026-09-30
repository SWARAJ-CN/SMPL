export type RegistrationStatus = "Pending verification" | "Verified" | "Needs attention"

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
  players: string[]
  transactionId: string
  paymentProof: string | null
  paymentProofName: string | null
}

export const emptyForm = (): FormData => ({
  teamName: "",
  captainName: "",
  contactNumber: "",
  email: "",
  players: Array(8).fill(""),
  transactionId: "",
  paymentProof: null,
  paymentProofName: null,
})
