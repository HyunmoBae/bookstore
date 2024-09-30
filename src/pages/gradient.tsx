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

    // Particle system
    const particles: Particle[] = []
    const particleCount = 50 // Adjust for desired effect

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
        this.size = Math.random() * 5 + 1
        this.speedX = Math.random() * 3 - 1.5
        this.speedY = Math.random() * 3 - 1.5
        // Set particle colors in yellow, orange, and red
        this.color = `hsl(${Math.random() * 40 + 20}, 100%, 60%)` // Hue between 20 and 60 for yellow/orange/red
      }

      update() {
        this.x += this.speedX
        this.y += this.speedY

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

    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle(canvas, ctx))
    }

    const drawScene = () => {
      time += 0.0025 // Slower transition for subtle animation
      const width = canvas.width
      const height = canvas.height

      // Create gradients with mostly white and a subtle tint of warm colors
      const gradients = [
        ctx.createLinearGradient(0, 0, width, height),
        ctx.createLinearGradient(width, 0, 0, height),
        ctx.createRadialGradient(width / 2, height / 2, 0, width / 2, height / 2, width / 2)
      ]

      // Mostly white color palette with subtle warm accents
      const colors = [
        `hsl(43, ${10 + Math.sin(time) * 5}%, 95%)`, // Mostly white with a hint of yellow
        `hsl(30, ${10 + Math.cos(time * 1.1) * 5}%, 90%)`, // Light white with a slight orange tone
        `hsl(60, ${10 + Math.sin(time * 1.2) * 5}%, 97%)`, // Almost pure white
        `hsl(20, ${10 + Math.cos(time * 0.9) * 5}%, 93%)` // Light white with a very subtle red tone
      ]

      gradients.forEach((gradient, index) => {
        gradient.addColorStop(0, colors[index % colors.length])
        gradient.addColorStop(0.5, colors[(index + 1) % colors.length])
        gradient.addColorStop(1, colors[(index + 2) % colors.length])
      })

      // Clear the canvas
      ctx.clearRect(0, 0, width, height)

      // Draw the blended gradients (mostly white with slight color shifts)
      gradients.forEach((gradient, index) => {
        ctx.globalAlpha = 0.7 + 0.3 * Math.sin(time + index * Math.PI / gradients.length) // Light and subtle
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
