"use client"

import { useState, useEffect, useMemo } from "react"
import Link from "next/link"
import { getCursos, getModulo } from "@/lib/data-loader"
import type { Curso, Questao } from "@/lib/types"

type ResultadoBusca = {
  tipo: "curso" | "modulo" | "questao"
  cursoId: string
  cursoNome: string
  moduloId?: string
  moduloNome?: string
  questao?: Questao
  trecho: string
}

export default function BuscaPage() {
  const [cursos, setCursos] = useState<Curso[]>([])
  const [termo, setTermo] = useState("")
  const [buscando, setBuscando] = useState(false)
  const [resultados, setResultados] = useState<ResultadoBusca[]>([])

  useEffect(() => {
    getCursos().then(setCursos)
  }, [])

  useEffect(() => {
    const q = termo.trim().toLowerCase()
    if (!q || q.length < 2) { setResultados([]); return }

    const timer = setTimeout(async () => {
      setBuscando(true)
      const encontrados: ResultadoBusca[] = []

      for (const curso of cursos) {
        if (curso.nome.toLowerCase().includes(q) || curso.descricao.toLowerCase().includes(q)) {
          encontrados.push({ tipo: "curso", cursoId: curso.id, cursoNome: curso.nome, trecho: curso.descricao.slice(0, 120) })
        }
        for (const modId of curso.moduloLista) {
          if (modId.toLowerCase().includes(q)) {
            encontrados.push({ tipo: "modulo", cursoId: curso.id, cursoNome: curso.nome, moduloId: modId, trecho: "" })
          }
          try {
            const mod = await getModulo(curso.id, modId)
            if (!mod) continue
            if (!encontrados.some(r => r.tipo === "modulo" && r.moduloId === modId && r.cursoId === curso.id) &&
                (mod.nome.toLowerCase().includes(q) || mod.descricao.toLowerCase().includes(q))) {
              encontrados.push({ tipo: "modulo", cursoId: curso.id, cursoNome: curso.nome, moduloId: modId, moduloNome: mod.nome, trecho: mod.descricao.slice(0, 120) })
            }
            for (const questao of mod.questoes) {
              const matchTitulo = questao.titulo.toLowerCase().includes(q)
              const matchPergunta = questao.pergunta.toLowerCase().includes(q)
              const matchTags = questao.tags?.some(t => t.toLowerCase().includes(q))
              if (matchTitulo || matchPergunta || matchTags) {
                encontrados.push({
                  tipo: "questao",
                  cursoId: curso.id,
                  cursoNome: curso.nome,
                  moduloId: modId,
                  moduloNome: mod.nome,
                  questao,
                  trecho: questao.pergunta.slice(0, 100),
                })
              }
            }
          } catch { /* skip */ }
        }
      }

      setResultados(encontrados.slice(0, 50))
      setBuscando(false)
    }, 300)

    return () => clearTimeout(timer)
  }, [termo, cursos])

  const grouped = useMemo(() => {
    const g: Record<string, ResultadoBusca[]> = {}
    for (const r of resultados) {
      const chave = r.tipo === "curso" ? "Cursos" : r.tipo === "modulo" ? "Módulos" : "Questões"
      if (!g[chave]) g[chave] = []
      g[chave].push(r)
    }
    return g
  }, [resultados])

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <div className="max-w-3xl mx-auto px-4 py-12 space-y-6">
        <h1 className="text-2xl font-bold text-white">Buscar</h1>

        <div className="relative">
          <input
            type="search"
            value={termo}
            onChange={e => setTermo(e.target.value)}
            placeholder="Buscar cursos, módulos ou questões..."
            className="w-full bg-[#161b22] border border-gray-800 rounded-xl px-4 py-3 pl-11 text-sm text-gray-200 placeholder-gray-600 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500/40 transition-all"
            aria-label="Buscar"
            autoFocus
          />
          <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>

        {buscando && (
          <div className="flex justify-center py-8">
            <div className="w-5 h-5 border-2 border-blue-400 border-t-transparent rounded-full animate-spin" />
          </div>
        )}

        {!buscando && termo.length >= 2 && resultados.length === 0 && (
          <p className="text-sm text-gray-500 text-center py-8">Nenhum resultado encontrado</p>
        )}

        {Object.entries(grouped).map(([grupo, items]) => (
          <div key={grupo} className="space-y-3">
            <h2 className="text-xs text-gray-500 uppercase tracking-wider font-medium">{grupo} ({items.length})</h2>
            <div className="space-y-2">
              {items.map((r, i) => (
                <Link
                  key={`${r.tipo}-${r.cursoId}-${r.moduloId || ""}-${r.questao?.id || i}`}
                  href={r.tipo === "questao" && r.moduloId
                    ? `/cursos/${r.cursoId}/modulo/${r.moduloId}`
                    : r.tipo === "modulo"
                    ? `/cursos/${r.cursoId}/modulo/${r.moduloId}`
                    : `/cursos/${r.cursoId}`
                  }
                  className="block bg-[#161b22] border border-gray-800 rounded-xl p-4 hover:border-gray-700 transition-colors"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] uppercase tracking-wider text-gray-600 font-medium">
                          {r.tipo === "curso" ? "Curso" : r.tipo === "modulo" ? "Módulo" : "Questão"}
                        </span>
                        <span className="text-[10px] text-gray-700">·</span>
                        <span className="text-[10px] text-gray-600">{r.cursoNome}</span>
                        {r.moduloNome && (
                          <>
                            <span className="text-[10px] text-gray-700">·</span>
                            <span className="text-[10px] text-gray-600 truncate">{r.moduloNome}</span>
                          </>
                        )}
                      </div>
                      <p className="text-sm text-white mt-1 font-medium truncate">
                        {r.tipo === "questao" ? r.questao?.titulo : r.tipo === "modulo" ? r.moduloNome : r.cursoNome}
                      </p>
                      {r.trecho && (
                        <p className="text-xs text-gray-500 mt-1 line-clamp-2">{r.trecho}</p>
                      )}
                    </div>
                    {r.questao && (
                      <span className="text-[10px] text-gray-600 shrink-0">
                        {r.questao.nivel} · {r.questao.xp} XP
                      </span>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        ))}

        {!buscando && resultados.length === 0 && termo.length < 2 && (
          <p className="text-sm text-gray-500 text-center py-8">
            Digite pelo menos 2 caracteres para buscar
          </p>
        )}
      </div>
    </div>
  )
}
