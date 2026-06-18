import { calcularNivel, Nivel, Perfil, xpParaProximoNivel, Questao, NIVEIS } from "./types"
import { carregarPerfil, salvarPerfil } from "./storage"

export interface ResultadoQuestao {
  correta: boolean
  xpGanho: number
  respostaUsuario: string
}

export function responderQuestao(
  perfil: Perfil,
  questao: Questao,
  respostaUsuario: string
): ResultadoQuestao {
  const correta = normalizarResposta(respostaUsuario) === normalizarResposta(questao.correta)

  perfil.totalQuestoes++
  if (correta) {
    perfil.acertos++
    perfil.xp += questao.xp
  } else {
    perfil.erros++
  }

  atualizarStreak(perfil)
  salvarPerfil(perfil)

  return {
    correta,
    xpGanho: correta ? questao.xp : 0,
    respostaUsuario,
  }
}

export function getNivelAtual(perfil: Perfil): Nivel {
  return calcularNivel(perfil.xp)
}

export function getXpRestante(perfil: Perfil): number {
  return xpParaProximoNivel(perfil.xp)
}

export function getProgressoGeral(perfil: Perfil): { total: number; completo: number; porcentagem: number } {
  const total = perfil.totalQuestoes || 1
  const completo = perfil.acertos
  return {
    total,
    completo,
    porcentagem: Math.round((completo / total) * 100),
  }
}

function normalizarResposta(resposta: string): string {
  return resposta.trim().toLowerCase().replace(/\s+/g, " ")
}

function atualizarStreak(perfil: Perfil): void {
  const hoje = new Date().toISOString().split("T")[0]
  const ultimo = perfil.ultimoAcesso

  if (ultimo === hoje) return

  const ontem = new Date()
  ontem.setDate(ontem.getDate() - 1)
  const ontemStr = ontem.toISOString().split("T")[0]

  if (ultimo === ontemStr) {
    perfil.streak++
  } else {
    perfil.streak = 1
  }

  perfil.ultimoAcesso = hoje
}
