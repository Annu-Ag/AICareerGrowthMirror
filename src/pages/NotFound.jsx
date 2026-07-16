import { Link } from 'react-router-dom'

export default function NotFound() {
  return <section className="mx-auto max-w-6xl px-5 py-24 text-center sm:px-8"><p className="text-sm font-semibold text-indigo-600">404</p><h1 className="mt-2 text-4xl font-semibold tracking-tight">This reflection doesn’t exist.</h1><Link to="/" className="mt-7 inline-block rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white">Back to Mirror</Link></section>
}
