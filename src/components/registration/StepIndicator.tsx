// src/components/registration/StepIndicator.tsx
import { Check } from "lucide-react"
import { cn } from "../../lib/utils"
import { stepLabels } from "../../lib/registrationSteps"

export default function StepIndicator({ current }: { current: number }) {
  return (
    <div
      className="flex gap-1 lg:flex-col lg:gap-0"
      aria-label="Registration progress"
    >
      {stepLabels.map((name, index) => (
        <div
          key={name}
          className="relative flex flex-1 items-center gap-3 pb-0 last:lg:pb-0 lg:pb-9"
        >
          <div
            className={cn(
              "relative z-10 flex h-9 w-9 shrink-0 items-center justify-center rounded-full border text-sm font-bold",
              index < current
                ? "border-[#d9f36a] bg-[#d9f36a] text-[#1a3a29]"
                : index === current
                  ? "border-[#d9f36a] bg-[#34583a] text-[#d9f36a]"
                  : "border-white/30 text-white/50",
            )}
          >
            {index < current ? <Check size={17} /> : `0${index + 1}`}
          </div>
          <span
            className={cn(
              "hidden text-sm font-semibold lg:block",
              index > current ? "text-white/45" : "text-white",
            )}
          >
            {name}
          </span>
          {index < stepLabels.length - 1 && (
            <div className="absolute left-[18px] top-9 hidden h-[calc(100%-36px)] w-px bg-white/20 lg:block" />
          )}
        </div>
      ))}
    </div>
  )
}