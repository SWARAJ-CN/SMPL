// src/components/admin/AdminStats.tsx
import { ClipboardCheck, ShieldCheck, Users } from "lucide-react"
import type { Registration } from "../../types/tournament"

export default function AdminStats({ items }: { items: Registration[] }) {
  const stats = [
    { label: "Total teams", value: items.length, icon: Users },
    {
      label: "Pending verification",
      value: items.filter((r) => r.status === "Pending verification").length,
      icon: ClipboardCheck,
    },
    {
      label: "Verified",
      value: items.filter((r) => r.status === "Verified").length,
      icon: ShieldCheck,
    },
  ]

  return (
    <div className="mt-9 grid gap-4 sm:grid-cols-3">
      {stats.map(({ label, value, icon: Icon }) => (
        <div
          key={label}
          className="rounded-2xl border border-[#e2e9dd] bg-white p-6"
        >
          <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-[#788979]">
            <span>{label}</span>
            <Icon size={19} className="text-[#6a8b58]" />
          </div>
          <div className="mt-5 font-display text-4xl font-bold text-[#1b3c2a]">
            {value}
          </div>
        </div>
      ))}
    </div>
  )
}