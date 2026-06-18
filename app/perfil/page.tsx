"use client"

import { useState } from "react"
import { useAuth } from "@/lib/use-auth"
import Link from "next/link"

export default function PerfilPage() {
  const { user, enviando, erro, sair, atualizarNome } = useAuth()
  const [editando, setEditando] = useState(false)
  const [nome, setNome] = useState(user?.displayName || "")

  if (!user) return null

  const handleSalvar = async () => {
    await atualizarNome(nome)
    if (!erro) setEditando(false)
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <div className="max-w-2xl mx-auto px-4 py-12 space-y-8">
        <div>
          <h1 className="text-2xl font-bold text-white">Perfil</h1>
          <p className="text-sm text-gray-500 mt-1">Suas informações da conta</p>
        </div>

        {erro && (
          <div className="bg-red-900/20 border border-red-800/30 rounded-xl px-4 py-2.5 text-sm text-red-400">
            {erro}
          </div>
        )}

        <div className="bg-[#161b22] border border-gray-800 rounded-2xl p-6 space-y-6">
          <div className="flex items-center gap-4">
            {user.photoURL ? (
              <img src={user.photoURL} alt="" className="w-16 h-16 rounded-full" />
            ) : (
              <div className="w-16 h-16 rounded-full bg-blue-600/30 flex items-center justify-center text-2xl text-blue-300 font-bold">
                {(user.displayName || user.email || "U")[0].toUpperCase()}
              </div>
            )}
            <div className="flex-1 min-w-0">
              {editando ? (
                <div className="space-y-2">
                  <input
                    type="text"
                    value={nome}
                    onChange={e => setNome(e.target.value)}
                    onKeyDown={e => e.key === "Enter" && handleSalvar()}
                    className="w-full bg-[#0d1117] border border-gray-800 rounded-lg px-3 py-2 text-sm text-gray-200 focus:border-blue-500 focus:outline-none"
                    aria-label="Nome"
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={handleSalvar}
                      disabled={enviando || !nome.trim()}
                      className="text-xs bg-blue-600 hover:bg-blue-500 disabled:opacity-50 px-3 py-1.5 rounded-lg text-white transition-colors"
                    >
                      {enviando ? "Salvando..." : "Salvar"}
                    </button>
                    <button
                      onClick={() => { setEditando(false); setNome(user.displayName || "") }}
                      className="text-xs text-gray-500 hover:text-gray-300 px-3 py-1.5 transition-colors"
                    >
                      Cancelar
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <h2 className="text-lg font-medium text-white truncate">
                    {user.displayName || "Sem nome"}
                  </h2>
                  <p className="text-sm text-gray-500 truncate">{user.email}</p>
                </>
              )}
            </div>
            {!editando && (
              <button
                onClick={() => setEditando(true)}
                className="text-xs text-blue-500 hover:text-blue-400 transition-colors"
              >
                Editar
              </button>
            )}
          </div>

          <div className="border-t border-gray-800 pt-4 space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Email</span>
              <span className="text-gray-300">{user.email}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Email verificado</span>
              <span className={user.emailVerified ? "text-green-400" : "text-yellow-400"}>
                {user.emailVerified ? "Sim" : "Não"}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Método de login</span>
              <span className="text-gray-300">
                {user.providerData.map(p => p?.providerId).join(", ")}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Conta criada em</span>
              <span className="text-gray-300">
                {user.metadata.creationTime
                  ? new Date(user.metadata.creationTime).toLocaleDateString("pt-BR")
                  : "—"}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-[#161b22] border border-gray-800 rounded-2xl p-6 space-y-4">
          <h2 className="text-lg font-medium text-white">Ações</h2>
          <div className="space-y-3">
            <Link
              href="/cursos"
              className="block w-full text-center py-3 rounded-xl bg-blue-600/20 border border-blue-800/30 text-blue-400 text-sm hover:bg-blue-600/30 transition-colors"
            >
              Ver meus cursos
            </Link>
            <button
              onClick={sair}
              className="block w-full text-center py-3 rounded-xl bg-red-900/20 border border-red-800/30 text-red-400 text-sm hover:bg-red-900/30 transition-colors"
            >
              Sair da conta
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
