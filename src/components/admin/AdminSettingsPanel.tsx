// src/components/admin/AdminSettingsPanel.tsx
import { useRef, useState } from "react"
import type { ChangeEvent } from "react"
import { RotateCcw, Save, Upload, X } from "lucide-react"
import Button from "../ui/Button"
import Input from "../ui/Input"
import { fieldClass, outlineClass } from "../../lib/styles"
import {
  defaultSettings,
  getSettings,
  isValidUpiId,
  resetSettings,
  saveSettings,
  type PaymentRequirement,
  type TournamentSettings,
} from "../../lib/tournamentSettings"

const MAX_QR_SIZE = 500 * 1024
const QR_TYPES = ["image/png", "image/jpeg", "image/webp"]

const labelClass = "mb-2 block text-sm font-bold text-[#243d2d]"
const helperClass = "mt-1.5 text-xs text-[#7a897a]"

function Section({
  title,
  description,
  children,
}: {
  title: string
  description?: string
  children: React.ReactNode
}) {
  return (
    <section className="rounded-2xl border border-[#e2e9dd] bg-white p-5 sm:p-6">
      <h2 className="font-display text-xl font-bold uppercase text-[#1d3e2c]">
        {title}
      </h2>
      {description && (
        <p className="mt-1 text-sm text-[#7a897b]">{description}</p>
      )}
      <div className="mt-5 grid gap-5 sm:grid-cols-2">{children}</div>
    </section>
  )
}

