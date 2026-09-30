// src/components/registration/RegistrationForm.tsx
import { useRef, useState } from "react"
import { ArrowLeft, ArrowRight, ChevronRight, CircleHelp } from "lucide-react"
import Button from "../ui/Button"
import StepIndicator from "./StepIndicator"
import TeamStep from "./steps/TeamStep"
import SquadStep from "./steps/SquadStep"
import PaymentStep from "./steps/PaymentStep"
import ReviewStep from "./steps/ReviewStep"
import Success from "./Success"
import { primaryClass, ghostClass } from "../../lib/styles"
import { scrollToId } from "../../lib/utils"
import {
  stepDescriptions,
  stepLabels,
  stepTitles,
} from "../../lib/registrationSteps"
import { validatePayment, validateSquad, validateTeam } from "../../lib/validation"
import type { Errors } from "../../lib/validation"
import { submitRegistration } from "../../lib/registration"
import { emptyForm } from "../../types/tournament"
import type { FormData, Registration } from "../../types/tournament"

export default function RegistrationForm() {
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
    scrollToId("register")
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
      scrollToId("register")
    } catch {
      setMessage(
        "Couldn't save this registration in your browser. Try removing the image or freeing browser storage and submit again.",
      )
    } finally {
      submittingRef.current = false
      setSubmitting(false)
    }
  }

  function reset() {
    setData(emptyForm())
    setResult(null)
    setStep(0)
    setErrors({})
    setMessage("")
    scrollToId("register")
  }

  return (
    <section
      id="register"
      className="scroll-mt-6 bg-[#edf1e9] px-5 py-20 md:px-8 lg:py-24"
    >
      <div className="mx-auto max-w-[1150px]">
        <div className="mb-10 text-center">
          <p className="text-[11px] font-bold uppercase tracking-[.2em] text-[#6f8a5f]">
            JOIN THE TOURNAMENT
          </p>
          <h2 className="mt-2 font-display text-5xl font-bold uppercase tracking-tight text-[#173a29] sm:text-6xl">
            Claim your place.
          </h2>
          <p className="mt-3 text-sm text-[#6e806f]">
            One quick form. Eight players. A whole lot to play for.
          </p>
        </div>

        {result ? (
          <Success item={result} reset={reset} />
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

              <StepIndicator current={step} />

              <div className="mt-8 hidden border-t border-white/20 pt-6 text-xs leading-6 text-white/65 lg:block">
                <CircleHelp size={18} className="mb-2 text-[#d9f36a]" />
                Need help? Contact the organizer for event or payment questions.
              </div>
            </aside>

            <div className="p-5 sm:p-9 lg:p-12">
              <div className="mb-8 flex items-center gap-2 text-[11px] font-bold uppercase tracking-[.14em] text-[#7a9373]">
                STEP {step + 1} OF 4 <ChevronRight size={13} />{" "}
                {stepLabels[step]}
              </div>
              <h3 className="font-display text-3xl font-bold uppercase text-[#1a3b29] sm:text-4xl">
                {stepTitles[step]}
              </h3>
              <p className="mb-8 mt-2 text-sm leading-6 text-[#778878]">
                {stepDescriptions[step]}
              </p>

              {step === 0 && <TeamStep data={data} set={set} errors={errors} />}
              {step === 1 && <SquadStep data={data} set={set} errors={errors} />}
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
                    className={ghostClass}
                  >
                    <ArrowLeft size={17} /> Back
                  </button>
                ) : (
                  <span className="text-xs text-[#9ba89a]">* Required fields</span>
                )}

                {step < 3 ? (
                  <Button className={primaryClass} onClick={next}>
                    Continue <ArrowRight size={17} />
                  </Button>
                ) : (
                  <Button onClick={submit} disabled={submitting}>
                    {submitting ? "Submitting..." : "Submit registration"}{" "}
                    {submitting ? (
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-[#193a29]/30 border-t-[#193a29]" />
                    ) : (
                      <ArrowRight size={17} />
                    )}
                  </Button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}