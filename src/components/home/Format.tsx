// src/components/home/Format.tsx
import { Link } from "react-router-dom"
import { ArrowRight, CheckCircle2 } from "lucide-react"
import { eyebrowClass } from "../../lib/styles"

const highlights = [
  "5 starting players, including your captain",
  "3 substitutes ready to make an impact",
  "Exactly 8 players per team",
]

export default function Format() {
  return (
    <section
      id="format"
      className="mx-auto grid max-w-[1240px] gap-12 px-5 py-20 md:px-8 lg:grid-cols-[1fr_1fr] lg:items-center lg:gap-24 lg:py-28"
    >
      <div>
        <p className={eyebrowClass}>THE FORMAT</p>
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
          {highlights.map((text) => (
            <div
              key={text}
              className="flex items-center gap-3 text-sm font-semibold text-[#23402e]"
            >
              <CheckCircle2 size={19} className="text-[#6d9543]" /> {text}
            </div>
          ))}
        </div>
        <Link
          to="/register"
          className="mt-8 inline-flex items-center gap-2 font-bold text-[#315d37] hover:underline"
        >
          Build your squad <ArrowRight size={18} />
        </Link>
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