// src/lib/utils.ts

const HTML_ESCAPES: Record<string, string> = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;",
}

/** Escapes characters that are unsafe to inject into HTML strings. */
export function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/g, (char) => HTML_ESCAPES[char] ?? char)
}

/** Joins truthy class names. Handy for conditional Tailwind classes. */
export function cn(...values: Array<string | false | null | undefined>): string {
  return values.filter(Boolean).join(" ")
}

/** Smoothly scrolls the element with the given id into view. */
export function scrollToId(
  id: string,
  block: ScrollLogicalPosition = "start",
): void {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block })
}