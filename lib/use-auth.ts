"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import { auth, onAuthStateChanged, loginGoogle, loginEmail, cadastrarEmail, logout, sendPasswordResetEmail, updateProfile } from "./firebase"
import type { User } from "firebase/auth"

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [enviando, setEnviando] = useState(false)
  const [erro, setErro] = useState("")
  const router = useRouter()

  useEffect(() => {
    if (!auth) {
      setLoading(false)
      return
    }
    const unsub = onAuthStateChanged(auth, u => {
      setUser(u)
      setLoading(false)
    })
    return () => unsub()
  }, [])

  const logarGoogle = useCallback(async () => {
    setErro("")
    setEnviando(true)
    try {
      await loginGoogle()
      router.push("/cursos")
    } catch (e: unknown) {
      setErro((e as Error)?.message || "Erro ao fazer login com Google")
    } finally {
      setEnviando(false)
    }
  }, [router])

  const logarEmail = useCallback(async (email: string, senha: string) => {
    setErro("")
    setEnviando(true)
    try {
      await loginEmail(email, senha)
      router.push("/cursos")
    } catch (e: unknown) {
      const msg = (e as Error)?.message || ""
      if (msg.includes("auth/user-not-found")) setErro("Usuário não encontrado")
      else if (msg.includes("auth/wrong-password") || msg.includes("auth/invalid-credential")) setErro("Email ou senha inválidos")
      else if (msg.includes("auth/invalid-email")) setErro("Email inválido")
      else if (msg.includes("auth/too-many-requests")) setErro("Muitas tentativas. Tente novamente mais tarde")
      else setErro("Erro ao fazer login")
    } finally {
      setEnviando(false)
    }
  }, [router])

  const cadastrar = useCallback(async (email: string, senha: string) => {
    setErro("")
    setEnviando(true)
    try {
      await cadastrarEmail(email, senha)
      router.push("/cursos")
    } catch (e: unknown) {
      const msg = (e as Error)?.message || ""
      if (msg.includes("auth/email-already-in-use")) setErro("Este email já está cadastrado")
      else if (msg.includes("auth/weak-password")) setErro("Senha muito fraca. Mínimo 6 caracteres")
      else if (msg.includes("auth/invalid-email")) setErro("Email inválido")
      else setErro("Erro ao criar conta")
    } finally {
      setEnviando(false)
    }
  }, [router])

  const redefinirSenha = useCallback(async (email: string) => {
    if (!auth) {
      setErro("Firebase não configurado")
      return
    }
    setErro("")
    setEnviando(true)
    try {
      await sendPasswordResetEmail(auth, email)
    } catch (e: unknown) {
      const msg = (e as Error)?.message || ""
      if (msg.includes("auth/user-not-found")) setErro("Email não encontrado")
      else if (msg.includes("auth/invalid-email")) setErro("Email inválido")
      else setErro("Erro ao enviar email de redefinição")
    } finally {
      setEnviando(false)
    }
  }, [])

  const atualizarNome = useCallback(async (nome: string) => {
    if (!auth || !auth.currentUser) return
    setErro("")
    try {
      await updateProfile(auth.currentUser, { displayName: nome })
      setUser({ ...auth.currentUser } as User)
    } catch {
      setErro("Erro ao atualizar nome")
    }
  }, [])

  const sair = useCallback(async () => {
    await logout()
    router.push("/")
  }, [router])

  return { user, loading, enviando, erro, logarGoogle, logarEmail, cadastrar, redefinirSenha, atualizarNome, sair }
}
