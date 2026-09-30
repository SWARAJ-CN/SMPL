// src/components/ui/Input.tsx
import { cn } from "../../lib/utils"
import { fieldClass } from "../../lib/styles"

export type InputProps = {
  id: string
  label: string
  value: string
  placeholder: string
  onChange?: (value: string) => void
  error?: string
  type?: string
  note?: string
  readOnly?: boolean
}

export default function Input({
  id,
  label,
  value,
  onChange,
  placeholder,
  error,
  type = "text",
  note,
  readOnly = false,
}: InputProps) {
  return (
    <div>
      <label htmlFor={id} className="mb-2 block text-sm font-bold text-[#243d2d]">
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
        className={cn(
          fieldClass,
          error && "border-[#c96952] focus:border-[#c96952] focus:ring-[#f9dfda]",
          readOnly && "bg-[#f3f5ef] text-[#6d796d]",
        )}
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