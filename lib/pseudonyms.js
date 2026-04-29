const adjectives = [
    'quiet', 'gentle', 'soft', 'calm', 'still',
    'wandering', 'distant', 'hollow', 'sleepy', 'fading',
    'tender', 'weary', 'pale', 'misty', 'cloudy'
  ]
  
  const nouns = [
    'moon', 'rain', 'shore', 'river', 'forest',
    'window', 'shadow', 'candle', 'cloud', 'lantern',
    'tide', 'echo', 'ember', 'dusk', 'petal'
  ]
  
  export function generatePseudonym() {
    const adj = adjectives[Math.floor(Math.random() * adjectives.length)]
    const noun = nouns[Math.floor(Math.random() * nouns.length)]
    const num = Math.floor(Math.random() * 99) + 1
    return `${adj}-${noun}-${num}`
  }
  
  export function generateAvatarSeed() {
    return Math.random().toString(36).substring(2, 10)
  }