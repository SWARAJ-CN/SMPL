// src/pages/HomePage.tsx
import Hero from "../components/home/Hero"
import Format from "../components/home/Format"
import ContactSection from "../components/home/ContactSection"

export default function HomePage() {
  return (
    <main>
      <Hero />
      <Format />
      <ContactSection />
    </main>
  )
}