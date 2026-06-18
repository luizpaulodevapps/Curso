import cursosData from "../data/cursos.json"
import { Curso, Modulo, Questao } from "./types"

type CursosJSON = { cursos: Curso[] }

export interface ProgressoCursosMap {
  [chave: string]: {
    questoesRespondidas: Record<string, boolean>
    concluido?: boolean
  }
}

const catalogo = (cursosData as CursosJSON).cursos

const cacheModulos = new Map<string, Modulo>()

export async function getCursos(): Promise<Curso[]> {
  return catalogo
}

export async function getCurso(id: string): Promise<Curso | undefined> {
  return catalogo.find(c => c.id === id)
}

export async function getModulo(cursoId: string, moduloId: string): Promise<Modulo | undefined> {
  const key = `${cursoId}/${moduloId}`
  if (cacheModulos.has(key)) return cacheModulos.get(key)

  try {
    const res = await fetch(`/api/data/${cursoId}/${moduloId}`)
    if (!res.ok) return undefined
    const mod = await res.json() as Modulo
    cacheModulos.set(key, mod)
    return mod
  } catch {
    return undefined
  }
}

export async function getModulos(cursoId: string): Promise<(Modulo | null)[]> {
  const curso = await getCurso(cursoId)
  if (!curso) return []

  const modulos = await Promise.all(
    curso.moduloLista.map(id => getModulo(cursoId, id))
  )
  return modulos.map(m => m ?? null)
}

export async function getQuestao(cursoId: string, moduloId: string, questaoId: string): Promise<Questao | undefined> {
  const modulo = await getModulo(cursoId, moduloId)
  if (!modulo) return undefined
  return modulo.questoes.find(q => q.id === questaoId)
}

export interface ContextoQuestao {
  questao: Questao
  modulo: Modulo
  curso: Curso
  indexNoModulo: number
  totalNoModulo: number
  indiceGlobal: number
  totalGlobal: number
  proxima: { moduloId: string; questaoId: string } | null
  anterior: { moduloId: string; questaoId: string } | null
}

export async function continuarEstudos(
  progresso: ProgressoCursosMap
): Promise<{ cursoId: string; moduloId: string; questaoId: string } | null> {
  for (const curso of catalogo) {
    const modulos = (await getModulos(curso.id)).filter((m): m is Modulo => m !== null)
    modulos.sort((a, b) => a.ordem - b.ordem)

    for (const modulo of modulos) {
      const chave = `${curso.id}/${modulo.id}`
      const prog = progresso[chave]

      for (const questao of modulo.questoes) {
        const respondida = prog?.questoesRespondidas?.[questao.id] !== undefined
        if (!respondida) {
          return { cursoId: curso.id, moduloId: modulo.id, questaoId: questao.id }
        }
      }
    }
  }
  return null
}

export async function getContextoQuestao(
  cursoId: string, moduloId: string, questaoId: string
): Promise<ContextoQuestao | null> {
  const curso = await getCurso(cursoId)
  if (!curso) return null

  const modulo = await getModulo(cursoId, moduloId)
  if (!modulo) return null

  const questao = modulo.questoes.find(q => q.id === questaoId)
  if (!questao) return null

  const modulos = (await getModulos(cursoId)).filter((m): m is Modulo => m !== null)
  modulos.sort((a, b) => a.ordem - b.ordem)

  const flat = modulos.flatMap(m => m.questoes.map(q => ({ moduloId: m.id, questaoId: q.id, questao: q })))

  const idx = flat.findIndex(x => x.moduloId === moduloId && x.questaoId === questaoId)

  return {
    questao,
    modulo,
    curso,
    indexNoModulo: modulo.questoes.findIndex(q => q.id === questaoId),
    totalNoModulo: modulo.questoes.length,
    indiceGlobal: idx,
    totalGlobal: flat.length,
    proxima: idx >= 0 && idx < flat.length - 1 ? flat[idx + 1] : null,
    anterior: idx > 0 ? flat[idx - 1] : null,
  }
}
