"use client"

import { useEffect, useState, useRef } from "react"
import { carregarPerfil, salvarPerfil } from "@/lib/storage"

export function StudyTimer() {
  const [display, setDisplay] = useState("")
  const inicioRef = useRef<number | null>(null)

  useEffect(() => {
    const perfil = carregarPerfil()
    inicioRef.current = perfil.sessaoInicio ?? Date.now()
    if (!perfil.sessaoInicio) {
      perfil.sessaoInicio = inicioRef.current
      perfil.tempoSessao = 0
      salvarPerfil(perfil)
    }

    const salvar = () => {
      const p = carregarPerfil()
      if (p.sessaoInicio) {
        const segundos = Math.floor((Date.now() - p.sessaoInicio) / 1000)
        p.tempoEstudo += segundos
        p.tempoSessao = (p.tempoSessao ?? 0) + segundos
        p.sessaoInicio = Date.now()
        inicioRef.current = p.sessaoInicio
        salvarPerfil(p)
      }
    }

    const interval = setInterval(() => {
      const p = carregarPerfil()
      const total = (p.tempoEstudo ?? 0) + Math.floor((Date.now() - (inicioRef.current ?? Date.now())) / 1000)
      const h = Math.floor(total / 3600)
      const m = Math.floor((total % 3600) / 60)
      setDisplay(h > 0 ? `${h}h ${m}m` : `${m}m`)
    }, 10000)

    window.addEventListener("beforeunload", salvar)

    return () => {
      clearInterval(interval)
      salvar()
      window.removeEventListener("beforeunload", salvar)
    }
  }, [])

  return (
    <span className="text-xs text-gray-500 shrink-0 ml-auto" title="Tempo total de estudo">
      ⏱ {display || "0m"}
    </span>
  )
}
