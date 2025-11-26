import React, { useEffect, useRef, useState } from "react"
import * as d3 from "d3"
import { TrendingUp, Users, Globe, PieChart, BarChart, DollarSign } from "lucide-react"

interface RotatingEarthProps {
  width?: number
  height?: number
  className?: string
  isDarkMode?: boolean
}

const STATS = [
  {
    id: 1,
    label: "ROI Increase",
    value: "+124%",
    icon: TrendingUp,
    coords: [-74.006, 40.7128], // New York
  },
  {
    id: 2,
    label: "Global Reach",
    value: "150+ Countries",
    icon: Globe,
    coords: [103.8198, 1.3521], // Singapore
  },
  {
    id: 3,
    label: "Active Users",
    value: "10K+",
    icon: Users,
    coords: [-0.1276, 51.5074], // London
  },
  {
    id: 4,
    label: "Conversion Rate",
    value: "8.4%",
    icon: PieChart,
    coords: [-122.4194, 37.7749], // San Francisco
  },
  {
    id: 5,
    label: "Organic Traffic",
    value: "+215%",
    icon: BarChart,
    coords: [13.4050, 52.5200], // Berlin
  },
  {
    id: 6,
    label: "Client LTV",
    value: "$12k avg",
    icon: DollarSign,
    coords: [151.2093, -33.8688], // Sydney
  }
]

