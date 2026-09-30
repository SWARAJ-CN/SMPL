// src/components/admin/RegistrationDetailDialog.tsx
import { FileImage, FileText, Printer, X } from "lucide-react"
import Receipt from "../Receipt"
import { fieldClass } from "../../lib/styles"
import { receiptHtml } from "../../lib/receipt"
import { downloadFile } from "../../lib/registration"
import { useTournamentSettings } from "../../lib/tournamentSettings"
import type { Registration, RegistrationStatus } from "../../types/tournament"

const STATUS_OPTIONS: RegistrationStatus[] = [
  "Pending verification",
  "Verified",
  "Needs attention",
]

type Props = {
  item: Registration
  onClose: () => void
  onChangeStatus: (item: Registration, status: RegistrationStatus) => void
}

export default function RegistrationDetailDialog({
  item,
  onClose,
  onChangeStatus,
}: Props) {
  const settings = useTournamentSettings()

  const uploadedProofs =
    item.playerProofs?.filter((p) => p?.data).length ?? 0

  /** Renders a single player line with an optional ID proof download link. */
  const playerRow = (name: string, index: number, label: number) => {
    const proof = item.playerProofs?.[index]
    return (
      <div
        key={index}
        className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1 border-b border-[#f1f4ee] py-1.5 last:border-0"
      >
        <span className="min-w-0 flex-1 truncate text-[#617462]">
          {label}. {name}
        </span>
        {proof?.data ? (
          <a
            href={proof.data}
            download={proof.name ?? `player-${label}-id`}
            className="inline-flex shrink-0 items-center gap-1 text-xs font-bold text-[#4a784b] hover:underline"
            title={proof.name ?? "ID proof"}
          >
            <FileImage size={13} /> ID
          </a>
        ) : (
          <span className="shrink-0 text-xs font-semibold text-[#a6513d]">
            No ID
          </span>
        )}
      </div>
    )
  }

  const handleDownloadReceipt = () =>
    downloadFile(
      receiptHtml(item, settings),
      `${item.registrationId}-receipt.html`,
      "text/html;charset=utf-8",
    )

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#11251a]/70 p-4"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={`Registration for ${item.teamName}`}
        className="max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl sm:p-8"
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[.2em] text-[#6f8a5f]">
              TEAM REGISTRATION
            </p>
            <h2 className="mt-2 font-display text-3xl font-bold uppercase text-[#1e402d]">
              {item.teamName}
            </h2>
            <p className="mt-1 break-all text-sm text-[#768677]">
              {item.registrationId}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close details"
            className="rounded-lg p-2 hover:bg-[#f1f4ef]"
          >
            <X size={21} />
          </button>
        </div>

        <div className="mt-6 grid gap-4 border-y border-[#e7ece4] py-5 text-sm sm:grid-cols-2">
          <div>
            <span className="text-[#899789]">Captain</span>
            <strong className="block text-[#294631]">{item.captainName}</strong>
          </div>
          <div>
            <span className="text-[#899789]">Contact</span>
            <strong className="block text-[#294631]">
              {item.contactNumber}
            </strong>
          </div>
          <div>
            <span className="text-[#899789]">Email</span>
            <strong className="block break-all text-[#294631]">
              {item.email}
            </strong>
          </div>
          <div>
            <span className="text-[#899789]">Submitted</span>
            <strong className="block text-[#294631]">
              {new Date(item.createdAt).toLocaleString("en-IN")}
            </strong>
          </div>
        </div>

        <div className="mt-5 grid gap-5 text-sm sm:grid-cols-2">
          <div>
            <strong className="text-[#294631]">Starting 5</strong>
            <div className="mt-2">
              {item.players.starting.map((name, i) => playerRow(name, i, i + 1))}
            </div>
          </div>
          <div>
            <strong className="text-[#294631]">Substitutes</strong>
            <div className="mt-2">
              {item.players.substitutes.map((name, i) =>
                playerRow(name, i + 5, i + 6),
              )}
            </div>
          </div>
        </div>

        <p className="mt-3 text-xs text-[#879687]">
          Player ID proofs attached:{" "}
          <strong
            className={
              uploadedProofs === 8 ? "text-[#397043]" : "text-[#a6513d]"
            }
          >
            {uploadedProofs}/8
          </strong>
        </p>

        <div className="mt-6 border-t border-[#e7ece4] pt-5 text-sm">
          <strong className="text-[#294631]">Payment</strong>
          <p className="mt-2 text-[#617462]">
            Reference: {item.payment.transactionId || "Not provided"}
          </p>
          {item.payment.paymentProof ? (
            <a
              href={item.payment.paymentProof}
              download={item.payment.paymentProofName || "payment-proof.png"}
              className="mt-3 inline-flex items-center gap-2 font-bold text-[#4a784b] hover:underline"
            >
              <FileImage size={17} /> View / download proof:{" "}
              {item.payment.paymentProofName}
            </a>
          ) : (
            <p className="mt-2 text-[#617462]">No image provided</p>
          )}
        </div>

        <div className="mt-6 border-t border-[#e7ece4] pt-5">
          <label
            htmlFor="registrationStatus"
            className="mb-2 block text-sm font-bold text-[#294631]"
          >
            Verification status
          </label>
          <select
            id="registrationStatus"
            className={fieldClass}
            value={item.status}
            onChange={(e) =>
              onChangeStatus(item, e.target.value as RegistrationStatus)
            }
          >
            {STATUS_OPTIONS.map((status) => (
              <option key={status}>{status}</option>
            ))}
          </select>
          <p className="mt-2 text-xs text-[#879687]">
            Status changes are saved to this browser only.
          </p>
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={handleDownloadReceipt}
            className="inline-flex items-center gap-2 rounded-lg border border-[#d7e3d1] px-4 py-2.5 text-sm font-bold text-[#315e39] hover:bg-[#f4f8f0]"
          >
            <FileText size={16} /> Download receipt
          </button>
          <button
            type="button"
            onClick={() => window.print()}
            className="inline-flex items-center gap-2 rounded-lg border border-[#d7e3d1] px-4 py-2.5 text-sm font-bold text-[#315e39] hover:bg-[#f4f8f0]"
          >
            <Printer size={16} /> Print receipt
          </button>
        </div>

        <Receipt item={item} />
      </div>
    </div>
  )
}