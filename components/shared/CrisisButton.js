'use client'

import { useEffect, useState } from 'react'
import { getCrisisInfo } from '@/lib/crisis'

export default function CrisisButton() {
  const [crisis, setCrisis] = useState(null)
  const [showDetails, setShowDetails] = useState(false)

  useEffect(() => {
    getCrisisInfo().then(setCrisis)
  }, [])

  return (
    <div style={{textAlign:'center', padding:'2rem 1rem'}}>
      <button
        onClick={() => setShowDetails(!showDetails)}
        style={{fontSize:'0.85rem', color:'#e88080', background:'none', border:'none', cursor:'pointer', fontWeight:'700', letterSpacing:'0.05em', textDecoration:'underline', textUnderlineOffset:'4px'}}
      >
        I NEED HELP RIGHT NOW
      </button>

      {showDetails && crisis && (
        <div style={{marginTop:'1rem', backgroundColor:'#2a1f1f', border:'0.5px solid #e88080', borderRadius:'12px', padding:'1rem', maxWidth:'320px', margin:'1rem auto 0', textAlign:'left'}}>
          <p style={{fontSize:'0.75rem', color:'#e88080', fontWeight:'600', marginBottom:'0.75rem'}}>
            Help in {crisis.country}:
          </p>
          {crisis.lines.map((line, i) => (
            <div key={i} style={{marginBottom:'0.6rem', paddingBottom:'0.6rem', borderBottom: i < crisis.lines.length - 1 ? '0.5px solid #3a2020' : 'none'}}>
              <div style={{fontSize:'0.8rem', color:'#e8e6f0', fontWeight:'500'}}>{line.name}</div>
              <div style={{fontSize:'0.85rem', color:'#e88080', fontWeight:'600'}}>{line.number}</div>
              <div style={{fontSize:'0.7rem', color:'#9b98b0'}}>{line.available}</div>
            </div>
          ))}
          <a href={crisis.url} target="_blank" style={{fontSize:'0.75rem', color:'#9b9be8', textDecoration:'underline', textUnderlineOffset:'3px', display:'block', marginTop:'0.5rem'}}>
            More resources
          </a>
        </div>
      )}
    </div>
  )
}