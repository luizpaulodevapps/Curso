"use client"

import { useState } from "react"

interface UseMentorProps {
  codigo: string
  erro?: string
  questao?: string
}

function delay(ms: number) {
  return new Promise(r => setTimeout(r, ms))
}

async function fetchComRetry(url: string, options: RequestInit, tentativas = 3): Promise<Response> {
  for (let i = 0; i < tentativas; i++) {
    const res = await fetch(url, options)
    if (res.ok) return res
    // Só retenta se for 502/503 (indisponível temporário)
    if (res.status !== 502 && res.status !== 503) return res
    if (i < tentativas - 1) await delay(1000 * Math.pow(2, i))
  }
  return fetch(url, options)
}

export function useMentor({ codigo, erro, questao }: UseMentorProps) {
  const [resposta, setResposta] = useState("")
  const [loading, setLoading] = useState(false)
  const [erroApi, setErroApi] = useState("")

  async function perguntar(action: "dica" | "explicar-erro" | "explicar-codigo" | "mostrar-teoria") {
    setLoading(true)
    setResposta("")
    setErroApi("")

    try {
      const res = await fetchComRetry("/api/mentor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, codigo, erro, questao }),
      })
      const data = await res.json()

      if (!res.ok) {
        setErroApi(data.erro || "Erro ao consultar mentor")
        return
      }

      setResposta(data.resposta)
    } catch {
      setErroApi("Erro de conexão com o servidor")
    } finally {
      setLoading(false)
    }
  }

  return { resposta, loading, erroApi, perguntar }
}
