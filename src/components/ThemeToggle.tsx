import { useEffect, useState } from 'react'
import { Moon, SunMedium } from 'lucide-react'
import { Switch } from '@heroui/react'

type ThemeMode = 'light' | 'dark'

function getInitialMode(): ThemeMode {
  if (typeof window === 'undefined') {
    return 'dark'
  }

  const stored = window.localStorage.getItem('theme')
  if (stored === 'light' || stored === 'dark') {
    return stored
  }

  return window.matchMedia('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light'
}

function applyThemeMode(mode: ThemeMode) {
  document.documentElement.classList.remove('light', 'dark')
  document.documentElement.classList.add(mode)
  document.documentElement.setAttribute('data-theme', mode)
  document.documentElement.style.colorScheme = mode
}

export default function ThemeToggle() {
  const [mode, setMode] = useState<ThemeMode>('dark')

  useEffect(() => {
    const initialMode = getInitialMode()
    setMode(initialMode)
    applyThemeMode(initialMode)
  }, [])

  useEffect(() => {
    applyThemeMode(mode)
  }, [mode])

  const isDark = mode === 'dark'

  return (
    <Switch
      aria-label={
        isDark ? 'Переключить на светлую тему' : 'Переключить на тёмную тему'
      }
      isSelected={isDark}
      onChange={(selected) => {
        const nextMode: ThemeMode = selected ? 'dark' : 'light'
        setMode(nextMode)
        applyThemeMode(nextMode)
        window.localStorage.setItem('theme', nextMode)
      }}
      size="lg"
    >
      {({ isSelected }) => (
        <Switch.Control>
          <Switch.Thumb>
            <Switch.Icon>
              {isSelected ? (
                <SunMedium className="size-3 text-inherit opacity-100" />
              ) : (
                <Moon className="size-3 text-inherit opacity-70" />
              )}
            </Switch.Icon>
          </Switch.Thumb>
        </Switch.Control>
      )}
    </Switch>
  )
}