export default function AdminSettingsPanel() {
  const [draft, setDraft] = useState<TournamentSettings>(() => getSettings())
  const [message, setMessage] = useState("")
  const [error, setError] = useState("")
  const qrRef = useRef<HTMLInputElement>(null)

  const set = <K extends keyof TournamentSettings>(
    key: K,
    value: TournamentSettings[K],
  ) => {
    setDraft((d) => ({ ...d, [key]: value }))
    setMessage("")
    setError("")
  }

  function handleQrUpload(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    if (!file) return
    if (!QR_TYPES.includes(file.type)) {
      setError("QR code must be a PNG, JPG, or WebP image.")
      event.target.value = ""
      return
    }
    if (file.size > MAX_QR_SIZE) {
      setError("QR code image must be under 500 KB.")
      event.target.value = ""
      return
    }
    const reader = new FileReader()
    reader.onload = () => {
      set("upiQr", String(reader.result))
      setError("")
    }
    reader.onerror = () => setError("Could not read that image.")
    reader.readAsDataURL(file)
  }

  function handleSave() {
    setError("")
    setMessage("")

    if (draft.registrationFee !== null) {
      if (Number.isNaN(draft.registrationFee) || draft.registrationFee < 0) {
        setError("Registration fee must be a non-negative number or left blank.")
        return
      }
    }
    if (!isValidUpiId(draft.upiId.trim())) {
      setError("UPI ID should look like name@provider.")
      return
    }

    try {
      saveSettings({
        ...draft,
        title: draft.title.trim() || defaultSettings.title,
        shortName: draft.shortName.trim() || defaultSettings.shortName,
        upiId: draft.upiId.trim(),
        contactName: draft.contactName.trim(),
        contactNumbers: draft.contactNumbers
          .map((n) => n.trim())
          .filter(Boolean),
      })
      setMessage("Settings saved. Changes appear across the site immediately.")
    } catch {
      setError("Couldn't save settings. Check available browser storage.")
    }
  }

  function handleReset() {
    if (!confirm("Reset all tournament settings to defaults?")) return
    try {
      resetSettings()
      setDraft(defaultSettings)
      setMessage("Reset to defaults.")
      setError("")
    } catch {
      setError("Couldn't reset settings.")
    }
  }

  return (
    <div className="mt-8 space-y-6">
      <Section
        title="Event details"
        description="Shown in the hero strip, receipt, and admin table."
      >
        <div className="sm:col-span-2">
          <Input
            id="settings-title"
            label="Tournament title"
            value={draft.title}
            onChange={(v) => set("title", v)}
            placeholder="Tournament full name"
          />
        </div>
        <Input
          id="settings-shortName"
          label="Short name"
          value={draft.shortName}
          onChange={(v) => set("shortName", v)}
          placeholder="SMPL 5s"
        />
        <Input
          id="settings-date"
          label="Tournament date"
          value={draft.date}
          onChange={(v) => set("date", v)}
          placeholder="e.g. 15 March 2026"
        />
        <Input
          id="settings-venue"
          label="Venue"
          value={draft.venue}
          onChange={(v) => set("venue", v)}
          placeholder="Ground / address"
        />
        <Input
          id="settings-prize"
          label="Prize pool"
          value={draft.prizeMoney}
          onChange={(v) => set("prizeMoney", v)}
          placeholder="e.g. ₹25,000"
        />
      </Section>

      <Section
        title="Registration & fee"
        description="Fee drives the payment step and the UPI deep-link amount."
      >
        <div>
          <label htmlFor="settings-fee" className={labelClass}>
            Registration fee (₹)
          </label>
          <input
            id="settings-fee"
            type="number"
            min={0}
            step={50}
            className={fieldClass}
            value={draft.registrationFee ?? ""}
            placeholder="Leave blank for 'To be announced'"
            onChange={(e) =>
              set(
                "registrationFee",
                e.target.value === "" ? null : Number(e.target.value),
              )
            }
          />
          <p className={helperClass}>
            Blank = "To be announced" and UPI link omits the amount.
          </p>
        </div>
        <Input
          id="settings-prefix"
          label="Registration ID prefix"
          value={draft.registrationPrefix}
          onChange={(v) => set("registrationPrefix", v)}
          placeholder="SMPL5S"
        />
      </Section>

      <Section
        title="Organizer contact"
        description="Displayed in the contact section and hero strip."
      >
        <Input
          id="settings-contactName"
          label="Contact person name"
          value={draft.contactName}
          onChange={(v) => set("contactName", v)}
          placeholder="e.g. Anil Kumar"
        />
        <div>
          <label htmlFor="settings-contactNumbers" className={labelClass}>
            Contact numbers
          </label>
          <textarea
            id="settings-contactNumbers"
            rows={3}
            className={fieldClass}
            value={draft.contactNumbers.join("\n")}
            placeholder={"+91 98765 43210\n+91 90123 45678"}
            onChange={(e) =>
              set("contactNumbers", e.target.value.split("\n"))
            }
          />
          <p className={helperClass}>One number per line.</p>
        </div>
      </Section>

      <Section
        title="Payment / UPI"
        description="Upload a QR image or let the site generate one from the UPI ID."
      >
        <Input
          id="settings-upiId"
          label="UPI ID"
          value={draft.upiId}
          onChange={(v) => set("upiId", v)}
          placeholder="name@okhdfcbank"
          note="Format: username@provider. Leave blank to hide payment details."
        />
        <div>
          <label className={labelClass}>UPI QR image</label>
          <input
            ref={qrRef}
            type="file"
            accept="image/png,image/jpeg,image/webp"
            className="sr-only"
            onChange={handleQrUpload}
          />
          {draft.upiQr ? (
            <div className="flex items-center gap-3 rounded-xl border border-[#cbdcbf] bg-[#f8fbf5] p-3">
              <img
                src={draft.upiQr}
                alt="Uploaded UPI QR"
                className="h-16 w-16 rounded border border-[#dce5d6] object-contain"
              />
              <div className="min-w-0 flex-1">
                <p className="text-xs font-bold text-[#26492f]">
                  Custom QR uploaded
                </p>
                <p className="text-[11px] text-[#69806d]">
                  Replaces the auto-generated QR.
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  set("upiQr", null)
                  if (qrRef.current) qrRef.current.value = ""
                }}
                className="text-xs font-bold text-[#a54b3b] hover:underline"
              >
                Remove
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => qrRef.current?.click()}
              className="flex w-full items-center gap-2 rounded-xl border border-dashed border-[#cbdac4] bg-white px-4 py-4 text-left transition hover:border-[#6a9c55] hover:bg-[#f8fbf6]"
            >
              <Upload size={18} className="shrink-0 text-[#689158]" />
              <span className="text-sm font-semibold text-[#2f5636]">
                Upload QR (PNG, JPG, WebP · max 500 KB)
              </span>
            </button>
          )}
          <p className={helperClass}>
            Leave empty to auto-generate a QR from the UPI ID.
          </p>
        </div>
        <div className="sm:col-span-2">
          <label htmlFor="settings-paymentRequirement" className={labelClass}>
            What must the team submit?
          </label>
          <select
            id="settings-paymentRequirement"
            className={fieldClass}
            value={draft.paymentRequirement}
            onChange={(e) =>
              set("paymentRequirement", e.target.value as PaymentRequirement)
            }
          >
            <option value="either">Screenshot or transaction ID</option>
            <option value="proof">Screenshot only</option>
            <option value="transaction">Transaction ID only</option>
            <option value="both">Both required</option>
          </select>
        </div>
      </Section>

      {error && (
        <p
          role="alert"
          className="rounded-lg bg-[#fff1e9] p-3 text-sm font-medium text-[#ae513b]"
        >
          {error}
        </p>
      )}
      {message && (
        <p className="rounded-lg bg-[#e8f5e4] p-3 text-sm font-medium text-[#2f7a3e]">
          {message}
        </p>
      )}

      <div className="flex flex-wrap items-center justify-between gap-3">
        <Button variant="outline" onClick={handleReset}>
          <RotateCcw size={16} /> Reset to defaults
        </Button>
        <Button onClick={handleSave}>
          <Save size={16} /> Save settings
        </Button>
      </div>
    </div>
  )
}