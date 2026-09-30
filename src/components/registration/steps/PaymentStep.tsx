// src/components/registration/steps/PaymentStep.tsx
import { useEffect, useRef, useState } from "react"
import type { ChangeEvent } from "react"
import QRCode from "qrcode"
import { Check, Copy, IndianRupee, Smartphone, UploadCloud } from "lucide-react"
import Input from "../../ui/Input"
import { primaryClass } from "../../../lib/styles"
import {
  buildUpiUri,
  formatFee,
  useTournamentSettings,
} from "../../../lib/tournamentSettings"
import type { FormData } from "../../../types/tournament"
import type { Errors } from "../../../lib/validation"

type Props = {
  data: FormData
  set: (patch: Partial<FormData>) => void
  errors: Errors
  setMessage: (value: string) => void
}

export default function PaymentStep({ data, set, errors, setMessage }: Props) {
  const settings = useTournamentSettings()
  const [copied, setCopied] = useState(false)
  const [autoQr, setAutoQr] = useState("")
  const [reading, setReading] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  const upiUri = buildUpiUri(settings)

  useEffect(() => {
    // Only auto-generate a QR when the admin hasn't uploaded one.
    if (settings.upiQr || !upiUri) {
      setAutoQr("")
      return
    }
    QRCode.toDataURL(upiUri, { width: 240, margin: 2 })
      .then(setAutoQr)
      .catch(() => setAutoQr(""))
  }, [upiUri, settings.upiQr])

  const qrSrc = settings.upiQr || autoQr

  async function copyUpi() {
    try {
      await navigator.clipboard.writeText(settings.upiId)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      setMessage("Unable to copy automatically. Please select and copy the UPI ID.")
    }
  }

  function upload(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    if (!file) return
    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      setMessage("Choose a JPG, PNG or WebP image.")
      event.target.value = ""
      return
    }
    if (file.size > settings.maxProofSize) {
      setMessage("Image must be under 1 MB so it can be saved in this browser.")
      event.target.value = ""
      return
    }
    setReading(true)
    setMessage("")
    const reader = new FileReader()
    reader.onload = () => {
      set({ paymentProof: String(reader.result), paymentProofName: file.name })
      setReading(false)
    }
    reader.onerror = () => {
      setReading(false)
      setMessage("Could not read that image. Please try another file.")
    }
    reader.readAsDataURL(file)
  }

  return (
    <div className="space-y-7">
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl bg-[#e8f1db] p-5">
        <div>
          <span className="text-xs font-bold uppercase tracking-[.12em] text-[#5b7754]">
            Registration fee
          </span>
          <div className="mt-1 font-display text-3xl font-bold text-[#1c422b]">
            {formatFee(settings.registrationFee)}
          </div>
        </div>
        <span className="rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-[#527247]">
          Per team
        </span>
      </div>

      <div className="rounded-2xl border border-[#dfe6da] bg-white p-5 sm:p-6">
        <div className="mb-4 flex items-center gap-3">
          <span className="rounded-lg bg-[#eef4e9] p-2 text-[#4c7547]">
            <IndianRupee size={20} />
          </span>
          <h3 className="font-display text-xl font-bold uppercase text-[#1e3c2b]">
            Pay with UPI
          </h3>
        </div>

        {settings.upiId ? (
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
            <div className="min-w-0 flex-1">
              <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-[#7a8c7c]">
                UPI ID
              </p>
              <div className="flex flex-wrap items-center gap-2">
                <code className="break-all text-lg font-bold text-[#1e3c2b]">
                  {settings.upiId}
                </code>
                <button
                  type="button"
                  onClick={copyUpi}
                  className="inline-flex items-center gap-1 rounded-lg border border-[#dbe4d5] px-3 py-2 text-xs font-bold text-[#375e3c] hover:bg-[#f0f6ec]"
                >
                  {copied ? <Check size={14} /> : <Copy size={14} />}
                  {copied ? "Copied!" : "Copy"}
                </button>
              </div>
              <p className="mt-4 text-sm leading-6 text-[#657868]">
                Tap the button below to open your UPI app with the amount
                prefilled, or scan the QR with another phone.
              </p>

              {upiUri && (
                <a
                  href={upiUri}
                  className={`${primaryClass} mt-4 !px-5 !py-3 !text-sm`}
                >
                  <Smartphone size={16} /> Pay{" "}
                  {settings.registrationFee !== null
                    ? formatFee(settings.registrationFee)
                    : ""}{" "}
                  with UPI app
                </a>
              )}
            </div>
            {qrSrc && (
              <img
                src={qrSrc}
                alt={`UPI payment QR code for ${settings.upiId}`}
                className="h-40 w-40 shrink-0 rounded-xl border border-[#e3e7e1] bg-white p-2"
              />
            )}
          </div>
        ) : (
          <div className="rounded-xl border border-[#eddfbb] bg-[#fff9e9] p-4 text-sm leading-6 text-[#725b29]">
            <strong>Payment details pending.</strong> The organizer has not
            configured a UPI ID or fee yet. Do not send money to an unverified
            address. You can still submit a demo registration with a reference
            or screenshot.
          </div>
        )}
      </div>

      <div>
        <div className="mb-4">
          <h3 className="text-base font-bold text-[#1f3b2b]">Payment proof</h3>
          <p className="mt-1 text-sm text-[#778879]">
            Add a screenshot or transaction ID. Your payment will be verified by
            an organizer.
          </p>
        </div>

        <input
          ref={fileRef}
          id="paymentProof"
          type="file"
          accept="image/png,image/jpeg,image/webp"
          className="sr-only"
          onChange={upload}
          aria-describedby={errors.paymentProof ? "proof-error" : undefined}
        />

        {data.paymentProof ? (
          <div className="flex flex-wrap items-center gap-4 rounded-xl border border-[#cbdcbf] bg-[#f8fbf5] p-4">
            <img
              src={data.paymentProof}
              alt="Payment proof preview"
              className="h-16 w-16 rounded-lg border border-[#dce5d6] object-cover"
            />
            <div className="min-w-0 flex-1">
              <strong className="block truncate text-sm text-[#26492f]">
                {data.paymentProofName}
              </strong>
              <span className="text-xs text-[#69806d]">Ready to submit</span>
            </div>
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className="text-sm font-bold text-[#3e6c42] hover:underline"
            >
              Change
            </button>
            <button
              type="button"
              onClick={() => {
                set({ paymentProof: null, paymentProofName: null })
                if (fileRef.current) fileRef.current.value = ""
              }}
              className="text-sm font-bold text-[#a54b3b] hover:underline"
            >
              Remove
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            className="flex w-full flex-col items-center rounded-xl border-2 border-dashed border-[#cbdac4] bg-white px-4 py-8 text-center transition hover:border-[#6a9c55] hover:bg-[#f8fbf6]"
          >
            <UploadCloud size={28} className="mb-3 text-[#689158]" />
            <span className="text-sm font-bold text-[#2f5636]">
              {reading ? "Reading image..." : "Click to upload payment screenshot"}
            </span>
            <span className="mt-1 text-xs text-[#809182]">
              JPG, PNG or WebP · Maximum 1 MB
            </span>
          </button>
        )}

        {errors.paymentProof && (
          <p
            id="proof-error"
            role="alert"
            className="mt-2 text-xs font-medium text-[#b24d3c]"
          >
            {errors.paymentProof}
          </p>
        )}
      </div>

      <div className="relative flex items-center gap-4">
        <span className="h-px flex-1 bg-[#dfe5d9]" />
        <span className="text-xs font-bold uppercase text-[#94a095]">and / or</span>
        <span className="h-px flex-1 bg-[#dfe5d9]" />
      </div>

      <Input
        id="transactionId"
        label="Transaction ID / UTR number"
        value={data.transactionId}
        onChange={(transactionId) => set({ transactionId })}
        placeholder="e.g. 425891234567"
        error={errors.transactionId}
        note="Enter the reference from your payment app if available."
      />
    </div>
  )
}