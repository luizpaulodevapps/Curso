export type ResultadoExecucao =
  | { valido: true; saida: string; tempoMs: number; logs: string[] }
  | { valido: false; erro: string; tempoMs: number; logs: string[] }

export function executarCodigo(codigo: string): ResultadoExecucao {
  const logs: string[] = []
  const mockConsole = {
    log: (...args: unknown[]) => logs.push(args.map(String).join(" ")),
    error: (...args: unknown[]) => logs.push(`[ERRO] ${args.map(String).join(" ")}`),
    warn: (...args: unknown[]) => logs.push(`[AVISO] ${args.map(String).join(" ")}`),
    info: (...args: unknown[]) => logs.push(`[INFO] ${args.map(String).join(" ")}`),
  }

  const inicio = performance.now()
  try {
    const fn = new Function("console", codigo)
    fn(mockConsole)
    const tempoMs = Math.round(performance.now() - inicio)
    return { valido: true, saida: logs.join("\n"), tempoMs, logs }
  } catch (e) {
    const tempoMs = Math.round(performance.now() - inicio)
    return {
      valido: false,
      erro: e instanceof Error ? e.message : "Erro desconhecido",
      tempoMs,
      logs,
    }
  }
}

export type ResultadoValidacao =
  | { valido: true; saida: string; tempoMs: number }
  | { valido: false; erro: string; tempoMs: number }

export function validarComExpressao(
  codigo: string,
  validacao: string,
  mensagemErro?: string
): ResultadoValidacao {
  const exec = executarCodigo(codigo)
  if (!exec.valido) return exec

  try {
    const fnValidacao = new Function("saida", `"use strict"; return (${validacao})`)
    const resultado = fnValidacao(exec.saida)
    if (resultado === true) return { valido: true, saida: exec.saida, tempoMs: exec.tempoMs }
    return {
      valido: false,
      erro: mensagemErro ?? "Código não passou na validação.",
      tempoMs: exec.tempoMs,
    }
  } catch (e) {
    return {
      valido: false,
      erro: e instanceof Error ? e.message : "Erro na validação",
      tempoMs: exec.tempoMs,
    }
  }
}

export function validarPorComparacao(
  codigo: string,
  esperado: string
): boolean {
  const normalizar = (s: string) =>
    s
      .replace(/\/\/.*$/gm, "")
      .replace(/\/\*[\s\S]*?\*\//g, "")
      .replace(/\s+/g, " ")
      .trim()
  return normalizar(codigo) === normalizar(esperado)
}

export function validarPorSaida(
  codigo: string,
  saidaEsperada: string
): ResultadoValidacao {
  const exec = executarCodigo(codigo)
  if (!exec.valido) return exec

  if (exec.saida.trim() === saidaEsperada.trim()) {
    return { valido: true, saida: exec.saida, tempoMs: exec.tempoMs }
  }
  return {
    valido: false,
    erro: `Saída esperada:\n"${saidaEsperada}"\n\nSua saída:\n"${exec.saida}"`,
    tempoMs: exec.tempoMs,
  }
}
