"use client"

import { useEffect, useRef } from "react"

type EnhancedGradientProps = {
  className?: string
}

export const Gradient: React.FC<EnhancedGradientProps> = ({ className }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    resizeCanvas()
    window.addEventListener("resize", resizeCanvas)

    let animationFrameId: number
    let time = 0

    // Increase the particle count for a richer effect
    const particles: Particle[] = []
    const particleCount = 100 // Increased from 50 to 100

    class Particle {
      x: number
      y: number
      size: number
      speedX: number
      speedY: number
      color: string
      ctx: CanvasRenderingContext2D

      constructor(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) {
        this.ctx = ctx
        this.x = Math.random() * canvas.width
        this.y = Math.random() * canvas.height
        this.size = Math.random() * 5 + 1 // Dynamic particle size
        this.speedX = Math.random() * 3 - 1.5
        this.speedY = Math.random() * 3 - 1.5
        this.color = `hsl(${Math.random() * 360}, 100%, 50%)` // Full color spectrum
      }

      update() {
        this.x += this.speedX
        this.y += this.speedY

        // Bounce off edges
        if (this.x < 0 || this.x > this.ctx.canvas.width) this.speedX *= -1
        if (this.y < 0 || this.y > this.ctx.canvas.height) this.speedY *= -1
      }

      draw() {
        this.ctx.fillStyle = this.color
        this.ctx.beginPath()
        this.ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2)
        this.ctx.fill()
      }
    }

    // Create particles
    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle(canvas, ctx))
    }

    const drawScene = () => {
      time += 0.01 // Adjusted for faster movement
      const width = canvas.width
      const height = canvas.height

      // Create dynamic gradients
      const gradients = [
        ctx.createLinearGradient(0, 0, width, height),
        ctx.createLinearGradient(width, 0, 0, height),
        ctx.createRadialGradient(width / 2, height / 2, 0, width / 2, height / 2, width / 2)
      ]

      // Dynamic color palette
      const colors = [
        `hsl(${(time * 50) % 360}, 100%, 50%)`,
        `hsl(${(time * 70) % 360}, 100%, 50%)`,
        `hsl(${(time * 90) % 360}, 100%, 50%)`,
        `hsl(${(time * 110) % 360}, 100%, 50%)`
      ]

      gradients.forEach((gradient, index) => {
        gradient.addColorStop(0, colors[index % colors.length])
        gradient.addColorStop(0.5, colors[(index + 1) % colors.length])
        gradient.addColorStop(1, colors[(index + 2) % colors.length])
      })

      // Clear the canvas
      ctx.clearRect(0, 0, width, height)

      // Draw blended gradients
      gradients.forEach((gradient, index) => {
        ctx.globalAlpha = 0.5 + 0.5 * Math.sin(time + index * Math.PI / gradients.length)
        ctx.fillStyle = gradient
        ctx.fillRect(0, 0, width, height)
      })

      ctx.globalAlpha = 1

      // Update and draw particles
      particles.forEach(particle => {
        particle.update()
        particle.draw()
      })

      animationFrameId = requestAnimationFrame(drawScene)
    }

    drawScene()

    return () => {
      window.removeEventListener("resize", resizeCanvas)
      cancelAnimationFrame(animationFrameId)
    }
  }, [])

  return (
    <div className={`fixed inset-0 overflow-hidden ${className}`}>
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-[200%] h-[200%]"
      />
    </div>
  )
}

export default Gradient
