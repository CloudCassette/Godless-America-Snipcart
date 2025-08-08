import { useState, useEffect } from 'react'

export function useTheme() {
  const [isDark, setIsDark] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    // Check for saved theme preference or default to dark
    const savedTheme = localStorage.getItem('godless-theme')
    const prefersDark = savedTheme === 'dark' || (!savedTheme && true) // Default to dark
    setIsDark(prefersDark)
    
    // Apply theme to document body
    if (prefersDark) {
      document.body.classList.add('dark-theme')
      console.log('Applied dark theme')
    } else {
      document.body.classList.remove('dark-theme')
      console.log('Applied light theme')
    }
  }, [])

  const toggleTheme = () => {
    if (!mounted) return
    
    const newTheme = !isDark
    setIsDark(newTheme)
    localStorage.setItem('godless-theme', newTheme ? 'dark' : 'light')
    
    // Apply theme class to body
    if (newTheme) {
      document.body.classList.add('dark-theme')
      console.log('Toggled to dark theme')
    } else {
      document.body.classList.remove('dark-theme')
      console.log('Toggled to light theme')
    }
  }

  // Don't render anything until mounted to avoid hydration issues
  if (!mounted) {
    return { isDark: true, toggleTheme: () => {} } // Default to dark while loading
  }

  return { isDark, toggleTheme }
}
