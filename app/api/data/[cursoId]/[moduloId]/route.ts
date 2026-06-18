import { NextResponse } from "next/server"

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ cursoId: string; moduloId: string }> }
) {
  const { cursoId, moduloId } = await params

  try {
    const mod = await import(`@/data/${cursoId}/${moduloId}.json`)
    return NextResponse.json(mod)
  } catch {
    return NextResponse.json({ erro: "Módulo não encontrado" }, { status: 404 })
  }
}
