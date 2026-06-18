import { describe, it, expect } from "vitest"
import { executarCodigo, validarComExpressao, validarPorComparacao, validarPorSaida } from "@/lib/editor"

describe("executarCodigo", () => {
  it("executa código válido e retorna saída", () => {
    const r = executarCodigo("console.log('oi')")
    expect(r.valido).toBe(true)
    if (r.valido) expect(r.saida).toBe("oi")
  })

  it("retorna erro para sintaxe inválida", () => {
    const r = executarCodigo("const x =")
    expect(r.valido).toBe(false)
    if (!r.valido) expect(r.erro).toBeTruthy()
  })

  it("retorna erro para referência inexistente", () => {
    const r = executarCodigo("foo.bar()")
    expect(r.valido).toBe(false)
  })

  it("captura múltiplos logs", () => {
    const r = executarCodigo("console.log('a'); console.log('b')")
    expect(r.valido).toBe(true)
    if (r.valido) expect(r.saida).toBe("a\nb")
  })

  it("código vazio executa sem erro", () => {
    const r = executarCodigo("")
    expect(r.valido).toBe(true)
    if (r.valido) expect(r.saida).toBe("")
  })

  it("mede tempo de execução", () => {
    const r = executarCodigo("let s=0; for(let i=0;i<100;i++) s+=i")
    expect(r.tempoMs).toBeGreaterThanOrEqual(0)
  })
})

describe("validarComExpressao", () => {
  it("passa quando validação retorna true", () => {
    const r = validarComExpressao("console.log(42)", "saida.trim() === '42'")
    expect(r.valido).toBe(true)
  })

  it("falha quando validação retorna false", () => {
    const r = validarComExpressao("console.log(1)", "saida.trim() === '2'")
    expect(r.valido).toBe(false)
    if (!r.valido) expect(r.erro).toBe("Código não passou na validação.")
  })

  it("usa mensagem de erro customizada", () => {
    const r = validarComExpressao("console.log(1)", "false", "Valor esperado: 2")
    expect(r.valido).toBe(false)
    if (!r.valido) expect(r.erro).toBe("Valor esperado: 2")
  })

  it("falha quando código tem erro de sintaxe", () => {
    const r = validarComExpressao("console.log(", "true")
    expect(r.valido).toBe(false)
    if (!r.valido) expect(r.erro).toBeTruthy()
  })

  it("falha quando expressão de validação é inválida", () => {
    const r = validarComExpressao("console.log('a')", "saida === ")
    expect(r.valido).toBe(false)
  })

  it("retorna saída correta quando válido", () => {
    const r = validarComExpressao("console.log('ola')", "saida.includes('ola')")
    expect(r.valido).toBe(true)
    if (r.valido) expect(r.saida).toBe("ola")
  })
})

describe("validarPorComparacao", () => {
  it("compara ignorando espaços e comentários", () => {
    expect(validarPorComparacao("let  x  = 1", "let x = 1")).toBe(true)
  })

  it("compara código com comentários", () => {
    expect(validarPorComparacao("let x = 1 // isso é um teste", "let x = 1")).toBe(true)
  })

  it("rejeita código diferente", () => {
    expect(validarPorComparacao("let x = 1", "let y = 2")).toBe(false)
  })
})

describe("validarPorSaida", () => {
  it("valida saída exata", () => {
    const r = validarPorSaida("console.log('hello')", "hello")
    expect(r.valido).toBe(true)
  })

  it("rejeita saída diferente", () => {
    const r = validarPorSaida("console.log('a')", "b")
    expect(r.valido).toBe(false)
  })

  it("ignora espaços nas bordas", () => {
    const r = validarPorSaida("console.log('a')", "  a  ")
    expect(r.valido).toBe(true)
  })

  it("retorna erro descritivo ao falhar", () => {
    const r = validarPorSaida("console.log('real')", "esperado")
    expect(r.valido).toBe(false)
    if (!r.valido) {
      expect(r.erro).toContain("real")
      expect(r.erro).toContain("esperado")
    }
  })
})

describe("casos extremos", () => {
  it("código com undefined não quebra", () => {
    const r = executarCodigo("console.log(undefined)")
    expect(r.valido).toBe(true)
  })

  it("código com null não quebra", () => {
    const r = executarCodigo("console.log(null)")
    expect(r.valido).toBe(true)
    if (r.valido) expect(r.saida).toBe("null")
  })

  it("console.error é capturado", () => {
    const r = executarCodigo("console.error('deu ruim')")
    expect(r.valido).toBe(true)
    if (r.valido) expect(r.saida).toContain("deu ruim")
  })

  it("throw é tratado como erro", () => {
    const r = executarCodigo("throw new Error('falhou')")
    expect(r.valido).toBe(false)
    if (!r.valido) expect(r.erro).toContain("falhou")
  })

  it("várias linhas com saída vazia", () => {
    const r = executarCodigo("let a = 1; let b = 2; let c = a + b")
    expect(r.valido).toBe(true)
    if (r.valido) expect(r.saida).toBe("")
  })

  it("template literals funcionam", () => {
    const r = executarCodigo("const n = 42; console.log(`O número é ${n}`)")
    expect(r.valido).toBe(true)
    if (r.valido) expect(r.saida).toBe("O número é 42")
  })
})
