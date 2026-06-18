"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { getCursos, getModulos } from "@/lib/data-loader"
import type { Curso, Modulo, Questao } from "@/lib/types"
import { useProfile } from "@/lib/use-profile"

type CursoComStats = Curso & {
  totalQuestoes: number
  modulosCarregados: number
}

export default function AdminPage() {
  const [cursos, setCursos] = useState<CursoComStats[]>([])
  const [moduloAberto, setModuloAberto] = useState<string | null>(null)
  const [dadosModulo, setDadosModulo] = useState<Modulo | null>(null)
  const { perfil } = useProfile()

  useEffect(() => {
    getCursos().then(async lista => {
      const comStats: CursoComStats[] = []
      for (const c of lista) {
        const mods = await getModulos(c.id)
        const valida = mods.filter((m): m is Modulo => m !== null)
        comStats.push({
          ...c,
          modulosCarregados: valida.length,
          totalQuestoes: valida.reduce((acc, m) => acc + m.questoes.length, 0),
        })
      }
      setCursos(comStats)
    })
  }, [])

  const abrirModulo = async (chave: string) => {
    const [cursoId, moduloId] = chave.split("/")
    if (moduloAberto === chave) { setModuloAberto(null); return }
    setModuloAberto(chave)
    const mod = await getModulos(cursoId)
    const encontrado = mod.find((m): m is Modulo => m?.id === moduloId)
    setDadosModulo(encontrado ?? null)
  }

  const totalUsuarios = perfil.totalQuestoes > 0 ? 1 : 0
  const totalQuestoesSistema = cursos.reduce((a, c) => a + c.totalQuestoes, 0)

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <div className="max-w-5xl mx-auto px-4 py-12 space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">Admin</h1>
            <p className="text-sm text-gray-500 mt-1">Gerenciamento de cursos e conteúdo</p>
          </div>
          <span className="text-[10px] uppercase tracking-wider text-gray-600 bg-gray-900 px-3 py-1.5 rounded-full border border-gray-800">
            {totalQuestoesSistema} questões · {cursos.length} cursos
          </span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-[#161b22] border border-gray-800 rounded-xl p-4">
            <p className="text-2xl font-bold text-white">{cursos.length}</p>
            <p className="text-xs text-gray-500 mt-1">Cursos</p>
          </div>
          <div className="bg-[#161b22] border border-gray-800 rounded-xl p-4">
            <p className="text-2xl font-bold text-white">{totalQuestoesSistema}</p>
            <p className="text-xs text-gray-500 mt-1">Questões</p>
          </div>
          <div className="bg-[#161b22] border border-gray-800 rounded-xl p-4">
            <p className="text-2xl font-bold text-white">
              {cursos.reduce((a, c) => a + c.modulosCarregados, 0)}
            </p>
            <p className="text-xs text-gray-500 mt-1">Módulos</p>
          </div>
          <div className="bg-[#161b22] border border-gray-800 rounded-xl p-4">
            <p className="text-2xl font-bold text-white">{totalUsuarios}</p>
            <p className="text-xs text-gray-500 mt-1">Usuários ativos</p>
          </div>
        </div>

        <div className="space-y-3">
          <h2 className="text-sm text-gray-500 uppercase tracking-wider font-medium">Cursos</h2>
          {cursos.map(curso => (
            <div key={curso.id} className="bg-[#161b22] border border-gray-800 rounded-xl overflow-hidden">
              <Link
                href={`/cursos/${curso.id}`}
                className="flex items-center gap-4 p-4 hover:bg-gray-800/30 transition-colors"
              >
                <span className="text-2xl">{curso.icone}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white truncate">{curso.nome}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{curso.moduloLista.length} módulos · {curso.totalQuestoes} questões</p>
                </div>
                <span className="text-[10px] text-gray-600 bg-gray-900 px-2 py-1 rounded-full">{curso.nivel}</span>
              </Link>
              <div className="border-t border-gray-800">
                {curso.moduloLista.map(modId => {
                  const chave = `${curso.id}/${modId}`
                  const aberto = moduloAberto === chave
                  return (
                    <div key={modId}>
                      <button
                        onClick={() => abrirModulo(chave)}
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-left hover:bg-gray-800/20 transition-colors"
                      >
                        <svg
                          className={`w-3 h-3 text-gray-600 transition-transform ${aberto ? "rotate-90" : ""}`}
                          fill="none" viewBox="0 0 24 24" stroke="currentColor"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                        <span className="text-xs text-gray-400">{modId}</span>
                      </button>
                      {aberto && dadosModulo && dadosModulo.id === modId && (
                        <div className="px-4 pb-3 space-y-1">
                          <p className="text-xs text-gray-500">{dadosModulo.nome}</p>
                          <p className="text-xs text-gray-600">{dadosModulo.questoes.length} questões</p>
                          <div className="mt-2 max-h-48 overflow-y-auto space-y-1">
                            {dadosModulo.questoes.map((q: Questao) => (
                              <div key={q.id} className="flex items-center justify-between text-xs bg-gray-900/50 rounded-lg px-3 py-1.5">
                                <span className="text-gray-400 truncate flex-1">{q.id} — {q.titulo}</span>
                                <span className="text-gray-600 shrink-0 ml-2">{q.nivel} · {q.xp}XP</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
