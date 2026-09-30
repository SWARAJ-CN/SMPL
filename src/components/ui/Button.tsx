// src/components/ui/Button.tsx
import type { ButtonHTMLAttributes } from "react"
import { cn } from "../../lib/utils"
import { darkClass, outlineClass, primaryClass } from "../../lib/styles"

const variants = {
  primary: primaryClass,
  outline: outlineClass,
  dark: darkClass,
} as const

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: keyof typeof variants
  block?: boolean
}

export default function Button({
  variant = "primary",
  block = false,
  type = "button",
  className,
  ...rest
}: ButtonProps) {
  return (
    <button
      type={type}
      className={cn(variants[variant], block && "w-full", className)}
      {...rest}
    />
  )
}