import React, { useEffect, useState } from 'react'

// Simple theme toggle: toggles 'dark' class on the <html> element and persists preference
const ThemeToggle = () => {
  const [isDark, setIsDark] = useState(false)

  // Initialize from localStorage or OS preference
  useEffect(() => {
    const stored = localStorage.getItem('theme')
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
    const shouldBeDark = stored ? stored === 'dark' : prefersDark
    setIsDark(shouldBeDark)
    document.documentElement.classList.toggle('dark', shouldBeDark)
  }, [])

  const toggle = () => {
    setIsDark(prev => {
      const next = !prev
      document.documentElement.classList.toggle('dark', next)
      localStorage.setItem('theme', next ? 'dark' : 'light')
      return next
    })
  }

  return (
    <button
      onClick={toggle}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      className="inline-flex items-center gap-2 px-3 py-2 rounded border text-sm border-neutral-200 hover:border-neutral-300 text-neutral-700 hover:text-neutral-900 bg-white dark:bg-neutral-900 dark:text-neutral-200 dark:border-neutral-700 dark:hover:border-neutral-600"
      title={isDark ? 'Light mode' : 'Dark mode'}
    >
      <span className="w-4 h-4 inline-block">
        {isDark ? (
          // Sun icon
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M6.76 4.84l-1.8-1.79-1.41 1.41 1.79 1.8 1.42-1.42zm10.48 14.32l1.79 1.8 1.41-1.41-1.8-1.79-1.4 1.4zM12 4V1h-2v3h2zm0 19v-3h-2v3h2zm7-10h3v-2h-3v2zM2 13h3v-2H2v2zm14.24-8.16l1.42 1.42 1.79-1.8-1.41-1.41-1.8 1.79zM4.24 19.76l1.42-1.42-1.8-1.79-1.41 1.41 1.79 1.8zM12 6a6 6 0 100 12A6 6 0 0012 6z"/></svg>
        ) : (
          // Moon icon
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M12.002 2a1 1 0 01.993.883l.007.117v1.055a8.994 8.994 0 018.946 8.163l.054.892a1 1 0 01-1.496.93 7 7 0 10-9.574 9.574 1 1 0 01-.93 1.496l-.892-.054A8.994 8.994 0 013.055 13.12l-1.055-.007A1 1 0 011 12.002C1 6.478 5.477 2 11.002 2h1z"/></svg>
        )}
      </span>
      <span className="hidden md:inline">{isDark ? 'Light' : 'Dark'}</span>
    </button>
  )
}

export default ThemeToggle
