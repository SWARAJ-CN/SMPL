// src/components/admin/AdminLogin.tsx
import { useState } from "react"
import type { FormEvent } from "react"
import { ArrowRight, LockKeyhole, ShieldCheck } from "lucide-react"
import Button from "../ui/Button"
import { fieldClass } from "../../lib/styles"
import {
  hasAdminPasscode,
  setupAdminPasscode,
  signInAdmin,
} from "../../lib/adminAuth"

export default function AdminLogin({
  onAuthenticated,
}: {
  onAuthenticated: () => void
}) {
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
          <p className="text-[11px] font-bold uppercase tracking-[.2em] text-[#6f8a5f]">
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

            <Button type="submit" block disabled={busy}>
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
            </Button>
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