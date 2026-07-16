import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-24 text-center sm:px-8">
      <div className="mx-auto max-w-sm">
        {/* Animated 404 */}
        <div className="relative mb-8">
          <div className="text-[120px] font-bold leading-none tracking-tight gradient-text">
            404
          </div>
          <div className="absolute inset-0 flex items-center justify-center opacity-[0.04] text-[200px] font-bold select-none">
            404
          </div>
        </div>

        <p className="section-eyebrow mb-4">Page not found</p>
        <h1 className="text-3xl font-semibold tracking-tight text-fg">
          This reflection doesn't exist.
        </h1>
        <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-fg-secondary">
          The page you're looking for has moved or never existed. Let's get you back on track.
        </p>

        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link
            to="/"
            className="btn-primary-gradient"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
            Back to Mirror
          </Link>
          <Link
            to="/profile"
            className="btn-outline"
          >
            Build your profile
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  )
}
