"use client"

import { useState } from "react"
import { ROADMAP_JAVASCRIPT, ROADMAP_SAAS } from "@/lib/roadmap"
import type { FaseRoadmap } from "@/lib/types"

const roadmaps: Record<string, { titulo: string; fases: FaseRoadmap[] }> = {
  javascript: { titulo: "JavaScript Completo", fases: ROADMAP_JAVASCRIPT },
  saas: { titulo: "JavaScript para Construir SaaS", fases: ROADMAP_SAAS },
}

export default function RoadmapPage() {
  const [selecionado, setSelecionado] = useState("javascript")
  const roadmap = roadmaps[selecionado]

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-8 space-y-6">
      <h1 className="text-3xl font-bold">Roadmap de Carreira</h1>
      <p className="text-gray-400">Sua trilha de aprendizado passo a passo</p>

      <div className="flex gap-2">
        {Object.entries(roadmaps).map(([key, r]) => (
          <button
            key={key}
            onClick={() => setSelecionado(key)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              selecionado === key
                ? "bg-blue-600 text-white"
                : "bg-gray-800 text-gray-400 hover:bg-gray-700"
            }`}
          >
            {r.titulo}
          </button>
        ))}
      </div>

      <div className="relative">
        <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gray-800" />

        <div className="space-y-6">
          {roadmap.fases.map((fase) => (
            <div key={fase.fase} className="relative pl-14">
              <div className="absolute left-4 top-1 w-5 h-5 rounded-full bg-blue-600 border-4 border-[#0a0a0a] z-10" />

              <div className="bg-[#1a1a2e] rounded-xl p-5 border border-gray-800">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="text-lg font-bold">
                      Fase {fase.fase} — {fase.titulo}
                    </h3>
                    <span className="inline-block px-2 py-0.5 bg-purple-600/20 text-purple-400 text-xs rounded-full mt-1">
                      {fase.duracao}
                    </span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-1.5 mb-3">
                  {fase.topicos.map((topico) => (
                    <span
                      key={topico}
                      className="px-2 py-0.5 bg-gray-800 text-gray-300 text-xs rounded-full"
                    >
                      {topico}
                    </span>
                  ))}
                </div>

                <div className="flex items-center gap-2 text-sm text-gray-400">
                  <span className="text-lg">🚀</span>
                  <span>Projeto: <strong className="text-white">{fase.projeto}</strong></span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
