'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Suspense } from 'react'

function WellnessContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const canvasRef = useRef(null)
  const [activeTab, setActiveTab] = useState(searchParams.get('tab') || 'breathing')

  // Breathing
  const [breathingType, setBreathingType] = useState('box')
  const [breathPhase, setBreathPhase] = useState('ready')
  const [breathText, setBreathText] = useState('tap to begin')
  const [breathScale, setBreathScale] = useState(1)
  const [isBreathing, setIsBreathing] = useState(false)
  const breathingRef = useRef(null)

  // Grounding
  const [groundingStep, setGroundingStep] = useState(0)
  const [groundingInput, setGroundingInput] = useState('')
  const [groundingAnswers, setGroundingAnswers] = useState([])

  // Journal
  const [journalText, setJournalText] = useState('')
  const [journalSaved, setJournalSaved] = useState(false)

  // Mood tracker
  const [todayMood, setTodayMood] = useState(null)
  const [moodSaved, setMoodSaved] = useState(false)

  // Gratitude jar
  const [gratitudeText, setGratitudeText] = useState('')
  const [gratitudeList, setGratitudeList] = useState([])
  const [gratitudeSaved, setGratitudeSaved] = useState(false)

  // Vent timer
  const [ventText, setVentText] = useState('')
  const [ventTimeLeft, setVentTimeLeft] = useState(300)
  const [ventStarted, setVentStarted] = useState(false)
  const [ventDone, setVentDone] = useState(false)
  const ventRef = useRef(null)

  // Sleep sounds
  const [playingSound, setPlayingSound] = useState(null)
  const audioRef = useRef(null)

  // Crisis plan
  const [crisisPlan, setCrisisPlan] = useState({
    warning: '',
    people: '',
    activities: '',
    hotline: '',
    safe: '',
  })
  const [crisisSaved, setCrisisSaved] = useState(false)

  const journalPrompts = [
    "What was one small thing that was okay today?",
    "What is one thing your body did for you today?",
    "Name something you are looking forward to, even if it is tiny.",
    "What would you tell a friend who felt the way you feel right now?",
    "What is one thing you do not have to do today?",
    "What sound, smell, or texture felt comforting recently?",
  ]
  const [prompt] = useState(journalPrompts[Math.floor(Math.random() * journalPrompts.length)])

  const groundingSteps = [
    { sense: 'see', emoji: '👁', instruction: 'Name 5 things you can see right now' },
    { sense: 'touch', emoji: '🤲', instruction: 'Name 4 things you can physically feel' },
    { sense: 'hear', emoji: '👂', instruction: 'Name 3 things you can hear' },
    { sense: 'smell', emoji: '👃', instruction: 'Name 2 things you can smell' },
    { sense: 'taste', emoji: '👅', instruction: 'Name 1 thing you can taste' },
  ]

  const breathingPatterns = {
    box: { inhale: 4, hold1: 4, exhale: 4, hold2: 4, name: 'Box' },
    calm: { inhale: 4, hold1: 0, exhale: 6, hold2: 0, name: 'Calm' },
    deep: { inhale: 5, hold1: 2, exhale: 7, hold2: 0, name: 'Deep' },
  }

  const sounds = [
    { id: 'rain', label: 'Rain', emoji: '🌧', url: 'https://cdn.pixabay.com/audio/2022/03/10/audio_6ac0d3a4f4.mp3' },
    { id: 'forest', label: 'Forest', emoji: '🌲', url: 'https://cdn.pixabay.com/audio/2021/09/06/audio_6f446b5e9f.mp3' },
    { id: 'waves', label: 'Waves', emoji: '🌊', url: 'https://cdn.pixabay.com/audio/2022/01/18/audio_d0c6ff1bce.mp3' },
    { id: 'white', label: 'White noise', emoji: '🤍', url: 'https://cdn.pixabay.com/audio/2022/03/10/audio_270f49d430.mp3' },
    { id: 'fire', label: 'Fireplace', emoji: '🔥', url: 'https://cdn.pixabay.com/audio/2022/03/23/audio_6ec15e5053.mp3' },
  ]

  const moods = [
    { score: 1, emoji: '😶', label: 'numb' },
    { score: 2, emoji: '😔', label: 'low' },
    { score: 3, emoji: '😐', label: 'okay' },
    { score: 4, emoji: '🙂', label: 'alright' },
    { score: 5, emoji: '😊', label: 'good' },
  ]

  // Load saved data
  useEffect(() => {
    const saved = localStorage.getItem('unspoken-gratitude')
    if (saved) setGratitudeList(JSON.parse(saved))
    const savedCrisis = localStorage.getItem('unspoken-crisis-plan')
    if (savedCrisis) setCrisisPlan(JSON.parse(savedCrisis))
  }, [])

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

  // Vent timer
  useEffect(() => {
    if (ventStarted && ventTimeLeft > 0) {
      ventRef.current = setInterval(() => {
        setVentTimeLeft(t => {
          if (t <= 1) {
            clearInterval(ventRef.current)
            setVentDone(true)
            setVentStarted(false)
            return 0
          }
          return t - 1
        })
      }, 1000)
    }
    return () => clearInterval(ventRef.current)
  }, [ventStarted])

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
    const newAnswers = [...groundingAnswers, { step: groundingSteps[groundingStep].sense, answer: groundingInput }]
    setGroundingAnswers(newAnswers)
    setGroundingInput('')
    if (groundingStep < groundingSteps.length - 1) {
      setGroundingStep(groundingStep + 1)
    } else {
      setGroundingStep(5)
    }
  }

  function saveJournal() {
    setJournalSaved(true)
    setTimeout(() => setJournalSaved(false), 3000)
  }

  function saveMood() {
    setMoodSaved(true)
    setTimeout(() => setMoodSaved(false), 3000)
  }

  function addGratitude() {
    if (!gratitudeText.trim()) return
    const newList = [{ text: gratitudeText, date: new Date().toLocaleDateString() }, ...gratitudeList].slice(0, 30)
    setGratitudeList(newList)
    localStorage.setItem('unspoken-gratitude', JSON.stringify(newList))
    setGratitudeText('')
    setGratitudeSaved(true)
    setTimeout(() => setGratitudeSaved(false), 2000)
  }

  function toggleSound(sound) {
    if (playingSound === sound.id) {
      audioRef.current?.pause()
      setPlayingSound(null)
    } else {
      if (audioRef.current) audioRef.current.pause()
      audioRef.current = new Audio(sound.url)
      audioRef.current.loop = true
      audioRef.current.volume = 0.5
      audioRef.current.play()
      setPlayingSound(sound.id)
    }
  }

  function saveCrisisPlan() {
    localStorage.setItem('unspoken-crisis-plan', JSON.stringify(crisisPlan))
    setCrisisSaved(true)
    setTimeout(() => setCrisisSaved(false), 3000)
  }

  function formatTime(s) {
    return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`
  }

  const tabs = [
    { id: 'breathing', label: '🫁 breathe' },
    { id: 'grounding', label: '🌿 ground' },
    { id: 'journal', label: '📓 journal' },
    { id: 'mood', label: '📊 mood' },
    { id: 'gratitude', label: '🫙 grateful' },
    { id: 'vent', label: '⏱ vent' },
    { id: 'sounds', label: '🎵 sounds' },
    { id: 'crisis', label: '🛡 plan' },
  ]

  const tabStyle = (tab) => ({
    padding: '0.5rem 0.75rem',
    fontSize: '0.75rem',
    fontWeight: activeTab === tab ? '500' : 'normal',
    color: activeTab === tab ? '#9b9be8' : '#4a4760',
    backgroundColor: activeTab === tab ? '#1e1a3e' : 'transparent',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'all 0.2s',
    whiteSpace: 'nowrap',
  })

  return (
    <main style={{minHeight:'100vh', backgroundColor:'#0f0d14', color:'#e8e6f0', position:'relative', overflow:'hidden'}}>

      <canvas ref={canvasRef} style={{position:'fixed', top:0, left:0, width:'100%', height:'100%', pointerEvents:'none', zIndex:0}} />

      <div style={{position:'relative', zIndex:1}}>

        <nav style={{position:'sticky', top:0, zIndex:10, backgroundColor:'rgba(15,13,20,0.92)', backdropFilter:'blur(12px)', borderBottom:'0.5px solid #2a2640', padding:'1rem 1.5rem', display:'flex', justifyContent:'space-between', alignItems:'center'}}>
          <button onClick={() => router.push('/feed')} style={{background:'#16131f', border:'0.5px solid #2a2640', color:'#9b98b0', cursor:'pointer', fontSize:'0.8rem', padding:'0.5rem 0.85rem', borderRadius:'8px'}}>
            back
          </button>
          <h1 style={{fontSize:'1rem', fontWeight:'500', color:'#e8e6f0'}}>wellness</h1>
          <a href="https://www.befrienders.org" target="_blank" style={{fontSize:'0.72rem', color:'#e88080', textDecoration:'none', padding:'0.5rem 0.85rem', borderRadius:'8px', border:'0.5px solid #2a1f1f', backgroundColor:'#2a1f1f', fontWeight:'700'}}>
            I NEED HELP
          </a>
        </nav>

        {/* Tabs — horizontal scroll */}
        <div style={{overflowX:'auto', padding:'0.75rem 1rem', borderBottom:'0.5px solid #2a2640', backgroundColor:'rgba(15,13,20,0.6)'}}>
          <div style={{display:'flex', gap:'0.3rem', minWidth:'max-content'}}>
            {tabs.map(tab => (
              <button key={tab.id} style={tabStyle(tab.id)} onClick={() => setActiveTab(tab.id)}>
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div style={{maxWidth:'480px', margin:'0 auto', padding:'1.5rem 1rem'}}>

          {/* BREATHING */}
          {activeTab === 'breathing' && (
            <div style={{animation:'fadeSlideUp 0.4s ease forwards'}}>
              <div style={{display:'flex', gap:'0.5rem', marginBottom:'1.5rem'}}>
                {Object.entries(breathingPatterns).map(([key, val]) => (
                  <button key={key} onClick={() => { setBreathingType(key); setIsBreathing(false); setBreathText('tap to begin'); setBreathScale(1) }}
                    style={{flex:1, fontSize:'0.75rem', padding:'0.6rem', borderRadius:'8px', border: breathingType === key ? '0.5px solid #9b9be8' : '0.5px solid #2a2640', backgroundColor: breathingType === key ? '#1e1a3e' : '#16131f', color: breathingType === key ? '#9b9be8' : '#9b98b0', cursor:'pointer', transition:'all 0.2s'}}>
                    {val.name}
                  </button>
                ))}
              </div>
              <div style={{display:'flex', flexDirection:'column', alignItems:'center', padding:'2rem 0'}}>
                <div onClick={startBreathing}
                  style={{width:'180px', height:'180px', borderRadius:'50%', backgroundColor: breathPhase === 'inhale' ? 'rgba(155,155,232,0.15)' : breathPhase === 'exhale' ? 'rgba(126,196,160,0.15)' : 'rgba(155,155,232,0.06)', border: `2px solid ${breathPhase === 'inhale' ? '#9b9be8' : breathPhase === 'exhale' ? '#7ec4a0' : '#2a2640'}`, display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer', transform:`scale(${breathScale})`, transition:`transform ${breathPhase === 'inhale' ? breathingPatterns[breathingType].inhale : breathingPatterns[breathingType].exhale}s ease`, marginBottom:'1.5rem'}}>
                  <span style={{fontSize:'0.85rem', color:'#9b98b0', textAlign:'center', padding:'1rem', lineHeight:'1.5'}}>{breathText}</span>
                </div>
                <p style={{fontSize:'0.75rem', color:'#4a4760', textAlign:'center'}}>{isBreathing ? 'tap to stop' : 'tap to start'}</p>
              </div>
            </div>
          )}

          {/* GROUNDING */}
          {activeTab === 'grounding' && (
            <div style={{backgroundColor:'rgba(22,19,31,0.9)', border:'0.5px solid #2a2640', borderRadius:'14px', padding:'1.5rem', animation:'fadeSlideUp 0.4s ease forwards'}}>
              {groundingStep < 5 ? (
                <div>
                  <div style={{textAlign:'center', marginBottom:'1.5rem'}}>
                    <div style={{fontSize:'2.5rem', marginBottom:'0.75rem'}}>{groundingSteps[groundingStep].emoji}</div>
                    <h2 style={{fontSize:'0.95rem', fontWeight:'500', color:'#e8e6f0', marginBottom:'0.75rem'}}>{groundingSteps[groundingStep].instruction}</h2>
                    <div style={{display:'flex', justifyContent:'center', gap:'0.3rem'}}>
                      {groundingSteps.map((_, i) => (
                        <div key={i} style={{width:'6px', height:'6px', borderRadius:'50%', backgroundColor: i <= groundingStep ? '#9b9be8' : '#2a2640'}} />
                      ))}
                    </div>
                  </div>
                  {groundingAnswers.length > 0 && (
                    <div style={{marginBottom:'1rem', display:'flex', flexDirection:'column', gap:'0.4rem'}}>
                      {groundingAnswers.map((a, i) => (
                        <div key={i} style={{fontSize:'0.75rem', color:'#7ec4a0', padding:'0.4rem 0.75rem', backgroundColor:'#1a2e24', borderRadius:'8px'}}>{a.answer}</div>
                      ))}
                    </div>
                  )}
                  <div style={{display:'flex', gap:'0.5rem'}}>
                    <input type="text" placeholder={`something you can ${groundingSteps[groundingStep].sense}...`} value={groundingInput} onChange={e => setGroundingInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleGroundingSubmit()}
                      style={{flex:1, backgroundColor:'#1e1a2e', border:'0.5px solid #2a2640', borderRadius:'8px', padding:'0.65rem 0.85rem', fontSize:'0.875rem', color:'#e8e6f0', outline:'none', fontFamily:'inherit'}} autoFocus />
                    <button onClick={handleGroundingSubmit} style={{backgroundColor:'#9b9be8', color:'#0f0d14', border:'none', borderRadius:'8px', padding:'0.65rem 1rem', fontWeight:'600', cursor:'pointer'}}>next</button>
                  </div>
                </div>
              ) : (
                <div style={{textAlign:'center', padding:'1rem'}}>
                  <div style={{fontSize:'2.5rem', marginBottom:'1rem'}}>🌿</div>
                  <h2 style={{fontSize:'1rem', fontWeight:'500', color:'#e8e6f0', marginBottom:'0.5rem'}}>You made it through.</h2>
                  <p style={{fontSize:'0.8rem', color:'#9b98b0', lineHeight:'1.6', marginBottom:'1.5rem'}}>You are here. You are safe.</p>
                  <button onClick={() => { setGroundingStep(0); setGroundingAnswers([]); setGroundingInput('') }}
                    style={{fontSize:'0.8rem', color:'#9b98b0', background:'#16131f', border:'0.5px solid #2a2640', borderRadius:'8px', padding:'0.6rem 1.25rem', cursor:'pointer'}}>
                    do it again
                  </button>
                </div>
              )}
            </div>
          )}

          {/* JOURNAL */}
          {activeTab === 'journal' && (
            <div style={{backgroundColor:'rgba(22,19,31,0.9)', border:'0.5px solid #2a2640', borderRadius:'14px', padding:'1.5rem', display:'flex', flexDirection:'column', gap:'1.25rem', animation:'fadeSlideUp 0.4s ease forwards'}}>
              <div style={{backgroundColor:'#1e1a2e', borderRadius:'10px', padding:'1rem', borderLeft:'2px solid #9b9be8'}}>
                <p style={{fontSize:'0.875rem', color:'#9b98b0', lineHeight:'1.7', fontStyle:'italic'}}>{prompt}</p>
              </div>
              <textarea placeholder="write whatever comes to mind..." value={journalText} onChange={e => setJournalText(e.target.value)} rows={7}
                style={{backgroundColor:'#1e1a2e', border:'0.5px solid #2a2640', borderRadius:'10px', padding:'0.85rem 1rem', fontSize:'0.875rem', color:'#e8e6f0', outline:'none', resize:'none', lineHeight:'1.7', fontFamily:'inherit'}} />
              <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
                <span style={{fontSize:'0.7rem', color:'#4a4760'}}>{journalText.length > 0 ? `${journalText.length} characters` : 'no pressure'}</span>
                <button onClick={saveJournal} disabled={!journalText.trim()}
                  style={{fontSize:'0.8rem', backgroundColor: journalText.trim() ? '#9b9be8' : '#2a2640', color: journalText.trim() ? '#0f0d14' : '#4a4760', border:'none', borderRadius:'8px', padding:'0.6rem 1.25rem', cursor: journalText.trim() ? 'pointer' : 'not-allowed', fontWeight:'500'}}>
                  {journalSaved ? 'saved' : 'save'}
                </button>
              </div>
              {journalSaved && <p style={{fontSize:'0.75rem', color:'#7ec4a0', textAlign:'center'}}>saved privately.</p>}
            </div>
          )}

          {/* MOOD TRACKER */}
          {activeTab === 'mood' && (
            <div style={{animation:'fadeSlideUp 0.4s ease forwards'}}>
              <div style={{backgroundColor:'rgba(22,19,31,0.9)', border:'0.5px solid #2a2640', borderRadius:'14px', padding:'1.5rem', display:'flex', flexDirection:'column', gap:'1.25rem'}}>
                <div>
                  <h2 style={{fontSize:'1rem', fontWeight:'500', color:'#e8e6f0', marginBottom:'0.4rem'}}>How are you feeling today?</h2>
                  <p style={{fontSize:'0.8rem', color:'#9b98b0'}}>One honest check-in. No pressure.</p>
                </div>
                <div style={{display:'flex', justifyContent:'space-between', gap:'0.5rem'}}>
                  {moods.map(mood => (
                    <button key={mood.score} onClick={() => setTodayMood(mood.score)}
                      style={{flex:1, backgroundColor: todayMood === mood.score ? '#1e1a3e' : '#1e1a2e', border: todayMood === mood.score ? '0.5px solid #9b9be8' : '0.5px solid #2a2640', borderRadius:'10px', padding:'0.75rem 0.25rem', display:'flex', flexDirection:'column', alignItems:'center', gap:'0.4rem', cursor:'pointer', transition:'all 0.2s'}}>
                      <span style={{fontSize:'1.5rem'}}>{mood.emoji}</span>
                      <span style={{fontSize:'0.65rem', color: todayMood === mood.score ? '#9b9be8' : '#4a4760'}}>{mood.label}</span>
                    </button>
                  ))}
                </div>
                <button onClick={saveMood} disabled={!todayMood}
                  style={{width:'100%', backgroundColor: todayMood ? '#9b9be8' : '#2a2640', color: todayMood ? '#0f0d14' : '#4a4760', border:'none', borderRadius:'10px', padding:'0.85rem', fontSize:'0.875rem', fontWeight:'500', cursor: todayMood ? 'pointer' : 'not-allowed', transition:'all 0.2s'}}>
                  {moodSaved ? 'logged' : 'log mood'}
                </button>
                {moodSaved && <p style={{fontSize:'0.75rem', color:'#7ec4a0', textAlign:'center'}}>mood logged. thank you for checking in.</p>}
              </div>
            </div>
          )}

          {/* GRATITUDE JAR */}
          {activeTab === 'gratitude' && (
            <div style={{animation:'fadeSlideUp 0.4s ease forwards'}}>
              <div style={{backgroundColor:'rgba(22,19,31,0.9)', border:'0.5px solid #2a2640', borderRadius:'14px', padding:'1.5rem', display:'flex', flexDirection:'column', gap:'1.25rem'}}>
                <div>
                  <h2 style={{fontSize:'1rem', fontWeight:'500', color:'#e8e6f0', marginBottom:'0.4rem'}}>🫙 gratitude jar</h2>
                  <p style={{fontSize:'0.8rem', color:'#9b98b0'}}>Drop in one small thing. Even tiny ones count.</p>
                </div>
                <div style={{display:'flex', gap:'0.5rem'}}>
                  <input type="text" placeholder="something small that was okay today..." value={gratitudeText} onChange={e => setGratitudeText(e.target.value)} onKeyDown={e => e.key === 'Enter' && addGratitude()}
                    style={{flex:1, backgroundColor:'#1e1a2e', border:'0.5px solid #2a2640', borderRadius:'10px', padding:'0.75rem 1rem', fontSize:'0.875rem', color:'#e8e6f0', outline:'none', fontFamily:'inherit'}} />
                  <button onClick={addGratitude} style={{backgroundColor:'#9b9be8', color:'#0f0d14', border:'none', borderRadius:'10px', padding:'0.75rem 1rem', fontWeight:'600', cursor:'pointer'}}>+</button>
                </div>
                {gratitudeSaved && <p style={{fontSize:'0.75rem', color:'#7ec4a0'}}>added to your jar.</p>}
                <div style={{display:'flex', flexDirection:'column', gap:'0.5rem', maxHeight:'300px', overflowY:'auto'}}>
                  {gratitudeList.length === 0 && (
                    <p style={{fontSize:'0.8rem', color:'#4a4760', textAlign:'center', padding:'1rem'}}>your jar is empty. add something small.</p>
                  )}
                  {gratitudeList.map((item, i) => (
                    <div key={i} style={{backgroundColor:'#1e1a2e', borderRadius:'10px', padding:'0.75rem 1rem', display:'flex', justifyContent:'space-between', alignItems:'center'}}>
                      <span style={{fontSize:'0.85rem', color:'#e8e6f0'}}>{item.text}</span>
                      <span style={{fontSize:'0.7rem', color:'#4a4760'}}>{item.date}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* VENT TIMER */}
          {activeTab === 'vent' && (
            <div style={{animation:'fadeSlideUp 0.4s ease forwards'}}>
              <div style={{backgroundColor:'rgba(22,19,31,0.9)', border:'0.5px solid #2a2640', borderRadius:'14px', padding:'1.5rem', display:'flex', flexDirection:'column', gap:'1.25rem'}}>
                <div>
                  <h2 style={{fontSize:'1rem', fontWeight:'500', color:'#e8e6f0', marginBottom:'0.4rem'}}>⏱ vent timer</h2>
                  <p style={{fontSize:'0.8rem', color:'#9b98b0'}}>5 minutes to say everything. Then it disappears. No one sees it.</p>
                </div>

                {!ventDone ? (
                  <>
                    <div style={{textAlign:'center', fontSize:'2rem', fontWeight:'300', color: ventStarted ? '#9b9be8' : '#4a4760', fontVariantNumeric:'tabular-nums'}}>
                      {formatTime(ventTimeLeft)}
                    </div>
                    <textarea
                      placeholder="say everything you need to say. it won't be saved."
                      value={ventText}
                      onChange={e => setVentText(e.target.value)}
                      disabled={!ventStarted}
                      rows={8}
                      style={{backgroundColor:'#1e1a2e', border: ventStarted ? '0.5px solid #9b9be8' : '0.5px solid #2a2640', borderRadius:'10px', padding:'0.85rem 1rem', fontSize:'0.875rem', color: ventStarted ? '#e8e6f0' : '#4a4760', outline:'none', resize:'none', lineHeight:'1.7', fontFamily:'inherit', transition:'all 0.3s'}}
                    />
                    <button
                      onClick={() => { if (!ventStarted) { setVentStarted(true) } else { clearInterval(ventRef.current); setVentStarted(false); setVentText(''); setVentTimeLeft(300) } }}
                      style={{width:'100%', backgroundColor: ventStarted ? '#2a1f1f' : '#9b9be8', color: ventStarted ? '#e88080' : '#0f0d14', border:'none', borderRadius:'10px', padding:'0.85rem', fontSize:'0.875rem', fontWeight:'500', cursor:'pointer', transition:'all 0.2s'}}>
                      {ventStarted ? 'stop & clear' : 'start venting'}
                    </button>
                  </>
                ) : (
                  <div style={{textAlign:'center', padding:'1rem'}}>
                    <div style={{fontSize:'2rem', marginBottom:'1rem'}}>🌬</div>
                    <h3 style={{fontSize:'1rem', color:'#e8e6f0', marginBottom:'0.5rem'}}>time's up.</h3>
                    <p style={{fontSize:'0.85rem', color:'#9b98b0', lineHeight:'1.6', marginBottom:'1.5rem'}}>everything you wrote is gone. you got it out. that's what matters.</p>
                    <button onClick={() => { setVentDone(false); setVentText(''); setVentTimeLeft(300); setVentStarted(false) }}
                      style={{fontSize:'0.8rem', color:'#9b98b0', background:'#16131f', border:'0.5px solid #2a2640', borderRadius:'8px', padding:'0.6rem 1.25rem', cursor:'pointer'}}>
                      do it again
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* SLEEP SOUNDS */}
          {activeTab === 'sounds' && (
            <div style={{animation:'fadeSlideUp 0.4s ease forwards'}}>
              <div style={{backgroundColor:'rgba(22,19,31,0.9)', border:'0.5px solid #2a2640', borderRadius:'14px', padding:'1.5rem', display:'flex', flexDirection:'column', gap:'1rem'}}>
                <div>
                  <h2 style={{fontSize:'1rem', fontWeight:'500', color:'#e8e6f0', marginBottom:'0.4rem'}}>🎵 sleep sounds</h2>
                  <p style={{fontSize:'0.8rem', color:'#9b98b0'}}>Tap to play. Tap again to stop.</p>
                </div>
                <div style={{display:'flex', flexDirection:'column', gap:'0.75rem'}}>
                  {sounds.map(sound => (
                    <button key={sound.id} onClick={() => toggleSound(sound)}
                      style={{display:'flex', alignItems:'center', gap:'1rem', padding:'1rem 1.1rem', backgroundColor: playingSound === sound.id ? '#1e1a3e' : '#1e1a2e', border: playingSound === sound.id ? '0.5px solid #9b9be8' : '0.5px solid #2a2640', borderRadius:'12px', cursor:'pointer', transition:'all 0.2s', textAlign:'left'}}>
                      <span style={{fontSize:'1.5rem'}}>{sound.emoji}</span>
                      <div style={{flex:1}}>
                        <div style={{fontSize:'0.875rem', color: playingSound === sound.id ? '#9b9be8' : '#e8e6f0', fontWeight: playingSound === sound.id ? '500' : 'normal'}}>{sound.label}</div>
                        {playingSound === sound.id && <div style={{fontSize:'0.7rem', color:'#9b9be8', marginTop:'0.2rem', animation:'pulse 2s ease-in-out infinite'}}>playing...</div>}
                      </div>
                      <div style={{width:'8px', height:'8px', borderRadius:'50%', backgroundColor: playingSound === sound.id ? '#9b9be8' : '#2a2640', transition:'all 0.2s'}} />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* CRISIS PLAN */}
          {activeTab === 'crisis' && (
            <div style={{animation:'fadeSlideUp 0.4s ease forwards'}}>
              <div style={{backgroundColor:'rgba(22,19,31,0.9)', border:'0.5px solid #2a2640', borderRadius:'14px', padding:'1.5rem', display:'flex', flexDirection:'column', gap:'1.25rem'}}>
                <div>
                  <h2 style={{fontSize:'1rem', fontWeight:'500', color:'#e8e6f0', marginBottom:'0.4rem'}}>🛡 my safety plan</h2>
                  <p style={{fontSize:'0.8rem', color:'#9b98b0', lineHeight:'1.5'}}>Write this when you are okay. Read it when you are not.</p>
                </div>
                {[
                  { key: 'warning', label: 'Warning signs — how do I know when I am struggling?', placeholder: 'e.g. I stop eating, I isolate, I feel numb...' },
                  { key: 'activities', label: 'Things that help me feel better', placeholder: 'e.g. walking, music, calling a friend...' },
                  { key: 'people', label: 'People I can reach out to', placeholder: 'e.g. my sister, my friend Anika...' },
                  { key: 'hotline', label: 'Crisis line I can call', placeholder: 'e.g. Kaan Pete Roi: 01779-554391' },
                  { key: 'safe', label: 'A reason to hold on', placeholder: 'e.g. my cat, the book I want to finish...' },
                ].map(field => (
                  <div key={field.key} style={{display:'flex', flexDirection:'column', gap:'0.4rem'}}>
                    <label style={{fontSize:'0.72rem', color:'#4a4760', letterSpacing:'0.05em'}}>{field.label}</label>
                    <textarea
                      placeholder={field.placeholder}
                      value={crisisPlan[field.key]}
                      onChange={e => setCrisisPlan({...crisisPlan, [field.key]: e.target.value})}
                      rows={2}
                      style={{backgroundColor:'#1e1a2e', border:'0.5px solid #2a2640', borderRadius:'8px', padding:'0.65rem 0.85rem', fontSize:'0.85rem', color:'#e8e6f0', outline:'none', resize:'none', lineHeight:'1.6', fontFamily:'inherit'}}
                    />
                  </div>
                ))}
                <button onClick={saveCrisisPlan}
                  style={{width:'100%', backgroundColor:'#9b9be8', color:'#0f0d14', border:'none', borderRadius:'10px', padding:'0.85rem', fontSize:'0.875rem', fontWeight:'500', cursor:'pointer'}}>
                  {crisisSaved ? 'saved safely' : 'save my plan'}
                </button>
                {crisisSaved && <p style={{fontSize:'0.75rem', color:'#7ec4a0', textAlign:'center'}}>saved on this device. only you can see this.</p>}
                <div style={{backgroundColor:'#2a1f1f', borderRadius:'10px', padding:'1rem', textAlign:'center'}}>
                  <a href="https://www.befrienders.org" target="_blank" style={{fontSize:'0.85rem', color:'#e88080', textDecoration:'none', fontWeight:'700', letterSpacing:'0.02em'}}>
                    I NEED HELP RIGHT NOW
                  </a>
                </div>
              </div>
            </div>
          )}

        </div>

      </div>

      <style>{`
        @keyframes fadeSlideUp { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }
        input::placeholder { color: #4a4760; }
        textarea::placeholder { color: #4a4760; }
        input:focus { border-color: #9b9be8 !important; }
        textarea:focus { border-color: #9b9be8 !important; }
        ::-webkit-scrollbar { width: 3px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #2a2640; border-radius: 99px; }
      `}</style>

    </main>
  )
}

export default function Wellness() {
  return (
    <Suspense>
      <WellnessContent />
    </Suspense>
  )
}