// src/components/layout/Header.tsx
import { useEffect, useState } from "react"
import { Link, NavLink, useLocation } from "react-router-dom"
import { ArrowRight, CircleDot, Menu, X } from "lucide-react"
import { cn } from "../../lib/utils"
import { primaryClass } from "../../lib/styles"

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  cn("hover:text-[#153d29]", isActive && "text-[#183a28]")

const MOBILE_LINK = "rounded-lg p-3 text-left"

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false)
  const { pathname, hash } = useLocation()

  useEffect(() => {
    setMenuOpen(false)
  }, [pathname, hash])

  return (
    <header className="relative z-20 border-b border-[#e4e8df] bg-[#f7f8f3]">
      <div className="mx-auto flex h-[76px] max-w-[1240px] items-center justify-between gap-4 px-5 md:px-8">
        <Link
          to="/"
          className="flex items-center gap-3 text-left"
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
        </Link>

        <nav
          className="hidden items-center gap-8 text-sm font-semibold text-[#536356] md:flex"
          aria-label="Main navigation"
        >
          <NavLink to="/" end className={navLinkClass}>
            Home
          </NavLink>
          <Link to="/#format" className="hover:text-[#153d29]">
            Tournament format
          </Link>
          <NavLink to="/admin" className={navLinkClass}>
            Admin
          </NavLink>
        </nav>

        <Link
          to="/register"
          className={cn(primaryClass, "hidden !px-5 !py-2.5 !text-sm md:inline-flex")}
        >
          Register your team <ArrowRight size={16} />
        </Link>

        <button
          type="button"
          className="rounded-lg p-2 md:hidden"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((open) => !open)}
        >
          {menuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {menuOpen && (
        <nav
          className="flex flex-col gap-1 border-t border-[#e4e8df] bg-[#f7f8f3] p-5 text-sm font-semibold md:hidden"
          aria-label="Mobile navigation"
        >
          <Link to="/" className={MOBILE_LINK}>
            Home
          </Link>
          <Link to="/#format" className={MOBILE_LINK}>
            Tournament format
          </Link>
          <Link to="/admin" className={MOBILE_LINK}>
            Admin
          </Link>
          <Link to="/register" className={cn(primaryClass, "mt-2")}>
            Register your team <ArrowRight size={16} />
          </Link>
        </nav>
      )}
    </header>
  )
}