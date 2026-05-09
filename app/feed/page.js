'use client'

import { useEffect, useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import SideMenu from '@/components/ui/SideMenu'

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

export default function Feed() {
  const router = useRouter()
  const canvasRef = useRef(null)
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState(null)
  const [pseudonym, setPseudonym] = useState('')
  const [isDark, setIsDark] = useState(true)

  const [quickContent, setQuickContent] = useState('')
  const [quickSpace, setQuickSpace] = useState(null)
  const [quickPosting, setQuickPosting] = useState(false)
  const [showSpacePicker, setShowSpacePicker] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)

  function toggleTheme() {
    const newTheme = !isDark
    setIsDark(newTheme)
    localStorage.setItem('unspoken-theme', newTheme ? 'dark' : 'light')
  }

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

  async function loadFeed() {
    const { data } = await supabase
      .from('posts')
      .select('*, spaces(name, emoji), reactions(id, type, user_id)')
      .eq('is_removed', false)
      .order('created_at', { ascending: false })
      .limit(30)
    setPosts(data || [])
  }

  useEffect(() => {
    async function init() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/auth/login'); return }
      setUser(user)
      const { data: profile } = await supabase.from('users').select('pseudonym').eq('id', user.id).single()
      if (profile) setPseudonym(profile.pseudonym)
      await loadFeed()
      setLoading(false)
    }
    init()
  }, [router])

  async function handleQuickPost() {
    if (!quickContent.trim() || !quickSpace) return
    setQuickPosting(true)
    await supabase.from('posts').insert({
      user_id: user.id,
      space_id: quickSpace,
      content: quickContent.trim(),
      has_content_warning: false,
    })
    setQuickContent('')
    setQuickSpace(null)
    setIsExpanded(false)
    setShowSpacePicker(false)
    setQuickPosting(false)
    await loadFeed()
  }

  async function handleReaction(postId, type) {
    if (!user) return
    const { data: existing } = await supabase
      .from('reactions').select('id')
      .eq('post_id', postId).eq('user_id', user.id).eq('type', type)
      .maybeSingle()
    if (existing) {
      await supabase.from('reactions').delete().eq('id', existing.id)
    } else {
      await supabase.from('reactions').insert({ post_id: postId, user_id: user.id, type })
    }
    await loadFeed()
  }

  async function handleReport(postId) {
    if (!user) return
    const confirmed = window.confirm('Report this post?')
    if (confirmed) {
      await supabase.from('reports').insert({ post_id: postId, reporter_user_id: user.id, reason: 'reported by user' })
      alert('Post reported. Our team will review it.')
    }
  }

  function hearYouCount(post) { return post.reactions?.filter(r => r.type === 'hear_you').length || 0 }
  function meTooCount(post) { return post.reactions?.filter(r => r.type === 'me_too').length || 0 }
  function userReacted(post, type) { return post.reactions?.some(r => r.user_id === user?.id && r.type === type) }

  const selectedSpace = spaces.find(s => s.id === quickSpace)

  return (
    <main style={{minHeight:'100vh', backgroundColor:'#0f0d14', color:'#e8e6f0', position:'relative', overflow:'hidden'}}>

      <canvas ref={canvasRef} style={{position:'fixed', top:0, left:0, width:'100%', height:'100%', pointerEvents:'none', zIndex:0}} />

      <div style={{position:'relative', zIndex:1}}>

        <nav style={{position:'sticky', top:0, zIndex:10, backgroundColor:'rgba(15,13,20,0.92)', backdropFilter:'blur(12px)', borderBottom:'0.5px solid #2a2640', padding:'0.85rem 1.5rem', display:'flex', justifyContent:'space-between', alignItems:'center', animation:'fadeDown 0.6s ease forwards'}}>
          <h1 style={{fontSize:'1.25rem', fontWeight:'500', color:'#e8e6f0'}}>unspoken</h1>
          <SideMenu isDark={isDark} toggleTheme={toggleTheme} />
        </nav>

        <div style={{maxWidth:'560px', margin:'0 auto', padding:'1.25rem 1rem'}}>

          {/* Quick post box */}
          <div style={{backgroundColor:'rgba(22,19,31,0.95)', border:'0.5px solid #2a2640', borderRadius:'16px', padding:'1rem 1.25rem', marginBottom:'1.25rem', backdropFilter:'blur(8px)', animation:'fadeSlideUp 0.5s ease forwards'}}>

            <div style={{display:'flex', alignItems:'center', gap:'0.85rem'}}>
              <div style={{width:'36px', height:'36px', borderRadius:'50%', backgroundColor:'#1e1a3e', border:'0.5px solid #9b9be8', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0}}>
                <span style={{fontSize:'0.7rem', color:'#9b9be8'}}>{pseudonym ? pseudonym[0].toUpperCase() : '?'}</span>
              </div>
              <div
                onClick={() => setIsExpanded(true)}
                style={{flex:1, backgroundColor:'#1e1a2e', border:'0.5px solid #2a2640', borderRadius:'999px', padding:'0.6rem 1rem', fontSize:'0.875rem', color:'#4a4760', cursor: isExpanded ? 'default' : 'pointer'}}
              >
                {!isExpanded && "something on your mind?"}
              </div>
            </div>

            {isExpanded && (
              <div style={{marginTop:'0.85rem', animation:'fadeSlideUp 0.3s ease forwards'}}>
                <textarea
                  placeholder="say what you feel. no one knows it's you."
                  value={quickContent}
                  onChange={e => setQuickContent(e.target.value)}
                  rows={3}
                  autoFocus
                  style={{width:'100%', backgroundColor:'#1e1a2e', border:'0.5px solid #2a2640', borderRadius:'10px', padding:'0.75rem 1rem', fontSize:'0.9rem', color:'#e8e6f0', outline:'none', resize:'none', lineHeight:'1.6', fontFamily:'inherit', marginBottom:'0.75rem', boxSizing:'border-box'}}
                />

                <button
                  onClick={() => setShowSpacePicker(!showSpacePicker)}
                  style={{fontSize:'0.78rem', color: selectedSpace ? '#9b9be8' : '#9b98b0', backgroundColor: selectedSpace ? '#1e1a3e' : '#1e1a2e', border: selectedSpace ? '0.5px solid #9b9be8' : '0.5px solid #2a2640', borderRadius:'8px', padding:'0.45rem 0.85rem', cursor:'pointer', marginBottom: showSpacePicker ? '0.75rem' : '0', transition:'all 0.2s'}}
                >
                  {selectedSpace ? `${selectedSpace.emoji} ${selectedSpace.name}` : '+ pick a space'}
                </button>

                {showSpacePicker && (
                  <div style={{display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:'0.4rem', marginBottom:'0.75rem'}}>
                    {spaces.map(space => (
                      <button
                        key={space.id}
                        onClick={() => { setQuickSpace(space.id); setShowSpacePicker(false) }}
                        style={{backgroundColor: quickSpace === space.id ? '#1e1a3e' : '#1e1a2e', border: quickSpace === space.id ? '0.5px solid #9b9be8' : '0.5px solid #2a2640', borderRadius:'8px', padding:'0.5rem', display:'flex', alignItems:'center', gap:'0.4rem', cursor:'pointer', transition:'all 0.15s'}}
                      >
                        <span style={{fontSize:'0.85rem'}}>{space.emoji}</span>
                        <span style={{fontSize:'0.68rem', color: quickSpace === space.id ? '#9b9be8' : '#9b98b0', textAlign:'left', lineHeight:'1.3'}}>{space.name}</span>
                      </button>
                    ))}
                  </div>
                )}

                <div style={{display:'flex', gap:'0.5rem', justifyContent:'flex-end'}}>
                  <button onClick={() => { setIsExpanded(false); setQuickContent(''); setQuickSpace(null); setShowSpacePicker(false) }} style={{fontSize:'0.78rem', color:'#4a4760', background:'none', border:'none', cursor:'pointer', padding:'0.5rem 0.75rem'}}>
                    cancel
                  </button>
                  <button
                    onClick={handleQuickPost}
                    disabled={!quickContent.trim() || !quickSpace || quickPosting}
                    style={{fontSize:'0.78rem', fontWeight:'500', backgroundColor: quickContent.trim() && quickSpace ? '#9b9be8' : '#2a2640', color: quickContent.trim() && quickSpace ? '#0f0d14' : '#4a4760', border:'none', borderRadius:'8px', padding:'0.5rem 1.25rem', cursor: quickContent.trim() && quickSpace ? 'pointer' : 'not-allowed', transition:'all 0.2s'}}
                  >
                    {quickPosting ? 'posting...' : 'post anonymously'}
                  </button>
                </div>
              </div>
            )}

            {!isExpanded && (
              <div style={{display:'flex', gap:'0.5rem', marginTop:'0.85rem', paddingTop:'0.85rem', borderTop:'0.5px solid #2a2640'}}>
                {[
                  { emoji:'🌙', label:"can't sleep", id:1 },
                  { emoji:'🌊', label:'anxiety', id:3 },
                  { emoji:'🌱', label:'small win', id:4 },
                  { emoji:'🪐', label:'lonely', id:8 },
                ].map(s => (
                  <button
                    key={s.id}
                    onClick={() => { setIsExpanded(true); setQuickSpace(s.id) }}
                    style={{flex:1, fontSize:'0.75rem', color:'#9b98b0', backgroundColor:'#1e1a2e', border:'0.5px solid #2a2640', borderRadius:'8px', padding:'0.45rem 0.25rem', cursor:'pointer', transition:'all 0.2s', display:'flex', alignItems:'center', justifyContent:'center', gap:'0.3rem'}}
                  >
                    <span>{s.emoji}</span>
                  </button>
                ))}
                <button onClick={() => setIsExpanded(true)} style={{flex:1, fontSize:'0.7rem', color:'#9b98b0', backgroundColor:'#1e1a2e', border:'0.5px solid #2a2640', borderRadius:'8px', padding:'0.45rem 0.25rem', cursor:'pointer'}}>
                  ···
                </button>
              </div>
            )}
          </div>

          {loading && (
            <div style={{textAlign:'center', color:'#4a4760', padding:'4rem', fontSize:'0.875rem'}}>
              <div style={{fontSize:'1.5rem', marginBottom:'0.75rem', animation:'pulse 2s ease-in-out infinite'}}>🌙</div>
              loading...
            </div>
          )}

          {!loading && posts.length === 0 && (
            <div style={{textAlign:'center', padding:'4rem'}}>
              <p style={{color:'#4a4760', fontSize:'0.875rem', lineHeight:'1.8'}}>No posts yet. Be the first to say something.</p>
            </div>
          )}

          {posts.map((post, i) => (
            <div key={post.id} style={{backgroundColor:'rgba(22,19,31,0.9)', border:'0.5px solid #2a2640', borderRadius:'14px', padding:'1.25rem', marginBottom:'0.75rem', backdropFilter:'blur(8px)', animation:`fadeSlideUp 0.5s ease ${i * 0.07}s forwards`, opacity:0}}>

              <div style={{display:'flex', justifyContent:'space-between', marginBottom:'0.75rem'}}>
                <span style={{fontSize:'0.7rem', color:'#4a4760'}}>{post.spaces?.emoji} {post.spaces?.name}</span>
                <span style={{fontSize:'0.7rem', color:'#4a4760'}}>{new Date(post.created_at).toLocaleDateString()}</span>
              </div>

              {post.has_content_warning && (
                <div style={{backgroundColor:'#2a2640', borderRadius:'8px', padding:'0.5rem 0.75rem', marginBottom:'0.75rem', fontSize:'0.75rem', color:'#9b98b0'}}>
                  {post.warning_label || 'sensitive content'}
                </div>
              )}

              <p style={{fontSize:'0.9rem', color:'#e8e6f0', lineHeight:'1.75', marginBottom:'1rem'}}>{post.content}</p>

              <div style={{display:'flex', gap:'0.5rem', alignItems:'center'}}>
                <button onClick={() => handleReaction(post.id, 'hear_you')}
                  style={{fontSize:'0.75rem', color: userReacted(post, 'hear_you') ? '#0f0d14' : '#7ec4a0', backgroundColor: userReacted(post, 'hear_you') ? '#7ec4a0' : '#1a2e24', border:'0.5px solid #2a4a38', padding:'5px 14px', borderRadius:'999px', cursor:'pointer', transition:'all 0.2s', fontWeight: userReacted(post, 'hear_you') ? '500' : 'normal'}}>
                  I hear you {hearYouCount(post) > 0 && `· ${hearYouCount(post)}`}
                </button>
                <button onClick={() => handleReaction(post.id, 'me_too')}
                  style={{fontSize:'0.75rem', color: userReacted(post, 'me_too') ? '#0f0d14' : '#e8a0b4', backgroundColor: userReacted(post, 'me_too') ? '#e8a0b4' : '#2e1a24', border:'0.5px solid #4a2a38', padding:'5px 14px', borderRadius:'999px', cursor:'pointer', transition:'all 0.2s', fontWeight: userReacted(post, 'me_too') ? '500' : 'normal'}}>
                  Me too {meTooCount(post) > 0 && `· ${meTooCount(post)}`}
                </button>
                <button onClick={() => handleReport(post.id)}
                  style={{fontSize:'0.7rem', color:'#2a2640', background:'none', border:'none', cursor:'pointer', marginLeft:'auto', transition:'color 0.2s'}}
                  onMouseEnter={e => e.target.style.color = '#4a4760'}
                  onMouseLeave={e => e.target.style.color = '#2a2640'}>
                  report
                </button>
              </div>
            </div>
          ))}

        </div>

        <div style={{textAlign:'center', padding:'2rem'}}>
          <a href="https://www.befrienders.org" target="_blank" style={{fontSize:'0.8rem', color:'#e88080', fontWeight:'700', textDecoration:'underline', textUnderlineOffset:'4px', letterSpacing:'0.02em'}}>
            I NEED HELP RIGHT NOW
          </a>
        </div>

      </div>

      <style>{`
        @keyframes fadeSlideUp { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes fadeDown { from { opacity: 0; transform: translateY(-10px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes pulse { 0%, 100% { opacity: 1; transform: scale(1); } 50% { opacity: 0.7; transform: scale(0.97); } }
        textarea::placeholder { color: #4a4760; }
        textarea:focus { border-color: #9b9be8 !important; box-shadow: 0 0 0 3px rgba(155,155,232,0.08); }
      `}</style>

    </main>
  )
}