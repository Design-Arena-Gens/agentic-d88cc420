'use client'

import { useRef, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Stars } from '@react-three/drei'
import * as THREE from 'three'

function Earth() {
  const meshRef = useRef<THREE.Mesh>(null)
  const cloudsRef = useRef<THREE.Mesh>(null)

  // Create Earth texture with India highlighted
  const earthTexture = useMemo(() => {
    const canvas = document.createElement('canvas')
    canvas.width = 2048
    canvas.height = 1024
    const ctx = canvas.getContext('2d')!

    // Base ocean color
    ctx.fillStyle = '#1a4d80'
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // Draw continents (simplified)
    ctx.fillStyle = '#2d5a2d'

    // Africa
    ctx.beginPath()
    ctx.ellipse(1050, 600, 200, 280, 0, 0, Math.PI * 2)
    ctx.fill()

    // Europe
    ctx.fillRect(1000, 350, 150, 100)

    // Asia (simplified)
    ctx.fillRect(1200, 300, 400, 200)

    // India - highlighted in bright color
    ctx.fillStyle = '#ff9933' // Saffron color
    ctx.beginPath()
    // India shape (simplified triangular peninsula)
    ctx.moveTo(1350, 480)
    ctx.lineTo(1420, 480)
    ctx.lineTo(1420, 560)
    ctx.lineTo(1400, 640)
    ctx.lineTo(1370, 640)
    ctx.lineTo(1350, 560)
    ctx.closePath()
    ctx.fill()

    // Add glow around India
    ctx.strokeStyle = '#ffffff'
    ctx.lineWidth = 3
    ctx.stroke()

    // Add some random green patches for other land
    ctx.fillStyle = '#3a7a3a'
    for (let i = 0; i < 50; i++) {
      const x = Math.random() * canvas.width
      const y = Math.random() * canvas.height
      const size = Math.random() * 30 + 10
      ctx.fillRect(x, y, size, size)
    }

    return new THREE.CanvasTexture(canvas)
  }, [])

  // Create clouds texture
  const cloudsTexture = useMemo(() => {
    const canvas = document.createElement('canvas')
    canvas.width = 2048
    canvas.height = 1024
    const ctx = canvas.getContext('2d')!

    ctx.fillStyle = 'rgba(0, 0, 0, 0)'
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // Draw clouds
    ctx.fillStyle = 'rgba(255, 255, 255, 0.3)'
    for (let i = 0; i < 100; i++) {
      const x = Math.random() * canvas.width
      const y = Math.random() * canvas.height
      const size = Math.random() * 60 + 20
      ctx.beginPath()
      ctx.ellipse(x, y, size, size * 0.6, 0, 0, Math.PI * 2)
      ctx.fill()
    }

    return new THREE.CanvasTexture(canvas)
  }, [])

  useFrame((state) => {
    if (meshRef.current) {
      // Rotate Earth slowly
      meshRef.current.rotation.y += 0.001
    }
    if (cloudsRef.current) {
      // Rotate clouds slightly faster
      cloudsRef.current.rotation.y += 0.0012
    }
  })

  return (
    <group>
      {/* Earth */}
      <mesh ref={meshRef}>
        <sphereGeometry args={[2, 64, 64]} />
        <meshStandardMaterial
          map={earthTexture}
          roughness={0.7}
          metalness={0.1}
        />
      </mesh>

      {/* Clouds layer */}
      <mesh ref={cloudsRef}>
        <sphereGeometry args={[2.01, 64, 64]} />
        <meshStandardMaterial
          map={cloudsTexture}
          transparent
          opacity={0.6}
          depthWrite={false}
        />
      </mesh>

      {/* Atmosphere glow */}
      <mesh>
        <sphereGeometry args={[2.1, 64, 64]} />
        <meshBasicMaterial
          color="#4488ff"
          transparent
          opacity={0.1}
          side={THREE.BackSide}
        />
      </mesh>
    </group>
  )
}

function CameraAnimation() {
  useFrame((state) => {
    const time = state.clock.getElapsedTime()
    // Animate camera in an orbit
    state.camera.position.x = Math.sin(time * 0.1) * 8
    state.camera.position.z = Math.cos(time * 0.1) * 8
    state.camera.position.y = Math.sin(time * 0.05) * 2 + 3
    state.camera.lookAt(0, 0, 0)
  })
  return null
}

export default function EarthScene() {
  return (
    <Canvas camera={{ position: [0, 3, 8], fov: 45 }}>
      <ambientLight intensity={0.3} />
      <pointLight position={[10, 10, 10]} intensity={1.5} />
      <pointLight position={[-10, -10, -10]} intensity={0.3} color="#4488ff" />

      <Earth />
      <Stars radius={300} depth={60} count={5000} factor={7} saturation={0} fade speed={1} />

      <CameraAnimation />
      <OrbitControls
        enableZoom={true}
        enablePan={false}
        minDistance={3}
        maxDistance={15}
        autoRotate={false}
      />
    </Canvas>
  )
}
