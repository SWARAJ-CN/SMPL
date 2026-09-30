// src/components/home/Hero.tsx
import { Link } from "react-router-dom"
import {
  ArrowDown, ArrowRight, CalendarDays, IndianRupee, MapPin, Phone, Trophy,
} from "lucide-react"
import { primaryClass } from "../../lib/styles"
import { formatFee, useTournamentSettings } from "../../lib/tournamentSettings"

export default function Hero() {
  const settings = useTournamentSettings()

  const contactValue = settings.contactNumbers.length
    ? settings.contactNumbers.join(" / ")
    : "To be announced"

  const info = [
    { icon: CalendarDays, label: "TOURNAMENT DATE", value: settings.date },
    { icon: MapPin, label: "VENUE", value: settings.venue },
    { icon: IndianRupee, label: "ENTRY FEE", value: formatFee(settings.registrationFee) },
    { icon: Trophy, label: "PRIZE POOL", value: settings.prizeMoney },
    { icon: Phone, label: "CONTACT", value: contactValue },
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
            <span className="h-1.5 w-1.5 rounded-full bg-[#d9f36a]" /> Team registrations open
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
            Bring your best eight. Make every touch count at the {settings.title}.
          </p>
          <div className="mt-9 flex flex-wrap items-center gap-4">
            <Link to="/register" className={primaryClass}>
              Register your team <ArrowRight size={18} />
            </Link>
            <a
              href="#format"
              className="inline-flex items-center gap-2 rounded-xl px-4 py-3.5 font-semibold text-white transition hover:text-[#d9f36a]"
            >
              Explore the format <ArrowDown size={17} />
            </a>
          </div>
          <div className="mt-12 flex items-center gap-7 border-t border-white/20 pt-6 text-sm text-[#d5e0d4]">
            <span>
              <strong className="mr-2 font-display text-2xl text-white">5</strong> on the pitch
            </span>
            <span className="h-6 w-px bg-white/25" />
            <span>
              <strong className="mr-2 font-display text-2xl text-white">8</strong> in the squad
            </span>
            <span className="h-6 w-px bg-white/25" />
            <span className="font-semibold text-[#d9f36a]">One shot at glory.</span>
          </div>
        </div>
      </section>

      <section className="border-b border-[#e5e8e0] bg-white">
        <div className="mx-auto grid max-w-[1240px] grid-cols-2 gap-px bg-[#e8ede6] px-5 md:px-8 lg:grid-cols-5 lg:gap-0 lg:bg-transparent">
          {info.map(({ icon: Icon, label, value }) => (
            <div
              key={label}
              className="flex gap-3 bg-white py-6 pr-3 first:lg:pl-0 last:lg:border-0 lg:border-r lg:border-[#e8ede6] lg:px-4"
            >
              <span className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#edf4e4] text-[#4c7241]">
                <Icon size={19} />
              </span>
              <div>
                <div className="text-[10px] font-bold tracking-[.14em] text-[#829185]">
                  {label}
                </div>
                <div className="mt-1 text-sm font-bold text-[#203d2b]">{value}</div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  )
}