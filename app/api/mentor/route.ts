import { NextRequest, NextResponse } from "next/server"

const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY
const DEEPSEEK_URL = "https://api.deepseek.com/v1/chat/completions"

interface MentorRequest {
  action: "dica" | "explicar-erro" | "explicar-codigo" | "mostrar-teoria"
  codigo: string
  erro?: string
  questao?: string
}

function montarPrompt(req: MentorRequest): string {
  const base = `Você é um mentor de programação amigável que ensina com analogias do dia a dia (cozinha, supermercado, etc.). Responda em português brasileiro, de forma direta e educativa.`

  switch (req.action) {
    case "dica":
      return `${base}\n\nO aluno está tentando resolver este exercício:\n\n${req.questao || "Exercício de programação"}\n\nCódigo atual:\n\`\`\`\n${req.codigo}\n\`\`\`\n\nDê uma dica que ajude sem dar a resposta completa. Use uma analogia do dia a dia.`
    case "explicar-erro":
      return `${base}\n\nO código abaixo gerou um erro:\n\`\`\`\n${req.codigo}\n\`\`\`\n\nErro:\n${req.erro || "Erro desconhecido"}\n\nExplique o erro de forma simples e como corrigir. Use analogia do dia a dia.`
    case "explicar-codigo":
      return `${base}\n\nExplique passo a passo o que este código faz, como se fosse para um iniciante absoluto:\n\`\`\`\n${req.codigo}\n\`\`\`\n\nUse analogia do dia a dia.`
    case "mostrar-teoria":
      return `${base}\n\nO aluno está estudando programação. O contexto do exercício é:\n${req.questao || "Conceitos de programação"}\n\nExplique o conceito teórico por trás disso de forma simples com analogia do dia a dia.`
    default:
      return base
  }
}

export async function POST(req: NextRequest) {
  if (!DEEPSEEK_API_KEY) {
    return NextResponse.json({ erro: "API key não configurada" }, { status: 500 })
  }

  try {
    const body: MentorRequest = await req.json()
    const prompt = montarPrompt(body)

    const res = await fetch(DEEPSEEK_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${DEEPSEEK_API_KEY}`,
      },
      body: JSON.stringify({
        model: "deepseek-chat",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.7,
        max_tokens: 512,
      }),
    })

    if (!res.ok) {
      const errText = await res.text()
      console.error("DeepSeek API error:", res.status, errText)
      return NextResponse.json({ erro: errText || "Erro ao consultar IA" }, { status: 502 })
    }

    const data = await res.json()
    const texto = data?.choices?.[0]?.message?.content || "Desculpe, não consegui processar sua solicitação."

    return NextResponse.json({ resposta: texto })
  } catch (err) {
    console.error("Mentor API error:", err)
    return NextResponse.json({ erro: "Erro interno do servidor" }, { status: 500 })
  }
}
