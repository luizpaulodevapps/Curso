"use client"

import { useState } from "react"
import { useProfile } from "@/lib/use-profile"

export default function FlashcardsPage() {
  const { perfil, pendentes, revisarFlashcards } = useProfile()
  const [index, setIndex] = useState(0)
  const [virado, setVirado] = useState(false)
  const [qualidade, setQualidade] = useState<number | null>(null)

  const fila = pendentes.length > 0 ? pendentes : perfil.flashcards
  const card = fila[index]

  function handleQualidade(q: number) {
    if (card) {
      revisarFlashcards(card.id, q)
    }
    setQualidade(q)
    setTimeout(() => {
      setVirado(false)
      setQualidade(null)
      if (index < fila.length - 1) {
        setIndex(i => i + 1)
      } else {
        setIndex(0)
      }
    }, 600)
  }

  return (
    <div className="max-w-3xl mx-auto p-4 md:p-8 space-y-6">
      <h1 className="text-3xl font-bold">Flashcards</h1>
      <p className="text-gray-400">
        {pendentes.length} pendentes • {perfil.flashcards.length} total
      </p>

      {fila.length === 0 ? (
        <div className="bg-[#1a1a2e] rounded-2xl p-12 border border-gray-800 text-center">
          <p className="text-4xl mb-4">🃏</p>
          <p className="text-gray-400">
            Nenhum flashcard ainda. Complete algumas questões para gerar flashcards automaticamente.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="text-center text-sm text-gray-500">
            {index + 1} de {fila.length}
          </div>

          <div
            onClick={() => !virado && setVirado(true)}
            className="bg-[#1a1a2e] rounded-2xl p-8 border border-gray-800 min-h-[200px] flex items-center justify-center cursor-pointer hover:border-blue-500/50 transition-all"
          >
            <div className="text-center">
              <p className="text-sm text-gray-500 mb-4">
                {virado ? "Resposta" : "Pergunta"}
              </p>
              <p className="text-xl font-medium">
                {virado ? card?.resposta : card?.pergunta}
              </p>
              {!virado && (
                <p className="text-sm text-gray-500 mt-6">Clique para ver a resposta</p>
              )}
            </div>
          </div>

          {virado && qualidade === null && (
            <div className="space-y-2">
              <p className="text-sm text-gray-500 text-center mb-2">Qual foi sua facilidade?</p>
              <div className="flex gap-2 justify-center">
                {[1, 2, 3, 4, 5].map((q) => (
                  <button
                    key={q}
                    onClick={() => handleQualidade(q)}
                    className="px-4 py-2 rounded-xl bg-gray-800 hover:bg-gray-700 transition-colors text-sm"
                  >
                    {q === 1 ? "😵" : q === 2 ? "😕" : q === 3 ? "😐" : q === 4 ? "😊" : "😎"} {q}
                  </button>
                ))}
              </div>
            </div>
          )}

          {qualidade !== null && (
            <div className="text-center text-sm text-green-400 animate-pulse">
              {qualidade >= 3 ? "Bom! Intervalo aumentado. ✅" : "Vamos revisar novamente amanhã. 🔄"}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