export default function RotatingEarth({ width = 600, height = 600, className = "", isDarkMode = true }: RotatingEarthProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  // Refs for card DOM elements to update positions without re-renders
  const cardsRef = useRef<(HTMLDivElement | null)[]>([])

  useEffect(() => {
    if (!canvasRef.current) return

    const canvas = canvasRef.current
    const context = canvas.getContext("2d")
    if (!context) return

    // Set up responsive dimensions
    const containerWidth = width
    const containerHeight = height
    
    const radius = Math.min(containerWidth, containerHeight) / 2.2

    const dpr = window.devicePixelRatio || 1
    canvas.width = containerWidth * dpr
    canvas.height = containerHeight * dpr
    canvas.style.width = `100%`
    canvas.style.height = `auto`
    canvas.style.maxWidth = `${width}px`
    
    context.scale(dpr, dpr)

    // Create projection
    const projection = d3
      .geoOrthographic()
      .scale(radius)
      .translate([containerWidth / 2, containerHeight / 2])
      .clipAngle(90)

    const path = d3.geoPath().projection(projection).context(context)

    const pointInPolygon = (point: [number, number], polygon: number[][]): boolean => {
      const [x, y] = point
      let inside = false

      for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
        const [xi, yi] = polygon[i]
        const [xj, yj] = polygon[j]

        if (yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) {
          inside = !inside
        }
      }

      return inside
    }

    const pointInFeature = (point: [number, number], feature: any): boolean => {
      const geometry = feature.geometry

      if (geometry.type === "Polygon") {
        const coordinates = geometry.coordinates
        if (!pointInPolygon(point, coordinates[0])) return false
        for (let i = 1; i < coordinates.length; i++) {
          if (pointInPolygon(point, coordinates[i])) return false 
        }
        return true
      } else if (geometry.type === "MultiPolygon") {
        for (const polygon of geometry.coordinates) {
          if (pointInPolygon(point, polygon[0])) {
            let inHole = false
            for (let i = 1; i < polygon.length; i++) {
              if (pointInPolygon(point, polygon[i])) {
                inHole = true
                break
              }
            }
            if (!inHole) return true
          }
        }
        return false
      }

      return false
    }

    const generateDotsInPolygon = (feature: any, dotSpacing = 16) => {
      const dots: [number, number][] = []
      const bounds = d3.geoBounds(feature)
      const [[minLng, minLat], [maxLng, maxLat]] = bounds
      const stepSize = dotSpacing * 0.08
      if (stepSize <= 0) return dots;
      for (let lng = minLng; lng <= maxLng; lng += stepSize) {
        for (let lat = minLat; lat <= maxLat; lat += stepSize) {
          const point: [number, number] = [lng, lat]
          if (pointInFeature(point, feature)) {
            dots.push(point)
          }
        }
      }
      return dots
    }

    interface DotData {
      lng: number
      lat: number
      visible: boolean
    }

    const allDots: DotData[] = []
    let landFeatures: any

    const render = () => {
      context.clearRect(0, 0, containerWidth, containerHeight)

      const currentScale = projection.scale()
      const scaleFactor = currentScale / radius

      // Draw ocean
      context.beginPath()
      context.arc(containerWidth / 2, containerHeight / 2, currentScale, 0, 2 * Math.PI)
      
      // Ocean fill
      context.fillStyle = "rgba(0, 19, 88, 0.6)" 
      context.strokeStyle = "rgba(255, 255, 255, 0.2)" 
      
      context.fill()
      context.lineWidth = 1 * scaleFactor
      context.stroke()

      if (landFeatures) {
        // Draw graticule
        const graticule = d3.geoGraticule()
        context.beginPath()
        path(graticule())
        context.strokeStyle = "rgba(64, 146, 239, 0.15)" 
        context.lineWidth = 1 * scaleFactor
        context.stroke()

        // Draw dots
        allDots.forEach((dot) => {
          const projected = projection([dot.lng, dot.lat])
          if (
            projected &&
            projected[0] >= 0 &&
            projected[0] <= containerWidth &&
            projected[1] >= 0 &&
            projected[1] <= containerHeight
          ) {
            context.beginPath()
            context.arc(projected[0], projected[1], 1.5 * scaleFactor, 0, 2 * Math.PI)
            context.fillStyle = "#4092ef" 
            context.fill()
          }
        })
      }

      // Update Card Positions
      STATS.forEach((stat, index) => {
        const el = cardsRef.current[index]
        if (!el) return

        // D3 projection returns [x, y] or null if the point is clipped (on the back side)
        // However, d3.geoOrthographic() with clipAngle(90) clips points on the back.
        // We need to be careful: if it's clipped, projection returns null? 
        // d3 v4+ returns null if clipped.
        const coords = projection([stat.coords[0], stat.coords[1]])
        
        if (coords) {
          const [x, y] = coords
          // Check if it's within bounds (double check)
          // Also, slightly adjust scale based on z-depth? Orthographic doesn't give z-depth easily, 
          // but visibility is binary with clipAngle(90).
          
          el.style.display = 'block'
          el.style.transform = `translate(${x}px, ${y}px) translate(-50%, -150%)`
          el.style.opacity = '1'
          el.style.zIndex = '10'
        } else {
          el.style.display = 'none'
          el.style.opacity = '0'
          el.style.zIndex = '0'
        }
      })
    }

    const loadWorldData = async () => {
      try {
        setIsLoading(true)
        const response = await fetch(
          "https://raw.githubusercontent.com/martynafford/natural-earth-geojson/refs/heads/master/110m/physical/ne_110m_land.json",
        )
        if (!response.ok) throw new Error("Failed to load land data")
        landFeatures = await response.json()
        landFeatures.features.forEach((feature: any) => {
          const dots = generateDotsInPolygon(feature, 12)
          dots.forEach(([lng, lat]) => {
            allDots.push({ lng, lat, visible: true })
          })
        })
        render()
        setIsLoading(false)
      } catch (err) {
        console.error(err)
        setError("Failed to load land map data")
        setIsLoading(false)
      }
    }

    const rotation = [0, -10]
    let autoRotate = true
    const rotationSpeed = 0.3

    const rotate = () => {
      if (autoRotate) {
        rotation[0] += rotationSpeed
        projection.rotate(rotation as [number, number])
        render()
      }
    }
    const rotationTimer = d3.timer(rotate)

    const handleMouseDown = (event: MouseEvent) => {
      autoRotate = false
      const startX = event.clientX
      const startY = event.clientY
      const startRotation = [...rotation]
      const handleMouseMove = (moveEvent: MouseEvent) => {
        const sensitivity = 0.25
        const dx = moveEvent.clientX - startX
        const dy = moveEvent.clientY - startY
        rotation[0] = startRotation[0] + dx * sensitivity
        rotation[1] = startRotation[1] - dy * sensitivity
        rotation[1] = Math.max(-90, Math.min(90, rotation[1]))
        projection.rotate(rotation as [number, number])
        render()
      }
      const handleMouseUp = () => {
        document.removeEventListener("mousemove", handleMouseMove)
        document.removeEventListener("mouseup", handleMouseUp)
        setTimeout(() => { autoRotate = true }, 1000)
      }
      document.addEventListener("mousemove", handleMouseMove)
      document.addEventListener("mouseup", handleMouseUp)
    }

    const handleWheel = (event: WheelEvent) => {
      if(event.target === canvas) {
          event.preventDefault()
          const scaleFactor = event.deltaY > 0 ? 0.9 : 1.1
          const newRadius = Math.max(radius * 0.5, Math.min(radius * 3, projection.scale() * scaleFactor))
          projection.scale(newRadius)
          render()
      }
    }

    canvas.addEventListener("mousedown", handleMouseDown)
    canvas.addEventListener("wheel", handleWheel, { passive: false })
    loadWorldData()

    return () => {
      rotationTimer.stop()
      canvas.removeEventListener("mousedown", handleMouseDown)
      canvas.removeEventListener("wheel", handleWheel)
    }
  }, [width, height])

  if (error) {
    return (
      <div className={`flex items-center justify-center p-8 border border-white/10 rounded-full h-[400px] w-[400px] ${className}`}>
        <div className="text-center text-white/50">
          <p className="text-sm">Visualisation offline</p>
        </div>
      </div>
    )
  }

  return (
    <div ref={containerRef} className={`relative flex justify-center items-center ${className} cursor-grab active:cursor-grabbing`}>
      <canvas ref={canvasRef} className="rounded-full select-none" />
      
      {/* Floating Stats Cards */}
      {STATS.map((stat, i) => (
        <div 
            key={stat.id}
            ref={(el) => { cardsRef.current[i] = el }}
            className="absolute top-0 left-0 pointer-events-none hidden will-change-transform"
        >
            <div className="flex items-center gap-3 p-3 pr-6 rounded-xl bg-white/80 dark:bg-black/40 backdrop-blur-md border border-slate-200 dark:border-white/20 shadow-xl min-w-[160px]">
                <div className="w-10 h-10 rounded-lg bg-icy-main/20 flex items-center justify-center text-icy-main">
                    <stat.icon size={20} />
                </div>
                <div>
                    <div className="text-xs text-slate-600 dark:text-gray-400 font-medium uppercase tracking-wider">{stat.label}</div>
                    <div className="text-black dark:text-white font-bold">{stat.value}</div>
                </div>
            </div>
            {/* Connecting line anchor */}
            <div className="w-0.5 h-8 bg-gradient-to-b from-icy-main/50 to-transparent mx-auto"></div>
        </div>
      ))}
    </div>
  )
}