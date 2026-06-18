"use client"

import Link from "next/link"
import { useState, useEffect } from "react"
import { useAuth } from "@/lib/use-auth"
import { useRouter } from "next/navigation"

export default function CadastroPage() {
  const [nome, setNome] = useState("")
  const [email, setEmail] = useState("")
  const [senha, setSenha] = useState("")
  const [confirmar, setConfirmar] = useState("")
  const [erroLocal, setErroLocal] = useState("")
  const { user, loading, enviando, erro, cadastrar, logarGoogle } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && user) router.push("/cursos")
  }, [user, loading, router])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a]">
        <div className="w-6 h-6 border-2 border-purple-400 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (user) return null

  const handleCadastrar = () => {
    setErroLocal("")
    if (!nome.trim()) { setErroLocal("Digite seu nome"); return }
    if (senha.length < 6) { setErroLocal("Senha deve ter no mínimo 6 caracteres"); return }
    if (senha !== confirmar) { setErroLocal("Senhas não conferem"); return }
    cadastrar(email, senha)
  }

  const msgErro = erroLocal || erro

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#0a0a0a]">
      <style>{`
        @keyframes gradient-shift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          33% { transform: translateY(-20px) rotate(1deg); }
          66% { transform: translateY(10px) rotate(-1deg); }
        }
        @keyframes fade-up {
          from { opacity: 0; transform: translateY(24px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes glow-pulse {
          0%, 100% { box-shadow: 0 0 20px rgba(59, 130, 246, 0.15); }
          50% { box-shadow: 0 0 40px rgba(59, 130, 246, 0.3); }
        }
        @keyframes shimmer {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        .animate-gradient { animation: gradient-shift 8s ease infinite; background-size: 200% 200%; }
        .animate-float { animation: float 6s ease-in-out infinite; }
        .animate-fade-up { animation: fade-up 0.6s ease-out both; }
        .animate-glow { animation: glow-pulse 3s ease-in-out infinite; }
        .card-delay-1 { animation-delay: 0.1s; }
        .card-delay-2 { animation-delay: 0.2s; }
        .card-delay-3 { animation-delay: 0.3s; }
      `}</style>

      <div className="absolute inset-0 bg-gradient-to-br from-purple-950 via-[#0a0a0a] to-blue-950 animate-gradient opacity-80" />
      <div className="absolute top-10 right-10 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl animate-float" style={{ animationDelay: "0s" }} />
      <div className="absolute bottom-10 left-10 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-float" style={{ animationDelay: "2.5s" }} />
      <div className="absolute top-1/3 left-1/4 w-64 h-64 bg-indigo-500/5 rounded-full blur-3xl animate-float" style={{ animationDelay: "5s" }} />
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJNMCAwaDQwdjQwSDB6IiBmaWxsPSJub25lIiBzdHJva2U9InJnYmEoMTY4LCA4NSwgMjQ3LCAwLjAzKSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9zdmc+')] opacity-50" />

      <div className="relative w-full max-w-md px-4 py-8">
        <div className="animate-fade-up card-delay-1 text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 via-blue-400 to-purple-400 bg-clip-text text-transparent"
              style={{ backgroundSize: "200% auto", animation: "shimmer 4s ease-in-out infinite" }}>
            Criar Conta
          </h1>
          <p className="text-gray-500 mt-2 text-sm">Comece sua jornada de aprendizado</p>
        </div>

        <div className="animate-fade-up card-delay-2 bg-[#161b22]/80 backdrop-blur-xl border border-gray-800 rounded-2xl p-8 space-y-5 animate-glow">
          {msgErro && (
            <div className="bg-red-900/20 border border-red-800/30 rounded-xl px-4 py-2.5 text-sm text-red-400 text-center">
              {msgErro}
            </div>
          )}

          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs text-gray-500 uppercase tracking-wider font-medium">Nome</label>
              <input
                type="text"
                value={nome}
                onChange={e => setNome(e.target.value)}
                placeholder="Seu nome"
                className="w-full bg-[#0d1117] border border-gray-800 rounded-xl px-4 py-3 text-sm text-gray-200 placeholder-gray-600 focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500/40 transition-all"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs text-gray-500 uppercase tracking-wider font-medium">Email</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="seu@email.com"
                className="w-full bg-[#0d1117] border border-gray-800 rounded-xl px-4 py-3 text-sm text-gray-200 placeholder-gray-600 focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500/40 transition-all"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs text-gray-500 uppercase tracking-wider font-medium">Senha</label>
              <input
                type="password"
                value={senha}
                onChange={e => setSenha(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-[#0d1117] border border-gray-800 rounded-xl px-4 py-3 text-sm text-gray-200 placeholder-gray-600 focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500/40 transition-all"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs text-gray-500 uppercase tracking-wider font-medium">Confirmar senha</label>
              <input
                type="password"
                value={confirmar}
                onChange={e => setConfirmar(e.target.value)}
                onKeyDown={e => e.key === "Enter" && handleCadastrar()}
                placeholder="••••••••"
                className="w-full bg-[#0d1117] border border-gray-800 rounded-xl px-4 py-3 text-sm text-gray-200 placeholder-gray-600 focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500/40 transition-all"
              />
            </div>
          </div>

          <button
            onClick={handleCadastrar}
            disabled={!email || !senha || !nome || enviando}
            className="relative w-full py-3 rounded-xl font-medium text-sm text-white overflow-hidden group transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span className="absolute inset-0 bg-gradient-to-r from-purple-600 via-blue-500 to-purple-600 bg-[length:200%_100%] animate-gradient" />
            <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent bg-[length:200%_100%] group-hover:animate-[shimmer_1.5s_ease-in-out_infinite]" />
            <span className="relative flex items-center justify-center gap-2">
              {enviando && <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
              Criar conta
            </span>
          </button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-800" />
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="bg-[#161b22] px-3 text-gray-500">ou cadastre-se com</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={logarGoogle}
              disabled={enviando}
              className="flex items-center justify-center gap-2 bg-[#0d1117] border border-gray-800 rounded-xl px-4 py-2.5 text-sm text-gray-300 hover:border-gray-600 hover:text-white transition-all active:scale-[0.98] disabled:opacity-50"
              aria-label="Cadastrar com Google"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24"><path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/><path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
              Google
            </button>
            <button
              disabled
              className="flex items-center justify-center gap-2 bg-[#0d1117] border border-gray-800 rounded-xl px-4 py-2.5 text-sm text-gray-500 cursor-not-allowed"
              aria-label="Cadastrar com GitHub (em breve)"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24"><path fill="currentColor" d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
              GitHub <span className="text-[10px] text-gray-600">em breve</span>
            </button>
          </div>
        </div>

        <div className="animate-fade-up card-delay-3 text-center mt-6">
          <p className="text-sm text-gray-500">
            Já tem conta?{" "}
            <Link href="/" className="text-purple-400 hover:text-purple-300 transition-colors font-medium">
              Fazer login
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
