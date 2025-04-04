import { useTheme, THEME } from './ThemeProvider'

export default function ThemeToggleButton() {
  const { theme, toggleTheme } = useTheme()
  const isLight = theme === THEME.LIGHT

  return (
    <button
      onClick={toggleTheme}
      className={`px-4 py-2 rounded ${
        isLight ? 'bg-black text-white' : 'bg-white text-black'
      } transition-colors`}
    >
      {isLight ? '다크모드' : '라이트모드'}
    </button>
  )
}
