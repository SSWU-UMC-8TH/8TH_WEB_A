import { Outlet } from "react-router-dom"

export const HomeLayout = () => {
  return (
    <div className="h-dvh flex flex-col">
      <nav>네비게이션 바</nav>
      <main className="flex-1">
        <Outlet /> {/* Outlet에는 children들이 렌더링 됨 */}
      </main>
      <footer>푸터</footer>
    </div>
  )
}
