// src/components/layout/Footer.tsx
import { Mail } from "lucide-react"
import { tournamentConfig as config } from "../../config/tournament"

export default function Footer() {
  return (
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
  )
}