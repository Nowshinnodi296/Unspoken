'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'

export default function Wellness() {
  const router = useRouter()
  const canvasRef = useRef(null)
  const [activeTab, setActiveTab] = useState('breathing')
  const [breathingType, setBreathingType] = useState('box')
  const [breathPhase, setBreathPhase] = useState('ready')
  const [breathText, setBreathText] = useState('tap to begin')
  const [breathScale, setBreathScale] = useState(1)
  const [isBreathing, setIsBreathing] = useState(false)
  const [groundingStep, setGroundingStep] = useState(0)
  const [groundingInput, setGroundingInput] = useState('')
  const [groundingAnswers, setGroundingAnswers] = useState([])
  const [journalText, setJournalText] = useState('')
  const [journalSaved, setJournalSaved] = useState(false)
  const breathingRef = useRef(null)

  const journalPrompts = [
    "What was one small thing that was okay today?",
    "What is one thing your body did for you today?",
    "Name something you're looking forward to, even if it's tiny.",
    "What would you tell a friend who felt the way you feel right now?",
    "What is one thing you don't have to do today?",
    "What sound, smell, or texture felt comforting recently?",
    "What is something you survived that you thought you couldn't?",
    "What does rest mean to you right now?",
  ]

  const [prompt] = useState(journalPrompts[Math.floor(Math.random() * journalPrompts.length)])

  const groundingSteps = [
    { count: 5, sense: 'see', emoji: '👁', instruction: 'Name 5 things you can see right now' },
    { count: 4, sense: 'touch', emoji: '🤲', instruction: 'Name 4 things you can physically feel' },
    { count: 3, sense: 'hear', emoji: '👂', instruction: 'Name 3 things you can hear' },
    { count: 2, sense: 'smell', emoji: '👃', instruction: 'Name 2 things you can smell' },
    { count: 1, sense: 'taste', emoji: '👅', instruction: 'Name 1 thing you can taste' },
  ]

  const breathingPatterns = {
    box: { inhale: 4, hold1: 4, exhale: 4, hold2: 4, name: 'Box breathing' },
    '478': { inhale: 4, hold1: 7, exhale: 8, hold2: 0, name: '4-7-8 breathing' },
    calm: { inhale: 4, hold1: 0, exhale: 6, hold2: 0, name: 'Calm breathing' },
  }

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
      speedX: (Math.random() - 0.5) * 0.15,
      speedY: (Math.random() - 0.5) * 0.15,
      opacity: Math.random() * 0.25 + 0.05,
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

  async function startBreathing() {
    if (isBreathing) {
      setIsBreathing(false)
      setBreathPhase('ready')
      setBreathText('tap to begin')
      setBreathScale(1)
      if (breathingRef.current) clearTimeout(breathingRef.current)
      return
    }
    setIsBreathing(true)
    const pattern = breathingPatterns[breathingType]

    async function runCycle() {
      const phases = [
        { phase: 'inhale', text: 'breathe in', duration: pattern.inhale * 1000, scale: 1.4 },
        ...(pattern.hold1 > 0 ? [{ phase: 'hold', text: 'hold', duration: pattern.hold1 * 1000, scale: 1.4 }] : []),
        { phase: 'exhale', text: 'breathe out', duration: pattern.exhale * 1000, scale: 1 },
        ...(pattern.hold2 > 0 ? [{ phase: 'hold2', text: 'hold', duration: pattern.hold2 * 1000, scale: 1 }] : []),
      ]

      for (const p of phases) {
        setBreathPhase(p.phase)
        setBreathText(p.text)
        setBreathScale(p.scale)
        await new Promise(resolve => { breathingRef.current = setTimeout(resolve, p.duration) })
      }
      runCycle()
    }
    runCycle()
  }

  function handleGroundingSubmit() {
    if (!groundingInput.trim()) return
    const current = groundingSteps[groundingStep]
    const newAnswers = [...groundingAnswers, { step: current.sense, answer: groundingInput }]
    setGroundingAnswers(newAnswers)
    setGroundingInput('')
    if (groundingStep < groundingSteps.length - 1) {
      setGroundingStep(groundingStep + 1)
    } else {
      setGroundingStep(5)
    }
  }

  function resetGrounding() {
    setGroundingStep(0)
    setGroundingAnswers([])
    setGroundingInput('')
  }

  function saveJournal() {
    setJournalSaved(true)
    setTimeout(() => setJournalSaved(false), 3000)
  }

  const tabStyle = (tab) => ({
    flex: 1,
    padding: '0.6rem',
    fontSize: '0.8rem',
    fontWeight: activeTab === tab ? '500' : 'normal',
    color: activeTab === tab ? '#9b9be8' : '#4a4760',
    backgroundColor: activeTab === tab ? '#1e1a3e' : 'transparent',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'all 0.2s',
  })

  return (
    <main style={{minHeight:'100vh', backgroundColor:'#0f0d14', color:'#e8e6f0', position:'relative', overflow:'hidden'}}>

      <canvas ref={canvasRef} style={{position:'fixed', top:0, left:0, width:'100%', height:'100%', pointerEvents:'none', zIndex:0}} />

      <div style={{position:'relative', zIndex:1}}>

        {/* Navbar */}
        <nav style={{position:'sticky', top:0, zIndex:10, backgroundColor:'rgba(15,13,20,0.85)', backdropFilter:'blur(12px)', borderBottom:'0.5px solid #2a2640', padding:'1rem 1.5rem', display:'flex', justifyContent:'space-between', alignItems:'center'}}>
          <button onClick={() => router.push('/feed')} style={{background:'none', border:'none', color:'#4a4760', cursor:'pointer', fontSize:'1rem'}}>←</button>
          <h1 style={{fontSize:'1rem', fontWeight:'500', color:'#e8e6f0'}}>wellness tools</h1>
          <a href="https://www.befrienders.org" target="_blank" style={{fontSize:'0.7rem', color:'#e88080', opacity:'0.6', textDecoration:'underline', textUnderlineOffset:'3px'}}>
            need help?
          </a>
        </nav>

        <div style={{maxWidth:'480px', margin:'0 auto', padding:'1.5rem 1rem'}}>

          {/* Tabs */}
          <div style={{display:'flex', gap:'0.4rem', backgroundColor:'#16131f', border:'0.5px solid #2a2640', borderRadius:'12px', padding:'0.4rem', marginBottom:'1.5rem', animation:'fadeSlideUp 0.5s ease forwards'}}>
            <button style={tabStyle('breathing')} onClick={() => setActiveTab('breathing')}>🫁 breathe</button>
            <button style={tabStyle('grounding')} onClick={() => setActiveTab('grounding')}>🌿 ground</button>
            <button style={tabStyle('journal')} onClick={() => setActiveTab('journal')}>📓 journal</button>
          </div>

          {/* Breathing */}
          {activeTab === 'breathing' && (
            <div style={{animation:'fadeSlideUp 0.4s ease forwards'}}>

              {/* Pattern selector */}
              <div style={{display:'flex', gap:'0.5rem', marginBottom:'1.5rem'}}>
                {Object.entries(breathingPatterns).map(([key, val]) => (
                  <button
                    key={key}
                    onClick={() => { setBreathingType(key); setIsBreathing(false); setBreathText('tap to begin'); setBreathScale(1) }}
                    style={{flex:1, fontSize:'0.7rem', padding:'0.5rem', borderRadius:'8px', border: breathingType === key ? '0.5px solid #9b9be8' : '0.5px solid #2a2640', backgroundColor: breathingType === key ? '#1e1a3e' : '#16131f', color: breathingType === key ? '#9b9be8' : '#4a4760', cursor:'pointer', transition:'all 0.2s'}}
                  >
                    {val.name}
                  </button>
                ))}
              </div>

              {/* Breathing circle */}
              <div style={{display:'flex', flexDirection:'column', alignItems:'center', padding:'2rem 0'}}>
                <div
                  onClick={startBreathing}
                  style={{
                    width:'160px',
                    height:'160px',
                    borderRadius:'50%',
                    backgroundColor: breathPhase === 'inhale' ? 'rgba(155,155,232,0.15)' : breathPhase === 'exhale' ? 'rgba(126,196,160,0.15)' : 'rgba(155,155,232,0.08)',
                    border: `1.5px solid ${breathPhase === 'inhale' ? '#9b9be8' : breathPhase === 'exhale' ? '#7ec4a0' : '#2a2640'}`,
                    display:'flex',
                    alignItems:'center',
                    justifyContent:'center',
                    cursor:'pointer',
                    transform:`scale(${breathScale})`,
                    transition:`transform ${breathPhase === 'inhale' ? breathingPatterns[breathingType].inhale : breathingPatterns[breathingType].exhale}s ease`,
                    marginBottom:'1.5rem',
                  }}
                >
                  <span style={{fontSize:'0.8rem', color:'#9b98b0', textAlign:'center', padding:'1rem'}}>
                    {breathText}
                  </span>
                </div>

                <p style={{fontSize:'0.75rem', color:'#4a4760', textAlign:'center'}}>
                  {isBreathing ? 'tap circle to stop' : `${breathingPatterns[breathingType].name} — tap to start`}
                </p>

                {isBreathing && (
                  <div style={{marginTop:'1rem', fontSize:'0.7rem', color:'#4a4760', textAlign:'center', animation:'pulse 2s ease-in-out infinite'}}>
                    follow the circle...
                  </div>
                )}
              </div>

            </div>
          )}

          {/* Grounding */}
          {activeTab === 'grounding' && (
            <div style={{animation:'fadeSlideUp 0.4s ease forwards'}}>
              <div style={{backgroundColor:'rgba(22,19,31,0.9)', border:'0.5px solid #2a2640', borderRadius:'14px', padding:'1.5rem', backdropFilter:'blur(8px)'}}>

                {groundingStep < 5 ? (
                  <>
                    <div style={{textAlign:'center', marginBottom:'1.5rem'}}>
                      <div style={{fontSize:'2rem', marginBottom:'0.5rem'}}>{groundingSteps[groundingStep].emoji}</div>
                      <h2 style={{fontSize:'0.95rem', fontWeight:'500', color:'#e8e6f0', marginBottom:'0.4rem'}}>
                        {groundingSteps[groundingStep].instruction}
                      </h2>
                      <p style={{fontSize:'0.75rem', color:'#4a4760'}}>
                        step {groundingStep + 1} of 5
                      </p>
                    </div>

                    {/* Previous answers */}
                    {groundingAnswers.length > 0 && (
                      <div style={{marginBottom:'1rem', display:'flex', flexDirection:'column', gap:'0.4rem'}}>
                        {groundingAnswers.map((a, i) => (
                          <div key={i} style={{fontSize:'0.75rem', color:'#4a4760', padding:'0.4rem 0.75rem', backgroundColor:'#1e1a2e', borderRadius:'8px'}}>
                            ✓ {a.answer}
                          </div>
                        ))}
                      </div>
                    )}

                    <div style={{display:'flex', gap:'0.5rem'}}>
                      <input
                        type="text"
                        placeholder={`something you can ${groundingSteps[groundingStep].sense}...`}
                        value={groundingInput}
                        onChange={e => setGroundingInput(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && handleGroundingSubmit()}
                        style={{flex:1, backgroundColor:'#1e1a2e', border:'0.5px solid #2a2640', borderRadius:'8px', padding:'0.65rem 0.85rem', fontSize:'0.875rem', color:'#e8e6f0', outline:'none'}}
                        autoFocus
                      />
                      <button
                        onClick={handleGroundingSubmit}
                        style={{backgroundColor:'#9b9be8', color:'#0f0d14', border:'none', borderRadius:'8px', padding:'0.65rem 1rem', fontSize:'0.875rem', fontWeight:'500', cursor:'pointer'}}
                      >
                        →
                      </button>
                    </div>
                  </>
                ) : (
                  <div style={{textAlign:'center', padding:'1rem'}}>
                    <div style={{fontSize:'2rem', marginBottom:'1rem'}}>🌿</div>
                    <h2 style={{fontSize:'1rem', fontWeight:'500', color:'#e8e6f0', marginBottom:'0.5rem'}}>
                      You made it through.
                    </h2>
                    <p style={{fontSize:'0.8rem', color:'#9b98b0', lineHeight:'1.6', marginBottom:'1.5rem'}}>
                      Grounding complete. You are here. You are safe.
                    </p>
                    <div style={{display:'flex', flexDirection:'column', gap:'0.4rem', marginBottom:'1.25rem'}}>
                      {groundingAnswers.map((a, i) => (
                        <div key={i} style={{fontSize:'0.75rem', color:'#7ec4a0', padding:'0.4rem 0.75rem', backgroundColor:'#1a2e24', borderRadius:'8px', textAlign:'left'}}>
                          ✓ {a.answer}
                        </div>
                      ))}
                    </div>
                    <button
                      onClick={resetGrounding}
                      style={{fontSize:'0.8rem', color:'#4a4760', background:'none', border:'0.5px solid #2a2640', borderRadius:'8px', padding:'0.6rem 1.25rem', cursor:'pointer'}}
                    >
                      do it again
                    </button>
                  </div>
                )}

              </div>
            </div>
          )}

          {/* Journal */}
          {activeTab === 'journal' && (
            <div style={{animation:'fadeSlideUp 0.4s ease forwards'}}>
              <div style={{backgroundColor:'rgba(22,19,31,0.9)', border:'0.5px solid #2a2640', borderRadius:'14px', padding:'1.5rem', backdropFilter:'blur(8px)', display:'flex', flexDirection:'column', gap:'1.25rem'}}>

                <div style={{backgroundColor:'#1e1a2e', borderRadius:'10px', padding:'1rem', borderLeft:'2px solid #9b9be8'}}>
                  <p style={{fontSize:'0.85rem', color:'#9b98b0', lineHeight:'1.6', fontStyle:'italic'}}>
                    {prompt}
                  </p>
                </div>

                <textarea
                  placeholder="write whatever comes to mind... this stays with you"
                  value={journalText}
                  onChange={e => setJournalText(e.target.value)}
                  rows={7}
                  style={{backgroundColor:'#1e1a2e', border:'0.5px solid #2a2640', borderRadius:'10px', padding:'0.85rem 1rem', fontSize:'0.875rem', color:'#e8e6f0', outline:'none', resize:'none', lineHeight:'1.7', fontFamily:'inherit'}}
                />

                <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
                  <span style={{fontSize:'0.7rem', color:'#4a4760'}}>
                    {journalText.length > 0 ? `${journalText.length} characters` : 'no pressure — just write'}
                  </span>
                  <button
                    onClick={saveJournal}
                    disabled={!journalText.trim()}
                    style={{fontSize:'0.8rem', backgroundColor: journalText.trim() ? '#9b9be8' : '#2a2640', color: journalText.trim() ? '#0f0d14' : '#4a4760', border:'none', borderRadius:'8px', padding:'0.6rem 1.25rem', cursor: journalText.trim() ? 'pointer' : 'not-allowed', transition:'all 0.2s'}}
                  >
                    {journalSaved ? '✓ saved' : 'save'}
                  </button>
                </div>

                {journalSaved && (
                  <p style={{fontSize:'0.75rem', color:'#7ec4a0', textAlign:'center', animation:'fadeSlideUp 0.3s ease forwards'}}>
                    saved privately. only you can see this.
                  </p>
                )}

              </div>
            </div>
          )}

        </div>

        {/* Crisis */}
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
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
        input::placeholder { color: #4a4760; }
        textarea::placeholder { color: #4a4760; }
        input:focus { border-color: #9b9be8 !important; }
        textarea:focus { border-color: #9b9be8 !important; }
      `}</style>

    </main>
  )
}