export const crisisData = {
  BD: {
    country: 'Bangladesh',
    lines: [
      { name: 'Kaan Pete Roi', number: '01779-554391', available: '24/7' },
      { name: 'Kishor Alo', number: '10666', available: '24/7' },
    ],
    url: 'https://www.kaanpeteroi.org',
  },
  IN: {
    country: 'India',
    lines: [
      { name: 'KIRAN', number: '1800-599-0019', available: '24/7, free, 13 languages' },
      { name: 'iCall', number: '9152987821', available: 'Mon-Sat 8am-10pm' },
    ],
    url: 'https://icallhelpline.org',
  },
  PK: {
    country: 'Pakistan',
    lines: [
      { name: 'Umang', number: '0317-4288665', available: '24/7' },
      { name: 'Rozan Counselling', number: '051-2890505', available: 'Mon-Fri' },
    ],
    url: 'https://umang.com.pk',
  },
  US: {
    country: 'United States',
    lines: [
      { name: '988 Suicide & Crisis Lifeline', number: '988', available: '24/7' },
      { name: 'Crisis Text Line', number: 'Text HOME to 741741', available: '24/7' },
    ],
    url: 'https://988lifeline.org',
  },
  CA: {
    country: 'Canada',
    lines: [
      { name: 'Talk Suicide Canada', number: '1-833-456-4566', available: '24/7' },
      { name: 'Kids Help Phone', number: '1-800-668-6868', available: '24/7' },
    ],
    url: 'https://talksuicide.ca',
  },
  AU: {
    country: 'Australia',
    lines: [
      { name: 'Lifeline', number: '13 11 14', available: '24/7' },
      { name: 'Beyond Blue', number: '1300 22 4636', available: '24/7' },
    ],
    url: 'https://www.lifeline.org.au',
  },
  GB: {
    country: 'United Kingdom',
    lines: [
      { name: 'Samaritans', number: '116 123', available: '24/7, free' },
      { name: 'Mind', number: '0300 123 3393', available: 'Mon-Fri 9am-6pm' },
    ],
    url: 'https://www.samaritans.org',
  },
  FR: {
    country: 'France',
    lines: [
      { name: 'SOS Amitie', number: '09 72 39 40 50', available: '24/7' },
      { name: 'Suicide Ecoute', number: '01 45 39 40 00', available: '24/7' },
    ],
    url: 'https://www.sos-amitie.com',
  },
  ES: {
    country: 'Spain',
    lines: [
      { name: 'Telefono de la Esperanza', number: '717 003 717', available: '24/7' },
    ],
    url: 'https://telefonodelaesperanza.org',
  },
  DEFAULT: {
    country: 'Worldwide',
    lines: [
      { name: 'Befrienders Worldwide', number: 'befrienders.org', available: '24/7' },
      { name: 'Find A Helpline', number: 'findahelpline.com', available: '175+ countries' },
    ],
    url: 'https://www.befrienders.org',
  },
}

export async function getCrisisInfo() {
  try {
    const res = await fetch('https://ipapi.co/json/')
    const data = await res.json()
    const code = data.country_code
    return crisisData[code] || crisisData.DEFAULT
  } catch {
    return crisisData.DEFAULT
  }
}