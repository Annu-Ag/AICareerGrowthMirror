import { NavLink, Outlet } from 'react-router-dom'

const navigation = [
  { label: 'Profile', to: '/profile' },
  { label: 'Analysis', to: '/analysis' },
  { label: 'Check-in', to: '/check-in' },
  { label: 'Report', to: '/report' },
]

export default function Layout() {
  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900">
      <header className="sticky top-0 z-20 border-b border-slate-200/80 bg-[#f8fafc]/90 backdrop-blur-xl">
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 lg:px-8" aria-label="Primary navigation">
          <NavLink to="/" className="flex items-center gap-2.5 font-semibold tracking-tight text-slate-900">
            <span className="grid size-8 place-items-center rounded-xl bg-indigo-600 text-sm text-white shadow-sm">✦</span>
            Mirror
          </NavLink>
          <div className="hidden items-center gap-1 md:flex">
            {navigation.map((item) => (
              <NavLink key={item.to} to={item.to} className={({ isActive }) => `rounded-lg px-3 py-2 text-sm font-medium transition ${isActive ? 'bg-white text-indigo-700 shadow-sm' : 'text-slate-500 hover:text-slate-900'}`}>
                {item.label}
              </NavLink>
            ))}
          </div>
          <NavLink to="/profile" className="rounded-lg bg-slate-900 px-3.5 py-2 text-sm font-medium text-white transition hover:bg-slate-700">My mirror</NavLink>
        </nav>
      </header>
      <main><Outlet /></main>
    </div>
  )
}
