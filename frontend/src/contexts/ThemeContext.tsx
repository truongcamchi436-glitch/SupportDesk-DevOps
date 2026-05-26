import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from 'react'
import { ThemeProvider as SCThemeProvider } from 'styled-components'
import { lightTheme, darkTheme } from '../styles/global'

type ThemeMode = 'light' | 'dark'

interface ThemeContextType {
  mode: ThemeMode
  toggle: () => void
}

const ThemeContext = createContext<ThemeContextType | null>(null)

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [mode, setMode] = useState<ThemeMode>(() => {
    const saved = localStorage.getItem('theme') as ThemeMode | null
    if (saved) return saved
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  })

  useEffect(() => {
    localStorage.setItem('theme', mode)
    document.documentElement.setAttribute('data-theme', mode)
  }, [mode])

  const toggle = useCallback(() => {
    setMode(prev => prev === 'light' ? 'dark' : 'light')
  }, [])

  const theme = mode === 'dark' ? darkTheme : lightTheme

  return (
    <ThemeContext.Provider value={{ mode, toggle }}>
      <SCThemeProvider theme={theme}>
        {children}
      </SCThemeProvider>
    </ThemeContext.Provider>
  )
}

export const useTheme = (): ThemeContextType => {
  const ctx = useContext(ThemeContext)
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider')
  return ctx
}
