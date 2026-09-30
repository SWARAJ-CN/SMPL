import { useEffect, useRef, useState } from "react"
import type { ChangeEvent, FormEvent, ReactNode } from "react"
import QRCode from "qrcode"
import {
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  Check,
  CheckCircle2,
  ChevronRight,
  CircleDot,
  CircleHelp,
  ClipboardCheck,
  Copy,
  Download,
  FileImage,
  FileText,
  IndianRupee,
  LayoutDashboard,
  LockKeyhole,
  LogOut,
  Mail,
  MapPin,
  Menu,
  Phone,
  Printer,
  Search,
  ShieldCheck,
  Trophy,
  UploadCloud,
  Users,
  X,
} from "lucide-react"
import { feeLabel, tournamentConfig as config } from "./config/tournament"
import {
  hasAdminPasscode,
  isAdminSignedIn,
  setupAdminPasscode,
  signInAdmin,
  signOutAdmin,
} from "./lib/adminAuth"
import {
  downloadFile,
  getRegistrations,
  submitRegistration,
  updateRegistrationStatus,
} from "./lib/registration"
import { validatePayment, validateSquad, validateTeam } from "./lib/validation"
import type { Errors } from "./lib/validation"
import { emptyForm } from "./types/tournament"
import type {
  FormData,
  Registration,
  RegistrationStatus,
} from "./types/tournament"

const steps = ["Team details", "Your squad", "Payment", "Review"]
const fieldClass =
  "w-full rounded-xl border border-[#d9dfd5] bg-white px-4 py-3.5 text-[15px] text-[#17291e] outline-none transition placeholder:text-[#9aa59a] focus:border-[#537d48] focus:ring-4 focus:ring-[#dbe9d2]"
const primaryClass =
  "inline-flex items-center justify-center gap-2 rounded-xl bg-[#d9f36a] px-6 py-3.5 font-bold text-[#183222] transition hover:bg-[#c8ea4c] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#d9f36a] disabled:cursor-not-allowed disabled:opacity-50"

function scrollToRegister() {
  document.getElementById("register")?.scrollIntoView({ behavior: "smooth" })
}
function escapeHtml(value: string) {
  return value.replace(
    /[&<>"']/g,
    (char) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        char
      ] || char,
  )
}

function receiptHtml(item: Registration) {
  const rows = (names: string[], start: number) =>
    names
      .map(
        (name, i) =>
          `<tr><td>${start + i}</td><td>${escapeHtml(name)}</td></tr>`,
      )
      .join("")
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><title>Receipt ${escapeHtml(item.registrationId)}</title><style>body{font:15px Arial,sans-serif;color:#193125;max-width:720px;margin:50px auto;padding:0 24px}header{border-bottom:3px solid #193125;padding-bottom:25px}h1{font-size:26px;margin:12px 0}h2{font-size:17px;margin:30px 0 12px}small{color:#65756a}table{width:100%;border-collapse:collapse}td{padding:10px;border-bottom:1px solid #ddd}td:first-child{width:170px;color:#65756a}.id{background:#edf3e7;padding:18px;margin:25px 0;font-size:20px;font-weight:bold}footer{border-top:1px solid #ddd;margin-top:40px;padding-top:18px;color:#65756a}@media print{body{margin:20px auto}}</style></head><body><header><small>OFFICIAL REGISTRATION RECEIPT</small><h1>${escapeHtml(config.title)}</h1><small>Submitted ${escapeHtml(new Date(item.createdAt).toLocaleString("en-IN"))}</small></header><div class="id">Registration ID: ${escapeHtml(item.registrationId)}</div><h2>Team details</h2><table><tr><td>Team</td><td>${escapeHtml(item.teamName)}</td></tr><tr><td>Captain</td><td>${escapeHtml(item.captainName)}</td></tr><tr><td>WhatsApp</td><td>${escapeHtml(item.contactNumber)}</td></tr><tr><td>Email</td><td>${escapeHtml(item.email)}</td></tr></table><h2>Starting 5</h2><table>${rows(item.players.starting, 1)}</table><h2>Substitutes</h2><table>${rows(item.players.substitutes, 6)}</table><h2>Payment details</h2><table><tr><td>Registration fee</td><td>${escapeHtml(feeLabel)}</td></tr><tr><td>Transaction ID</td><td>${escapeHtml(item.payment.transactionId || "Not provided")}</td></tr><tr><td>Payment proof</td><td>${escapeHtml(item.payment.paymentProofName || "Not provided")}</td></tr><tr><td>Status</td><td>${escapeHtml(item.status)}</td></tr></table><h2>Tournament details</h2><table><tr><td>Date</td><td>${escapeHtml(config.date)}</td></tr><tr><td>Venue</td><td>${escapeHtml(config.venue)}</td></tr><tr><td>Prize money</td><td>${escapeHtml(config.prizeMoney)}</td></tr></table><footer>This receipt confirms a local browser registration record only. Payment is subject to organizer verification.</footer></body></html>`
}

function Receipt({ item }: { item: Registration }) {
  return (
    <div className="print-receipt hidden">
      <div className="text-xs font-bold uppercase tracking-[.2em]">
        Official registration receipt
      </div>
      <h1 className="mt-3 text-3xl font-bold">{config.title}</h1>
      <p className="mt-2 text-sm">
        Submitted {new Date(item.createdAt).toLocaleString("en-IN")}
      </p>
      <div className="my-8 border-y-2 border-[#183222] py-5 text-2xl font-bold">
        Registration ID: {item.registrationId}
      </div>
      <h2 className="text-xl font-bold">Team details</h2>
      <p>
        {item.teamName} · Captain: {item.captainName}
      </p>
      <p>
        {item.contactNumber} · {item.email}
      </p>
      <h2 className="mt-8 text-xl font-bold">Starting 5</h2>
      <ol className="list-inside list-decimal">
        {item.players.starting.map((p, i) => (
          <li key={i}>{p}</li>
        ))}
      </ol>
      <h2 className="mt-8 text-xl font-bold">Substitutes</h2>
      <ol start={6} className="list-inside list-decimal">
        {item.players.substitutes.map((p, i) => (
          <li key={i}>{p}</li>
        ))}
      </ol>
      <h2 className="mt-8 text-xl font-bold">Payment details</h2>
      <p>
        Fee: {feeLabel} · Status: {item.status}
      </p>
      <p>Transaction ID: {item.payment.transactionId || "Not provided"}</p>
      <p>Proof: {item.payment.paymentProofName || "Not provided"}</p>
      <h2 className="mt-8 text-xl font-bold">Tournament details</h2>
      <p>
        {config.date} · {config.venue} · Prize: {config.prizeMoney}
      </p>
      <p className="mt-10 border-t pt-4 text-sm">
        Payment is subject to organizer verification. This registration is saved
        in this browser only.
      </p>
    </div>
  )
}

function Header({
  view,
  setView,
}: {
  view: "home" | "admin"
  setView: (view: "home" | "admin") => void
}) {
  const [menuOpen, setMenuOpen] = useState(false)
  const go = (target: "home" | "admin", register = false) => {
    setView(target)
    setMenuOpen(false)
    if (register) setTimeout(scrollToRegister, 50)
    else window.scrollTo({ top: 0, behavior: "smooth" })
  }
  return (
    <header className="relative z-20 border-b border-[#e4e8df] bg-[#f7f8f3]">
      <div className="mx-auto flex h-[76px] max-w-[1240px] items-center justify-between gap-4 px-5 md:px-8">
        <button
          className="flex items-center gap-3 text-left"
          onClick={() => go("home")}
          aria-label="Go to homepage"
        >
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#193a29] text-[#d9f36a]">
            <CircleDot size={22} strokeWidth={2.5} />
          </span>
          <span className="leading-tight">
            <strong className="block font-display text-[20px] font-bold tracking-tight text-[#173223]">
              SMPL<span className="text-[#729240]">/</span>5s
            </strong>
            <span className="block text-[9px] font-bold uppercase tracking-[.18em] text-[#69796b]">
              Football tournament
            </span>
          </span>
        </button>
        <nav
          className="hidden items-center gap-8 text-sm font-semibold text-[#536356] md:flex"
          aria-label="Main navigation"
        >
          <button
            onClick={() => go("home")}
            className={`hover:text-[#153d29] ${
              view === "home" ? "text-[#183a28]" : ""
            }`}
          >
            Home
          </button>
          <button
            onClick={() => {
              go("home")
              setTimeout(
                () =>
                  document
                    .getElementById("format")
                    ?.scrollIntoView({ behavior: "smooth" }),
                50,
              )
            }}
            className="hover:text-[#153d29]"
          >
            Tournament format
          </button>
          <button
            onClick={() => go("admin")}
            className={`hover:text-[#153d29] ${
              view === "admin" ? "text-[#183a28]" : ""
            }`}
          >
            Admin
          </button>
        </nav>
        <button
          onClick={() => go("home", true)}
          className={`${primaryClass} hidden !px-5 !py-2.5 !text-sm md:inline-flex`}
        >
          Register your team <ArrowRight size={16} />
        </button>
        <button
          className="rounded-lg p-2 md:hidden"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <X /> : <Menu />}
        </button>
      </div>
      {menuOpen && (
        <nav
          className="flex flex-col gap-1 border-t border-[#e4e8df] bg-[#f7f8f3] p-5 text-sm font-semibold md:hidden"
          aria-label="Mobile navigation"
        >
          <button
            className="rounded-lg p-3 text-left"
            onClick={() => go("home")}
          >
            Home
          </button>
          <button
            className="rounded-lg p-3 text-left"
            onClick={() => {
              go("home")
              setTimeout(
                () =>
                  document
                    .getElementById("format")
                    ?.scrollIntoView({ behavior: "smooth" }),
                50,
              )
            }}
          >
            Tournament format
          </button>
          <button
            className="rounded-lg p-3 text-left"
            onClick={() => go("admin")}
          >
            Admin
          </button>
          <button
            className={`${primaryClass} mt-2`}
            onClick={() => go("home", true)}
          >
            Register your team <ArrowRight size={16} />
          </button>
        </nav>
      )}
    </header>
  )
}

