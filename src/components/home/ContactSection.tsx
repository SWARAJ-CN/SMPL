// src/components/home/ContactSection.tsx
import { Phone, User } from "lucide-react"
import { useTournamentSettings } from "../../lib/tournamentSettings"

export default function ContactSection() {
  const settings = useTournamentSettings()
  const hasContact =
    settings.contactName.trim() || settings.contactNumbers.length > 0

  return (
    <section className="bg-[#1a3a29] px-5 py-14 text-center text-white">
      <p className="text-[11px] font-bold uppercase tracking-[.2em] text-[#d9f36a]">
        QUESTIONS?
      </p>
      <h2 className="mt-2 font-display text-3xl font-bold uppercase sm:text-4xl">
        We're here to help.
      </h2>
      <p className="mt-3 text-sm text-[#c2d3c2]">
        Reach out to the organizer for tournament or registration details.
      </p>

      {hasContact ? (
        <div className="mt-6 flex flex-col items-center gap-3">
          {settings.contactName.trim() && (
            <span className="inline-flex items-center gap-2 font-display text-lg font-bold text-white">
              <User size={17} className="text-[#d9f36a]" />
              {settings.contactName}
            </span>
          )}
          {settings.contactNumbers.length > 0 ? (
            <div className="flex flex-wrap justify-center gap-4">
              {settings.contactNumbers.map((number) => (
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
            <p className="text-sm font-semibold text-[#d9f36a]">
              Phone number to be announced
            </p>
          )}
        </div>
      ) : (
        <p className="mt-4 text-sm font-semibold text-[#d9f36a]">
          Contact details to be announced
        </p>
      )}
    </section>
  )
}