import ThemeToggleButton from './ThemeToggleButton'

export default function Navbar() {
  return (
    <nav className="w-full p-4 flex justify-end border-b border-gray-300">
      <ThemeToggleButton />
    </nav>
  )
}
