import { Component } from 'react'
import type { ErrorInfo, ReactNode } from 'react'

interface Props {
  children: ReactNode
}

interface State {
  hasError: boolean
  message: string | null
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, message: null }

  static getDerivedStateFromError(error: unknown): State {
    return { hasError: true, message: error instanceof Error ? error.message : String(error) }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('Scrapbook page crashed:', error, info.componentStack)
  }

  render() {
    if (!this.state.hasError) return this.props.children

    return (
      <div className="mx-auto max-w-xl px-4 py-24 text-center">
        <h1 className="font-display text-3xl text-rose-700">A page fell out of the book.</h1>
        <p className="mt-3 text-ink-soft">
          Something on this page did not load properly. Reloading usually puts it back.
        </p>
        {this.state.message && (
          <p className="mt-4 font-mono text-xs break-words text-ink-soft/80">{this.state.message}</p>
        )}
        <button
          type="button"
          onClick={() => window.location.reload()}
          className="mt-8 rounded-full bg-rose-500 px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-rose-600"
        >
          Reload the scrapbook
        </button>
      </div>
    )
  }
}