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

export default function NewPost() {
  const router = useRouter()
  const canvasRef = useRef(null)
  const [content, setContent] = useState('')
  const [selectedSpace, setSelectedSpace] = useState(null)
  const [hasWarning, setHasWarning] = useState(false)
  const [warningLabel, setWarningLabel] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // Particles
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    let animationId
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
    const particles = Array.from({ length: 40 }, () => ({
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
    return () => cancelAnimationFrame(animationId)
  }, [])

  async function handlePost() {
    if (!content.trim() || !selectedSpace) return
    setLoading(true)
    setError('')

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { router.push('/auth/login'); return }

    const { error: postError } = await supabase.from('posts').insert({
      user_id: user.id,
      space_id: selectedSpace,
      content: content.trim(),
      has_content_warning: hasWarning,
      warning_label: warningLabel || null,
    })

    if (postError) {
      setError(postError.message)
      setLoading(false)
      return
    }

    router.push('/feed')
  }

  return (
    <main style={{minHeight:'100vh', backgroundColor:'#0f0d14', color:'#e8e6f0', position:'relative', overflow:'hidden'}}>

      <canvas ref={canvasRef} style={{position:'fixed', top:0, left:0, width:'100%', height:'100%', pointerEvents:'none', zIndex:0}} />

      <div style={{position:'relative', zIndex:1, maxWidth:'520px', margin:'0 auto', padding:'2rem 1rem'}}>

        {/* Header */}
        <div style={{display:'flex', alignItems:'center', gap:'1rem', marginBottom:'2rem', animation:'fadeSlideUp 0.5s ease forwards'}}>
          <button
            onClick={() => router.back()}
            style={{background:'none', border:'none', color:'#4a4760', cursor:'pointer', fontSize:'1.2rem'}}
          >
            ←
          </button>
          <h1 style={{fontSize:'1.1rem', fontWeight:'500', color:'#e8e6f0'}}>say something</h1>
        </div>

        {/* Card */}
        <div style={{backgroundColor:'rgba(22,19,31,0.95)', border:'0.5px solid #2a2640', borderRadius:'18px', padding:'1.75rem', display:'flex', flexDirection:'column', gap:'1.25rem', animation:'fadeSlideUp 0.7s ease forwards', backdropFilter:'blur(8px)'}}>

          {/* Text area */}
          <div style={{display:'flex', flexDirection:'column', gap:'0.5rem'}}>
            <label style={{fontSize:'0.65rem', color:'#4a4760', letterSpacing:'0.12em', textTransform:'uppercase'}}>
              What's on your mind?
            </label>
            <textarea
              placeholder="Say what you feel. No one knows it's you."
              value={content}
              onChange={e => setContent(e.target.value)}
              rows={5}
              style={{
                backgroundColor:'#1e1a2e',
                border:'0.5px solid #2a2640',
                borderRadius:'10px',
                padding:'0.85rem 1rem',
                fontSize:'0.9rem',
                color:'#e8e6f0',
                outline:'none',
                resize:'none',
                lineHeight:'1.7',
                fontFamily:'inherit',
              }}
            />
            <div style={{fontSize:'0.7rem', color: content.length > 400 ? '#e88080' : '#4a4760', textAlign:'right'}}>
              {content.length}/500
            </div>
          </div>

          {/* Space picker */}
          <div style={{display:'flex', flexDirection:'column', gap:'0.5rem'}}>
            <label style={{fontSize:'0.65rem', color:'#4a4760', letterSpacing:'0.12em', textTransform:'uppercase'}}>
              Post in
            </label>
            <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:'0.4rem'}}>
              {spaces.map(space => (
                <button
                  key={space.id}
                  onClick={() => setSelectedSpace(space.id)}
                  style={{
                    backgroundColor: selectedSpace === space.id ? '#1e1a3e' : '#1e1a2e',
                    border: selectedSpace === space.id ? '0.5px solid #9b9be8' : '0.5px solid #2a2640',
                    borderRadius:'8px',
                    padding:'0.5rem 0.75rem',
                    display:'flex',
                    alignItems:'center',
                    gap:'0.4rem',
                    cursor:'pointer',
                    transition:'all 0.15s',
                    textAlign:'left',
                  }}
                >
                  <span style={{fontSize:'0.9rem'}}>{space.emoji}</span>
                  <span style={{fontSize:'0.72rem', color: selectedSpace === space.id ? '#9b9be8' : '#9b98b0'}}>
                    {space.name}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Content warning */}
          <div style={{display:'flex', flexDirection:'column', gap:'0.5rem'}}>
            <button
              onClick={() => setHasWarning(!hasWarning)}
              style={{
                display:'flex',
                alignItems:'center',
                gap:'0.5rem',
                background:'none',
                border:'none',
                cursor:'pointer',
                padding:0,
              }}
            >
              <div style={{
                width:'16px',
                height:'16px',
                borderRadius:'4px',
                backgroundColor: hasWarning ? '#9b9be8' : 'transparent',
                border: hasWarning ? '0.5px solid #9b9be8' : '0.5px solid #2a2640',
                transition:'all 0.2s',
              }} />
              <span style={{fontSize:'0.78rem', color:'#9b98b0'}}>Add content warning</span>
            </button>

            {hasWarning && (
              <input
                type="text"
                placeholder="e.g. grief, self-harm, anxiety"
                value={warningLabel}
                onChange={e => setWarningLabel(e.target.value)}
                style={{
                  backgroundColor:'#1e1a2e',
                  border:'0.5px solid #2a2640',
                  borderRadius:'8px',
                  padding:'0.6rem 0.85rem',
                  fontSize:'0.8rem',
                  color:'#e8e6f0',
                  outline:'none',
                  animation:'fadeSlideUp 0.3s ease forwards',
                }}
              />
            )}
          </div>

          {/* Error */}
          {error && (
            <p style={{fontSize:'0.75rem', color:'#e88080', backgroundColor:'#2a1f1f', padding:'0.5rem 0.75rem', borderRadius:'8px', animation:'shake 0.4s ease'}}>
              {error}
            </p>
          )}

          {/* Submit */}
          <button
            onClick={handlePost}
            disabled={!content.trim() || !selectedSpace || loading || content.length > 500}
            style={{
              width:'100%',
              backgroundColor: !content.trim() || !selectedSpace ? '#2a2640' : '#9b9be8',
              color: !content.trim() || !selectedSpace ? '#4a4760' : '#0f0d14',
              fontSize:'0.875rem',
              fontWeight:'500',
              padding:'0.85rem',
              borderRadius:'12px',
              border:'none',
              cursor: !content.trim() || !selectedSpace ? 'not-allowed' : 'pointer',
              transition:'all 0.2s',
            }}
          >
            {loading ? 'posting...' : 'post anonymously'}
          </button>

          <a href="/feed" style={{textAlign:'center', fontSize:'0.75rem', color:'#4a4760', textDecoration:'none'}}>
            back to feed
          </a>

        </div>

        {/* Crisis */}
        <div style={{textAlign:'center', marginTop:'2rem'}}>
          <a href="https://www.befrienders.org" target="_blank" style={{fontSize:'0.75rem', color:'#e88080', opacity:'0.4', textDecoration:'underline', textUnderlineOffset:'4px'}}>
            I need help right now
          </a>
        </div>

      </div>

      <style>{`
        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-6px); }
          75% { transform: translateX(6px); }
        }
        textarea::placeholder { color: #4a4760; }
        input::placeholder { color: #4a4760; }
        textarea:focus { border-color: #9b9be8 !important; box-shadow: 0 0 0 3px rgba(155,155,232,0.1); }
      `}</style>

    </main>
  )
}