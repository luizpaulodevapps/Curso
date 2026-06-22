import staticCursosData from "../data/cursos.json"
import { Curso, Modulo, Questao } from "./types"
import { db } from "./firebase"
import { collection, getDocs, doc, getDoc } from "firebase/firestore"

type CursosJSON = { cursos: Curso[] }
const staticCatalogo = (staticCursosData as CursosJSON).cursos

export interface ProgressoCursosMap {
  [chave: string]: {
    questoesRespondidas: Record<string, boolean>
    concluido?: boolean
  }
}

const CACHE_CURSOS_KEY = "cache-db/cursos"
const CACHE_MODULO_PREFIX = "cache-db/modulo/"
const CACHE_EXPIRATION_MS = 10 * 60 * 1000 // 10 minutos

interface CacheItem<T> {
  data: T
  timestamp: number
}

function getFromCache<T>(key: string): T | null {
  if (typeof window === "undefined") return null
  try {
    const raw = localStorage.getItem(key)
    if (!raw) return null
    const item = JSON.parse(raw) as CacheItem<T>
    const isExpired = Date.now() - item.timestamp > CACHE_EXPIRATION_MS
    if (isExpired) {
      localStorage.removeItem(key)
      return null
    }
    return item.data
  } catch {
    return null
  }
}

function saveToCache<T>(key: string, data: T): void {
  if (typeof window === "undefined") return
  try {
    const item: CacheItem<T> = {
      data,
      timestamp: Date.now(),
    }
    localStorage.setItem(key, JSON.stringify(item))
  } catch {}
}

export async function getCursos(): Promise<Curso[]> {
  // 1. Tentar ler do cache local
  const cached = getFromCache<Curso[]>(CACHE_CURSOS_KEY)
  if (cached) return cached

  // 2. Tentar ler do Firestore
  if (db) {
    try {
      const snap = await getDocs(collection(db, "cursos"))
      const lista: Curso[] = []
      snap.forEach(docSnap => {
        lista.push(docSnap.data() as Curso)
      })
      if (lista.length > 0) {
        // Ordenar os cursos para manter consistência
        lista.sort((a, b) => a.nome.localeCompare(b.nome))
        saveToCache(CACHE_CURSOS_KEY, lista)
        return lista
      }
    } catch (err) {
      console.error("Erro ao carregar cursos do Firestore, usando fallback estático:", err)
    }
  }

  // 3. Fallback estático
  return staticCatalogo
}

export async function getCurso(id: string): Promise<Curso | undefined> {
  const lista = await getCursos()
  return lista.find(c => c.id === id)
}

export async function getModulo(cursoId: string, moduloId: string): Promise<Modulo | undefined> {
  const cacheKey = `${CACHE_MODULO_PREFIX}${cursoId}-${moduloId}`

  // 1. Tentar ler do cache local
  const cached = getFromCache<Modulo>(cacheKey)
  if (cached) return cached

  // 2. Tentar ler do Firestore
  if (db) {
    try {
      const docSnap = await getDoc(doc(db, "modulos", `${cursoId}-${moduloId}`))
      if (docSnap.exists()) {
        const mod = docSnap.data() as Modulo
        mod.id = moduloId // Garantir ID consistente com o slug
        saveToCache(cacheKey, mod)
        return mod
      }
    } catch (err) {
      console.error(`Erro ao carregar modulo ${moduloId} do Firestore, usando fallback estático:`, err)
    }
  }

  // 3. Fallback estático (API local)
  try {
    const res = await fetch(`/api/data/${cursoId}/${moduloId}`)
    if (!res.ok) return undefined
    const mod = await res.json() as Modulo
    mod.id = moduloId
    saveToCache(cacheKey, mod)
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
  const cursos = await getCursos()
  for (const curso of cursos) {
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

  const indexNoModulo = modulo.questoes.findIndex(q => q.id === questaoId)
  const proximaQuestao = indexNoModulo >= 0 && indexNoModulo < modulo.questoes.length - 1 ? modulo.questoes[indexNoModulo + 1] : null
  const anteriorQuestao = indexNoModulo > 0 ? modulo.questoes[indexNoModulo - 1] : null

  return {
    questao,
    modulo,
    curso,
    indexNoModulo,
    totalNoModulo: modulo.questoes.length,
    indiceGlobal: idx,
    totalGlobal: flat.length,
    proxima: proximaQuestao ? { moduloId, questaoId: proximaQuestao.id } : null,
    anterior: anteriorQuestao ? { moduloId, questaoId: anteriorQuestao.id } : null,
  }
}
