import { Component } from 'react'
import { Link } from 'react-router-dom'

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, info) {
    console.error('ErrorBoundary caught:', error, info)
  }

  render() {
    if (this.state.hasError) {
      return (
        <section className="mx-auto max-w-6xl px-6 py-24 text-center sm:px-8">
          <div className="mx-auto max-w-sm">
            <div className="text-[100px] leading-none mb-6">💫</div>
            <p className="section-eyebrow mb-4">Something went wrong</p>
            <h1 className="text-3xl font-semibold tracking-tight text-fg">
              The mirror cracked
            </h1>
            <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-fg-secondary">
              An unexpected error occurred. Don't worry — your data is saved in your browser.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <button
                onClick={() => window.location.reload()}
                className="btn-primary-gradient"
              >
                Reload page
              </button>
              <Link
                to="/"
                className="btn-outline"
                onClick={() => this.setState({ hasError: false, error: null })}
              >
                Go home
              </Link>
            </div>
          </div>
        </section>
      )
    }

    return this.props.children
  }
}
