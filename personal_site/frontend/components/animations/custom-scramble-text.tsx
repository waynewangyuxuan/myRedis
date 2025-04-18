"use client"

import { useEffect, useRef, useState } from "react"
import { useGsap } from "@/hooks/use-gsap"
import { useInView } from "@/hooks/use-in-view"
import type { JSX } from "react/jsx-runtime"

interface CustomScrambleTextProps {
  text: string
  className?: string
  delay?: number
  duration?: number
  tag?: keyof JSX.IntrinsicElements
  loop?: boolean
  loopDelay?: number
  hoverToLoop?: boolean
  customChars?: string
}

// Characters used for scrambling
const DEFAULT_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+-=[]{}|;:,.<>/?`~"

export default function CustomScrambleText({
  text,
  className = "",
  delay = 0,
  duration = 0.8, // Shorter duration
  tag: Tag = "h2",
  loop = false, // Default to no looping
  loopDelay = 4, // Longer delay between loops if enabled
  hoverToLoop = false,
  customChars,
}: CustomScrambleTextProps) {
  const [displayText, setDisplayText] = useState("")
  const { ref, inView } = useInView({ threshold: 0.3, triggerOnce: !loop })
  const { gsap, isLoaded } = useGsap()
  const hasInitialized = useRef(false)
  const animationFrameId = useRef<number | null>(null)
  const timeoutId = useRef<NodeJS.Timeout | null>(null)
  const startTimeRef = useRef(0)
  const containerRef = useRef<HTMLDivElement>(null)
  const [isHovering, setIsHovering] = useState(false)

  // Function to start scramble animation
  const startScramble = () => {
    // Clear any existing animation
    if (animationFrameId.current) {
      cancelAnimationFrame(animationFrameId.current)
    }
    if (timeoutId.current) {
      clearTimeout(timeoutId.current)
    }

    // Initial state - all dashes
    setDisplayText("-".repeat(text.length))

    const delayInMs = delay * 1000
    const durationInMs = duration * 1000

    // Wait for delay
    timeoutId.current = setTimeout(() => {
      startTimeRef.current = Date.now()

      // Animation function
      const animate = () => {
        const elapsed = Date.now() - startTimeRef.current
        const progress = Math.min(elapsed / durationInMs, 1)

        // Generate scrambled text
        let result = ""
        const charsToUse = customChars || DEFAULT_CHARS

        for (let i = 0; i < text.length; i++) {
          // If this character should be revealed based on progress
          if (i < Math.floor(text.length * progress)) {
            result += text[i]
          } else {
            // Otherwise show a random character
            result += charsToUse[Math.floor(Math.random() * charsToUse.length)]
          }
        }

        setDisplayText(result)

        if (progress < 1) {
          animationFrameId.current = requestAnimationFrame(animate)
        } else {
          setDisplayText(text) // Ensure final text is correct

          // If looping is enabled, restart after loopDelay
          if (loop && (!hoverToLoop || isHovering)) {
            timeoutId.current = setTimeout(() => {
              startScramble()
            }, loopDelay * 1000)
          }
        }
      }

      animationFrameId.current = requestAnimationFrame(animate)
    }, delayInMs)
  }

  // Handle hover events if hoverToLoop is enabled
  const handleMouseEnter = () => {
    if (hoverToLoop) {
      setIsHovering(true)
      startScramble()
    }
  }

  const handleMouseLeave = () => {
    if (hoverToLoop) {
      setIsHovering(false)
    }
  }

  useEffect(() => {
    if (!inView || hasInitialized.current || typeof window === "undefined") return

    hasInitialized.current = true
    startScramble()

    return () => {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current)
      }
      if (timeoutId.current) {
        clearTimeout(timeoutId.current)
      }
    }
  }, [inView, isLoaded, gsap, delay, duration, loop, hoverToLoop, text, customChars])

  return (
    <div
      ref={(node) => {
        // Combine refs
        if (node) {
          ref.current = node
          containerRef.current = node
        }
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={hoverToLoop ? "cursor-pointer" : ""}
    >
      <Tag className={className}>{displayText}</Tag>
    </div>
  )
}
