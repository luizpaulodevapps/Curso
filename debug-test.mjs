import { validarComExpressao, executarCodigo } from "@/lib/editor"

const r1 = executarCodigo("console.log(42)")
console.log("executarCodigo resultado:", JSON.stringify(r1))

const r2 = validarComExpressao("console.log(42)", "saida.trim() === '42'")
console.log("validarComExpressao resultado:", JSON.stringify(r2))

const validationFn = new Function("saida", `"use strict"; saida.trim() === '42'`)
console.log("validationFn('42'):", validationFn("42"))
