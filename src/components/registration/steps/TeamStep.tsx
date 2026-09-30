// src/components/registration/steps/TeamStep.tsx
import Input from "../../ui/Input"
import type { FormData } from "../../../types/tournament"
import type { Errors } from "../../../lib/validation"

type Props = {
  data: FormData
  set: (patch: Partial<FormData>) => void
  errors: Errors
}

export default function TeamStep({ data, set, errors }: Props) {
  return (
    <div className="grid gap-6 sm:grid-cols-2">
      <div className="sm:col-span-2">
        <Input
          id="teamName"
          label="Team name"
          value={data.teamName}
          onChange={(teamName) => set({ teamName })}
          placeholder="e.g. Riverside Rovers"
          error={errors.teamName}
        />
      </div>
      <Input
        id="captainName"
        label="Captain name"
        value={data.captainName}
        onChange={(captainName) =>
          set({ captainName, players: [captainName, ...data.players.slice(1)] })
        }
        placeholder="Captain's full name"
        error={errors.captainName}
      />
      <Input
        id="contactNumber"
        label="WhatsApp / contact number"
        value={data.contactNumber}
        onChange={(contactNumber) => set({ contactNumber })}
        placeholder="+91 98765 43210"
        error={errors.contactNumber}
        type="tel"
      />
      <div className="sm:col-span-2">
        <Input
          id="email"
          label="Email address"
          value={data.email}
          onChange={(email) => set({ email })}
          placeholder="you@example.com"
          error={errors.email}
          type="email"
          note="We'll use this for registration updates when an organizer is connected."
        />
      </div>
    </div>
  )
}