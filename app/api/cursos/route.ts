import { NextResponse } from "next/server"
import cursosData from "@/data/cursos.json"

export async function GET() {
  return NextResponse.json(cursosData)
}
