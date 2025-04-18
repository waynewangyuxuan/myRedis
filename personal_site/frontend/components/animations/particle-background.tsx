"use client"

import { useEffect, useRef } from "react"
import { useTheme } from "next-themes"
import { useGsap } from "@/hooks/use-gsap"
import { useMobile } from "@/hooks/use-mobile"

interface Particle {
  x: number
  y: number
  size: number
  speedX: number
  speedY: number
  opacity: number
}

interface Blob {
  x: number
  y: number
  size: number
  speedX: number
  speedY: number
  color: string
  targetColor: string
  colorProgress: number
}

const COLORS = [
  'rgba(200, 220, 255, 0.1)',  // 淡蓝色
  'rgba(220, 240, 255, 0.1)',  // 更淡的蓝色
  'rgba(230, 245, 255, 0.1)',  // 最淡的蓝色
]

export default function ParticleBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const { theme } = useTheme()
  const { gsap, isLoaded } = useGsap()
  const isMobile = useMobile()
  const animationRef = useRef<number | null>(null)
  const particlesRef = useRef<Particle[]>([])
  const blobsRef = useRef<Blob[]>([])

  useEffect(() => {
    if (!isLoaded || typeof window === "undefined") return

    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
      initParticles()
      initBlobs()
    }

    const initBlobs = () => {
      const blobCount = isMobile ? 3 : 5
      blobsRef.current = []

      for (let i = 0; i < blobCount; i++) {
        blobsRef.current.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size: Math.random() * 300 + 200,  // 200-500px大小
          speedX: (Math.random() - 0.5) * 0.2,  // 缓慢移动
          speedY: (Math.random() - 0.5) * 0.2,
          color: COLORS[Math.floor(Math.random() * COLORS.length)],
          targetColor: COLORS[Math.floor(Math.random() * COLORS.length)],
          colorProgress: 0
        })
      }
    }

    const initParticles = () => {
      const particleCount = isMobile
        ? Math.min(20, Math.floor(window.innerWidth / 50))
        : Math.min(40, Math.floor(window.innerWidth / 40))

      particlesRef.current = []

      for (let i = 0; i < particleCount; i++) {
        particlesRef.current.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size: Math.random() * 4 + 1,
          speedX: Math.random() * 0.01 - 0.005,
          speedY: Math.random() * 0.01 - 0.005,
          opacity: Math.random() * 0.5 + 0.1,
        })
      }
    }

    resizeCanvas()
    window.addEventListener("resize", resizeCanvas)

    let mouseX = 0
    let mouseY = 0
    const mouseRadius = 100

    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX
      mouseY = e.clientY
    }

    window.addEventListener("mousemove", handleMouseMove)

    const drawBlobs = () => {
      if (theme === "dark") return

      blobsRef.current.forEach(blob => {
        // 更新位置
        blob.x += blob.speedX
        blob.y += blob.speedY

        // 边界检查
        if (blob.x < -blob.size) blob.x = canvas.width + blob.size
        if (blob.x > canvas.width + blob.size) blob.x = -blob.size
        if (blob.y < -blob.size) blob.y = canvas.height + blob.size
        if (blob.y > canvas.height + blob.size) blob.y = -blob.size

        // 渐变颜色过渡
        blob.colorProgress += 0.001
        if (blob.colorProgress >= 1) {
          blob.color = blob.targetColor
          blob.targetColor = COLORS[Math.floor(Math.random() * COLORS.length)]
          blob.colorProgress = 0
        }

        // 绘制渐变斑块
        const gradient = ctx.createRadialGradient(
          blob.x, blob.y, 0,
          blob.x, blob.y, blob.size
        )
        gradient.addColorStop(0, blob.color)
        gradient.addColorStop(1, 'rgba(255, 255, 255, 0)')
        
        ctx.fillStyle = gradient
        ctx.beginPath()
        ctx.arc(blob.x, blob.y, blob.size, 0, Math.PI * 2)
        ctx.fill()
      })
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // 先绘制背景斑块
      drawBlobs()

      // 绘制粒子和连线
      particlesRef.current.forEach((particle, index) => {
        particle.x += particle.speedX
        particle.y += particle.speedY

        if (particle.x > canvas.width) particle.x = 0
        if (particle.x < 0) particle.x = canvas.width
        if (particle.y > canvas.height) particle.y = 0
        if (particle.y < 0) particle.y = canvas.height

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

        const isDark = theme === "dark"
        ctx.fillStyle = isDark ? `rgba(255, 255, 255, ${particle.opacity})` : `rgba(0, 0, 0, ${particle.opacity})`
        ctx.beginPath()
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
        ctx.fill()

        for (let j = index + 1; j < particlesRef.current.length; j++) {
          const otherParticle = particlesRef.current[j]
          const dx = particle.x - otherParticle.x
          const dy = particle.y - otherParticle.y
          const distance = Math.sqrt(dx * dx + dy * dy)

          if (distance < 150) {
            ctx.beginPath()
            ctx.strokeStyle = isDark
              ? `rgba(255, 255, 255, ${0.05 * (1 - distance / 150)})`
              : `rgba(0, 0, 0, ${0.05 * (1 - distance / 150)})`
            ctx.lineWidth = 0.5
            ctx.moveTo(particle.x, particle.y)
            ctx.lineTo(otherParticle.x, otherParticle.y)
            ctx.stroke()
          }
        }
      })

      animationRef.current = requestAnimationFrame(animate)
    }

    if (gsap) {
      gsap.ticker.add(animate)
    } else {
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
  }, [theme, gsap, isLoaded, isMobile])

  return <canvas ref={canvasRef} className="fixed inset-0 -z-10 pointer-events-none" aria-hidden="true" />
}
