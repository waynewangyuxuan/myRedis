"use client"

import { useEffect, useRef, useState } from "react"
import { useInView } from "@/hooks/use-in-view"
import type { JSX } from "react/jsx-runtime"

interface CustomFontTextProps {
  text: string
  className?: string
  tag?: keyof JSX.IntrinsicElements
  interval?: number
  hoverToChange?: boolean
}

// List of diverse fonts to cycle through
const FONTS = [
  // System fonts
  "Arial, sans-serif",
  "Verdana, sans-serif",
  "Helvetica, sans-serif",
  "Tahoma, sans-serif",
  "Trebuchet MS, sans-serif",
  "Times New Roman, serif",
  "Georgia, serif",
  "Garamond, serif",
  "Courier New, monospace",
  "Brush Script MT, cursive",
  "Copperplate, fantasy",
  "Papyrus, fantasy",
  "Impact, fantasy",

  // Google Fonts (these will fallback to system fonts if not loaded)
  "'Roboto', sans-serif",
  "'Open Sans', sans-serif",
  "'Lato', sans-serif",
  "'Montserrat', sans-serif",
  "'Raleway', sans-serif",
  "'Playfair Display', serif",
  "'Merriweather', serif",
  "'Ubuntu', sans-serif",
  "'Rubik', sans-serif",
  "'Oswald', sans-serif",
  "'Fira Sans', sans-serif",
  "'Nunito', sans-serif",
  "'Poppins', sans-serif",
  "'Quicksand', sans-serif",
  "'Comfortaa', cursive",
  "'Pacifico', cursive",
  "'Caveat', cursive",
  "'Permanent Marker', cursive",
  "'Architects Daughter', cursive",
  "'Shadows Into Light', cursive",
]

export default function CustomFontText({
  text,
  className = "",
  tag: Tag = "h2",
  interval = 1500, // Changed from 3000 to 1500 (1.5 seconds)
  hoverToChange = false,
}: CustomFontTextProps) {
  const [currentFont, setCurrentFont] = useState(FONTS[0])
  const { ref, inView } = useInView({ threshold: 0.3, triggerOnce: false })
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const [isHovering, setIsHovering] = useState(false)

  // Function to change to a random font
  const changeFont = () => {
    const currentIndex = FONTS.indexOf(currentFont)
    let newIndex

    // Ensure we don't get the same font twice in a row
    do {
      newIndex = Math.floor(Math.random() * FONTS.length)
    } while (newIndex === currentIndex && FONTS.length > 1)

    setCurrentFont(FONTS[newIndex])
  }

  // Start or stop the font changing interval
  const toggleFontInterval = (start: boolean) => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }

    if (start) {
      intervalRef.current = setInterval(changeFont, interval)
    }
  }

  // Handle hover events
  const handleMouseEnter = () => {
    if (hoverToChange) {
      setIsHovering(true)
      toggleFontInterval(true)
    }
  }

  const handleMouseLeave = () => {
    if (hoverToChange) {
      setIsHovering(false)
      toggleFontInterval(false)
    }
  }

  useEffect(() => {
    // Only start the interval if the element is in view and we're not in hover-only mode
    // or if we're in hover mode and currently hovering
    const shouldStartInterval = inView && (!hoverToChange || (hoverToChange && isHovering))

    toggleFontInterval(shouldStartInterval)

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [inView, hoverToChange, isHovering, interval])

  // Load Google Fonts
  useEffect(() => {
    if (typeof window === "undefined") return

    // Create a link element for Google Fonts
    const link = document.createElement("link")
    link.rel = "stylesheet"
    link.href =
      "https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&family=Open+Sans:wght@400;700&family=Lato:wght@400;700&family=Montserrat:wght@400;700&family=Raleway:wght@400;700&family=Playfair+Display:wght@400;700&family=Merriweather:wght@400;700&family=Ubuntu:wght@400;700&family=Rubik:wght@400;700&family=Oswald:wght@400;700&family=Fira+Sans:wght@400;700&family=Nunito:wght@400;700&family=Poppins:wght@400;700&family=Quicksand:wght@400;700&family=Comfortaa:wght@400;700&family=Pacifico&family=Caveat:wght@400;700&family=Permanent+Marker&family=Architects+Daughter&family=Shadows+Into+Light&display=swap"

    document.head.appendChild(link)

    return () => {
      document.head.removeChild(link)
    }
  }, [])

  return (
    <div
      ref={ref}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={hoverToChange ? "cursor-pointer" : ""}
    >
      <Tag className={className} style={{ fontFamily: currentFont, transition: "font-family 0.2s ease" }}>
        {text}
      </Tag>
    </div>
  )
}
