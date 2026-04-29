'use client'

import { useEffect, useRef } from 'react'

export default function Home() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    let animationId

    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    const particles = Array.from({ length: 60 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      size: Math.random() * 1.5 + 0.5,
      speedX: (Math.random() - 0.5) * 0.3,
      speedY: (Math.random() - 0.5) * 0.3,
      opacity: Math.random() * 0.4 + 0.1,
    }))

    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      particles.forEach((p) => {
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(155, 155, 232, ${p.opacity})`
        ctx.fill()
        p.x += p.speedX
        p.y += p.speedY
        if (p.x < 0) p.x = canvas.width
        if (p.x > canvas.width) p.x = 0
        if (p.y < 0) p.y = canvas.height
        if (p.y > canvas.height) p.y = 0
      })
      animationId = requestAnimationFrame(draw)
    }

    draw()

    const handleResize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    window.addEventListener('resize', handleResize)

    return () => {
      cancelAnimationFrame(animationId)
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  return (
    <main style={{minHeight:'100vh', backgroundColor:'#0f0d14', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', padding:'3rem 1.5rem', position:'relative', overflow:'hidden'}}>

      {/* Particles canvas */}
      <canvas ref={canvasRef} style={{position:'absolute', top:0, left:0, width:'100%', height:'100%', pointerEvents:'none'}} />

      {/* Fade-in wrapper */}
      <div style={{position:'relative', zIndex:1, width:'100%', display:'flex', flexDirection:'column', alignItems:'center', animation:'fadeIn 1.2s ease forwards'}}>

        {/* Logo */}
        <div style={{marginBottom:'2.5rem', textAlign:'center', animation:'slideDown 1s ease forwards'}}>
          <h1 style={{fontSize:'2.25rem', fontWeight:'500', color:'#e8e6f0', letterSpacing:'-0.02em'}}>
            unspoken
          </h1>
          <p style={{fontSize:'0.7rem', color:'#4a4760', marginTop:'0.5rem', letterSpacing:'0.15em', textTransform:'uppercase'}}>
            a quiet space to feel heard
          </p>
        </div>

        {/* Card */}
        <div style={{width:'100%', maxWidth:'380px', backgroundColor:'#16131f', border:'0.5px solid #2a2640', borderRadius:'18px', padding:'1.75rem', display:'flex', flexDirection:'column', gap:'1.25rem', animation:'slideUp 1s ease forwards'}}>

          <p style={{color:'#9b98b0', fontSize:'0.875rem', lineHeight:'1.6'}}>
            Say what you feel. No names. No judgment. No one keeping score.
          </p>

          {/* Sample post */}
          <div style={{backgroundColor:'#1e1a2e', border:'0.5px solid #2a2640', borderRadius:'12px', padding:'1rem', display:'flex', flexDirection:'column', gap:'0.75rem'}}>
            <div style={{fontSize:'0.7rem', color:'#4a4760'}}>can't sleep · anonymous</div>
            <p style={{fontSize:'0.875rem', color:'#e8e6f0', lineHeight:'1.6'}}>
              I've been staring at the ceiling for 3 hours. My brain won't stop.
            </p>
            <div style={{display:'flex', gap:'0.5rem'}}>

              {/* I hear you — sage green */}
              <span style={{
                fontSize:'0.75rem',
                color:'#7ec4a0',
                backgroundColor:'#1a2e24',
                border:'0.5px solid #2a4a38',
                padding:'4px 12px',
                borderRadius:'999px',
                animation:'pulse 2.5s ease-in-out infinite',
                cursor:'default'
              }}>
                I hear you
              </span>

              {/* Me too — dusty rose */}
              <span style={{
                fontSize:'0.75rem',
                color:'#e8a0b4',
                backgroundColor:'#2e1a24',
                border:'0.5px solid #4a2a38',
                padding:'4px 12px',
                borderRadius:'999px',
                animation:'pulse 2.5s ease-in-out infinite 0.8s',
                cursor:'default'
              }}>
                Me too
              </span>

            </div>
          </div>

          {/* Buttons */}
          <div style={{display:'flex', flexDirection:'column', gap:'0.5rem', marginTop:'0.25rem'}}>
            <a href="/auth/signup" style={{width:'100%', textAlign:'center', backgroundColor:'#9b9be8', color:'#0f0d14', fontSize:'0.875rem', fontWeight:'500', padding:'0.85rem', borderRadius:'12px', textDecoration:'none', display:'block', transition:'all 0.2s'}}>
              Join quietly
            </a>
            <a href="/auth/login" style={{width:'100%', textAlign:'center', color:'#4a4760', fontSize:'0.875rem', padding:'0.85rem', borderRadius:'12px', textDecoration:'none', display:'block'}}>
              Already here? Sign in
            </a>
          </div>

        </div>

        {/* Crisis */}
        <div style={{marginTop:'2.5rem'}}>
          <a href="https://www.befrienders.org" target="_blank" style={{fontSize:'0.75rem', color:'#e88080', opacity:'0.5', textDecoration:'underline', textUnderlineOffset:'4px'}}>
            I need help right now
          </a>
        </div>

      </div>

      {/* Animation keyframes */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.7; transform: scale(0.97); }
        }
        a[href="/auth/signup"]:hover {
          background-color: #6f6fbe !important;
        }
      `}</style>

    </main>
  )
}