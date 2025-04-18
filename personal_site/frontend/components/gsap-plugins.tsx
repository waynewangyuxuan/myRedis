"use client"

import { useEffect } from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { ScrambleTextPlugin } from "gsap/ScrambleTextPlugin"

export default function GsapPlugins() {
  useEffect(() => {
    // Register all GSAP plugins here to ensure they're available globally
    gsap.registerPlugin(ScrollTrigger, ScrambleTextPlugin)
  }, [])

  return null
}
