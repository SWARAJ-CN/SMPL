// src/components/Receipt.tsx
import { formatFee, useTournamentSettings } from "../lib/tournamentSettings"
import type { Registration } from "../types/tournament"

type Props = { item: Registration }

export default function Receipt({ item }: Props) {
  const settings = useTournamentSettings()
  const uploadedProofs =
    item.playerProofs?.filter((p) => p?.data).length ?? 0

  const proofFor = (index: number) => item.playerProofs?.[index]

  return (
    <div className="print-receipt hidden">
      <div className="text-xs font-bold uppercase tracking-[.2em]">
        Official registration receipt
      </div>
      <h1 className="mt-3 text-3xl font-bold">{settings.title}</h1>
      <p className="mt-2 text-sm">
        Submitted {new Date(item.createdAt).toLocaleString("en-IN")}
      </p>
      <div className="my-8 border-y-2 border-[#183222] py-5 text-2xl font-bold">
        Registration ID: {item.registrationId}
      </div>

      <h2 className="text-xl font-bold">Team details</h2>
      <p>
        {item.teamName} · Captain: {item.captainName}
      </p>
      <p>
        {item.contactNumber} · {item.email}
      </p>

      <h2 className="mt-8 text-xl font-bold">Starting 5</h2>
      <ol className="list-inside list-decimal">
        {item.players.starting.map((p, i) => (
          <li key={i}>
            {p}
            <span className="ml-2 text-xs text-gray-600">
              {proofFor(i)?.data ? `· ID: ${proofFor(i)?.name}` : "· ID: missing"}
            </span>
          </li>
        ))}
      </ol>

      <h2 className="mt-8 text-xl font-bold">Substitutes</h2>
      <ol start={6} className="list-inside list-decimal">
        {item.players.substitutes.map((p, i) => (
          <li key={i}>
            {p}
            <span className="ml-2 text-xs text-gray-600">
              {proofFor(i + 5)?.data
                ? `· ID: ${proofFor(i + 5)?.name}`
                : "· ID: missing"}
            </span>
          </li>
        ))}
      </ol>

      <p className="mt-3 text-sm text-gray-600">
        Player ID proofs attached: {uploadedProofs}/8
      </p>

      <h2 className="mt-8 text-xl font-bold">Payment details</h2>
      <p>
        Fee: {formatFee(settings.registrationFee)} · Status: {item.status}
      </p>
      <p>Transaction ID: {item.payment.transactionId || "Not provided"}</p>
      <p>Proof: {item.payment.paymentProofName || "Not provided"}</p>

      <h2 className="mt-8 text-xl font-bold">Tournament details</h2>
      <p>
        {settings.date} · {settings.venue} · Prize: {settings.prizeMoney}
      </p>
      <p className="mt-10 border-t pt-4 text-sm">
        Payment is subject to organizer verification. This registration is saved
        in this browser only.
      </p>
    </div>
  )
}