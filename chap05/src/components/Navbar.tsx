import { NavLink } from 'react-router-dom';

const navItems = [
  { path: '/', label: '홈' },
  { path: '/movies/popular',    label: '인기 영화' },
  { path: '/movies/upcoming',   label: '개봉 예정작' },
  { path: '/movies/top_rated',  label: '높은 평점' },   
  { path: '/movies/now_playing',label: '현재 상영작' },
];

export default function Navbar() {
  return (
    <nav className="bg-white shadow-md p-4 flex gap-4 justify-center sticky top-0 z-50">
      {navItems.map((item) => (
        <NavLink
          key={item.path}
          to={item.path}
          className={({ isActive }) =>
            isActive
              ? 'text-white bg-blue-600 px-3 py-1 rounded-lg font-bold shadow'
              : 'text-gray-700 hover:text-blue-500 px-3 py-1'
          }
        >
          {item.label}
        </NavLink>
      ))}
    </nav>
  );
}
