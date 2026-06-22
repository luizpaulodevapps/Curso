import { NextResponse } from "next/server"
import fs from "fs"
import path from "path"

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ cursoId: string; moduloId: string }> }
) {
  const { cursoId, moduloId } = await params

  // 1. Tentar importar diretamente pelo nome do arquivo (slug)
  try {
    const mod = await import(`@/data/${cursoId}/${moduloId}.json`)
    return NextResponse.json(mod)
  } catch {
    // 2. Se falhar, buscar por ID interno dentro dos arquivos JSON na pasta do curso
    try {
      const dirPath = path.join(process.cwd(), "data", cursoId)
      if (fs.existsSync(dirPath)) {
        const files = fs.readdirSync(dirPath).filter(f => f.endsWith(".json"))
        for (const file of files) {
          const filePath = path.join(dirPath, file)
          const content = fs.readFileSync(filePath, "utf8")
          const json = JSON.parse(content)
          if (json.id === moduloId) {
            return NextResponse.json(json)
          }
        }
      }
    } catch (e) {
      console.error("Erro ao buscar modulo por ID interno:", e)
    }

    return NextResponse.json({ erro: "Módulo não encontrado" }, { status: 404 })
  }
}
