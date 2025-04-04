import { createContext, useContext, useState, PropsWithChildren } from 'react'

export enum THEME {
  LIGHT = 'LIGHT',
  DARK = 'DARK',
}

type ThemeType = THEME.LIGHT | THEME.DARK

interface IThemeContext {
  theme: ThemeType
  toggleTheme: () => void
}

const ThemeContext = createContext<IThemeContext | undefined>(undefined)

export const ThemeProvider = ({ children }: PropsWithChildren) => {
  const [theme, setTheme] = useState<ThemeType>(THEME.LIGHT)

  const toggleTheme = () => {
    setTheme((prev) => (prev === THEME.LIGHT ? THEME.DARK : THEME.LIGHT))
  }

  const className = theme === THEME.LIGHT ? 'bg-white text-black' : 'bg-gray-900 text-white'

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      <div className={`${className} min-h-screen transition-all`}>{children}</div>
    </ThemeContext.Provider>
  )
}

export const useTheme = () => {
  const context = useContext(ThemeContext)
  if (!context) throw new Error('useTheme must be used within ThemeProvider')
  return context
}
