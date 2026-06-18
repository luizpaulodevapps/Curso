"use client"

import { LearningLab } from "@/components/LearningLab"

const exemplos = [
  {
    nome: "Olá, Mundo!",
    codigo: `console.log("Olá, Mundo!")`,
  },
  {
    nome: "Soma + Variáveis",
    codigo: `let a = 5\nlet b = 3\nlet soma = a + b\nconsole.log(\`A soma de \${a} + \${b} = \${soma}\`)`,
  },
  {
    nome: "Array + Map",
    codigo: `let nums = [1, 2, 3, 4, 5]\nlet dobrados = nums.map(n => n * 2)\nconsole.log("Original:", nums)\nconsole.log("Dobrados:", dobrados)`,
  },
  {
    nome: "Função + Filter",
    codigo: `const pares = (arr) => arr.filter(n => n % 2 === 0)\nconsole.log(pares([1, 2, 3, 4, 5, 6]))`,
  },
  {
    nome: "Objetos",
    codigo: `const usuario = {\n  nome: "Luiz",\n  idade: 30,\n  saudacao() {\n    return \`Olá, sou \${this.nome}\`\n  }\n}\nconsole.log(usuario.saudacao())`,
  },
  {
    nome: "Async",
    codigo: `const buscar = async () => {\n  const dados = await fetch("https://jsonplaceholder.typicode.com/todos/1")\n    .then(r => r.json())\n  console.log("Título:", dados.title)\n}\nbuscar()`,
  },
]

export default function EditorPage() {
  return (
    <LearningLab
      titulo="🧪 DevEstudos"
      modulo="Livre — Experimentação"
      exemplos={exemplos}
      missao={{
        titulo: "Experimente JavaScript",
        descricao: "Use o editor para escrever e executar código JavaScript. Escolha um exemplo ou escreva seu próprio código. Pressione Ctrl+Enter para executar.",
        xp: 0,
        dica: "Tente modificar os exemplos! Mude os números, adicione novas variáveis. O melhor jeito de aprender é experimentando.",
      }}
    />
  )
}
