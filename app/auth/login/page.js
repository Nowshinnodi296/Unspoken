'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

export default function Login() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [focusedInput, setFocusedInput] = useState(null)

  async function handleLogin() {
    setLoading(true)
    setError('')
    const { error: loginError } = await supabase.auth.signInWithPassword({ email, password })
    if (loginError) {
      setError('Wrong email or password. Try again.')
      setLoading(false)
      return
    }
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
    <main style={{minHeight:'100vh', backgroundColor:'#0f0d14', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', padding:'2rem 1.5rem', overflow:'hidden'}}>

      <div style={{width:'100%', display:'flex', flexDirection:'column', alignItems:'center', animation:'fadeSlideUp 0.8s ease forwards'}}>

        {/* Logo */}
        <div style={{marginBottom:'2rem', textAlign:'center'}}>
          <h1 style={{fontSize:'2rem', fontWeight:'500', color:'#e8e6f0', letterSpacing:'-0.02em'}}>
            unspoken
          </h1>
          <p style={{fontSize:'0.7rem', color:'#4a4760', marginTop:'0.4rem', letterSpacing:'0.15em', textTransform:'uppercase'}}>
            welcome back
          </p>
        </div>

        {/* Card */}
        <div style={{width:'100%', maxWidth:'380px', backgroundColor:'#16131f', border:'0.5px solid #2a2640', borderRadius:'18px', padding:'1.75rem', display:'flex', flexDirection:'column', gap:'1.25rem', animation:'fadeSlideUp 1s ease forwards'}}>

          {/* Email */}
          <div style={{display:'flex', flexDirection:'column', gap:'0.5rem', animation:'fadeSlideUp 1.1s ease forwards'}}>
            <label style={{fontSize:'0.65rem', color:'#4a4760', letterSpacing:'0.12em', textTransform:'uppercase'}}>Email</label>
            <input
              type="email"
              placeholder="you@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onFocus={() => setFocusedInput('email')}
              onBlur={() => setFocusedInput(null)}
              style={inputStyle('email')}
            />
          </div>

          {/* Password */}
          <div style={{display:'flex', flexDirection:'column', gap:'0.5rem', animation:'fadeSlideUp 1.2s ease forwards'}}>
            <label style={{fontSize:'0.65rem', color:'#4a4760', letterSpacing:'0.12em', textTransform:'uppercase'}}>Password</label>
            <input
              type="password"
              placeholder="your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onFocus={() => setFocusedInput('password')}
              onBlur={() => setFocusedInput(null)}
              style={inputStyle('password')}
            />
          </div>

          {/* Error */}
          {error && (
            <p style={{fontSize:'0.75rem', color:'#e88080', backgroundColor:'#2a1f1f', padding:'0.5rem 0.75rem', borderRadius:'8px', animation:'shake 0.4s ease'}}>
              {error}
            </p>
          )}

          {/* Button */}
          <button
            onClick={handleLogin}
            disabled={loading || !email || !password}
            style={{
              width:'100%',
              backgroundColor: loading || !email || !password ? '#2a2640' : '#9b9be8',
              color: loading || !email || !password ? '#4a4760' : '#0f0d14',
              fontSize:'0.875rem',
              fontWeight:'500',
              padding:'0.85rem',
              borderRadius:'12px',
              border:'none',
              cursor: loading || !email || !password ? 'not-allowed' : 'pointer',
              transition:'all 0.3s ease',
              animation:'fadeSlideUp 1.3s ease forwards',
            }}
          >
            {loading ? 'Signing in...' : 'Sign in'}
          </button>

          <a href="/auth/signup" style={{textAlign:'center', fontSize:'0.75rem', color:'#4a4760', textDecoration:'none'}}>
            New here? Join quietly
          </a>

        </div>

        {/* Crisis */}
        <div style={{marginTop:'2rem'}}>
          <a href="https://www.befrienders.org" target="_blank" style={{fontSize:'0.75rem', color:'#e88080', opacity:'0.5', textDecoration:'underline', textUnderlineOffset:'4px'}}>
            I need help right now
          </a>
        </div>

      </div>

      <style>{`
        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(24px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-6px); }
          75% { transform: translateX(6px); }
        }
        input::placeholder { color: #4a4760; }
        input:focus { box-shadow: 0 0 0 3px rgba(155,155,232,0.1); }
      `}</style>

    </main>
  )
}