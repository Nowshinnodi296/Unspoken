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
        style={{background:'none', border:'none', cursor:'pointer', padding:'0.4rem', display:'flex', flexDirection:'column', gap:'4px', justifyContent:'center'}}
      >
        <div style={{width:'20px', height:'2px', backgroundColor:'#9b98b0', borderRadius:'2px'}} />
        <div style={{width:'20px', height:'2px', backgroundColor:'#9b98b0', borderRadius:'2px'}} />
        <div style={{width:'20px', height:'2px', backgroundColor:'#9b98b0', borderRadius:'2px'}} />
      </button>

      {open && (
        <div onClick={() => setOpen(false)} style={{position:'fixed', inset:0, backgroundColor:'rgba(0,0,0,0.6)', zIndex:50, backdropFilter:'blur(4px)'}} />
      )}

      <div style={{position:'fixed', top:0, left:0, height:'100vh', width:'260px', backgroundColor:'#16131f', borderRight:'0.5px solid #2a2640', zIndex:51, display:'flex', flexDirection:'column', transform: open ? 'translateX(0)' : 'translateX(-100%)', transition:'transform 0.3s ease', boxShadow: open ? '8px 0 30px rgba(0,0,0,0.5)' : 'none'}}>

        <div style={{padding:'1.25rem', borderBottom:'0.5px solid #2a2640', display:'flex', justifyContent:'space-between', alignItems:'center'}}>
          <span style={{fontSize:'1rem', fontWeight:'500', color:'#e8e6f0'}}>unspoken</span>
          <button onClick={() => setOpen(false)} style={{background:'none', border:'none', color:'#4a4760', cursor:'pointer', fontSize:'1.2rem'}}>x</button>
        </div>

        <div style={{flex:1, padding:'0.75rem', overflowY:'auto', display:'flex', flexDirection:'column', gap:'0.2rem'}}>

          <div style={{fontSize:'0.65rem', color:'#4a4760', letterSpacing:'0.1em', textTransform:'uppercase', padding:'0.5rem 0.75rem 0.25rem'}}>Wellness</div>

          {[
            { icon:'🫁', label:'Breathe', path:'/wellness' },
            { icon:'🌿', label:'Grounding', path:'/wellness?tab=grounding' },
            { icon:'📓', label:'Journal', path:'/wellness?tab=journal' },
            { icon:'📊', label:'Mood tracker', path:'/wellness?tab=mood' },
            { icon:'🫙', label:'Gratitude jar', path:'/wellness?tab=gratitude' },
            { icon:'⏱', label:'Vent timer', path:'/wellness?tab=vent' },
            { icon:'🎵', label:'Sleep sounds', path:'/wellness?tab=sounds' },
            { icon:'🛡', label:'My safety plan', path:'/wellness?tab=crisis' },
          ].map((item) => (
            <button
              key={item.label}
              onClick={() => { setOpen(false); router.push(item.path) }}
              style={{display:'flex', alignItems:'center', gap:'0.75rem', padding:'0.65rem 0.75rem', borderRadius:'10px', border:'none', backgroundColor:'transparent', color:'#9b98b0', fontSize:'0.875rem', cursor:'pointer', textAlign:'left', width:'100%', transition:'all 0.15s'}}
              onMouseEnter={e => e.currentTarget.style.backgroundColor = '#1e1a2e'}
              onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
            >
              <span style={{fontSize:'1rem', width:'20px', textAlign:'center'}}>{item.icon}</span>
              {item.label}
            </button>
          ))}

          <div style={{height:'0.5px', backgroundColor:'#2a2640', margin:'0.5rem 0'}} />
          <div style={{fontSize:'0.65rem', color:'#4a4760', letterSpacing:'0.1em', textTransform:'uppercase', padding:'0.25rem 0.75rem'}}>Account</div>

          <button
            onClick={toggleTheme}
            style={{display:'flex', alignItems:'center', gap:'0.75rem', padding:'0.65rem 0.75rem', borderRadius:'10px', border:'none', backgroundColor:'transparent', color:'#9b98b0', fontSize:'0.875rem', cursor:'pointer', textAlign:'left', width:'100%'}}
            onMouseEnter={e => e.currentTarget.style.backgroundColor = '#1e1a2e'}
            onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
          >
            <span style={{fontSize:'1rem', width:'20px', textAlign:'center'}}>{isDark ? '☀️' : '🌙'}</span>
            {isDark ? 'Light mode' : 'Dark mode'}
          </button>

          <button
            onClick={() => { setOpen(false); router.push('/settings') }}
            style={{display:'flex', alignItems:'center', gap:'0.75rem', padding:'0.65rem 0.75rem', borderRadius:'10px', border:'none', backgroundColor:'transparent', color:'#9b98b0', fontSize:'0.875rem', cursor:'pointer', textAlign:'left', width:'100%'}}
            onMouseEnter={e => e.currentTarget.style.backgroundColor = '#1e1a2e'}
            onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
          >
            <span style={{fontSize:'1rem', width:'20px', textAlign:'center'}}>⚙️</span>
            Settings
          </button>

          <div style={{height:'0.5px', backgroundColor:'#2a2640', margin:'0.5rem 0'}} />

          <button
            onClick={handleSignOut}
            style={{display:'flex', alignItems:'center', gap:'0.75rem', padding:'0.65rem 0.75rem', borderRadius:'10px', border:'none', backgroundColor:'transparent', color:'#e88080', fontSize:'0.875rem', cursor:'pointer', textAlign:'left', width:'100%'}}
            onMouseEnter={e => e.currentTarget.style.backgroundColor = '#2a1f1f'}
            onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
          >
            <span style={{fontSize:'1rem', width:'20px', textAlign:'center'}}>🚪</span>
            Leave Unspoken
          </button>

        </div>

        <div style={{padding:'1rem 1.25rem', borderTop:'0.5px solid #2a2640', textAlign:'center'}}>
          <a href="https://www.befrienders.org" target="_blank" style={{fontSize:'0.8rem', color:'#e88080', textDecoration:'underline', textUnderlineOffset:'4px', fontWeight:'700', letterSpacing:'0.05em'}}>
            I NEED HELP RIGHT NOW
          </a>
        </div>

      </div>
    </div>
  )
}