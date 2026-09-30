// src/config/tournament.ts

// src/config/tournament.ts
export const tournamentConfig = {
  title: "Sajeev Memorial Public Library 5s Football Tournament",
  shortName: "SMPL 5s",
  date: "To be announced",
  venue: "To be announced",
  registrationFee: null as number | null,
  prizeMoney: "To be announced",
  contactNumbers: [] as string[],
  upiId: "",
  paymentRequirement: "either" as "either" | "proof" | "transaction" | "both",
  registrationPrefix: "SMPL5S",
  maxProofSize: 1024 * 1024,
  maxPlayerProofSize: 500 * 1024,
}
export const feeLabel =
  tournamentConfig.registrationFee === null
    ? "To be announced"
    : `₹${tournamentConfig.registrationFee.toLocaleString("en-IN")}`