function Hero() {
  const info = [
    { icon: CalendarDays, label: "TOURNAMENT DATE", value: config.date },
    { icon: MapPin, label: "VENUE", value: config.venue },
    { icon: IndianRupee, label: "ENTRY FEE", value: feeLabel },
    { icon: Trophy, label: "PRIZE POOL", value: config.prizeMoney },
    {
      icon: Phone,
      label: "CONTACT",
      value: config.contactNumbers.length
        ? config.contactNumbers.join(" / ")
        : "To be announced",
    },
  ]
  return (
    <>
      <section className="relative overflow-hidden bg-[#142d21] text-white">
        <div
          className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1487466365202-1afdb86c764e?auto=format&fit=crop&w=1800&q=85')] bg-cover bg-center opacity-35"
          role="img"
          aria-label="Football field under floodlights at night"
        />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,#112b20_0%,rgba(17,43,32,.96)_30%,rgba(17,43,32,.68)_66%,rgba(17,43,32,.2)_100%)]" />
        <div className="absolute -right-32 top-[-130px] h-[600px] w-[600px] rounded-full border border-white/10" />
        <div className="absolute -right-12 top-[-50px] h-[440px] w-[440px] rounded-full border border-white/10" />
        <div className="relative mx-auto flex min-h-[570px] max-w-[1240px] flex-col justify-center px-5 py-20 md:px-8 md:py-24">
          <div className="mb-7 flex w-fit items-center gap-2 rounded-full border border-[#b8d982]/40 bg-[#b8d982]/10 px-4 py-2 text-[11px] font-bold uppercase tracking-[.18em] text-[#d9f36a]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#d9f36a]" /> Team
            registrations open
          </div>
          <p className="mb-3 font-display text-lg font-bold uppercase tracking-[.22em] text-[#c9e686]">
            The beautiful game. Your moment.
          </p>
          <h1 className="max-w-[790px] font-display text-[clamp(3.4rem,8vw,7.4rem)] font-bold uppercase leading-[.88] tracking-[-.035em]">
            Small pitch.
            <br />
            <span className="text-[#d9f36a]">Big dreams.</span>
          </h1>
          <p className="mt-7 max-w-[530px] text-[16px] leading-relaxed text-[#d8e3d9] md:text-lg">
            Bring your best eight. Make every touch count at the {config.title}.
          </p>
          <div className="mt-9 flex flex-wrap items-center gap-4">
            <button onClick={scrollToRegister} className={primaryClass}>
              Register your team <ArrowRight size={18} />
            </button>
            <a
              href="#format"
              className="inline-flex items-center gap-2 rounded-xl px-4 py-3.5 font-semibold text-white transition hover:text-[#d9f36a]"
            >
              Explore the format <ArrowDown size={17} />
            </a>
          </div>
          <div className="mt-12 flex items-center gap-7 border-t border-white/20 pt-6 text-sm text-[#d5e0d4]">
            <span>
              <strong className="mr-2 font-display text-2xl text-white">
                5
              </strong>{" "}
              on the pitch
            </span>
            <span className="h-6 w-px bg-white/25" />
            <span>
              <strong className="mr-2 font-display text-2xl text-white">
                8
              </strong>{" "}
              in the squad
            </span>
            <span className="h-6 w-px bg-white/25" />
            <span className="font-semibold text-[#d9f36a]">
              One shot at glory.
            </span>
          </div>
        </div>
      </section>
      <section className="border-b border-[#e5e8e0] bg-white">
        <div className="mx-auto grid max-w-[1240px] grid-cols-2 gap-px bg-[#e8ede6] lg:grid-cols-5 lg:bg-transparent lg:gap-0 px-5 md:px-8">
          {info.map(({ icon: Icon, label, value }) => (
            <div
              className="flex gap-3 bg-white py-6 pr-3 lg:border-r lg:border-[#e8ede6] lg:px-4 first:lg:pl-0 last:lg:border-0"
              key={label}
            >
              <span className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#edf4e4] text-[#4c7241]">
                <Icon size={19} />
              </span>
              <div>
                <div className="text-[10px] font-bold tracking-[.14em] text-[#829185]">
                  {label}
                </div>
                <div className="mt-1 text-sm font-bold text-[#203d2b]">
                  {value}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  )
}

function Format() {
  return (
    <section
      id="format"
      className="mx-auto grid max-w-[1240px] gap-12 px-5 py-20 md:px-8 lg:grid-cols-[1fr_1fr] lg:items-center lg:gap-24 lg:py-28"
    >
      <div>
        <p className="eyebrow">THE FORMAT</p>
        <h2 className="mt-3 font-display text-5xl font-bold uppercase leading-[.98] tracking-tight text-[#173a29] md:text-6xl">
          All heart.
          <br />
          <span className="text-[#829848]">No sidelines.</span>
        </h2>
        <p className="mt-6 max-w-lg text-base leading-7 text-[#5f7162]">
          Fast feet, quick thinking, and a team that has your back. Build your
          eight-player squad and get ready to leave it all on the pitch.
        </p>
        <div className="mt-8 flex flex-col gap-4">
          <div className="flex items-center gap-3 text-sm font-semibold text-[#23402e]">
            <CheckCircle2 size={19} className="text-[#6d9543]" /> 5 starting
            players, including your captain
          </div>
          <div className="flex items-center gap-3 text-sm font-semibold text-[#23402e]">
            <CheckCircle2 size={19} className="text-[#6d9543]" /> 3 substitutes
            ready to make an impact
          </div>
          <div className="flex items-center gap-3 text-sm font-semibold text-[#23402e]">
            <CheckCircle2 size={19} className="text-[#6d9543]" /> Exactly 8
            players per team
          </div>
        </div>
        <button
          onClick={scrollToRegister}
          className="mt-8 inline-flex items-center gap-2 font-bold text-[#315d37] hover:underline"
        >
          Build your squad <ArrowRight size={18} />
        </button>
      </div>
      <div className="relative rounded-[28px] bg-[#193a2a] p-6 shadow-[0_25px_60px_-30px_#24432b] sm:p-9">
        <div className="absolute inset-3 rounded-[20px] border border-white/12" />
        <div className="relative">
          <div className="flex items-center justify-between border-b border-white/15 pb-5">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[.2em] text-[#d9f36a]">
                The starting lineup
              </p>
              <h3 className="mt-1 font-display text-3xl font-bold uppercase text-white">
                Your matchday 8
              </h3>
            </div>
            <span className="rounded-lg border border-[#d9f36a]/50 px-3 py-2 font-display text-xl font-bold text-[#d9f36a]">
              5 + 3
            </span>
          </div>
          <div className="mt-7 grid grid-cols-5 gap-2 text-center">
            {["CAP", "02", "03", "04", "05"].map((number, i) => (
              <div key={number}>
                <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-full border-2 border-[#d9f36a] bg-[#d9f36a]/15 font-display text-lg font-bold text-[#d9f36a] sm:h-14 sm:w-14">
                  {i === 0 ? "C" : number}
                </div>
                <span className="mt-2 block text-[10px] font-semibold text-white/70">
                  {i === 0 ? "CAPTAIN" : `PLAYER ${i + 1}`}
                </span>
              </div>
            ))}
          </div>
          <div className="my-8 flex items-center gap-3 text-[10px] font-bold uppercase tracking-[.22em] text-white/50">
            <span className="h-px flex-1 bg-white/20" /> Starting five{" "}
            <span className="h-px flex-1 bg-white/20" />
          </div>
          <div className="flex justify-center gap-10">
            {[6, 7, 8].map((n) => (
              <div key={n} className="text-center">
                <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-full border border-white/40 bg-white/10 font-display text-lg font-bold text-white sm:h-14 sm:w-14">
                  0{n}
                </div>
                <span className="mt-2 block text-[10px] font-semibold text-white/60">
                  SUB {n - 5}
                </span>
              </div>
            ))}
          </div>
          <p className="mt-8 border-t border-white/15 pt-5 text-center text-xs text-white/60">
            One team. Eight players. Endless possibilities.
          </p>
        </div>
      </div>
    </section>
  )
}

function Input({
  id,
  label,
  value,
  onChange,
  placeholder,
  error,
  type = "text",
  note,
  readOnly = false,
}: {
  id: string
  label: string
  value: string
  onChange?: (value: string) => void
  placeholder: string
  error?: string
  type?: string
  note?: string
  readOnly?: boolean
}) {
  return (
    <div>
      <label
        htmlFor={id}
        className="mb-2 block text-sm font-bold text-[#243d2d]"
      >
        {label} {!readOnly && <span className="text-[#ad5b3f]">*</span>}
      </label>
      <input
        id={id}
        name={id}
        type={type}
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        placeholder={placeholder}
        readOnly={readOnly}
        aria-invalid={Boolean(error)}
        aria-describedby={
          error ? `${id}-error` : note ? `${id}-note` : undefined
        }
        className={`${fieldClass} ${
          error
            ? "border-[#c96952] focus:border-[#c96952] focus:ring-[#f9dfda]"
            : ""
        } ${readOnly ? "bg-[#f3f5ef] text-[#6d796d]" : ""}`}
      />
      {error && (
        <p
          id={`${id}-error`}
          role="alert"
          className="mt-1.5 text-xs font-medium text-[#b24d3c]"
        >
          {error}
        </p>
      )}
      {note && !error && (
        <p id={`${id}-note`} className="mt-1.5 text-xs text-[#7a897a]">
          {note}
        </p>
      )}
    </div>
  )
}

function TeamStep({
  data,
  set,
  errors,
}: {
  data: FormData
  set: (patch: Partial<FormData>) => void
  errors: Errors
}) {
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

function SquadStep({
  data,
  set,
  errors,
}: {
  data: FormData
  set: (patch: Partial<FormData>) => void
  errors: Errors
}) {
  const update = (index: number, value: string) => {
    const players = [...data.players]
    players[index] = value
    set({ players })
  }
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
              5 starters · 3 substitutes
            </span>
          </div>
        </div>
        <span className="font-display text-xl font-bold text-[#315536]">
          {data.players.filter((p) => p.trim()).length}/8
        </span>
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
        {data.players.slice(0, 5).map((player, index) => (
          <Input
            key={index}
            id={`player${index}`}
            label={`Player ${index + 1}${index === 0 ? " — Captain" : ""}`}
            value={index === 0 ? data.captainName : player}
            onChange={(value) => update(index, value)}
            placeholder={
              index === 0 ? "From team details" : "Player's full name"
            }
            error={errors[`player${index}`]}
            readOnly={index === 0}
          />
        ))}
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
        {data.players.slice(5).map((player, i) => (
          <Input
            key={i + 5}
            id={`player${i + 5}`}
            label={`Player ${i + 6}`}
            value={player}
            onChange={(value) => update(i + 5, value)}
            placeholder="Player's full name"
            error={errors[`player${i + 5}`]}
          />
        ))}
      </div>
    </div>
  )
}

function PaymentStep({
  data,
  set,
  errors,
  setMessage,
}: {
  data: FormData
  set: (patch: Partial<FormData>) => void
  errors: Errors
  setMessage: (value: string) => void
}) {
  const [copied, setCopied] = useState(false)
  const [qr, setQr] = useState("")
  const [reading, setReading] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)
  useEffect(() => {
    if (!config.upiId) return
    const uri = `upi://pay?pa=${encodeURIComponent(config.upiId)}&pn=${encodeURIComponent(config.shortName)}${
      config.registrationFee !== null ? `&am=${config.registrationFee}` : ""
    }&cu=INR`
    QRCode.toDataURL(uri, { width: 240, margin: 2 })
      .then(setQr)
      .catch(() => setQr(""))
  }, [])
  async function copyUpi() {
    try {
      await navigator.clipboard.writeText(config.upiId)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      setMessage(
        "Unable to copy automatically. Please select and copy the UPI ID.",
      )
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
    if (file.size > config.maxProofSize) {
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
            {feeLabel}
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
        {config.upiId ? (
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
            <div className="min-w-0 flex-1">
              <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-[#7a8c7c]">
                UPI ID
              </p>
              <div className="flex flex-wrap items-center gap-2">
                <code className="break-all text-lg font-bold text-[#1e3c2b]">
                  {config.upiId}
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
                Pay the registration fee using the UPI ID or scan the QR code.
                Then add a screenshot or transaction reference below.
              </p>
            </div>
            {qr && (
              <img
                src={qr}
                alt={`UPI payment QR code for ${config.upiId}`}
                className="h-36 w-36 rounded-xl border border-[#e3e7e1] p-2"
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
              {reading
                ? "Reading image..."
                : "Click to upload payment screenshot"}
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
        <span className="text-xs font-bold uppercase text-[#94a095]">
          and / or
        </span>
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

function ReviewStep({
  data,
  edit,
}: {
  data: FormData
  edit: (step: number) => void
}) {
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
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <p className="mb-2 text-xs font-bold uppercase tracking-wider text-[#839280]">
              Starting 5
            </p>
            {data.players.slice(0, 5).map((p, i) => (
              <p className="py-1 text-sm font-medium text-[#263f2d]" key={i}>
                <span className="mr-3 text-[#9ba99a]">0{i + 1}</span>
                {p}
                {i === 0 && (
                  <span className="ml-2 text-xs text-[#5c804e]">(C)</span>
                )}
              </p>
            ))}
          </div>
          <div>
            <p className="mb-2 text-xs font-bold uppercase tracking-wider text-[#839280]">
              Substitutes
            </p>
            {data.players.slice(5).map((p, i) => (
              <p className="py-1 text-sm font-medium text-[#263f2d]" key={i}>
                <span className="mr-3 text-[#9ba99a]">0{i + 6}</span>
                {p}
              </p>
            ))}
          </div>
        </div>,
      )}
      {section(
        "Payment",
        2,
        <>
          {row("Registration fee", feeLabel)}
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

function Success({ item, reset }: { item: Registration
  reset: () => void
}) {
  return (
    <div className="mx-auto max-w-[760px] text-center">
      <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-[#e3f2d2] text-[#4b7b3d]">
        <CheckCircle2 size={43} strokeWidth={1.6} />
      </div>
      <p className="eyebrow">YOU'RE IN THE GAME</p>
      <h2 className="mt-2 font-display text-5xl font-bold uppercase leading-none text-[#183a29] sm:text-6xl">
        Registration
        <br />
        received.
      </h2>
      <p className="mx-auto mt-5 max-w-md text-sm leading-6 text-[#657768]">
        Your team is on the list in this browser. Keep your registration ID
        handy; payment is pending organizer verification.
      </p>
      <div className="mt-9 rounded-2xl border border-[#dce5d7] bg-white p-6 text-left shadow-sm sm:p-8">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#e7ebe4] pb-5">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[.16em] text-[#819283]">
              Your registration ID
            </p>
            <p className="mt-2 break-all font-display text-2xl font-bold text-[#1d452d] sm:text-3xl">
              {item.registrationId}
            </p>
          </div>
          <span className="rounded-full bg-[#fff2d9] px-3 py-1.5 text-xs font-bold text-[#8b672b]">
            {item.status}
          </span>
        </div>
        <div className="grid gap-x-8 gap-y-5 pt-6 text-sm sm:grid-cols-2">
          <div>
            <span className="text-[#839185]">Team name</span>
            <strong className="mt-1 block text-[#243f2d]">
              {item.teamName}
            </strong>
          </div>
          <div>
            <span className="text-[#839185]">Captain</span>
            <strong className="mt-1 block text-[#243f2d]">
              {item.captainName}
            </strong>
          </div>
          <div>
            <span className="text-[#839185]">Contact number</span>
            <strong className="mt-1 block text-[#243f2d]">
              {item.contactNumber}
            </strong>
          </div>
          <div>
            <span className="text-[#839185]">Tournament</span>
            <strong className="mt-1 block text-[#243f2d]">
              {config.date} · {config.venue}
            </strong>
          </div>
          <div>
            <span className="text-[#839185]">Starting 5</span>
            <strong className="mt-1 block leading-6 text-[#243f2d]">
              {item.players.starting.join(", ")}
            </strong>
          </div>
          <div>
            <span className="text-[#839185]">Substitutes</span>
            <strong className="mt-1 block leading-6 text-[#243f2d]">
              {item.players.substitutes.join(", ")}
            </strong>
          </div>
        </div>
      </div>
      <div className="mt-6 flex flex-wrap justify-center gap-3">
        <button
          className={primaryClass}
          onClick={() =>
            downloadFile(
              receiptHtml(item),
              `${item.registrationId}-receipt.html`,
              "text/html;charset=utf-8",
            )
          }
        >
          <Download size={17} /> Download receipt
        </button>
        <button
          onClick={() => window.print()}
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#c9d5c7] bg-white px-6 py-3.5 font-bold text-[#23462f] hover:bg-[#f1f6ec]"
        >
          <Printer size={17} /> Print receipt
        </button>
      </div>
      <button
        onClick={reset}
        className="mt-7 inline-flex items-center gap-2 text-sm font-bold text-[#4a7546] hover:underline"
      >
        Register another team <ArrowRight size={16} />
      </button>
      <Receipt item={item} />
    </div>
  )
}

function RegistrationForm() {
  const [data, setData] = useState<FormData>(emptyForm)
  const [step, setStep] = useState(0)
  const [errors, setErrors] = useState<Errors>({})
  const [message, setMessage] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [result, setResult] = useState<Registration | null>(null)
  const submittingRef = useRef(false)
  const set = (patch: Partial<FormData>) => {
    setData((prev) => ({ ...prev, ...patch }))
    setErrors({})
    setMessage("")
  }
  const changeStep = (next: number) => {
    setStep(next)
    setErrors({})
    setMessage("")
    document
      .getElementById("register")
      ?.scrollIntoView({ behavior: "smooth", block: "start" })
  }
  const next = () => {
    const found =
      step === 0
        ? validateTeam(data)
        : step === 1
          ? validateSquad(data)
          : validatePayment(data)
    setErrors(found)
    if (Object.keys(found).length === 0) changeStep(step + 1)
  }
  async function submit() {
    if (submittingRef.current) return
    const checks = [
      validateTeam(data),
      validateSquad(data),
      validatePayment(data),
    ]
    const invalid = checks.findIndex((check) => Object.keys(check).length > 0)
    if (invalid !== -1) {
      changeStep(invalid)
      setErrors(checks[invalid])
      setMessage("Please complete the highlighted fields before submitting.")
      return
    }
    submittingRef.current = true
    setSubmitting(true)
    setMessage("")
    try {
      await new Promise((resolve) => setTimeout(resolve, 550))
      const saved = submitRegistration(data)
      setResult(saved)
      document
        .getElementById("register")
        ?.scrollIntoView({ behavior: "smooth" })
    } catch {
      setMessage(
        "Couldn't save this registration in your browser. Try removing the image or freeing browser storage and submit again.",
      )
    } finally {
      submittingRef.current = false
      setSubmitting(false)
    }
  }
  return (
    <section
      id="register"
      className="scroll-mt-6 bg-[#edf1e9] px-5 py-20 md:px-8 lg:py-24"
    >
      <div className="mx-auto max-w-[1150px]">
        <div className="mb-10 text-center">
          <p className="eyebrow">JOIN THE TOURNAMENT</p>
          <h2 className="mt-2 font-display text-5xl font-bold uppercase tracking-tight text-[#173a29] sm:text-6xl">
            Claim your place.
          </h2>
          <p className="mt-3 text-sm text-[#6e806f]">
            One quick form. Eight players. A whole lot to play for.
          </p>
        </div>
        {result ? (
          <Success
            item={result}
            reset={() => {
              setData(emptyForm())
              setResult(null)
              setStep(0)
              setErrors({})
              setMessage("")
              scrollToRegister()
            }}
          />
        ) : (
          <div className="overflow-hidden rounded-[24px] border border-[#e0e7da] bg-white shadow-[0_25px_65px_-35px_#718673] lg:grid lg:grid-cols-[270px_1fr]">
            <aside className="bg-[#1a3a29] p-7 text-white lg:p-9">
              <div className="mb-8">
                <p className="text-[10px] font-bold uppercase tracking-[.2em] text-[#cce58e]">
                  Registration
                </p>
                <h3 className="mt-2 font-display text-3xl font-bold uppercase leading-none">
                  Let's get
                  <br />
                  you in.
                </h3>
              </div>
              <div
                className="flex gap-1 lg:flex-col lg:gap-0"
                aria-label="Registration progress"
              >
                {steps.map((name, index) => (
                  <div
                    key={name}
                    className="relative flex flex-1 items-center gap-3 pb-0 lg:pb-9 last:lg:pb-0"
                  >
                    <div
                      className={`relative z-10 flex h-9 w-9 shrink-0 items-center justify-center rounded-full border text-sm font-bold ${
                        index < step
                          ? "border-[#d9f36a] bg-[#d9f36a] text-[#1a3a29]"
                          : index === step
                            ? "border-[#d9f36a] bg-[#34583a] text-[#d9f36a]"
                            : "border-white/30 text-white/50"
                      }`}
                    >
                      {index < step ? <Check size={17} /> : `0${index + 1}`}
                    </div>
                    <span
                      className={`hidden text-sm font-semibold lg:block ${
                        index > step ? "text-white/45" : "text-white"
                      }`}
                    >
                      {name}
                    </span>
                    {index < steps.length - 1 && (
                      <div className="absolute left-[18px] top-9 hidden h-[calc(100%-36px)] w-px bg-white/20 lg:block" />
                    )}
                  </div>
                ))}
              </div>
              <div className="mt-8 hidden border-t border-white/20 pt-6 text-xs leading-6 text-white/65 lg:block">
                <CircleHelp size={18} className="mb-2 text-[#d9f36a]" />
                Need help? Contact the organizer for event or payment questions.
              </div>
            </aside>
            <div className="p-5 sm:p-9 lg:p-12">
              <div className="mb-8 flex items-center gap-2 text-[11px] font-bold uppercase tracking-[.14em] text-[#7a9373]">
                STEP {step + 1} OF 4 <ChevronRight size={13} /> {steps[step]}
              </div>
              <h3 className="font-display text-3xl font-bold uppercase text-[#1a3b29] sm:text-4xl">
                {
                  [
                    "Tell us about your team",
                    "Build your squad",
                    "Complete your payment",
                    "Review & confirm",
                  ][step]
                }
              </h3>
              <p className="mb-8 mt-2 text-sm leading-6 text-[#778878]">
                {
                  [
                    "Start with the basics. Make sure we can reach your captain.",
                    "Add all eight players. Your captain is automatically Player 1.",
                    "Add your payment details so the organizer can verify them.",
                    "Make sure everything looks right before you submit.",
                  ][step]
                }
              </p>
              {step === 0 && <TeamStep data={data} set={set} errors={errors} />}
              {step === 1 && (
                <SquadStep data={data} set={set} errors={errors} />
              )}
              {step === 2 && (
                <PaymentStep
                  data={data}
                  set={set}
                  errors={errors}
                  setMessage={setMessage}
                />
              )}
              {step === 3 && <ReviewStep data={data} edit={changeStep} />}
              {message && (
                <p
                  role="alert"
                  className="mt-5 rounded-lg bg-[#fff1e9] p-3 text-sm font-medium text-[#ae513b]"
                >
                  {message}
                </p>
              )}
              <div className="mt-9 flex flex-wrap items-center justify-between gap-4 border-t border-[#edf0e9] pt-6">
                {step > 0 ? (
                  <button
                    type="button"
                    onClick={() => changeStep(step - 1)}
                    className="inline-flex items-center gap-2 rounded-lg px-2 py-3 text-sm font-bold text-[#576f5b] hover:text-[#1a3b29]"
                  >
                    <ArrowLeft size={17} /> Back
                  </button>
                ) : (
                  <span className="text-xs text-[#9ba89a]">
                    * Required fields
                  </span>
                )}
                {step < 3 ? (
                  <button type="button" className={primaryClass} onClick={next}>
                    Continue <ArrowRight size={17} />
                  </button>
                ) : (
                  <button
                    type="button"
                    className={primaryClass}
                    onClick={submit}
                    disabled={submitting}
                  >
                    {submitting ? "Submitting..." : "Submit registration"}{" "}
                    {submitting ? (
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-[#193a29]/30 border-t-[#193a29]" />
                    ) : (
                      <ArrowRight size={17} />
                    )}
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}

function AdminLogin({ onAuthenticated }: { onAuthenticated: () => void }) {
  const [isSetup, setIsSetup] = useState(() => !hasAdminPasscode())
  const [password, setPassword] = useState("")
  const [confirmation, setConfirmation] = useState("")
  const [visible, setVisible] = useState(false)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState("")

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (busy) return
    setError("")
    if (isSetup && password.length < 8) {
      setError("Choose a passcode with at least 8 characters.")
      return
    }
    if (isSetup && password !== confirmation) {
      setError("The passcodes do not match.")
      return
    }
    setBusy(true)
    try {
      if (isSetup) await setupAdminPasscode(password)
      else if (!(await signInAdmin(password))) {
        setError("Incorrect passcode. Please try again.")
        return
      }
      setPassword("")
      setConfirmation("")
      onAuthenticated()
    } catch {
      setError(
        "Unable to access this browser's storage or security features. Please try again in a secure browser context.",
      )
      setIsSetup(!hasAdminPasscode())
    } finally {
      setBusy(false)
    }
  }

  return (
    <main className="flex min-h-[75vh] items-center bg-[#edf1e9] px-5 py-16 md:px-8">
      <div className="mx-auto grid w-full max-w-[930px] overflow-hidden rounded-[24px] border border-[#dce5d6] bg-white shadow-[0_25px_65px_-35px_#718673] md:grid-cols-[.85fr_1.15fr]">
        <div className="flex flex-col justify-between bg-[#1a3a29] p-8 text-white sm:p-10">
          <div>
            <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#d9f36a] text-[#1a3a29]">
              <LockKeyhole size={23} />
            </span>
            <p className="mt-10 text-[11px] font-bold uppercase tracking-[.2em] text-[#d9f36a]">
              ORGANIZER ACCESS
            </p>
            <h1 className="mt-3 font-display text-5xl font-bold uppercase leading-[.96]">
              Your teams.
              <br />
              Your space.
            </h1>
            <p className="mt-5 max-w-sm text-sm leading-7 text-[#c7d8c7]">
              Review registrations, verify payments and keep every team
              organized in one place.
            </p>
          </div>
          <p className="mt-10 border-t border-white/20 pt-5 text-xs leading-6 text-[#b9cebb]">
            This is a browser-local demo. The passcode gates this dashboard on
            this device only; it does not secure registration data or provide
            multi-device access.
          </p>
        </div>
        <div className="p-7 sm:p-10 md:p-12">
          <p className="eyebrow">
            {isSetup ? "FIRST-TIME SETUP" : "WELCOME BACK"}
          </p>
          <h2 className="mt-3 font-display text-4xl font-bold uppercase text-[#183a29]">
            {isSetup ? "Set up admin access" : "Admin sign in"}
          </h2>
          <p className="mt-2 text-sm leading-6 text-[#758677]">
            {isSetup
              ? "Create a passcode for this browser. Whoever opens admin first can set it up."
              : "Enter your passcode to view local registrations."}
          </p>
          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            <div>
              <label
                htmlFor="admin-password"
                className="mb-2 block text-sm font-bold text-[#243d2d]"
              >
                Admin passcode
              </label>
              <div className="relative">
                <input
                  id="admin-password"
                  type={visible ? "text" : "password"}
                  autoComplete={isSetup ? "new-password" : "current-password"}
                  className={`${fieldClass} !pr-20`}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value)
                    setError("")
                  }}
                  placeholder={
                    isSetup ? "At least 8 characters" : "Enter your passcode"
                  }
                  required
                  minLength={isSetup ? 8 : undefined}
                  aria-invalid={Boolean(error)}
                  aria-describedby={error ? "admin-error" : undefined}
                />
                <button
                  type="button"
                  onClick={() => setVisible(!visible)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-[#52784c] hover:underline"
                  aria-label={visible ? "Hide passcode" : "Show passcode"}
                >
                  {visible ? "Hide" : "Show"}
                </button>
              </div>
            </div>
            {isSetup && (
              <div>
                <label
                  htmlFor="admin-confirm"
                  className="mb-2 block text-sm font-bold text-[#243d2d]"
                >
                  Confirm passcode
                </label>
                <input
                  id="admin-confirm"
                  type={visible ? "text" : "password"}
                  autoComplete="new-password"
                  className={fieldClass}
                  value={confirmation}
                  onChange={(e) => {
                    setConfirmation(e.target.value)
                    setError("")
                  }}
                  placeholder="Enter it again"
                  required
                />
              </div>
            )}
            {error && (
              <p
                id="admin-error"
                role="alert"
                className="rounded-lg bg-[#fff1e9] p-3 text-sm font-medium text-[#ae513b]"
              >
                {error}
              </p>
            )}
            <button
              type="submit"
              disabled={busy}
              className={`${primaryClass} w-full`}
            >
              {busy
                ? "Please wait..."
                : isSetup
                  ? "Create passcode & enter"
                  : "Sign in to dashboard"}
              {busy ? (
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-[#193a29]/30 border-t-[#193a29]" />
              ) : (
                <ArrowRight size={17} />
              )}
            </button>
          </form>
          <div className="mt-7 flex items-start gap-2 border-t border-[#e8ede5] pt-5 text-xs leading-5 text-[#849385]">
            <ShieldCheck size={17} className="shrink-0 text-[#638a54]" />
            {isSetup
              ? "Your passcode is stored as a salted hash in this browser. Keep it somewhere safe."
              : "Your sign-in lasts for this browser tab's session. Sign out when you're done."}
          </div>
        </div>
      </div>
    </main>
  )
}

function Admin({ onSignOut }: { onSignOut: () => void }) {
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
      "Registration ID",
      "Team",
      "Captain",
      "Contact",
      "Email",
      "Starting 5",
      "Substitutes",
      "Transaction ID",
      "Proof filename",
      "Status",
      "Created at",
    ]
    const cell = (value: string) => {
      const safe = /^[=+@\-\t\r]/.test(value) ? `'${value}` : value
      return `"${safe.replace(/"/g, '""')}"`
    }
    const lines = items.map((r) =>
      [
        r.registrationId,
        r.teamName,
        r.captainName,
        r.contactNumber,
        r.email,
        r.players.starting.join("; "),
        r.players.substitutes.join("; "),
        r.payment.transactionId,
        r.payment.paymentProofName || "",
        r.status,
        r.createdAt,
      ]
        .map(cell)
        .join(","),
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
            <p className="eyebrow">
              <LayoutDashboard size={15} className="inline-block" /> ORGANIZER
              VIEW
            </p>
            <h1 className="mt-3 font-display text-5xl font-bold uppercase text-[#183a29]">
              Registrations.
            </h1>
            <p className="mt-3 max-w-xl text-sm leading-6 text-[#687969]">
              Local demo dashboard. Records are stored only in this browser on
              this device. The passcode is not server-backed authentication.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={exportCsv}
              disabled={!items.length}
              className={`${primaryClass} !bg-[#1c3e2b] !text-white hover:!bg-[#31573b]`}
            >
              <Download size={17} /> Export CSV
            </button>
            <button
              onClick={onSignOut}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#c9d5c7] bg-white px-5 py-3.5 font-bold text-[#23462f] hover:bg-[#f1f6ec]"
            >
              <LogOut size={17} /> Sign out
            </button>
          </div>
        </div>
        <div className="mt-9 grid gap-4 sm:grid-cols-3">
          {[
            ["Total teams", items.length, Users],
            [
              "Pending verification",
              items.filter((r) => r.status === "Pending verification").length,
              ClipboardCheck,
            ],
            [
              "Verified",
              items.filter((r) => r.status === "Verified").length,
              ShieldCheck,
            ],
          ].map(([label, value, Icon]) => {
            const IconComponent = Icon as typeof Users
            return (
              <div
                className="rounded-2xl border border-[#e2e9dd] bg-white p-6"
                key={label as string}
              >
                <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-[#788979]">
                  <span>{label as string}</span>
                  <IconComponent size={19} className="text-[#6a8b58]" />
                </div>
                <div className="mt-5 font-display text-4xl font-bold text-[#1b3c2a]">
                  {value as number}
                </div>
              </div>
            )
          })}
        </div>
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
          {filtered.length ? (
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
                  {filtered.map((item) => (
                    <tr
                      key={item.registrationId}
                      className="border-b border-[#edf0eb] last:border-0"
                    >
                      <td className="py-4">
                        <strong className="block text-[#26452f]">
                          {item.teamName}
                        </strong>
                        <span className="text-xs text-[#8b9a89]">
                          {item.registrationId}
                        </span>
                      </td>
                      <td className="py-4 text-[#586c5c]">
                        {item.captainName}
                      </td>
                      <td className="py-4 text-[#586c5c]">
                        {new Date(item.createdAt).toLocaleDateString("en-IN")}
                      </td>
                      <td className="py-4">
                        <span
                          className={`rounded-full px-3 py-1.5 text-xs font-bold ${
                            item.status === "Verified"
                              ? "bg-[#e8f5e4] text-[#397043]"
                              : item.status === "Needs attention"
                                ? "bg-[#fce9e5] text-[#a6513d]"
                                : "bg-[#fff2dc] text-[#906d32]"
                          }`}
                        >
                          {item.status}
                        </span>
                      </td>
                      <td className="py-4 text-right">
                        <button
                          onClick={() => setSelected(item)}
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
          ) : (
            <div className="py-16 text-center">
              <Users size={32} className="mx-auto text-[#98ae90]" />
              <h3 className="mt-4 font-bold text-[#274633]">
                {items.length ? "No matching teams" : "No teams yet"}
              </h3>
              <p className="mt-1 text-sm text-[#879587]">
                {items.length
                  ? "Try a different search."
                  : "Registrations submitted in this browser will appear here."}
              </p>
            </div>
          )}
        </div>
      </div>
      {selected && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#11251a]/70 p-4"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) setSelected(null)
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-label={`Registration for ${selected.teamName}`}
            className="max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl sm:p-8"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="eyebrow">TEAM REGISTRATION</p>
                <h2 className="mt-2 font-display text-3xl font-bold uppercase text-[#1e402d]">
                  {selected.teamName}
                </h2>
                <p className="mt-1 break-all text-sm text-[#768677]">
                  {selected.registrationId}
                </p>
              </div>
              <button
                onClick={() => setSelected(null)}
                aria-label="Close details"
                className="rounded-lg p-2 hover:bg-[#f1f4ef]"
              >
                <X size={21} />
              </button>
            </div>
            <div className="mt-6 grid gap-4 border-y border-[#e7ece4] py-5 text-sm sm:grid-cols-2">
              <div>
                <span className="text-[#899789]">Captain</span>
                <strong className="block text-[#294631]">
                  {selected.captainName}
                </strong>
              </div>
              <div>
                <span className="text-[#899789]">Contact</span>
                <strong className="block text-[#294631]">
                  {selected.contactNumber}
                </strong>
              </div>
              <div>
                <span className="text-[#899789]">Email</span>
                <strong className="block break-all text-[#294631]">
                  {selected.email}
                </strong>
              </div>
              <div>
                <span className="text-[#899789]">Submitted</span>
                <strong className="block text-[#294631]">
                  {new Date(selected.createdAt).toLocaleString("en-IN")}
                </strong>
              </div>
            </div>
            <div className="mt-5 grid gap-5 text-sm sm:grid-cols-2">
              <div>
                <strong className="text-[#294631]">Starting 5</strong>
                {selected.players.starting.map((name, i) => (
                  <p key={i} className="mt-2 text-[#617462]">
                    {i + 1}. {name}
                  </p>
                ))}
              </div>
              <div>
                <strong className="text-[#294631]">Substitutes</strong>
                {selected.players.substitutes.map((name, i) => (
                  <p key={i} className="mt-2 text-[#617462]">
                    {i + 6}. {name}
                  </p>
                ))}
              </div>
            </div>
            <div className="mt-6 border-t border-[#e7ece4] pt-5 text-sm">
              <strong className="text-[#294631]">Payment</strong>
              <p className="mt-2 text-[#617462]">
                Reference: {selected.payment.transactionId || "Not provided"}
              </p>
              {selected.payment.paymentProof ? (
                <a
                  href={selected.payment.paymentProof}
                  download={
                    selected.payment.paymentProofName || "payment-proof.png"
                  }
                  className="mt-3 inline-flex items-center gap-2 font-bold text-[#4a784b] hover:underline"
                >
                  <FileImage size={17} /> View / download proof:{" "}
                  {selected.payment.paymentProofName}
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
                value={selected.status}
                onChange={(e) =>
                  changeStatus(selected, e.target.value as RegistrationStatus)
                }
              >
                <option>Pending verification</option>
                <option>Verified</option>
                <option>Needs attention</option>
              </select>
              <p className="mt-2 text-xs text-[#879687]">
                Status changes are saved to this browser only.
              </p>
            </div>
            <div className="mt-6 flex flex-wrap gap-3">
              <button
                onClick={() =>
                  downloadFile(
                    receiptHtml(selected),
                    `${selected.registrationId}-receipt.html`,
                    "text/html;charset=utf-8",
                  )
                }
                className="inline-flex items-center gap-2 rounded-lg border border-[#d7e3d1] px-4 py-2.5 text-sm font-bold text-[#315e39] hover:bg-[#f4f8f0]"
              >
                <FileText size={16} /> Download receipt
              </button>
              <button
                onClick={() => window.print()}
                className="inline-flex items-center gap-2 rounded-lg border border-[#d7e3d1] px-4 py-2.5 text-sm font-bold text-[#315e39] hover:bg-[#f4f8f0]"
              >
                <Printer size={16} /> Print receipt
              </button>
            </div>
            <Receipt item={selected} />
          </div>
        </div>
      )}
    </main>
  )
}

export default function App() {
  const [view, setView] = useState<"home" | "admin">("home")
  const [adminSignedIn, setAdminSignedIn] = useState(isAdminSignedIn)
  return (
    <div className="min-h-screen bg-[#f7f8f3] text-[#193626]">
      <Header view={view} setView={setView} />
      {view === "home" ? (
        <main>
          <Hero />
          <Format />
          <RegistrationForm />
          <section className="bg-[#1a3a29] px-5 py-14 text-center text-white">
            <p className="eyebrow !text-[#d9f36a]">QUESTIONS?</p>
            <h2 className="mt-2 font-display text-3xl font-bold uppercase sm:text-4xl">
              We’re here to help.
            </h2>
            <p className="mt-3 text-sm text-[#c2d3c2]">
              Reach out to the organizer for tournament or registration details.
            </p>
            {config.contactNumbers.length > 0 ? (
              <div className="mt-5 flex flex-wrap justify-center gap-4">
                {config.contactNumbers.map((number) => (
                  <a
                    key={number}
                    href={`tel:${number}`}
                    className="inline-flex items-center gap-2 font-bold text-[#d9f36a] hover:underline"
                  >
                    <Phone size={16} /> {number}
                  </a>
                ))}
              </div>
            ) : (
              <p className="mt-4 text-sm font-semibold text-[#d9f36a]">
                Contact numbers to be announced
              </p>
            )}
          </section>
        </main>
      ) : adminSignedIn ? (
        <Admin
          onSignOut={() => {
            signOutAdmin()
            setAdminSignedIn(false)
          }}
        />
      ) : (
        <AdminLogin onAuthenticated={() => setAdminSignedIn(true)} />
      )}
      <footer className="bg-[#10281b] px-5 py-7 text-[#b1c5b2]">
        <div className="mx-auto flex max-w-[1240px] flex-wrap items-center justify-between gap-3 text-xs">
          <span className="font-display text-lg font-bold uppercase text-white">
            SMPL<span className="text-[#d9f36a]">/</span>5s
          </span>
          <span>
            Built for the love of the game. © {new Date().getFullYear()}{" "}
            {config.shortName}
          </span>
          <span className="flex items-center gap-2">
            <Mail size={14} /> Local browser demo
          </span>
        </div>
      </footer>
    </div>
  )
}
