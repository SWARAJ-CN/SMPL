// src/components/registration/PlayerIdProofField.tsx
import { useRef, useState } from "react"
import type { ChangeEvent } from "react"
import { FileText, UploadCloud } from "lucide-react"
import { tournamentConfig as config } from "../../config/tournament"
import type { PlayerProof } from "../../types/tournament"

const ACCEPTED_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "application/pdf",
]

type Props = {
  id: string
  proof: PlayerProof
  error?: string
  onChange: (proof: PlayerProof) => void
  onClear: () => void
}

export default function PlayerIdProofField({
  id,
  proof,
  error,
  onChange,
  onClear,
}: Props) {
  const fileRef = useRef<HTMLInputElement>(null)
  const [reading, setReading] = useState(false)
  const [localError, setLocalError] = useState("")

  function handleFile(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    if (!file) return
    setLocalError("")

    if (!ACCEPTED_TYPES.includes(file.type)) {
      setLocalError("Only JPG, PNG, WebP or PDF files are accepted.")
      event.target.value = ""
      return
    }

    if (file.size > config.maxPlayerProofSize) {
      setLocalError(
        `File must be under ${Math.round(
          config.maxPlayerProofSize / 1024,
        )} KB.`,
      )
      event.target.value = ""
      return
    }

    setReading(true)
    const reader = new FileReader()
    reader.onload = () => {
      onChange({
        data: String(reader.result),
        name: file.name,
        kind: file.type === "application/pdf" ? "pdf" : "image",
      })
      setReading(false)
    }
    reader.onerror = () => {
      setReading(false)
      setLocalError("Could not read that file. Please try again.")
    }
    reader.readAsDataURL(file)
  }

  const shownError = error || localError

  return (
    <div>
      <input
        ref={fileRef}
        id={id}
        type="file"
        accept="image/png,image/jpeg,image/webp,application/pdf"
        className="sr-only"
        onChange={handleFile}
        aria-describedby={shownError ? `${id}-error` : undefined}
      />

      {proof.data ? (
        <div className="flex items-center gap-3 rounded-lg border border-[#cbdcbf] bg-[#f8fbf5] p-2.5">
          {proof.kind === "image" ? (
            <img
              src={proof.data}
              alt={`${proof.name ?? "ID"} preview`}
              className="h-10 w-10 shrink-0 rounded object-cover"
            />
          ) : (
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded bg-[#e5efdc] text-[#4c7547]">
              <FileText size={18} />
            </span>
          )}
          <div className="min-w-0 flex-1">
            <p className="truncate text-xs font-semibold text-[#26492f]">
              {proof.name}
            </p>
            <p className="text-[10px] uppercase tracking-wider text-[#69806d]">
              {proof.kind === "pdf" ? "PDF document" : "ID image"}
            </p>
          </div>
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            className="text-xs font-bold text-[#3e6c42] hover:underline"
          >
            Change
          </button>
          <button
            type="button"
            onClick={() => {
              onClear()
              if (fileRef.current) fileRef.current.value = ""
            }}
            className="text-xs font-bold text-[#a54b3b] hover:underline"
          >
            Remove
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          className="flex w-full items-center gap-2 rounded-lg border border-dashed border-[#cbdac4] bg-white px-3 py-2.5 text-left transition hover:border-[#6a9c55] hover:bg-[#f8fbf6]"
        >
          <UploadCloud size={16} className="shrink-0 text-[#689158]" />
          <span className="text-xs font-semibold text-[#2f5636]">
            {reading
              ? "Reading file..."
              : "Upload ID proof (JPG, PNG, WebP, PDF)"}
          </span>
        </button>
      )}

      {shownError && (
        <p
          id={`${id}-error`}
          role="alert"
          className="mt-1 text-[11px] font-medium text-[#b24d3c]"
        >
          {shownError}
        </p>
      )}
    </div>
  )
}