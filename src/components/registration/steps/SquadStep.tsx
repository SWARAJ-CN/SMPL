// src/components/registration/steps/SquadStep.tsx
import { Users } from "lucide-react"
import Input from "../../ui/Input"
import PlayerIdProofField from "../PlayerIdProofField"
import { emptyPlayerProof } from "../../../types/tournament"
import type { FormData, PlayerProof } from "../../../types/tournament"
import type { Errors } from "../../../lib/validation"

type Props = {
  data: FormData
  set: (patch: Partial<FormData>) => void
  errors: Errors
}

export default function SquadStep({ data, set, errors }: Props) {
  const updateName = (index: number, value: string) => {
    const players = [...data.players]
    players[index] = value
    set({ players })
  }

  const updateProof = (index: number, proof: PlayerProof) => {
    const playerProofs = [...data.playerProofs]
    playerProofs[index] = proof
    set({ playerProofs })
  }

  const clearProof = (index: number) => updateProof(index, emptyPlayerProof())

  const renderPlayerCard = (index: number) => (
    <div
      key={index}
      className="rounded-xl border border-[#e3e9dd] bg-[#fbfcfa] p-4"
    >
      <Input
        id={`player${index}`}
        label={`Player ${index + 1}${index === 0 ? " — Captain" : ""}`}
        value={index === 0 ? data.captainName : data.players[index]}
        onChange={(value) => updateName(index, value)}
        placeholder={
          index === 0 ? "From team details" : "Player's full name"
        }
        error={errors[`player${index}`]}
        readOnly={index === 0}
      />
      <div className="mt-3">
        <p className="mb-1.5 text-xs font-bold text-[#4a6250]">
          ID proof <span className="text-[#ad5b3f]">*</span>
        </p>
        <PlayerIdProofField
          id={`player${index}-id-proof`}
          proof={data.playerProofs[index] ?? emptyPlayerProof()}
          error={errors[`player${index}Proof`]}
          onChange={(proof) => updateProof(index, proof)}
          onClear={() => clearProof(index)}
        />
      </div>
    </div>
  )

  const uploadedProofs = data.playerProofs.filter((p) => p?.data).length

  return (
    <div>
      <div className="mb-8 flex items-center justify-between rounded-xl bg-[#edf4e6] p-4">
        <div className="flex items-center gap-3">
          <Users className="text-[#5b8547]" size={21} />
          <div>
            <strong className="block text-sm text-[#24402c]">
              Your 8-player squad
            </strong>
            <span className="text-xs text-[#677e65]">
              5 starters · 3 substitutes · 8 ID proofs
            </span>
          </div>
        </div>
        <div className="text-right">
          <span className="block font-display text-xl font-bold text-[#315536]">
            {data.players.filter((p) => p.trim()).length}/8
          </span>
          <span className="text-[10px] uppercase tracking-wider text-[#7a8c7c]">
            {uploadedProofs}/8 proofs
          </span>
        </div>
      </div>

      {errors.squad && (
        <p role="alert" className="mb-4 text-sm text-red-700">
          {errors.squad}
        </p>
      )}

      <div className="mb-4 flex items-center gap-3">
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#1c402d] text-[#d9f36a]">
          <Users size={16} />
        </span>
        <h3 className="font-display text-xl font-bold uppercase text-[#203d2b]">
          Starting 5
        </h3>
        <span className="h-px flex-1 bg-[#dce3d7]" />
      </div>
      <div className="grid gap-5 sm:grid-cols-2">
        {[0, 1, 2, 3, 4].map(renderPlayerCard)}
      </div>

      <div className="mb-4 mt-9 flex items-center gap-3">
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#e4edda] text-[#487246]">
          <Users size={16} />
        </span>
        <h3 className="font-display text-xl font-bold uppercase text-[#203d2b]">
          Substitutes
        </h3>
        <span className="h-px flex-1 bg-[#dce3d7]" />
      </div>
      <div className="grid gap-5 sm:grid-cols-2">
        {[5, 6, 7].map(renderPlayerCard)}
      </div>
    </div>
  )
}