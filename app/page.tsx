'use client'

import dynamic from 'next/dynamic'

const EarthScene = dynamic(() => import('./components/EarthScene'), {
  ssr: false,
})

export default function Home() {
  return (
    <main style={{ width: '100vw', height: '100vh', position: 'relative' }}>
      <EarthScene />
      <div style={{
        position: 'absolute',
        top: '20px',
        left: '20px',
        zIndex: 10,
        color: 'white',
        textShadow: '0 0 10px rgba(0,0,0,0.8)',
      }}>
        <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>India from Space</h1>
        <p style={{ fontSize: '1rem', opacity: 0.8 }}>Animated satellite view</p>
      </div>
    </main>
  )
}
