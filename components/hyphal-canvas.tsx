"use client"

import { useEffect, useRef } from "react"

interface HyphalNode {
  x: number
  y: number
  vx: number
  vy: number
  age: number
  maxAge: number
  branches: HyphalNode[]
  parent: HyphalNode | null
  angle: number
  angleChangeRate: number
  connections: HyphalNode[]
  opacity: number
  isPersistent: boolean
}

export function HyphalCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const nodesRef = useRef<HyphalNode[]>([])
  const mouseRef = useRef({ x: 0, y: 0, isMoving: false })
  const animationRef = useRef<number>()

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

    let mouseMoveTimeout: NodeJS.Timeout
    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY, isMoving: true }
      clearTimeout(mouseMoveTimeout)
      mouseMoveTimeout = setTimeout(() => {
        mouseRef.current.isMoving = false
      }, 100)
    }
    window.addEventListener("mousemove", handleMouseMove)

    const createNode = (x: number, y: number, parent: HyphalNode | null = null): HyphalNode => {
      const angle = parent ? parent.angle + (Math.random() - 0.5) * 1.2 : Math.random() * Math.PI * 2
      const speed = parent ? 1.5 + Math.random() * 1 : 2 + Math.random() * 2
      return {
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        age: 0,
        maxAge: 80 + Math.random() * 60,
        branches: [],
        parent,
        angle,
        angleChangeRate: (Math.random() - 0.5) * 0.2,
        connections: [],
        opacity: 1,
        isPersistent: false,
      }
    }

    const findNearbyPersistentNodes = (x: number, y: number, radius: number): HyphalNode[] => {
      return nodesRef.current.filter((node) => {
        if (!node.isPersistent) return false
        const dx = node.x - x
        const dy = node.y - y
        const distance = Math.sqrt(dx * dx + dy * dy)
        return distance < radius
      })
    }

    const createMeshConnections = () => {
      nodesRef.current.forEach((node, i) => {
        const maturityFactor = node.age / node.maxAge
        // Reduced max connections from 6/3 to 4/2
        const maxConnections = node.isPersistent ? 7 : maturityFactor > 0.6 ? 4 : 2
        const connectionDistance = maturityFactor > 0.6 ? 80 : 50
        // Increased probability threshold to reduce connections
        const connectionProbability = maturityFactor > 0.6 ? 0.97 : 0.99

        if (node.age < 20 || node.connections.length >= maxConnections) return

        for (let j = i + 1; j < nodesRef.current.length; j++) {
          const other = nodesRef.current[j]
          if (other === node.parent || node === other.parent) continue

          const otherMaturityFactor = other.age / other.maxAge
          const otherMaxConnections = other.isPersistent ? 7 : otherMaturityFactor > 0.6 ? 4 : 2

          if (other.age < 20 || other.connections.length >= otherMaxConnections) continue

          const dx = other.x - node.x
          const dy = other.y - node.y
          const distance = Math.sqrt(dx * dx + dy * dy)

          if (distance < connectionDistance && Math.random() > connectionProbability) {
            if (!node.connections.includes(other)) {
              node.connections.push(other)
              other.connections.push(node)
            }
          }
        }
      })
    }

    const drawBranchingConnection = (
      ctx: CanvasRenderingContext2D,
      x1: number,
      y1: number,
      x2: number,
      y2: number,
      opacity: number,
    ) => {
      const dx = x2 - x1
      const dy = y2 - y1
      const distance = Math.sqrt(dx * dx + dy * dy)

      // For short distances, draw straight line
      if (distance < 30) {
        ctx.beginPath()
        ctx.moveTo(x1, y1)
        ctx.lineTo(x2, y2)
        ctx.stroke()
        return
      }

      // Create branching path with 1-2 intermediate points
      const numBranches = distance > 60 ? 2 : 1
      const points = [{ x: x1, y: y1 }]

      for (let i = 0; i < numBranches; i++) {
        const t = (i + 1) / (numBranches + 1)
        const midX = x1 + dx * t
        const midY = y1 + dy * t
        // Add perpendicular offset for organic branching
        const perpX = -dy / distance
        const perpY = dx / distance
        const offset = (Math.random() - 0.5) * distance * 0.3
        points.push({
          x: midX + perpX * offset,
          y: midY + perpY * offset,
        })
      }

      points.push({ x: x2, y: y2 })

      // Draw smooth curve through points
      ctx.beginPath()
      ctx.moveTo(points[0].x, points[0].y)

      for (let i = 1; i < points.length - 1; i++) {
        const xc = (points[i].x + points[i + 1].x) / 2
        const yc = (points[i].y + points[i + 1].y) / 2
        ctx.quadraticCurveTo(points[i].x, points[i].y, xc, yc)
      }

      ctx.lineTo(points[points.length - 1].x, points[points.length - 1].y)
      ctx.stroke()
    }

    const animate = () => {
      ctx.fillStyle = "rgba(250, 248, 245, 0.08)"
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      if (mouseRef.current.isMoving && Math.random() > 0.65) {
        const burstCount = Math.floor(Math.random() * 2) + 1
        const nearbyPersistent = findNearbyPersistentNodes(mouseRef.current.x, mouseRef.current.y, 100)

        for (let i = 0; i < burstCount; i++) {
          const node = createNode(mouseRef.current.x, mouseRef.current.y)
          nodesRef.current.push(node)

          if (nearbyPersistent.length > 0) {
            const connectCount = Math.min(3, nearbyPersistent.length)
            for (let j = 0; j < connectCount; j++) {
              const target = nearbyPersistent[Math.floor(Math.random() * nearbyPersistent.length)]
              if (!node.connections.includes(target)) {
                node.connections.push(target)
                target.connections.push(node)
              }
            }
          }
        }
      }

      if (Math.random() > 0.85) {
        createMeshConnections()
      }

      nodesRef.current = nodesRef.current.filter((node) => {
        node.age++

        if (!node.isPersistent) {
          node.angle += node.angleChangeRate
          if (Math.random() > 0.92) {
            node.angleChangeRate = (Math.random() - 0.5) * 0.25
          }
          if (Math.random() > 0.96) {
            node.angle += (Math.random() - 0.5) * 0.8
          }

          const speed = Math.sqrt(node.vx * node.vx + node.vy * node.vy)
          node.vx = Math.cos(node.angle) * speed
          node.vy = Math.sin(node.angle) * speed

          node.x += node.vx
          node.y += node.vy

          node.vx *= 0.96
          node.vy *= 0.96
        }

        const ageFactor = node.age / node.maxAge
        if (node.isPersistent) {
          node.opacity = 0.15
        } else if (ageFactor >= 1) {
          node.isPersistent = true
          node.opacity = 0.15
          node.vx = 0
          node.vy = 0
        } else {
          node.opacity = Math.max(0.15, 1 - ageFactor * 0.85)
        }

        if (
          node.age > 8 &&
          node.age < node.maxAge - 30 &&
          Math.random() > 0.92 &&
          node.branches.length < 4 &&
          !node.isPersistent
        ) {
          const branch = createNode(node.x, node.y, node)
          node.branches.push(branch)
          nodesRef.current.push(branch)
        }

        if (node.parent) {
          const gradient = ctx.createLinearGradient(node.parent.x, node.parent.y, node.x, node.y)
          const parentOpacity = node.parent.opacity * 0.5
          const nodeOpacity = node.opacity * 0.5
          gradient.addColorStop(0, `rgba(120, 120, 120, ${parentOpacity})`)
          gradient.addColorStop(0.5, `rgba(120, 120, 120, ${(parentOpacity + nodeOpacity) / 2})`)
          gradient.addColorStop(1, `rgba(120, 120, 120, ${nodeOpacity})`)

          ctx.strokeStyle = gradient
          ctx.lineWidth = 2.5 + Math.random() * 1.5
          ctx.lineCap = "round"
          ctx.beginPath()
          ctx.moveTo(node.parent.x, node.parent.y)
          ctx.lineTo(node.x, node.y)
          ctx.stroke()
        }

        node.connections.forEach((connected) => {
          if (nodesRef.current.includes(connected)) {
            const avgOpacity = ((node.opacity + connected.opacity) / 2) * 0.35
            ctx.strokeStyle = `rgba(120, 120, 120, ${avgOpacity})`
            ctx.lineWidth = 1.5
            ctx.lineCap = "round"
            drawBranchingConnection(ctx, node.x, node.y, connected.x, connected.y, avgOpacity)
          }
        })

        ctx.fillStyle = `rgba(120, 120, 120, ${node.opacity * 0.7})`
        ctx.beginPath()
        ctx.arc(node.x, node.y, 2.5, 0, Math.PI * 2)
        ctx.fill()

        return node.isPersistent || node.age < node.maxAge
      })

      if (nodesRef.current.length > 800) {
        const persistentNodes = nodesRef.current.filter((n) => n.isPersistent)
        const activeNodes = nodesRef.current.filter((n) => !n.isPersistent)
        if (persistentNodes.length > 500) {
          nodesRef.current = [...persistentNodes.slice(-400), ...activeNodes]
        }
      }

      animationRef.current = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener("resize", resizeCanvas)
      window.removeEventListener("mousemove", handleMouseMove)
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [])

  return <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-10" style={{ opacity: 0.6 }} />
}
