import { Header } from "@/components/movistar/header"
import { Breadcrumb } from "@/components/movistar/breadcrumb"
import { HeroSection } from "@/components/movistar/hero-section"
import { FeaturesGrid } from "@/components/movistar/features-grid"
import { DownloadSection } from "@/components/movistar/download-section"
import { HowToSection } from "@/components/movistar/how-to-section"
import { Footer } from "@/components/movistar/footer"

export default function MovistarLanding() {
  return (
    <main className="min-h-screen bg-white">
      <Header />
      <Breadcrumb />
      <HeroSection />
      <FeaturesGrid />
      <DownloadSection />
      <HowToSection />
      <Footer />
    </main>
  )
}
