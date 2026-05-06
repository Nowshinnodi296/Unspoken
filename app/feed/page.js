'use client'

import { useEffect, useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export default function Feed() {
  const router = useRouter()
  const canvasRef = useRef(null)
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState(null)

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

  useEffect(() => {
    async function loadFeed() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/auth/login'); return }
      setUser(user)
      const { data } = await supabase
        .from('posts')
        .select('*, spaces(name, emoji)')
        .eq('is_removed', false)
        .order('created_at', { ascending: false })
        .limit(30)
      setPosts(data || [])
      setLoading(false)
    }
    loadFeed()
  }, [router])

  async function handleReaction(postId, type) {
    if (!user) return
    const { data: existing } = await supabase
      .from('reactions')
      .select('id')
      .eq('post_id', postId)
      .eq('user_id', user.id)
      .eq('type', type)
      .maybeSingle()
    if (existing) {
      await supabase.from('reactions').delete().eq('id', existing.id)
    } else {
      await supabase.from('reactions').insert({ post_id: postId, user_id: user.id, type })
    }
  }

  async function handleSignOut() {
    await supabase.auth.signOut()
    router.push('/')
  }

  async function handleReport(postId) {
    if (!user) return
    const confirmed = window.confirm('Report this post?')
    if (confirmed) {
      await supabase.from('reports').insert({
        post_id: postId,
        reporter_user_id: user.id,
        reason: 'reported by user',
      })
    }
  }

  return (
    <main style={{minHeight:'100vh', backgroundColor:'#0f0d14', color:'#e8e6f0', position:'relative', overflow:'hidden'}}>

      <canvas ref={canvasRef} style={{position:'fixed', top:0, left:0, width:'100%', height:'100%', pointerEvents:'none', zIndex:0}} />

      <div style={{position:'relative', zIndex:1}}>

        <nav style={{
          position:'sticky', top:0, zIndex:10,
          backgroundColor:'rgba(15,13,20,0.85)',
          backdropFilter:'blur(12px)',
          borderBottom:'0.5px solid #2a2640',
          padding:'1rem 1.5rem',
          display:'flex', justifyContent:'space-between', alignItems:'center',
          animation:'fadeDown 0.6s ease forwards',
        }}>
          <h1 style={{fontSize:'1.25rem', fontWeight:'500', color:'#e8e6f0'}}>unspoken</h1>
          <div style={{display:'flex', gap:'0.75rem', alignItems:'center'}}>
            <a href="/post/new" style={{fontSize:'0.8rem', backgroundColor:'#9b9be8', color:'#0f0d14', padding:'0.5rem 1rem', borderRadius:'8px', textDecoration:'none', fontWeight:'500'}}>
              + Post
            </a>
            <a href="/wellness" style={{fontSize:'0.8rem', color:'#4a4760', textDecoration:'none'}}>
              breathe
            </a>
            <button onClick={handleSignOut} style={{fontSize:'0.8rem', color:'#4a4760', background:'none', border:'none', cursor:'pointer'}}>
              leave
            </button>
          </div>
        </nav>

        <div style={{maxWidth:'560px', margin:'0 auto', padding:'1.5rem 1rem'}}>

          {loading && (
            <div style={{textAlign:'center', color:'#4a4760', padding:'4rem', fontSize:'0.875rem'}}>
              <div style={{fontSize:'1.5rem', marginBottom:'0.75rem'}}>🌙</div>
              loading...
            </div>
          )}

          {!loading && posts.length === 0 && (
            <div style={{textAlign:'center', padding:'4rem', animation:'fadeSlideUp 0.8s ease forwards'}}>
              <p style={{color:'#4a4760', fontSize:'0.875rem', lineHeight:'1.8'}}>
                No posts yet. Be the first to say something.
              </p>
              <a href="/post/new" style={{display:'inline-block', marginTop:'1.25rem', fontSize:'0.8rem', color:'#9b9be8', textDecoration:'underline', textUnderlineOffset:'4px'}}>
                Write something
              </a>
            </div>
          )}

          {posts.map((post, i) => (
            <div
              key={post.id}
              style={{
                backgroundColor:'rgba(22,19,31,0.9)',
                border:'0.5px solid #2a2640',
                borderRadius:'14px',
                padding:'1.25rem',
                marginBottom:'0.75rem',
                backdropFilter:'blur(8px)',
                animation:`fadeSlideUp 0.5s ease ${i * 0.07}s forwards`,
                opacity:0,
              }}
            >
              <div style={{display:'flex', justifyContent:'space-between', marginBottom:'0.75rem'}}>
                <span style={{fontSize:'0.7rem', color:'#4a4760'}}>
                  {post.spaces?.emoji} {post.spaces?.name}
                </span>
                <span style={{fontSize:'0.7rem', color:'#4a4760'}}>
                  {new Date(post.created_at).toLocaleDateString()}
                </span>
              </div>

              {post.has_content_warning && (
                <div style={{backgroundColor:'#2a2640', borderRadius:'8px', padding:'0.5rem 0.75rem', marginBottom:'0.75rem', fontSize:'0.75rem', color:'#9b98b0'}}>
                  {post.warning_label || 'sensitive content'}
                </div>
              )}

              <p style={{fontSize:'0.9rem', color:'#e8e6f0', lineHeight:'1.75', marginBottom:'1rem'}}>
                {post.content}
              </p>

              <div style={{display:'flex', gap:'0.5rem', alignItems:'center'}}>
                <button
                  onClick={() => handleReaction(post.id, 'hear_you')}
                  style={{fontSize:'0.75rem', color:'#7ec4a0', backgroundColor:'#1a2e24', border:'0.5px solid #2a4a38', padding:'5px 14px', borderRadius:'999px', cursor:'pointer', transition:'all 0.2s'}}
                >
                  I hear you
                </button>
                <button
                  onClick={() => handleReaction(post.id, 'me_too')}
                  style={{fontSize:'0.75rem', color:'#e8a0b4', backgroundColor:'#2e1a24', border:'0.5px solid #4a2a38', padding:'5px 14px', borderRadius:'999px', cursor:'pointer', transition:'all 0.2s'}}
                >
                  Me too
                </button>
                <button
                  onClick={() => handleReport(post.id)}
                  style={{fontSize:'0.7rem', color:'#2a2640', background:'none', border:'none', cursor:'pointer', marginLeft:'auto', transition:'color 0.2s'}}
                >
                  report
                </button>
              </div>
            </div>
          ))}

        </div>

        <div style={{textAlign:'center', padding:'2rem'}}>
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
        @keyframes fadeDown {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.7; transform: scale(0.97); }
        }
      `}</style>

    </main>
  )
}