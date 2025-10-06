import React from 'react'

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null, errorInfo: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, errorInfo) {
    this.setState({ error, errorInfo })
    if (this.props.onError) {
      try { this.props.onError(error, errorInfo) } catch (_) {}
    }
    if (typeof window !== 'undefined') {
      console.error('Caught by ErrorBoundary:', error, errorInfo)
    }
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null, errorInfo: null })
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-[200px] p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center mb-2">
            <div className="w-6 h-6 bg-red-500 rounded mr-2" />
            <h2 className="text-red-700 font-semibold">Something went wrong.</h2>
          </div>
          <p className="text-red-600 text-sm">We encountered an error while rendering this section.</p>
          {this.state.error && (
            <pre className="mt-2 text-xs text-red-700 whitespace-pre-wrap">{String(this.state.error)}</pre>
          )}
          <button className="mt-3 px-3 py-1 bg-red-600 text-white rounded" onClick={this.handleRetry}>
            Retry
          </button>
        </div>
      )
    }
    return this.props.children
  }
}

export default ErrorBoundary