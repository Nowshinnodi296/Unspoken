'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export default function Feed() {
  const router = useRouter()
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState(null)

  useEffect(() => {
    async function loadFeed() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/auth/login'); return }
      setUser(user)

      const { data: posts } = await supabase
        .from('posts')
        .select('*, spaces(name, emoji)')
        .eq('is_removed', false)
        .order('created_at', { ascending: false })
        .limit(30)

      setPosts(posts || [])
      setLoading(false)
    }
    loadFeed()
  }, [])

  async function handleReaction(postId, type) {
    if (!user) return
    const { data: existing } = await supabase
      .from('reactions')
      .select('id')
      .eq('post_id', postId)
      .eq('user_id', user.id)
      .eq('type', type)
      .single()

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

  return (
    <main style={{minHeight:'100vh', backgroundColor:'#0f0d14', color:'#e8e6f0'}}>

      {/* Navbar */}
      <nav style={{position:'sticky', top:0, zIndex:10, backgroundColor:'#0f0d14', borderBottom:'0.5px solid #2a2640', padding:'1rem 1.5rem', display:'flex', justifyContent:'space-between', alignItems:'center'}}>
        <h1 style={{fontSize:'1.25rem', fontWeight:'500', color:'#e8e6f0'}}>unspoken</h1>
        <div style={{display:'flex', gap:'0.75rem', alignItems:'center'}}>
          <a href="/post/new" style={{fontSize:'0.8rem', backgroundColor:'#9b9be8', color:'#0f0d14', padding:'0.5rem 1rem', borderRadius:'8px', textDecoration:'none', fontWeight:'500'}}>
            + Post
          </a>
          <button onClick={handleSignOut} style={{fontSize:'0.8rem', color:'#4a4760', background:'none', border:'none', cursor:'pointer'}}>
            Leave
          </button>
        </div>
      </nav>

      {/* Feed */}
      <div style={{maxWidth:'560px', margin:'0 auto', padding:'1.5rem 1rem'}}>

        {loading && (
          <div style={{textAlign:'center', color:'#4a4760', padding:'3rem', fontSize:'0.875rem'}}>
            loading...
          </div>
        )}

        {!loading && posts.length === 0 && (
          <div style={{textAlign:'center', padding:'3rem', animation:'fadeSlideUp 0.8s ease forwards'}}>
            <p style={{color:'#4a4760', fontSize:'0.875rem', lineHeight:'1.8'}}>
              No posts yet. Be the first to say something.
            </p>
            <a href="/post/new" style={{display:'inline-block', marginTop:'1rem', fontSize:'0.8rem', color:'#9b9be8', textDecoration:'underline', textUnderlineOffset:'4px'}}>
              Write something
            </a>
          </div>
        )}

        {posts.map((post, i) => (
          <div
            key={post.id}
            style={{
              backgroundColor:'#16131f',
              border:'0.5px solid #2a2640',
              borderRadius:'14px',
              padding:'1.25rem',
              marginBottom:'0.75rem',
              animation:`fadeSlideUp ${0.3 + i * 0.05}s ease forwards`,
              opacity:0,
            }}
          >
            {/* Space + time */}
            <div style={{display:'flex', justifyContent:'space-between', marginBottom:'0.75rem'}}>
              <span style={{fontSize:'0.7rem', color:'#4a4760'}}>
                {post.spaces?.emoji} {post.spaces?.name}
              </span>
              <span style={{fontSize:'0.7rem', color:'#4a4760'}}>
                {new Date(post.created_at).toLocaleDateString()}
              </span>
            </div>

            {/* Content warning */}
            {post.has_content_warning && (
              <div style={{backgroundColor:'#2a2640', borderRadius:'8px', padding:'0.5rem 0.75rem', marginBottom:'0.75rem', fontSize:'0.75rem', color:'#9b98b0'}}>
                ⚠️ {post.warning_label || 'sensitive content'}
              </div>
            )}

            {/* Post content */}
            <p style={{fontSize:'0.9rem', color:'#e8e6f0', lineHeight:'1.7', marginBottom:'1rem'}}>
              {post.content}
            </p>

            {/* Reactions */}
            <div style={{display:'flex', gap:'0.5rem'}}>
              <button
                onClick={() => handleReaction(post.id, 'hear_you')}
                style={{fontSize:'0.75rem', color:'#7ec4a0', backgroundColor:'#1a2e24', border:'0.5px solid #2a4a38', padding:'5px 12px', borderRadius:'999px', cursor:'pointer', transition:'all 0.2s'}}
              >
                I hear you
              </button>
              <button
                onClick={() => handleReaction(post.id, 'me_too')}
                style={{fontSize:'0.75rem', color:'#e8a0b4', backgroundColor:'#2e1a24', border:'0.5px solid #4a2a38', padding:'5px 12px', borderRadius:'999px', cursor:'pointer', transition:'all 0.2s'}}
              >
                Me too
              </button>
              <button
                onClick={() => {
                  if (confirm('Report this post?')) {
                    supabase.from('reports').insert({ post_id: post.id, reporter_user_id: user.id, reason: 'reported by user' })
                  }
                }}
                style={{fontSize:'0.7rem', color:'#4a4760', background:'none', border:'none', cursor:'pointer', marginLeft:'auto'}}
              >
                report
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Crisis button */}
      <div style={{textAlign:'center', padding:'2rem'}}>
        <a href="https://www.befrienders.org" target="_blank" style={{fontSize:'0.75rem', color:'#e88080', opacity:'0.5', textDecoration:'underline', textUnderlineOffset:'4px'}}>
          I need help right now
        </a>
      </div>

      <style>{`
        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>

    </main>
  )
}