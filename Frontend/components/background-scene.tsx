"use client"

import { useEffect, useRef } from "react"
import * as THREE from "three"

export default function BackgroundScene() {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!containerRef.current) return

    // Scene setup
    const scene = new THREE.Scene()

    // Camera setup
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
    camera.position.z = 30

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
    })
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    containerRef.current.appendChild(renderer.domElement)

    // Create particles
    const particlesGeometry = new THREE.BufferGeometry()
    const particlesCount = 1000

    const posArray = new Float32Array(particlesCount * 3)
    const scaleArray = new Float32Array(particlesCount)

    // Fill with random positions
    for (let i = 0; i < particlesCount * 3; i += 3) {
      // Create a sphere of particles
      const radius = 20 + Math.random() * 10
      const theta = Math.random() * Math.PI * 2
      const phi = Math.random() * Math.PI

      posArray[i] = radius * Math.sin(phi) * Math.cos(theta)
      posArray[i + 1] = radius * Math.sin(phi) * Math.sin(theta)
      posArray[i + 2] = radius * Math.cos(phi)

      // Random scale for each particle
      scaleArray[i / 3] = Math.random() * 2
    }

    particlesGeometry.setAttribute("position", new THREE.BufferAttribute(posArray, 3))
    particlesGeometry.setAttribute("scale", new THREE.BufferAttribute(scaleArray, 1))

    // Create material
    const particlesMaterial = new THREE.PointsMaterial({
      size: 0.1,
      sizeAttenuation: true,
      color: 0x88ccff,
      transparent: true,
      opacity: 0.6,
      blending: THREE.AdditiveBlending,
    })

    // Create mesh
    const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial)
    scene.add(particlesMesh)

    // Add some soft ambient light
    const ambientLight = new THREE.AmbientLight(0x404080, 0.5)
    scene.add(ambientLight)

    // Add connections between nearby particles
    const lineMaterial = new THREE.LineBasicMaterial({
      color: 0x4488aa,
      transparent: true,
      opacity: 0.2,
      blending: THREE.AdditiveBlending,
    })

    const linesMesh = new THREE.Group()
    scene.add(linesMesh)

    // Handle window resize
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight
      camera.updateProjectionMatrix()
      renderer.setSize(window.innerWidth, window.innerHeight)
    }

    window.addEventListener("resize", handleResize)

    // Mouse interaction
    const mouse = new THREE.Vector2()

    const handleMouseMove = (event: MouseEvent) => {
      mouse.x = (event.clientX / window.innerWidth) * 2 - 1
      mouse.y = -(event.clientY / window.innerHeight) * 2 + 1

      // Add a subtle ripple effect when mouse moves
      const rippleStrength = 0.05
      const positions = particlesGeometry.attributes.position.array as Float32Array
      const originalPositions = posArray.slice() // Create a copy of the original positions

      for (let i = 0; i < particlesCount * 3; i += 3) {
        const dx = (mouse.x * window.innerWidth) / 2 - positions[i]
        const dy = (mouse.y * window.innerHeight) / 2 - positions[i + 1]
        const distance = Math.sqrt(dx * dx + dy * dy)

        if (distance < 300) {
          const factor = 1 - distance / 300
          positions[i] += dx * factor * rippleStrength
          positions[i + 1] += dy * factor * rippleStrength
        } else {
          // Slowly return to original position
          positions[i] = positions[i] * 0.99 + originalPositions[i] * 0.01
          positions[i + 1] = positions[i + 1] * 0.99 + originalPositions[i + 1] * 0.01
          positions[i + 2] = positions[i + 2] * 0.99 + originalPositions[i + 2] * 0.01
        }
      }

      particlesGeometry.attributes.position.needsUpdate = true
    }

    //window.addEventListener("mousemove", handleMouseMove)

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate)

      // Rotate the particle system slowly
      particlesMesh.rotation.x += 0.0005
      particlesMesh.rotation.y += 0.0003

      // Update particle connections
      updateParticleConnections()

      // Slowly change particle colors
      const time = Date.now() * 0.0005
      const hue = (Math.sin(time) * 0.5 + 0.5) * 360
      particlesMaterial.color.setHSL(hue / 360, 0.7, 0.7)
      lineMaterial.color.setHSL(hue / 360, 0.7, 0.5)

      // Mouse interaction - move particles slightly towards mouse
      const positions = particlesGeometry.attributes.position.array as Float32Array
      for (let i = 0; i < particlesCount * 3; i += 3) {
        const index = i / 3
        const x = positions[i]
        const y = positions[i + 1]
        const z = positions[i + 2]

        // Calculate distance from center
        const distance = Math.sqrt(x * x + y * y + z * z)

        // Apply subtle mouse influence
        positions[i] += mouse.x * 0.001 * (Math.sin(index) * 0.5)
        positions[i + 1] += mouse.y * 0.001 * (Math.cos(index) * 0.5)

        // Keep particles within bounds
        const maxDistance = 30
        if (distance > maxDistance) {
          positions[i] *= maxDistance / distance
          positions[i + 1] *= maxDistance / distance
          positions[i + 2] *= maxDistance / distance
        }
      }

      particlesGeometry.attributes.position.needsUpdate = true

      renderer.render(scene, camera)
    }

    // Function to update connections between particles
    const updateParticleConnections = () => {
      // Remove previous connections
      while (linesMesh.children.length > 0) {
        linesMesh.remove(linesMesh.children[0])
      }

      // Only create connections for a subset of particles to improve performance
      const positions = particlesGeometry.attributes.position.array as Float32Array
      const connectionThreshold = 5 // Maximum distance for connection
      const maxConnections = 200 // Limit total connections for performance
      let connectionCount = 0

      for (let i = 0; i < particlesCount * 3; i += 3) {
        if (connectionCount >= maxConnections) break
        if (Math.random() > 0.05) continue // Only check a small percentage of particles

        const x1 = positions[i]
        const y1 = positions[i + 1]
        const z1 = positions[i + 2]

        for (let j = i + 3; j < particlesCount * 3; j += 3) {
          if (connectionCount >= maxConnections) break
          if (Math.random() > 0.1) continue // Further reduce checks

          const x2 = positions[j]
          const y2 = positions[j + 1]
          const z2 = positions[j + 2]

          const distance = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2) + Math.pow(z2 - z1, 2))

          if (distance < connectionThreshold) {
            const lineGeometry = new THREE.BufferGeometry().setFromPoints([
              new THREE.Vector3(x1, y1, z1),
              new THREE.Vector3(x2, y2, z2),
            ])

            const line = new THREE.Line(lineGeometry, lineMaterial)
            linesMesh.add(line)
            connectionCount++
          }
        }
      }
    }

    // Start animation
    animate()

    // Cleanup
    return () => {
      window.removeEventListener("resize", handleResize)
      window.removeEventListener("mousemove", handleMouseMove)

      if (containerRef.current) {
        containerRef.current.removeChild(renderer.domElement)
      }

      // Dispose resources
      particlesGeometry.dispose()
      particlesMaterial.dispose()
      lineMaterial.dispose()
      renderer.dispose()
    }
  }, [])

  return <div ref={containerRef} className="absolute inset-0 -z-10" />
}

