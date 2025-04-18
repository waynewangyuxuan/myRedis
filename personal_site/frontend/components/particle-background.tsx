"use client"

import { useEffect, useRef } from "react"
import { useTheme } from "next-themes"
import { useGsap } from "./gsap-provider"

interface Particle {
  x: number
  y: number
  size: number
  speedX: number
  speedY: number
  opacity: number
}

export default function ParticleBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const { theme } = useTheme()
  const { gsap, isLoaded } = useGsap()
  const animationRef = useRef<number | null>(null)
  const particlesRef = useRef<Particle[]>([])

  useEffect(() => {
    // Only run if GSAP is loaded and we're in the browser
    if (!isLoaded || typeof window === "undefined") return

    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas to full screen
    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight

      // Recreate particles when resizing
      initParticles()
    }

    // Initialize particles
    const initParticles = () => {
      const particleCount = Math.min(100, Math.floor(window.innerWidth / 20))
      particlesRef.current = []

      for (let i = 0; i < particleCount; i++) {
        particlesRef.current.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size: Math.random() * 2 + 1,
          speedX: Math.random() * 1 - 0.5,
          speedY: Math.random() * 1 - 0.5,
          opacity: Math.random() * 0.5 + 0.1,
        })
      }
    }

    resizeCanvas()
    window.addEventListener("resize", resizeCanvas)

    // Mouse interaction
    let mouseX = 0
    let mouseY = 0
    const mouseRadius = 100

    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX
      mouseY = e.clientY
    }

    window.addEventListener("mousemove", handleMouseMove)

    // Animation function
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Draw particles
      particlesRef.current.forEach((particle, index) => {
        // Update position
        particle.x += particle.speedX
        particle.y += particle.speedY

        // Wrap around edges
        if (particle.x > canvas.width) particle.x = 0
        if (particle.x < 0) particle.x = canvas.width
        if (particle.y > canvas.height) particle.y = 0
        if (particle.y < 0) particle.y = canvas.height

        // Mouse interaction
        const dx = mouseX - particle.x
        const dy = mouseY - particle.y
        const distance = Math.sqrt(dx * dx + dy * dy)

        if (distance < mouseRadius) {
          const angle = Math.atan2(dy, dx)
          const pushX = Math.cos(angle) * (mouseRadius - distance) * 0.03
          const pushY = Math.sin(angle) * (mouseRadius - distance) * 0.03

          particle.x -= pushX
          particle.y -= pushY
        }

        // Draw particle
        const isDark = theme === "dark"
        ctx.fillStyle = isDark ? `rgba(255, 255, 255, ${particle.opacity})` : `rgba(0, 0, 0, ${particle.opacity})`

        ctx.beginPath()
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
        ctx.fill()

        // Connect particles
        for (let j = index + 1; j < particlesRef.current.length; j++) {
          const otherParticle = particlesRef.current[j]
          const dx = particle.x - otherParticle.x
          const dy = particle.y - otherParticle.y
          const distance = Math.sqrt(dx * dx + dy * dy)

          if (distance < 150) {
            ctx.beginPath()
            ctx.strokeStyle = isDark
              ? `rgba(255, 255, 255, ${0.1 * (1 - distance / 150)})`
              : `rgba(0, 0, 0, ${0.1 * (1 - distance / 150)})`
            ctx.lineWidth = 0.5
            ctx.moveTo(particle.x, particle.y)
            ctx.lineTo(otherParticle.x, otherParticle.y)
            ctx.stroke()
          }
        }
      })

      // Use requestAnimationFrame as fallback if GSAP ticker is not available
      animationRef.current = requestAnimationFrame(animate)
    }

    // Start animation
    if (gsap) {
      // Use GSAP ticker if available
      gsap.ticker.add(animate)
    } else {
      // Fallback to requestAnimationFrame
      animationRef.current = requestAnimationFrame(animate)
    }

    return () => {
      window.removeEventListener("resize", resizeCanvas)
      window.removeEventListener("mousemove", handleMouseMove)

      if (gsap) {
        gsap.ticker.remove(animate)
      } else if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [theme, gsap, isLoaded])

  return <canvas ref={canvasRef} className="fixed inset-0 -z-10 pointer-events-none" aria-hidden="true" />
}
