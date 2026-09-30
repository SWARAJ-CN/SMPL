// src/lib/registrationSteps.ts
export const stepLabels = [
  "Team details",
  "Your squad",
  "Payment",
  "Review",
] as const

export const stepTitles = [
  "Tell us about your team",
  "Build your squad",
  "Complete your payment",
  "Review & confirm",
] as const

export const stepDescriptions = [
  "Start with the basics. Make sure we can reach your captain.",
  "Add all eight players. Your captain is automatically Player 1.",
  "Add your payment details so the organizer can verify them.",
  "Make sure everything looks right before you submit.",
] as const