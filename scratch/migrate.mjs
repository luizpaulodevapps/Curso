import fs from "fs"
import path from "path"
import { initializeApp } from "firebase/app"
import { getFirestore, doc, setDoc } from "firebase/firestore"

// 1. Carregar variáveis de ambiente de .env.local
const envPath = path.join(process.cwd(), ".env.local")
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, "utf8")
  envContent.split("\n").forEach(line => {
    const trimmed = line.trim()
    if (trimmed && !trimmed.startsWith("#")) {
      const parts = trimmed.split("=")
      const key = parts[0].trim()
      const val = parts.slice(1).join("=").trim()
      process.env[key] = val
    }
  })
}

// 2. Validar credenciais
if (!process.env.NEXT_PUBLIC_FIREBASE_API_KEY) {
  console.error("Erro: NEXT_PUBLIC_FIREBASE_API_KEY não encontrada no .env.local!")
  process.exit(1)
}

// 3. Inicializar Firebase Client
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
}

console.log("Inicializando Firebase com ID do Projeto:", firebaseConfig.projectId)
const app = initializeApp(firebaseConfig)
const db = getFirestore(app)

// 4. Executar migração
async function run() {
  try {
    const cursosRaw = fs.readFileSync(path.join(process.cwd(), "data", "cursos.json"), "utf8")
    const { cursos } = JSON.parse(cursosRaw)

    console.log(`Encontrados ${cursos.length} cursos para migração.\n`)

    for (const curso of cursos) {
      console.log(`→ Enviando curso: ${curso.nome} (${curso.id})...`)
      await setDoc(doc(db, "cursos", curso.id), curso)

      for (const modId of curso.moduloLista) {
        const modPath = path.join(process.cwd(), "data", curso.id, `${modId}.json`)
        if (fs.existsSync(modPath)) {
          const modRaw = fs.readFileSync(modPath, "utf8")
          const mod = JSON.parse(modRaw)
          
          const docId = `${curso.id}-${modId}`
          console.log(`  └─ Enviando módulo: ${mod.nome} (${docId})...`)
          await setDoc(doc(db, "modulos", docId), {
            ...mod,
            cursoId: curso.id,
          })
        } else {
          console.warn(`  └─ [Aviso] Módulo ${modId} não encontrado em ${modPath}`)
        }
      }
      console.log(`✓ Curso ${curso.id} enviado com sucesso!\n`)
    }

    console.log("🎉 Migração concluída com sucesso!")
    process.exit(0)
  } catch (error) {
    console.error("Erro fatal durante a migração:", error)
    process.exit(1)
  }
}

run()
