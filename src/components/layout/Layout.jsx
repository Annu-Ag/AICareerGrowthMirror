import { useState, useRef, useEffect } from 'react'
import { NavLink, Outlet, useLocation } from 'react-router-dom'
import { useCareer } from '../../context/CareerContext'

const navigation = [
  { label: 'Profile', to: '/profile', icon: '👤', desc: 'Your career snapshot' },
  { label: 'Analysis', to: '/analysis', icon: '✨', desc: 'AI-powered insights' },
  { label: 'Check-in', to: '/check-in', icon: '📝', desc: 'Weekly reflection' },
  { label: 'Report', to: '/report', icon: '📈', desc: 'Growth metrics' },
]

function MobileMenu({ open, onClose, profile }) {
  const hasProfile = profile.name.trim().length > 0

  return (
    <>
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm md:hidden"
          onClick={onClose}
        />
      )}
      <div
        className={`fixed inset-y-0 right-0 z-50 w-72 bg-white shadow-xl transition-transform duration-300 ease-out md:hidden ${
          open ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between border-b border-border px-5 py-4">
          <span className="flex items-center gap-2.5 text-sm font-semibold">
            <span className="grid size-7 place-items-center rounded-[9px] bg-fg text-[11px] text-white">✦</span>
            <span className="gradient-text-brand">Mirror</span>
          </span>
          <button
            onClick={onClose}
            className="btn-ghost-icon"
            aria-label="Close menu"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        {hasProfile && (
          <div className="border-b border-border px-5 py-3.5">
            <p className="text-xs font-medium text-fg-muted">Signed in as</p>
            <p className="mt-0.5 text-sm font-semibold text-fg">{profile.name}</p>
          </div>
        )}

        <nav className="flex flex-col gap-1 p-4" aria-label="Mobile navigation">
          {navigation.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={onClose}
              className={({ isActive }) =>
                `side-nav-link ${isActive ? 'active' : ''}`
              }
            >
              <span className="text-base">{item.icon}</span>
              <div className="flex flex-col">
                <span className="text-sm font-medium">{item.label}</span>
                <span className="text-xs text-fg-muted">{item.desc}</span>
              </div>
            </NavLink>
          ))}
          <hr className="my-2 border-border" />
          <NavLink
            to="/"
            onClick={onClose}
            className={({ isActive }) =>
              `side-nav-link ${isActive ? 'active' : ''}`
            }
          >
            <span className="text-base">🏠</span>
            <div className="flex flex-col">
              <span className="text-sm font-medium">Home</span>
              <span className="text-xs text-fg-muted">Landing page</span>
            </div>
          </NavLink>
        </nav>
      </div>
    </>
  )
}

function Toast({ message, type, onClose }) {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000)
    return () => clearTimeout(timer)
  }, [onClose])

  const icons = {
    success: '✓',
    info: '✦',
    warning: '!',
  }

  return (
    <div className="toast" role="status">
      <span className="grid size-6 place-items-center rounded-full bg-white/10 text-xs">
        {icons[type] || '✦'}
      </span>
      {message}
    </div>
  )
}

export default function Layout() {
  const { pathname } = useLocation()
  const { profile, toast: toastState, clearToast } = useCareer()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const isLanding = pathname === '/'

  // Track scroll for header shadow
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const hasProfile = profile.name.trim().length > 0

  return (
    <div className={`min-h-screen ${isLanding ? 'bg-[#0a0a0a] text-white' : 'bg-bg text-fg'}`}>
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>

      {!isLanding && (
        <header
          className={`sticky top-0 z-30 transition-shadow duration-200 ${
            scrolled
              ? 'shadow-md bg-white/80'
              : 'bg-white/60'
          } glass`}
        >
          <nav
            className="mx-auto flex max-w-7xl items-center justify-between px-5 py-3 lg:px-8"
            aria-label="Primary navigation"
          >
            {/* Logo */}
            <NavLink
              to="/"
              className="flex items-center gap-2.5 text-[15px] font-semibold tracking-tight text-fg group"
            >
              <span className="grid size-7 place-items-center rounded-[9px] bg-fg text-[11px] text-white transition-all duration-200 group-hover:scale-110 group-hover:shadow-lg group-hover:shadow-accent/20">
                ✦
              </span>
              <span className="hidden sm:inline gradient-text-brand">Mirror</span>
            </NavLink>

            {/* Desktop nav links */}
            <div className="hidden items-center gap-1 md:flex">
              {navigation.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    `nav-link ${isActive ? 'active' : ''}`
                  }
                >
                  {item.label}
                </NavLink>
              ))}
            </div>

            {/* Right side */}
            <div className="flex items-center gap-3">
              {hasProfile && (
                <span className="hidden sm:flex items-center gap-2 mr-1">
                  <span className="size-1.5 rounded-full bg-success pulse-dot" />
                  <span className="text-xs text-fg-muted">{profile.name}</span>
                </span>
              )}

              <NavLink
                to="/profile"
                className="btn-primary-gradient hidden sm:inline-flex text-xs px-3.5 py-2"
              >
                {hasProfile ? 'Dashboard' : 'Get started'}
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </NavLink>

              {/* Mobile hamburger */}
              <button
                onClick={() => setMobileOpen(true)}
                className="btn-ghost-icon md:hidden"
                aria-label="Open menu"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <path d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </nav>
        </header>
      )}

      <MobileMenu open={mobileOpen} onClose={() => setMobileOpen(false)} profile={profile} />

      <main id="main-content" tabIndex={-1} className={!isLanding ? 'page-enter' : ''}>
        <Outlet />
      </main>

      {/* Toast notifications */}
      {toastState && (
        <Toast
          message={toastState.message}
          type={toastState.type}
          onClose={clearToast}
        />
      )}
    </div>
  )
}
