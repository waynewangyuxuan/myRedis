"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"

interface GsapContextType {
  gsap: any | null
  ScrollTrigger: any | null
  isLoaded: boolean
}

const GsapContext = createContext<GsapContextType>({
  gsap: null,
  ScrollTrigger: null,
  isLoaded: false,
})

export const useGsap = () => useContext(GsapContext)

export function GsapProvider({ children }: { children: ReactNode }) {
  const [gsapLib, setGsapLib] = useState<GsapContextType>({
    gsap: null,
    ScrollTrigger: null,
    isLoaded: false,
  })

  useEffect(() => {
    let isMounted = true

    const loadGsap = async () => {
      try {
        // Dynamically import GSAP and ScrollTrigger
        const gsapModule = await import("gsap")
        const { ScrollTrigger } = await import("gsap/ScrollTrigger")

        // Register plugins
        gsapModule.gsap.registerPlugin(ScrollTrigger)

        if (isMounted) {
          setGsapLib({
            gsap: gsapModule.gsap,
            ScrollTrigger,
            isLoaded: true,
          })
        }
      } catch (error) {
        console.error("Failed to load GSAP:", error)
        // Set a fallback state so the app can still run
        if (isMounted) {
          setGsapLib((prev) => ({ ...prev, isLoaded: true }))
        }
      }
    }

    // Only load GSAP in the browser
    if (typeof window !== "undefined") {
      loadGsap()
    }

    return () => {
      isMounted = false
    }
  }, [])

  return <GsapContext.Provider value={gsapLib}>{children}</GsapContext.Provider>
}
