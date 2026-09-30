// src/components/admin/AdminDashboard.tsx
import { useState } from "react"
import {
  Download,
  LayoutDashboard,
  LogOut,
  Search,
  Settings as SettingsIcon,
} from "lucide-react"
import Button from "../ui/Button"
import AdminStats from "./AdminStats"
import RegistrationsTable from "./RegistrationsTable"
import RegistrationDetailDialog from "./RegistrationDetailDialog"
import AdminSettingsPanel from "./AdminSettingsPanel"
import { fieldClass } from "../../lib/styles"
import {
  downloadFile,
  getRegistrations,
  updateRegistrationStatus,
} from "../../lib/registration"
import type { Registration, RegistrationStatus } from "../../types/tournament"

type Tab = "registrations" | "settings"

export default function AdminDashboard({ onSignOut }: { onSignOut: () => void }) {
  const [tab, setTab] = useState<Tab>("registrations")
  const [items, setItems] = useState<Registration[]>(getRegistrations)
  const [query, setQuery] = useState("")
  const [selected, setSelected] = useState<Registration | null>(null)
  const [error, setError] = useState("")

  const filtered = items.filter((item) =>
    `${item.teamName} ${item.captainName} ${item.registrationId} ${item.contactNumber}`
      .toLowerCase()
      .includes(query.toLowerCase()),
  )

  const changeStatus = (item: Registration, status: RegistrationStatus) => {
    try {
      const updated = updateRegistrationStatus(item.registrationId, status)
      setItems(updated)
      setSelected(
        updated.find((r) => r.registrationId === item.registrationId) || null,
      )
      setError("")
    } catch {
      setError("Couldn't save the status. Check available browser storage.")
    }
  }

  const exportCsv = () => {
    const headers = [
      "Registration ID", "Team", "Captain", "Contact", "Email",
      "Starting 5", "Substitutes", "Transaction ID", "Proof filename",
      "Status", "Created at",
    ]
    const cell = (value: string) => {
      const safe = /^[=+@\-\t\r]/.test(value) ? `'${value}` : value
      return `"${safe.replace(/"/g, '""')}"`
    }
    const lines = items.map((r) =>
      [
        r.registrationId, r.teamName, r.captainName, r.contactNumber, r.email,
        r.players.starting.join("; "), r.players.substitutes.join("; "),
        r.payment.transactionId, r.payment.paymentProofName || "",
        r.status, r.createdAt,
      ].map(cell).join(","),
    )
    downloadFile(
      [headers.map(cell).join(","), ...lines].join("\r\n"),
      "smpl5s-registrations.csv",
      "text/csv;charset=utf-8",
    )
  }

  return (
    <main className="min-h-[80vh] bg-[#f3f5ef] px-5 py-12 md:px-8">
      <div className="mx-auto max-w-[1240px]">
        <div className="flex flex-wrap items-end justify-between gap-5">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[.2em] text-[#6f8a5f]">
              <LayoutDashboard size={15} className="inline-block" /> ORGANIZER VIEW
            </p>
            <h1 className="mt-3 font-display text-5xl font-bold uppercase text-[#183a29]">
              Dashboard.
            </h1>
            <p className="mt-3 max-w-xl text-sm leading-6 text-[#687969]">
              Manage registrations and tournament settings. Everything is stored
              in this browser on this device.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            {tab === "registrations" && (
              <Button variant="dark" onClick={exportCsv} disabled={!items.length}>
                <Download size={17} /> Export CSV
              </Button>
            )}
            <Button variant="outline" onClick={onSignOut}>
              <LogOut size={17} /> Sign out
            </Button>
          </div>
        </div>

        {/* Tabs */}
        <div className="mt-8 flex gap-1 rounded-xl border border-[#e2e9dd] bg-white p-1">
          {(
            [
              ["registrations", "Registrations"],
              ["settings", "Tournament settings"],
            ] as const
          ).map(([key, label]) => (
            <button
              key={key}
              type="button"
              onClick={() => setTab(key)}
              className={
                "flex-1 rounded-lg px-4 py-2.5 text-sm font-bold transition " +
                (tab === key
                  ? "bg-[#1c3e2b] text-white"
                  : "text-[#4a6250] hover:bg-[#f1f6ec]")
              }
            >
              {key === "settings" && <SettingsIcon size={14} className="mr-1 inline" />}
              {label}
            </button>
          ))}
        </div>

        {tab === "settings" ? (
          <AdminSettingsPanel />
        ) : (
          <>
            <AdminStats items={items} />

            <div className="mt-8 rounded-2xl border border-[#e2e9dd] bg-white p-5 sm:p-7">
              <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h2 className="font-display text-2xl font-bold uppercase text-[#1d3e2c]">
                    All teams
                  </h2>
                  <p className="text-sm text-[#7a897b]">
                    View details and track verification status
                  </p>
                </div>
                <div className="relative w-full sm:w-72">
                  <Search
                    size={17}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8d9c8e]"
                  />
                  <input
                    className={`${fieldClass} !py-2.5 !pl-10`}
                    placeholder="Search teams or ID..."
                    aria-label="Search registrations"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                  />
                </div>
              </div>

              {error && (
                <p role="alert" className="mb-4 text-sm text-red-700">
                  {error}
                </p>
              )}

              <RegistrationsTable
                items={filtered}
                hasAny={items.length > 0}
                onSelect={setSelected}
              />
            </div>
          </>
        )}
      </div>

      {selected && (
        <RegistrationDetailDialog
          item={selected}
          onClose={() => setSelected(null)}
          onChangeStatus={changeStatus}
        />
      )}
    </main>
  )
}