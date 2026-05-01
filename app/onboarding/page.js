'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

const spaces = [
  { id: 1, name: "Can't sleep", emoji: '🌙' },
  { id: 2, name: 'Grief', emoji: '🕊' },
  { id: 3, name: 'Anxiety', emoji: '🌊' },
  { id: 4, name: 'Small wins', emoji: '🌱' },
  { id: 5, name: 'Work stress', emoji: '💼' },
  { id: 6, name: 'Just tired', emoji: '🌫' },
  { id: 7, name: 'First time here', emoji: '👋' },
  { id: 8, name: 'Lonely', emoji: '🪐' },
  { id: 9, name: 'Getting better', emoji: '🌤' },
  { id: 10, name: 'Anger', emoji: '🔥' },
  { id: 11, name: 'Body stuff', emoji: '🫀' },
  { id: 12, name: 'Missing someone', emoji: '✉️' },
]

const moods = [
  { score: 1, emoji: '😶', label: 'numb' },
  { score: 2, emoji: '😔', label: 'low' },
  { score: 3, emoji: '😐', label: 'okay' },
  { score: 4, emoji: '🙂', label: 'alright' },
  { score: 5, emoji: '😊', label: 'good' },
]

export default function Onboarding() {
  const router = useRouter()
  const canvasRef = useRef(null)
  const [step, setStep] = useState(1)
  const [selectedSpaces, setSelectedSpaces] = useState([])
  const [selectedMood, setSelectedMood] = useState(null)
  const [loading, setLoading] = useState(false)

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

  function toggleSpace(id) {
    setSelectedSpaces(prev =>
      prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
    )
  }

  async function handleFinish() {
    setLoading(true)
    const { data: { user } } = await supabase.auth.getUser()
    if (user && selectedMood) {
      await supabase.from('mood_checkins').insert({ user_id: user.id, mood_score: selectedMood })
      await supabase.from('users').update({ onboarding_done: true }).eq('id', user.id)
    }
    router.push('/feed')
  }

  return (
    <main style={{minHeight:'100vh', backgroundColor:'#0f0d14', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', padding:'2rem 1.5rem', position:'relative', overflow:'hidden'}}>

      <canvas ref={canvasRef} style={{position:'fixed', top:0, left:0, width:'100%', height:'100%', pointerEvents:'none', zIndex:0}} />

      <div style={{position:'relative', zIndex:1, width:'100%', maxWidth:'420px', animation:'fadeSlideUp 0.8s ease forwards'}}>

        <div style={{textAlign:'center', marginBottom:'2rem'}}>
          <h1 style={{fontSize:'1.75rem', fontWeight:'500', color:'#e8e6f0'}}>unspoken</h1>
          <p style={{fontSize:'0.7rem', color:'#4a4760', marginTop:'0.3rem', letterSpacing:'0.15em', textTransform:'uppercase'}}>
            step {step} of 2
          </p>
        </div>

        {step === 1 && (
          <div style={{backgroundColor:'rgba(22,19,31,0.95)', border:'0.5px solid #2a2640', borderRadius:'18px', padding:'1.75rem', display:'flex', flexDirection:'column', gap:'1.25rem', backdropFilter:'blur(8px)'}}>
            <div>
              <h2 style={{fontSize:'1rem', fontWeight:'500', color:'#e8e6f0', marginBottom:'0.4rem'}}>Which spaces feel safe to you?</h2>
              <p style={{fontSize:'0.8rem', color:'#9b98b0'}}>Pick as many as you like. You can change this later.</p>
            </div>
            <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:'0.5rem'}}>
              {spaces.map(space => (
                <button
                  key={space.id}
                  onClick={() => toggleSpace(space.id)}
                  style={{
                    backgroundColor: selectedSpaces.includes(space.id) ? '#1e1a3e' : '#1e1a2e',
                    border: selectedSpaces.includes(space.id) ? '0.5px solid #9b9be8' : '0.5px solid #2a2640',
                    borderRadius:'10px',
                    padding:'0.6rem 0.75rem',
                    display:'flex',
                    alignItems:'center',
                    gap:'0.5rem',
                    cursor:'pointer',
                    transition:'all 0.2s',
                  }}
                >
                  <span style={{fontSize:'1rem'}}>{space.emoji}</span>
                  <span style={{fontSize:'0.75rem', color: selectedSpaces.includes(space.id) ? '#9b9be8' : '#9b98b0'}}>{space.name}</span>
                </button>
              ))}
            </div>
            <button
              onClick={() => setStep(2)}
              style={{width:'100%', backgroundColor: selectedSpaces.length > 0 ? '#9b9be8' : '#2a2640', color: selectedSpaces.length > 0 ? '#0f0d14' : '#4a4760', fontSize:'0.875rem', fontWeight:'500', padding:'0.85rem', borderRadius:'12px', border:'none', cursor: selectedSpaces.length > 0 ? 'pointer' : 'not-allowed', transition:'all 0.2s'}}
            >
              Continue
            </button>
          </div>
        )}

        {step === 2 && (
          <div style={{backgroundColor:'rgba(22,19,31,0.95)', border:'0.5px solid #2a2640', borderRadius:'18px', padding:'1.75rem', display:'flex', flexDirection:'column', gap:'1.5rem', backdropFilter:'blur(8px)', animation:'fadeSlideUp 0.4s ease forwards'}}>
            <div>
              <h2 style={{fontSize:'1rem', fontWeight:'500', color:'#e8e6f0', marginBottom:'0.4rem'}}>How are you feeling right now?</h2>
              <p style={{fontSize:'0.8rem', color:'#9b98b0'}}>No right or wrong answer. Just honest.</p>
            </div>
            <div style={{display:'flex', justifyContent:'space-between', gap:'0.5rem'}}>
              {moods.map(mood => (
                <button
                  key={mood.score}
                  onClick={() => setSelectedMood(mood.score)}
                  style={{
                    flex:1,
                    backgroundColor: selectedMood === mood.score ? '#1e1a3e' : '#1e1a2e',
                    border: selectedMood === mood.score ? '0.5px solid #9b9be8' : '0.5px solid #2a2640',
                    borderRadius:'10px',
                    padding:'0.75rem 0.25rem',
                    display:'flex',
                    flexDirection:'column',
                    alignItems:'center',
                    gap:'0.4rem',
                    cursor:'pointer',
                    transition:'all 0.2s',
                    animation: selectedMood === mood.score ? 'pulse 1.5s ease-in-out infinite' : 'none',
                  }}
                >
                  <span style={{fontSize:'1.5rem'}}>{mood.emoji}</span>
                  <span style={{fontSize:'0.65rem', color: selectedMood === mood.score ? '#9b9be8' : '#4a4760'}}>{mood.label}</span>
                </button>
              ))}
            </div>
            <div style={{display:'flex', gap:'0.75rem'}}>
              <button onClick={() => setStep(1)} style={{flex:1, backgroundColor:'transparent', border:'0.5px solid #2a2640', color:'#4a4760', fontSize:'0.875rem', padding:'0.85rem', borderRadius:'12px', cursor:'pointer'}}>
                Back
              </button>
              <button
                onClick={handleFinish}
                disabled={!selectedMood || loading}
                style={{flex:2, backgroundColor: selectedMood ? '#9b9be8' : '#2a2640', color: selectedMood ? '#0f0d14' : '#4a4760', fontSize:'0.875rem', fontWeight:'500', padding:'0.85rem', borderRadius:'12px', border:'none', cursor: selectedMood ? 'pointer' : 'not-allowed', transition:'all 0.2s'}}
              >
                {loading ? 'Setting up...' : 'Enter Unspoken'}
              </button>
            </div>
          </div>
        )}

        <div style={{marginTop:'2rem', textAlign:'center'}}>
          <a href="https://www.befrienders.org" target="_blank" style={{fontSize:'0.75rem', color:'#e88080', opacity:'0.5', textDecoration:'underline', textUnderlineOffset:'4px'}}>
            I need help right now
          </a>
        </div>

      </div>

      <style>{`
        @keyframes fadeSlideUp { from { opacity: 0; transform: translateY(24px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes pulse { 0%, 100% { opacity: 1; transform: scale(1); } 50% { opacity: 0.8; transform: scale(0.97); } }
      `}</style>

    </main>
  )
}