import { initializeApp, getApps } from "firebase/app"
import { getAuth, GoogleAuthProvider, signInWithPopup, signInWithEmailAndPassword, createUserWithEmailAndPassword, sendPasswordResetEmail, updateProfile, signOut, onAuthStateChanged, type User } from "firebase/auth"
import { getFirestore, doc, setDoc, getDoc } from "firebase/firestore"
import type { Perfil } from "./types"

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY!,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN!,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID!,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET!,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID!,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID!,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID!,
}

const hasFirebaseConfig = typeof process.env.NEXT_PUBLIC_FIREBASE_API_KEY === "string" && process.env.NEXT_PUBLIC_FIREBASE_API_KEY.length > 0

const app = hasFirebaseConfig ? (getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0]) : null
const db = app ? getFirestore(app) : null
const auth = app ? getAuth(app) : null
const googleProvider = app ? new GoogleAuthProvider() : null

const COLECAO = "progresso"

export { auth, googleProvider, onAuthStateChanged, sendPasswordResetEmail, updateProfile }

export function loginGoogle(): Promise<User> {
  if (!auth || !googleProvider) return Promise.reject(new Error("Firebase não configurado"))
  return signInWithPopup(auth, googleProvider).then(r => r.user)
}

export function loginEmail(email: string, senha: string): Promise<User> {
  if (!auth) return Promise.reject(new Error("Firebase não configurado"))
  return signInWithEmailAndPassword(auth, email, senha).then(r => r.user)
}

export function cadastrarEmail(email: string, senha: string): Promise<User> {
  if (!auth) return Promise.reject(new Error("Firebase não configurado"))
  return createUserWithEmailAndPassword(auth, email, senha).then(r => r.user)
}

export function logout(): Promise<void> {
  if (!auth) return Promise.resolve()
  return signOut(auth)
}

function getUsuarioId(user?: User | null): string {
  if (user?.uid) return user.uid
  if (typeof window === "undefined") return ""
  let id = localStorage.getItem("firebase-usuario-id")
  if (!id) {
    id = crypto.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(36).slice(2)}`
    localStorage.setItem("firebase-usuario-id", id)
  }
  return id
}

export async function salvarProgressoFirebase(perfil: Perfil, user?: User | null): Promise<void> {
  const uid = getUsuarioId(user)
  if (!uid || !db) return
  try {
    await setDoc(doc(db, COLECAO, uid), { ...perfil, atualizadoEm: Date.now() })
  } catch (err) {
    console.error("Erro ao salvar no Firebase:", err)
  }
}

export async function carregarProgressoFirebase(user?: User | null): Promise<Perfil | null> {
  const uid = getUsuarioId(user)
  if (!uid || !db) return null
  try {
    const snap = await getDoc(doc(db, COLECAO, uid))
    if (snap.exists()) {
      const data = snap.data() as Perfil & { atualizadoEm?: number }
      const { atualizadoEm, ...perfil } = data
      return perfil as Perfil
    }
    return null
  } catch (err) {
    console.error("Erro ao carregar do Firebase:", err)
    return null
  }
}
