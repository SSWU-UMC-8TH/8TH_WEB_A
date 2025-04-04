import { ThemeProvider } from './ThemeProvider'
import Navbar from './Navbar'
import ThemeContent from './ThemeContent'

export default function ContextPage() {
  return (
    <ThemeProvider>
      <Navbar />
      <ThemeContent />
    </ThemeProvider>
  )
}

