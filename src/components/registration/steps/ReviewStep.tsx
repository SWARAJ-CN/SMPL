// src/components/registration/steps/ReviewStep.tsx
import type { ReactNode } from "react"
import { FileText, ShieldCheck } from "lucide-react"
import { formatFee, useTournamentSettings } from "../../../lib/tournamentSettings"
import type { FormData } from "../../../types/tournament"

type Props = {
  data: FormData
  edit: (step: number) => void
}

export default function ReviewStep({ data, edit }: Props) {
  const settings = useTournamentSettings()

  const section = (title: string, step: number, children: ReactNode) => (
    <section className="rounded-xl border border-[#e1e7dc] bg-white p-5 sm:p-6">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="font-display text-xl font-bold uppercase text-[#1b3c29]">
          {title}
        </h3>
        <button
          type="button"
          onClick={() => edit(step)}
          className="text-sm font-bold text-[#4c7547] hover:underline"
        >
          Edit <span className="sr-only">{title}</span>
        </button>
      </div>
      {children}
    </section>
  )

  const row = (label: string, value: string) => (
    <div className="flex flex-wrap justify-between gap-x-4 gap-y-1 border-b border-[#eef0eb] py-2.5 text-sm last:border-0">
      <span className="text-[#7c897b]">{label}</span>
      <span className="font-semibold text-[#263f2d]">
        {value || "Not provided"}
      </span>
    </div>
  )

  /**
   * Renders a single player line: number, name, optional (C) badge,
   * and an ID-proof status pill on the right.
   */
  const playerRow = (name: string, index: number, isCaptain: boolean) => {
    const proof = data.playerProofs[index]
    const hasProof = Boolean(proof?.data)

    return (
      <div
        key={index}
        className="flex items-center justify-between gap-3 border-b border-[#f1f4ee] py-1.5 last:border-0"
      >
        <span className="min-w-0 flex-1 truncate text-sm font-medium text-[#263f2d]">
          <span className="mr-3 text-[#9ba99a]">
            {String(index + 1).padStart(2, "0")}
          </span>
          {name || "—"}
          {isCaptain && (
            <span className="ml-2 text-xs text-[#5c804e]">(C)</span>
          )}
        </span>
        {hasProof ? (
          <span
            className="inline-flex shrink-0 items-center gap-1 rounded-full bg-[#e8f5e4] px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[#397043]"
            title={proof?.name ?? "ID proof uploaded"}
          >
            <FileText size={11} /> ID ✓
          </span>
        ) : (
          <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-[#fce9e5] px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[#a6513d]">
            ID missing
          </span>
        )}
      </div>
    )
  }

  const uploadedProofs = data.playerProofs.filter((p) => p?.data).length
  const missingProofs = 8 - uploadedProofs

  return (
    <div className="space-y-4">
      {section(
        "Team details",
        0,
        <>
          {row("Team name", data.teamName)}
          {row("Captain", data.captainName)}
          {row("WhatsApp", data.contactNumber)}
          {row("Email", data.email)}
        </>,
      )}

      {section(
        "Your squad",
        1,
        <>
          <div className="grid gap-6 sm:grid-cols-2">
            <div>
              <p className="mb-2 text-xs font-bold uppercase tracking-wider text-[#839280]">
                Starting 5
              </p>
              {data.players
                .slice(0, 5)
                .map((p, i) => playerRow(p, i, i === 0))}
            </div>
            <div>
              <p className="mb-2 text-xs font-bold uppercase tracking-wider text-[#839280]">
                Substitutes
              </p>
              {data.players
                .slice(5)
                .map((p, i) => playerRow(p, i + 5, false))}
            </div>
          </div>

          <div className="mt-5 flex flex-wrap items-center justify-between gap-2 rounded-lg bg-[#f5f8f1] px-3 py-2 text-xs">
            <span className="font-semibold text-[#4a6250]">
              ID proofs attached
            </span>
            <span
              className={
                missingProofs === 0
                  ? "font-bold text-[#397043]"
                  : "font-bold text-[#a6513d]"
              }
            >
              {uploadedProofs}/8
              {missingProofs > 0 && ` · ${missingProofs} missing`}
            </span>
          </div>
        </>,
      )}

      {section(
        "Payment",
        2,
        <>
          {row("Registration fee", formatFee(settings.registrationFee))}
          {row("Transaction ID", data.transactionId)}
          {row("Payment proof", data.paymentProofName || "Not provided")}
        </>,
      )}

      <div className="flex items-start gap-3 rounded-xl bg-[#edf4e7] p-4 text-sm leading-6 text-[#49634a]">
        <ShieldCheck size={20} className="mt-0.5 shrink-0" />
        Please check all details before submitting. This is a local demo: your
        registration is saved in this browser, not sent to organizers. Payment
        remains pending verification.
      </div>
    </div>
  )
}