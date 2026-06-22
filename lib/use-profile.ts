"use client"

import { useState, useCallback, useEffect, useRef } from "react"
import { Perfil, Questao } from "./types"
import { ResultadoQuestao } from "./engine"
import { carregarPerfil, salvarPerfil, perfilVazio } from "./storage"
import { responderQuestao, getNivelAtual, getXpRestante, getProgressoGeral } from "./engine"
import { verificarNovasConquistas, desbloquearConquistas } from "./achievements"
import { criarFlashcard, revisarFlashcard, flashcardsPendentes } from "./spaced-repetition"
import { salvarProgressoFirebase, carregarProgressoFirebase } from "./firebase"
import { useAuth } from "./use-auth"

export function useProfile() {
  const { user } = useAuth()
  const [perfil, setPerfil] = useState<Perfil>(perfilVazio)
  const [novasConquistas, setNovasConquistas] = useState<string[]>([])
  const [sincronizado, setSincronizado] = useState(true)
  const timerRef = useRef<number | null>(null)

  useEffect(() => {
    const local = carregarPerfil()
    setPerfil(local)

    carregarProgressoFirebase(user).then(firebase => {
      if (firebase && firebase.totalQuestoes > local.totalQuestoes) {
        setPerfil(firebase)
      }
    })

    if (user) {
      const anonId = localStorage.getItem("firebase-usuario-id")
      if (anonId) {
        carregarProgressoFirebase(null).then(anonPerfil => {
          if (anonPerfil && anonPerfil.totalQuestoes > local.totalQuestoes) {
            setPerfil(prev =>
              anonPerfil.totalQuestoes > prev.totalQuestoes ? anonPerfil : prev
            )
          }
        })
        localStorage.removeItem("firebase-usuario-id")
      }
    }
  }, [user])

  useEffect(() => {
    salvarPerfil(perfil)
    setSincronizado(false)
    clearTimeout(timerRef.current ?? undefined)
    timerRef.current = setTimeout(() => {
      salvarProgressoFirebase(perfil, user).finally(() => setSincronizado(true))
    }, 1000) as unknown as number
    return () => clearTimeout(timerRef.current ?? undefined)
  }, [perfil, user])

  const responder = useCallback((questao: Questao, resposta: string, cursoId?: string, moduloId?: string, totalQuestoesNoModulo?: number, forcarCorreta?: boolean): ResultadoQuestao => {
    const resultado = responderQuestao({ ...perfil }, questao, resposta, forcarCorreta)

    const novas = verificarNovasConquistas(resultado.correta
      ? { ...perfil, acertos: perfil.acertos + 1, xp: perfil.xp + questao.xp, totalQuestoes: perfil.totalQuestoes + 1 }
      : { ...perfil, erros: perfil.erros + 1, totalQuestoes: perfil.totalQuestoes + 1 }
    )

    const perfilAtualizado = { ...perfil }
    perfilAtualizado.progressoCursos = { ...perfilAtualizado.progressoCursos }
    perfilAtualizado.totalQuestoes++
    if (resultado.correta) {
      perfilAtualizado.acertos++
      perfilAtualizado.xp += questao.xp
    } else {
      perfilAtualizado.erros++
    }

    if (cursoId && moduloId) {
      const chave = `${cursoId}/${moduloId}`
      const atual = {
        ...(perfilAtualizado.progressoCursos[chave] || {
          cursoId, moduloId, questoesRespondidas: {}, acertos: 0, erros: 0, xpGanho: 0, concluido: false,
        })
      }
      atual.questoesRespondidas = { ...atual.questoesRespondidas }
      
      atual.questoesRespondidas[questao.id] = resultado.correta
      if (resultado.correta) atual.acertos++
      else atual.erros++
      atual.xpGanho += resultado.xpGanho

      if (totalQuestoesNoModulo) {
        const corretas = Object.values(atual.questoesRespondidas).filter(v => v === true).length
        atual.concluido = corretas >= totalQuestoesNoModulo
      }

      perfilAtualizado.progressoCursos[chave] = atual
    }

    if (novas.length > 0) {
      desbloquearConquistas(perfilAtualizado, novas)
      setNovasConquistas(prev => [...prev, ...novas.map(n => n.titulo)])
    }

    setPerfil(perfilAtualizado)
    return resultado
  }, [perfil])

  const concluirLeitura = useCallback((cursoId: string, moduloId: string, aulas: Questao[], totalQuestoes: number) => {
    const perfilAtualizado = { ...perfil }
    perfilAtualizado.progressoCursos = { ...perfilAtualizado.progressoCursos }

    const chave = `${cursoId}/${moduloId}`
    const atual = {
      ...(perfilAtualizado.progressoCursos[chave] || {
        cursoId, moduloId, questoesRespondidas: {}, acertos: 0, erros: 0, xpGanho: 0, concluido: false,
      })
    }
    atual.questoesRespondidas = { ...atual.questoesRespondidas }

    aulas.forEach(aula => {
      if (atual.questoesRespondidas[aula.id] !== true) {
        atual.questoesRespondidas[aula.id] = true
        atual.acertos++
        atual.xpGanho += aula.xp
        perfilAtualizado.xp += aula.xp
        perfilAtualizado.acertos++
        perfilAtualizado.totalQuestoes++
      }
    })

    if (totalQuestoes) {
      const corretas = Object.values(atual.questoesRespondidas).filter(v => v === true).length
      atual.concluido = corretas >= totalQuestoes
    }

    perfilAtualizado.progressoCursos[chave] = atual
    setPerfil(perfilAtualizado)
  }, [perfil])

  const adicionarFlashcard = useCallback((pergunta: string, resposta: string, cursoId: string, moduloId: string) => {
    const card = criarFlashcard(pergunta, resposta, cursoId, moduloId)
    setPerfil(prev => ({ ...prev, flashcards: [...prev.flashcards, card] }))
  }, [])

  const revisarFlashcards = useCallback((cardId: string, qualidade: number) => {
    setPerfil(prev => ({
      ...prev,
      flashcards: prev.flashcards.map(c =>
        c.id === cardId ? revisarFlashcard({ ...c }, qualidade) : c
      )
    }))
  }, [])

  const limparNotificacoes = useCallback(() => {
    setNovasConquistas([])
  }, [])

  return {
    perfil,
    nivel: getNivelAtual(perfil),
    xpRestante: getXpRestante(perfil),
    progresso: getProgressoGeral(perfil),
    novasConquistas,
    sincronizado,
    responder,
    concluirLeitura,
    adicionarFlashcard,
    revisarFlashcards,
    pendentes: flashcardsPendentes(perfil.flashcards),
    limparNotificacoes,
  }
}
