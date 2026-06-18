"use client"

import { Component, type ReactNode } from "react"

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  erro: Error | null
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { erro: null }

  static getDerivedStateFromError(erro: Error): State {
    return { erro }
  }

  render() {
    if (this.state.erro) {
      if (this.props.fallback) return this.props.fallback
      return (
        <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a] px-4">
          <div className="text-center space-y-4 max-w-md">
            <div className="text-4xl">💥</div>
            <h2 className="text-lg font-bold text-white">Algo deu errado</h2>
            <p className="text-sm text-gray-500 break-all">
              {this.state.erro.message}
            </p>
            <button
              onClick={() => this.setState({ erro: null })}
              className="text-sm bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Tentar novamente
            </button>
          </div>
        </div>
      )
    }
    return this.props.children
  }
}
