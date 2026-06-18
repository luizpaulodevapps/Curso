"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import type { Perfil } from "./types"
import { carregarPerfil, salvarPerfil } from "./storage"

export function useStudyTimer() {
  const [tempoDecorrido, setTempoDecorrido] = useState(0)
  const perfilRef = useRef<Perfil>(carregarPerfil())
  const inicioRef = useRef(perfilRef.current.sessaoInicio ?? Date.now())

  useEffect(() => {
    const perfil = perfilRef.current
    if (!perfil.sessaoInicio) {
      perfil.sessaoInicio = Date.now()
      perfil.tempoSessao = 0
      salvarPerfil(perfil)
    }

    const interval = setInterval(() => {
      const elapsed = Math.floor((Date.now() - (perfilRef.current.sessaoInicio ?? Date.now())) / 1000)
      setTempoDecorrido(elapsed)
    }, 1000)

    const salvarAntesDeSair = () => {
      const perfil = carregarPerfil()
      if (perfil.sessaoInicio) {
        const segundos = Math.floor((Date.now() - perfil.sessaoInicio) / 1000)
        perfil.tempoEstudo += segundos
        perfil.tempoSessao = (perfil.tempoSessao ?? 0) + segundos
        perfil.sessaoInicio = Date.now()
        salvarPerfil(perfil)
      }
    }

    window.addEventListener("beforeunload", salvarAntesDeSair)

    return () => {
      clearInterval(interval)
      salvarAntesDeSair()
      window.removeEventListener("beforeunload", salvarAntesDeSair)
    }
  }, [])

  const formatarTempo = useCallback((segundos: number) => {
    const h = Math.floor(segundos / 3600)
    const m = Math.floor((segundos % 3600) / 60)
    const s = segundos % 60
    if (h > 0) return `${h}h ${m}m`
    if (m > 0) return `${m}m ${s}s`
    return `${s}s`
  }, [])

  return {
    tempoDecorrido,
    tempoTotal: (perfilRef.current.tempoEstudo ?? 0) + tempoDecorrido,
    formatarTempo,
  }
}
