import HeroSection from "@/components/sections/hero-section"
import AboutSection from "@/components/sections/about-section"
import SkillsSection from "@/components/sections/skills-section"
import ProjectsSection from "@/components/sections/projects-section"
import ContentsSection from "@/components/sections/contents-section"
import ContactSection from "@/components/sections/contact-section"
import ScrollToTop from "@/components/ui/scroll-to-top"

export default function Home() {
  return (
    <main className="min-h-screen">
      <ScrollToTop />
      <HeroSection />
      <AboutSection />
      <SkillsSection />
      <ProjectsSection />
      <ContentsSection />
      <ContactSection />
    </main>
  )
}
