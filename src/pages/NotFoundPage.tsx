// src/pages/NotFoundPage.tsx
import { Link } from "react-router-dom"
import { ArrowLeft } from "lucide-react"
import { primaryClass } from "../lib/styles"

export default function NotFoundPage() {
  return (
    <main className="flex min-h-[60vh] flex-col items-center justify-center px-5 text-center">
      <p className="text-[11px] font-bold uppercase tracking-[.2em] text-[#6f8a5f]">
        404
      </p>
      <h1 className="mt-3 font-display text-5xl font-bold uppercase text-[#183a29]">
        Off the pitch.
      </h1>
      <p className="mt-3 max-w-md text-sm leading-6 text-[#687969]">
        That page doesn’t exist. Head back home or register your team.
      </p>
      <Link to="/" className={`${primaryClass} mt-8`}>
        <ArrowLeft size={17} /> Back to home
      </Link>
    </main>
  )
}