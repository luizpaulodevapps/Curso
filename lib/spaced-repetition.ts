import { RegistroFlashcard } from "./types"

const INTERVALOS = [1, 3, 7, 14, 30, 60, 120]

export function criarFlashcard(
  pergunta: string,
  resposta: string,
  cursoId: string,
  moduloId: string
): RegistroFlashcard {
  return {
    id: crypto.randomUUID?.() ?? `${Date.now()}-${Math.random()}`,
    pergunta,
    resposta,
    cursoId,
    moduloId,
    intervalo: 0,
    revisoes: 0,
    proximaRevisao: Date.now(),
    facilidade: 2.5,
  }
}

export function revisarFlashcard(
  card: RegistroFlashcard,
  qualidade: number
): RegistroFlashcard {
  if (qualidade < 3) {
    card.intervalo = 1
    card.revisoes = 0
  } else {
    card.revisoes++
    const idx = Math.min(card.revisoes - 1, INTERVALOS.length - 1)
    card.intervalo = INTERVALOS[idx]
  }

  card.facilidade = Math.max(
    1.3,
    card.facilidade + 0.1 + (qualidade - 3) * (0.1 + 0.04 * (1 - card.facilidade))
  )

  card.proximaRevisao = Date.now() + card.intervalo * 24 * 60 * 60 * 1000
  return card
}

export function flashcardsPendentes(cards: RegistroFlashcard[]): RegistroFlashcard[] {
  const agora = Date.now()
  return cards
    .filter((c) => c.proximaRevisao <= agora)
    .sort((a, b) => a.proximaRevisao - b.proximaRevisao)
}

export function flashcardsHoje(cards: RegistroFlashcard[]): number {
  return flashcardsPendentes(cards).length
}
