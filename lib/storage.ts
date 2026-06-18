import { Perfil, ProgressoUsuario } from "./types"

const PERFIL_KEY = "estudos-perfil"
const PROGRESSO_PREFIX = "estudos-progresso-"

export function perfilVazio(): Perfil {
  return {
    nome: "Aluno",
    xp: 0,
    streak: 0,
    ultimoAcesso: new Date().toISOString().split("T")[0],
    totalQuestoes: 0,
    acertos: 0,
    erros: 0,
    tempoEstudo: 0,
    conquistas: [],
    progressoCursos: {},
    flashcards: [],
  }
}

export function carregarPerfil(): Perfil {
  if (typeof window === "undefined") return perfilVazio()
  try {
    const raw = localStorage.getItem(PERFIL_KEY)
    if (!raw) return perfilVazio()
    return JSON.parse(raw) as Perfil
  } catch {
    return perfilVazio()
  }
}

export function salvarPerfil(perfil: Perfil): void {
  if (typeof window === "undefined") return
  localStorage.setItem(PERFIL_KEY, JSON.stringify(perfil))
}

export function carregarProgresso(cursoId: string, moduloId: string): ProgressoUsuario | null {
  if (typeof window === "undefined") return null
  try {
    const raw = localStorage.getItem(`${PROGRESSO_PREFIX}${cursoId}-${moduloId}`)
    if (!raw) return null
    return JSON.parse(raw) as ProgressoUsuario
  } catch {
    return null
  }
}

export function salvarProgresso(cursoId: string, moduloId: string, progresso: ProgressoUsuario): void {
  if (typeof window === "undefined") return
  localStorage.setItem(`${PROGRESSO_PREFIX}${cursoId}-${moduloId}`, JSON.stringify(progresso))
}

export function limparDados(): void {
  if (typeof window === "undefined") return
  const keys = Object.keys(localStorage).filter(k => k.startsWith("estudos-"))
  keys.forEach(k => localStorage.removeItem(k))
}
