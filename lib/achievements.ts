import { Conquista, Perfil } from "./types"

export const CONQUISTAS: Conquista[] = [
  {
    id: "primeiro-acerto",
    titulo: "Primeiro Passo",
    descricao: "Acertou sua primeira questão",
    icone: "🎯",
    condicao: (p) => p.acertos >= 1,
  },
  {
    id: "dez-acertos",
    titulo: "Aprendiz",
    descricao: "Acertou 10 questões",
    icone: "⭐",
    condicao: (p) => p.acertos >= 10,
  },
  {
    id: "cem-acertos",
    titulo: "Centenário",
    descricao: "Acertou 100 questões",
    icone: "💯",
    condicao: (p) => p.acertos >= 100,
  },
  {
    id: "streak-3",
    titulo: "Consistente",
    descricao: "Manteve streak de 3 dias",
    icone: "🔥",
    condicao: (p) => p.streak >= 3,
  },
  {
    id: "streak-7",
    titulo: "Determinado",
    descricao: "Manteve streak de 7 dias",
    icone: "🔥🔥",
    condicao: (p) => p.streak >= 7,
  },
  {
    id: "streak-30",
    titulo: "Imparável",
    descricao: "Manteve streak de 30 dias",
    icone: "💪",
    condicao: (p) => p.streak >= 30,
  },
  {
    id: "xp-100",
    titulo: "Colecionador de XP",
    descricao: "Acumulou 100 XP",
    icone: "📈",
    condicao: (p) => p.xp >= 100,
  },
  {
    id: "xp-1000",
    titulo: "Mestre do XP",
    descricao: "Acumulou 1000 XP",
    icone: "🏆",
    condicao: (p) => p.xp >= 1000,
  },
  {
    id: "nivel-3",
    titulo: "Dedicado",
    descricao: "Alcançou o nível 3",
    icone: "🌟",
    condicao: (p) => {
      const nivel = Math.floor(p.xp / 100) + 1
      return nivel >= 3
    },
  },
  {
    id: "nivel-5",
    titulo: "Avançado",
    descricao: "Alcançou o nível 5",
    icone: "👑",
    condicao: (p) => {
      const nivel = Math.floor(p.xp / 100) + 1
      return nivel >= 5
    },
  },
  {
    id: "sem-erros",
    titulo: "Perfeição",
    descricao: "Completou 10 questões sem nenhum erro",
    icone: "✨",
    condicao: (p) => p.acertos >= 10 && p.erros === 0,
  },
  {
    id: "primeiro-curso",
    titulo: "Estudante",
    descricao: "Concluiu seu primeiro curso",
    icone: "🎓",
    condicao: (p) =>
      Object.values(p.progressoCursos).filter((c) => c.concluido).length >= 1,
  },
]

export function verificarNovasConquistas(perfil: Perfil): Conquista[] {
  const novas: Conquista[] = []
  const jaTem = new Set(perfil.conquistas)

  for (const conquista of CONQUISTAS) {
    if (!jaTem.has(conquista.id) && conquista.condicao(perfil)) {
      novas.push(conquista)
    }
  }

  return novas
}

export function desbloquearConquistas(perfil: Perfil, conquistas: Conquista[]): void {
  for (const c of conquistas) {
    if (!perfil.conquistas.includes(c.id)) {
      perfil.conquistas.push(c.id)
    }
  }
}
