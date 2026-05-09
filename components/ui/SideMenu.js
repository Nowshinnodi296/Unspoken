'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export default function SideMenu({ isDark, toggleTheme }) {
  const router = useRouter()
  const [open, setOpen] = useState(false)

  async function handleSignOut() {
    await supabase.auth.signOut()
    router.push('/')
  }

  return (
    <div>
      <button
        onClick={() => setOpen(true)}
        style={{background:'#16131f', border:'0.5px solid #2a2640', borderRadius:'8px', padding:'0.45rem 0.75rem', cursor:'pointer', fontSize:'1.1rem', color:'#9b98b0', letterSpacing:'0.1em'}}
      >
        ···
      </button>

      {open && (
        <div
          onClick={() => setOpen(false)}
          style={{position:'fixed', inset:0, backgroundColor:'rgba(0,0,0,0.5)', zIndex:50, backdropFilter:'blur(4px)'}}
        />
      )}

      <div style={{position:'fixed', top:0, right:0, height:'100vh', width:'260px', backgroundColor:'#16131f', borderLeft:'0.5px solid #2a2640', zIndex:51, padding:'1.5rem 1.25rem', display:'flex', flexDirection:'column', gap:'0.4rem', transform: open ? 'translateX(0)' : 'translateX(100%)', transition:'transform 0.3s ease', boxShadow: open ? '-8px 0 30px rgba(0,0,0,0.4)' : 'none'}}>

        <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'1rem', paddingBottom:'1rem', borderBottom:'0.5px solid #2a2640'}}>
          <span style={{fontSize:'0.9rem', fontWeight:'500', color:'#e8e6f0'}}>unspoken</span>
          <button onClick={() => setOpen(false)} style={{background:'none', border:'none', color:'#4a4760', cursor:'pointer', fontSize:'1.2rem', padding:'0.25rem'}}>
            x
          </button>
        </div>

        {[
          { icon: '🫁', label: 'Breathe', path: '/wellness' },
          { icon: '🎵', label: 'Sleep sounds', path: '/wellness?tab=sounds' },
          { icon: '📊', label: 'Mood tracker', path: '/wellness?tab=mood' },
          { icon: '🫙', label: 'Gratitude jar', path: '/wellness?tab=gratitude' },
          { icon: '⏱', label: 'Vent timer', path: '/wellness?tab=vent' },
          { icon: '🛡', label: 'Crisis plan', path: '/wellness?tab=crisis' },
        ].map((item) => (
          <button
            key={item.label}
            onClick={() => { setOpen(false); router.push(item.path) }}
            style={{display:'flex', alignItems:'center', gap:'0.85rem', padding:'0.75rem 0.85rem', borderRadius:'10px', border:'none', backgroundColor:'transparent', color:'#9b98b0', fontSize:'0.875rem', cursor:'pointer', textAlign:'left', width:'100%', transition:'all 0.15s'}}
            onMouseEnter={e => e.currentTarget.style.backgroundColor = '#1e1a2e'}
            onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
          >
            <span style={{fontSize:'1.1rem'}}>{item.icon}</span>
            {item.label}
          </button>
        ))}

        <div style={{height:'0.5px', backgroundColor:'#2a2640', margin:'0.5rem 0'}} />

        <button
          onClick={toggleTheme}
          style={{display:'flex', alignItems:'center', gap:'0.85rem', padding:'0.75rem 0.85rem', borderRadius:'10px', border:'none', backgroundColor:'transparent', color:'#9b98b0', fontSize:'0.875rem', cursor:'pointer', textAlign:'left', width:'100%'}}
          onMouseEnter={e => e.currentTarget.style.backgroundColor = '#1e1a2e'}
          onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
        >
          <span style={{fontSize:'1.1rem'}}>{isDark ? '☀️' : '🌙'}</span>
          {isDark ? 'Light mode' : 'Dark mode'}
        </button>

        <button
          onClick={() => { setOpen(false); router.push('/settings') }}
          style={{display:'flex', alignItems:'center', gap:'0.85rem', padding:'0.75rem 0.85rem', borderRadius:'10px', border:'none', backgroundColor:'transparent', color:'#9b98b0', fontSize:'0.875rem', cursor:'pointer', textAlign:'left', width:'100%'}}
          onMouseEnter={e => e.currentTarget.style.backgroundColor = '#1e1a2e'}
          onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
        >
          <span style={{fontSize:'1.1rem'}}>⚙️</span>
          Settings
        </button>

        <div style={{height:'0.5px', backgroundColor:'#2a2640', margin:'0.5rem 0'}} />

        <button
          onClick={handleSignOut}
          style={{display:'flex', alignItems:'center', gap:'0.85rem', padding:'0.75rem 0.85rem', borderRadius:'10px', border:'none', backgroundColor:'transparent', color:'#e88080', fontSize:'0.875rem', cursor:'pointer', textAlign:'left', width:'100%'}}
          onMouseEnter={e => e.currentTarget.style.backgroundColor = '#2a1f1f'}
          onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
        >
          <span style={{fontSize:'1.1rem'}}>🚪</span>
          Leave
        </button>

        <div style={{marginTop:'auto', paddingTop:'1rem', borderTop:'0.5px solid #2a2640', textAlign:'center'}}>
          <a href="https://www.befrienders.org" target="_blank" style={{fontSize:'0.8rem', color:'#e88080', textDecoration:'underline', textUnderlineOffset:'4px', fontWeight:'700', letterSpacing:'0.01em'}}>
            I NEED HELP RIGHT NOW
          </a>
        </div>

      </div>
    </div>
  )
}