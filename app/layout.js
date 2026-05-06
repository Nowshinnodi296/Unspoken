'use client'

import { createContext, useContext, useState, useEffect } from 'react'
import './globals.css'

export const ThemeContext = createContext({
  isDark: true,
  toggleTheme: () => {},
})

export function useTheme() {
  return useContext(ThemeContext)
}

export default function RootLayout({ children }) {
  const [isDark, setIsDark] = useState(true)

  useEffect(() => {
    const saved = localStorage.getItem('unspoken-theme')
    if (saved) setIsDark(saved === 'dark')
  }, [])

  function toggleTheme() {
    const newTheme = !isDark
    setIsDark(newTheme)
    localStorage.setItem('unspoken-theme', newTheme ? 'dark' : 'light')
  }

  return (
    <html lang="en">
      <body style={{
        backgroundColor: isDark ? '#0f0d14' : '#f8f7ff',
        transition: 'background-color 0.4s ease',
      }}>
        <ThemeContext.Provider value={{ isDark, toggleTheme }}>
          {children}
        </ThemeContext.Provider>
      </body>
    </html>
  )
}