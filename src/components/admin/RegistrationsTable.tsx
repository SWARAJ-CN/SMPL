// src/components/admin/RegistrationsTable.tsx
import { ArrowRight, Users } from "lucide-react"
import { cn } from "../../lib/utils"
import { statusBadgeClass } from "../../lib/styles"
import type { Registration } from "../../types/tournament"

type Props = {
  items: Registration[]
  hasAny: boolean
  onSelect: (item: Registration) => void
}

export default function RegistrationsTable({ items, hasAny, onSelect }: Props) {
  if (!items.length) {
    return (
      <div className="py-16 text-center">
        <Users size={32} className="mx-auto text-[#98ae90]" />
        <h3 className="mt-4 font-bold text-[#274633]">
          {hasAny ? "No matching teams" : "No teams yet"}
        </h3>
        <p className="mt-1 text-sm text-[#879587]">
          {hasAny
            ? "Try a different search."
            : "Registrations submitted in this browser will appear here."}
        </p>
      </div>
    )
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[680px] text-left text-sm">
        <thead>
          <tr className="border-b border-[#e8ede5] text-[11px] font-bold uppercase tracking-wider text-[#89998a]">
            <th className="pb-4">Team / ID</th>
            <th className="pb-4">Captain</th>
            <th className="pb-4">Submitted</th>
            <th className="pb-4">Status</th>
            <th className="pb-4 text-right">Details</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr
              key={item.registrationId}
              className="border-b border-[#edf0eb] last:border-0"
            >
              <td className="py-4">
                <strong className="block text-[#26452f]">{item.teamName}</strong>
                <span className="text-xs text-[#8b9a89]">
                  {item.registrationId}
                </span>
              </td>
              <td className="py-4 text-[#586c5c]">{item.captainName}</td>
              <td className="py-4 text-[#586c5c]">
                {new Date(item.createdAt).toLocaleDateString("en-IN")}
              </td>
              <td className="py-4">
                <span
                  className={cn(
                    "rounded-full px-3 py-1.5 text-xs font-bold",
                    statusBadgeClass(item.status),
                  )}
                >
                  {item.status}
                </span>
              </td>
              <td className="py-4 text-right">
                <button
                  type="button"
                  onClick={() => onSelect(item)}
                  className="font-bold text-[#447747] hover:underline"
                >
                  View <ArrowRight size={14} className="inline" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}