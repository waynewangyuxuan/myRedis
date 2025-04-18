"use client"

import { useState, useEffect, useRef } from "react"

interface InViewOptions {
  threshold?: number
  rootMargin?: string
  triggerOnce?: boolean
}

export function useInView<T extends HTMLElement = HTMLDivElement>({
  threshold = 0,
  rootMargin = "0px",
  triggerOnce = false,
}: InViewOptions = {}) {
  const [inView, setInView] = useState(false)
  const ref = useRef<T>(null)
  const enteredView = useRef(false)

  useEffect(() => {
    if (typeof window === "undefined" || !window.IntersectionObserver) return

    const element = ref.current
    if (!element) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        const isInView = entry.isIntersecting

        if (isInView && triggerOnce) {
          enteredView.current = true
          setInView(true)
          observer.unobserve(element)
          return
        }

        if (triggerOnce && enteredView.current) return

        setInView(isInView)
      },
      { threshold, rootMargin },
    )

    observer.observe(element)

    return () => {
      observer.unobserve(element)
    }
  }, [threshold, rootMargin, triggerOnce])

  return { ref, inView }
}
