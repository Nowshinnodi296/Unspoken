'use client'

import { useState, useEffect, useRef } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

export default function Login() {
  const router = useRouter()
  const canvasRef = useRef(null)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [focusedInput, setFocusedInput] = useState(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    let animationId
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
    const particles = Array.from({ length: 50 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      size: Math.random() * 1.2 + 0.3,
      speedX: (Math.random() - 0.5) * 0.2,
      speedY: (Math.random() - 0.5) * 0.2,
      opacity: Math.random() * 0.3 + 0.05,
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
    const handleResize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight }
    window.addEventListener('resize', handleResize)
    return () => { cancelAnimationFrame(animationId); window.removeEventListener('resize', handleResize) }
  }, [])

  async function handleLogin() {
    setLoading(true)
    setError('')
    const { error: loginError } = await supabase.auth.signInWithPassword({ email, password })
    if (loginError) { setError('Wrong email or password. Try again.'); setLoading(false); return }
    router.push('/feed')
  }

  const inputStyle = (name) => ({
    backgroundColor:'#1e1a2e',
    border: focusedInput === name ? '0.5px solid #9b9be8' : '0.5px solid #2a2640',
    borderRadius:'10px',
    padding:'0.75rem 1rem',
    fontSize:'0.875rem',
    color:'#e8e6f0',
    outline:'none',
    width:'100%',
    transition:'border 0.3s ease',
  })

  return (
    <main style={{minHeight:'100vh', backgroundColor:'#0f0d14', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', padding:'2rem 1.5rem', position:'relative', overflow:'hidden'}}>

      <canvas ref={canvasRef} style={{position:'fixed', top:0, left:0, width:'100%', height:'100%', pointerEvents:'none', zIndex:0}} />

      <div style={{position:'relative', zIndex:1, width:'100%', display:'flex', flexDirection:'column', alignItems:'center', animation:'fadeSlideUp 0.8s ease forwards'}}>

        <div style={{marginBottom:'2rem', textAlign:'center'}}>
          <h1 style={{fontSize:'2rem', fontWeight:'500', color:'#e8e6f0', letterSpacing:'-0.02em'}}>unspoken</h1>
          <p style={{fontSize:'0.7rem', color:'#4a4760', marginTop:'0.4rem', letterSpacing:'0.15em', textTransform:'uppercase'}}>welcome back</p>
        </div>

        <div style={{width:'100%', maxWidth:'380px', backgroundColor:'rgba(22,19,31,0.95)', border:'0.5px solid #2a2640', borderRadius:'18px', padding:'1.75rem', display:'flex', flexDirection:'column', gap:'1.25rem', backdropFilter:'blur(8px)'}}>

          <div style={{display:'flex', flexDirection:'column', gap:'0.5rem'}}>
            <label style={{fontSize:'0.65rem', color:'#4a4760', letterSpacing:'0.12em', textTransform:'uppercase'}}>Email</label>
            <input type="email" placeholder="you@email.com" value={email} onChange={e => setEmail(e.target.value)} onFocus={() => setFocusedInput('email')} onBlur={() => setFocusedInput(null)} style={inputStyle('email')} />
          </div>

          <div style={{display:'flex', flexDirection:'column', gap:'0.5rem'}}>
            <label style={{fontSize:'0.65rem', color:'#4a4760', letterSpacing:'0.12em', textTransform:'uppercase'}}>Password</label>
            <input type="password" placeholder="your password" value={password} onChange={e => setPassword(e.target.value)} onFocus={() => setFocusedInput('password')} onBlur={() => setFocusedInput(null)} style={inputStyle('password')} />
          </div>

          {error && (
            <p style={{fontSize:'0.75rem', color:'#e88080', backgroundColor:'#2a1f1f', padding:'0.5rem 0.75rem', borderRadius:'8px', animation:'shake 0.4s ease'}}>
              {error}
            </p>
          )}

          <button
            onClick={handleLogin}
            disabled={loading || !email || !password}
            style={{width:'100%', backgroundColor: loading || !email || !password ? '#2a2640' : '#9b9be8', color: loading || !email || !password ? '#4a4760' : '#0f0d14', fontSize:'0.875rem', fontWeight:'500', padding:'0.85rem', borderRadius:'12px', border:'none', cursor: loading || !email || !password ? 'not-allowed' : 'pointer', transition:'all 0.3s ease'}}
          >
            {loading ? 'Signing in...' : 'Sign in'}
          </button>

          <a href="/auth/signup" style={{textAlign:'center', fontSize:'0.75rem', color:'#4a4760', textDecoration:'none'}}>
            New here? Join quietly
          </a>

        </div>

        <div style={{marginTop:'2rem'}}>
          <a href="https://www.befrienders.org" target="_blank" style={{fontSize:'0.75rem', color:'#e88080', opacity:'0.5', textDecoration:'underline', textUnderlineOffset:'4px'}}>
            I need help right now
          </a>
        </div>

      </div>

      <style>{`
        @keyframes fadeSlideUp { from { opacity: 0; transform: translateY(24px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes shake { 0%, 100% { transform: translateX(0); } 25% { transform: translateX(-6px); } 75% { transform: translateX(6px); } }
        input::placeholder { color: #4a4760; }
        input:focus { box-shadow: 0 0 0 3px rgba(155,155,232,0.1); }
      `}</style>
    </main>
  )
}