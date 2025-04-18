"use client"

import { useContext } from "react"
import { GsapContext } from "@/components/providers/gsap-provider"

export function useGsap() {
  return useContext(GsapContext)
}
