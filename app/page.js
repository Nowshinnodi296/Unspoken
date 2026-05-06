'use client'

import { useEffect, useRef } from 'react'
import { useTheme } from './layout'
import { darkTheme, lightTheme } from '@/lib/theme'

export default function Home() {
  const { isDark, toggleTheme } = useTheme()
  const t = isDark ? darkTheme : lightTheme
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
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
        ctx.fillStyle = `${t.particle}${p.opacity})`
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
    const handleResize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight }
    window.addEventListener('resize', handleResize)
    return () => { cancelAnimationFrame(animationId); window.removeEventListener('resize', handleResize) }
  }, [isDark])

  return (
    <main style={{minHeight:'100vh', backgroundColor:t.bgPage, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', padding:'3rem 1.5rem', position:'relative', overflow:'hidden', transition:'background-color 0.4s ease'}}>

      <canvas ref={canvasRef} style={{position:'fixed', top:0, left:0, width:'100%', height:'100%', pointerEvents:'none', zIndex:0}} />

      {/* Theme toggle */}
      <button
        onClick={toggleTheme}
        style={{position:'fixed', top:'1rem', right:'1rem', zIndex:10, background:'none', border:`0.5px solid ${t.border}`, borderRadius:'999px', padding:'0.4rem 0.85rem', fontSize:'0.75rem', color:t.textHint, cursor:'pointer', transition:'all 0.3s', backgroundColor:t.bgCard}}
      >
        {isDark ? '☀️ light' : '🌙 dark'}
      </button>

      <div style={{position:'relative', zIndex:1, width:'100%', display:'flex', flexDirection:'column', alignItems:'center', animation:'fadeIn 1.2s ease forwards'}}>

        <div style={{marginBottom:'2.5rem', textAlign:'center', animation:'slideDown 1s ease forwards'}}>
          <h1 style={{fontSize:'2.25rem', fontWeight:'500', color:t.textPrimary, letterSpacing:'-0.02em', transition:'color 0.4s'}}>
            unspoken
          </h1>
          <p style={{fontSize:'0.7rem', color:t.textHint, marginTop:'0.5rem', letterSpacing:'0.15em', textTransform:'uppercase'}}>
            a quiet space to feel heard
          </p>
        </div>

        <div style={{width:'100%', maxWidth:'380px', backgroundColor:t.bgCard, border:`0.5px solid ${t.border}`, borderRadius:'18px', padding:'1.75rem', display:'flex', flexDirection:'column', gap:'1.25rem', backdropFilter:'blur(8px)', animation:'slideUp 1s ease forwards', transition:'all 0.4s ease'}}>

          <p style={{color:t.textSecondary, fontSize:'0.875rem', lineHeight:'1.6'}}>
            Say what you feel. No names. No judgment. No one keeping score.
          </p>

          <div style={{backgroundColor:t.bgLifted, border:`0.5px solid ${t.border}`, borderRadius:'12px', padding:'1rem', display:'flex', flexDirection:'column', gap:'0.75rem', transition:'all 0.4s'}}>
            <div style={{fontSize:'0.7rem', color:t.textHint}}>can't sleep · anonymous</div>
            <p style={{fontSize:'0.875rem', color:t.textPrimary, lineHeight:'1.6'}}>
              I've been staring at the ceiling for 3 hours. My brain won't stop.
            </p>
            <div style={{display:'flex', gap:'0.5rem'}}>
              <span style={{fontSize:'0.75rem', color:t.greenSoft, backgroundColor:t.greenDim, border:`0.5px solid ${t.greenBorder}`, padding:'4px 12px', borderRadius:'999px', animation:'pulse 2.5s ease-in-out infinite'}}>
                I hear you
              </span>
              <span style={{fontSize:'0.75rem', color:t.pinkSoft, backgroundColor:t.pinkDim, border:`0.5px solid ${t.pinkBorder}`, padding:'4px 12px', borderRadius:'999px', animation:'pulse 2.5s ease-in-out infinite 0.8s'}}>
                Me too
              </span>
            </div>
          </div>

          <div style={{display:'flex', flexDirection:'column', gap:'0.5rem', marginTop:'0.25rem'}}>
            <a href="/auth/signup" style={{width:'100%', textAlign:'center', backgroundColor:t.accent, color: isDark ? '#0f0d14' : '#ffffff', fontSize:'0.875rem', fontWeight:'500', padding:'0.85rem', borderRadius:'12px', textDecoration:'none', display:'block', transition:'all 0.2s'}}>
              Join quietly
            </a>
            <a href="/auth/login" style={{width:'100%', textAlign:'center', color:t.textHint, fontSize:'0.875rem', padding:'0.85rem', borderRadius:'12px', textDecoration:'none', display:'block'}}>
              Already here? Sign in
            </a>
          </div>

        </div>

        <div style={{marginTop:'2.5rem'}}>
          <a href="https://www.befrienders.org" target="_blank" style={{fontSize:'0.75rem', color:t.redSoft, opacity:'0.5', textDecoration:'underline', textUnderlineOffset:'4px'}}>
            I need help right now
          </a>
        </div>

      </div>

      <style>{`
        @keyframes fadeIn { from { opacity:0; } to { opacity:1; } }
        @keyframes slideDown { from { opacity:0; transform:translateY(-20px); } to { opacity:1; transform:translateY(0); } }
        @keyframes slideUp { from { opacity:0; transform:translateY(20px); } to { opacity:1; transform:translateY(0); } }
        @keyframes pulse { 0%,100% { opacity:1; transform:scale(1); } 50% { opacity:0.7; transform:scale(0.97); } }
      `}</style>

    </main>
  )
}