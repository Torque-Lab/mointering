"use client"
import { useTheme } from "next-themes"
import { MoonIcon } from "../ui-icons/moonIcons"
import { SunIcons } from "../ui-icons/SunIcons"
import { useEffect, useState } from "react"

export function ThemeSwitcher() {
  const [mounted, setMounted] = useState(false)
  const { theme, setTheme } = useTheme()
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return <div className="w-6 h-6" />
  }

  return (
    <div className="flex items-center gap-2">
      <button 
        onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
        aria-label="Toggle theme"
      >
        {theme === 'light' ? <MoonIcon /> : <SunIcons />}
      </button>
    </div>
  )
}