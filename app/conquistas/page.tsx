"use client"

import { useProfile } from "@/lib/use-profile"
import { CONQUISTAS } from "@/lib/achievements"

export default function ConquistasPage() {
  const { perfil } = useProfile()
  const desbloqueadas = new Set(perfil.conquistas)

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-8 space-y-6">
      <h1 className="text-3xl font-bold">Conquistas</h1>
      <p className="text-gray-400">
        {desbloqueadas.size} de {CONQUISTAS.length} conquistas desbloqueadas
      </p>

      <div className="grid gap-3 md:grid-cols-2">
        {CONQUISTAS.map((c) => {
          const tem = desbloqueadas.has(c.id)
          return (
            <div
              key={c.id}
              className={`rounded-xl p-4 border transition-all ${
                tem
                  ? "bg-[#1a1a2e] border-yellow-500/30"
                  : "bg-[#1a1a2e]/50 border-gray-800 opacity-50"
              }`}
            >
              <div className="flex items-start gap-3">
                <span className={`text-3xl ${tem ? "" : "grayscale"}`}>
                  {c.icone}
                </span>
                <div>
                  <h3 className={`font-bold ${tem ? "text-yellow-400" : "text-gray-500"}`}>
                    {c.titulo}
                  </h3>
                  <p className={`text-sm ${tem ? "text-gray-400" : "text-gray-600"}`}>
                    {c.descricao}
                  </p>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
