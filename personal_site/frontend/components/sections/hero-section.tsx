"use client"

import { useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { ArrowDown } from "lucide-react"
import { useGsap } from "@/hooks/use-gsap"
import { siteConfig } from "@/constants/config"
import CustomFontText from "@/components/animations/custom-font-text"

export default function HeroSection() {
  const heroRef = useRef<HTMLDivElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)
  const subtitleRef = useRef<HTMLParagraphElement>(null)
  const buttonsRef = useRef<HTMLDivElement>(null)
  const scrollRef = useRef<HTMLDivElement>(null)

  const { gsap, isLoaded } = useGsap()

  useEffect(() => {
    // Only run if GSAP is loaded and we're in the browser
    if (!isLoaded || typeof window === "undefined" || !gsap) return

    const tl = gsap.timeline({ defaults: { ease: "power3.out" } })

    // Basic animation for the title
    tl.fromTo(titleRef.current, { y: 50, opacity: 0 }, { y: 0, opacity: 1, duration: 1 })
      // Continue with other animations
      .fromTo(subtitleRef.current, { y: 50, opacity: 0 }, { y: 0, opacity: 1, duration: 1 }, "-=0.6")
      .fromTo(buttonsRef.current, { y: 50, opacity: 0 }, { y: 0, opacity: 1, duration: 1 }, "-=0.6")
      .fromTo(scrollRef.current, { opacity: 0 }, { opacity: 1, duration: 1 }, "-=0.2")
  }, [gsap, isLoaded])

  const scrollToAbout = () => {
    const element = document.getElementById("about")
    if (element) {
      element.scrollIntoView({ behavior: "smooth" })
    }
  }

  return (
    <section id="home" ref={heroRef} className="relative flex min-h-screen items-center justify-center py-20">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center space-y-4 text-center">
          <div className="space-y-2">
            <h1 ref={titleRef} className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl">
              <CustomFontText text="Hi, I'm" tag="span" interval={1500} />{" "}
              <CustomFontText text={siteConfig.name} tag="span" className="text-primary" interval={1500} />
            </h1>
            <div ref={subtitleRef} className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
              <CustomFontText text="Web Developer & Designer" tag="span" interval={1500} hoverToChange={true} />
            </div>
          </div>
          <div ref={buttonsRef} className="space-x-4">
            <Button onClick={scrollToAbout}>View My Work</Button>
            <Button variant="outline" asChild>
              <a href="/resume.pdf" target="_blank" rel="noopener noreferrer">
                Resume
              </a>
            </Button>
          </div>
        </div>
      </div>
      <div ref={scrollRef} className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce">
        <Button variant="ghost" size="icon" onClick={scrollToAbout} aria-label="Scroll down">
          <ArrowDown className="h-6 w-6" />
        </Button>
      </div>
    </section>
  )
}
