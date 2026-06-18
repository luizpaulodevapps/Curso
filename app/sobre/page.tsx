"use client"

import Link from "next/link"

export default function Sobre() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-4">
      <div className="max-w-2xl text-center space-y-6">
        <h1 className="text-4xl font-bold text-blue-400">
          DevEstudos
        </h1>
        <p className="text-lg text-gray-300">
          Plataforma gamificada de aprendizado de programação.
        </p>
        <p className="text-gray-400">
          Uma jornada completa do zero ao SaaS, com 11 cursos, ~300 questões
          interativas, editor de código embutido (CodeMirror 6), sistema de
          XP e conquistas, flashcards com revisão espaçada e rastreador de tempo.
        </p>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-8 text-sm">
          <div className="bg-[#1a1a2e] rounded-xl p-4">
            <p className="text-2xl mb-1">📚</p>
            <p className="text-gray-300 font-medium">11 Cursos</p>
            <p className="text-gray-500">Mentalidade → HTML → CSS → Lógica → JS → React → Next → Firebase → SaaS</p>
          </div>
          <div className="bg-[#1a1a2e] rounded-xl p-4">
            <p className="text-2xl mb-1">🎯</p>
            <p className="text-gray-300 font-medium">~300 Lições</p>
            <p className="text-gray-500">Questões com validação automática de código</p>
          </div>
          <div className="bg-[#1a1a2e] rounded-xl p-4">
            <p className="text-2xl mb-1">🏆</p>
            <p className="text-gray-300 font-medium">Conquistas</p>
            <p className="text-gray-500">Badges desbloqueáveis ao progredir</p>
          </div>
          <div className="bg-[#1a1a2e] rounded-xl p-4">
            <p className="text-2xl mb-1">🗺️</p>
            <p className="text-gray-300 font-medium">Roadmap</p>
            <p className="text-gray-500">Guia visual da jornada completa</p>
          </div>
          <div className="bg-[#1a1a2e] rounded-xl p-4">
            <p className="text-2xl mb-1">🃏</p>
            <p className="text-gray-300 font-medium">Flashcards</p>
            <p className="text-gray-500">Revisão espaçada estilo SM-2</p>
          </div>
          <div className="bg-[#1a1a2e] rounded-xl p-4">
            <p className="text-2xl mb-1">💻</p>
            <p className="text-gray-300 font-medium">Editor</p>
            <p className="text-gray-500">CodeMirror 6 + execução sandbox</p>
          </div>
        </div>

        <div className="text-left bg-[#1a1a2e] rounded-xl p-6 border border-gray-800 mt-6">
          <h2 className="text-lg font-bold mb-3 text-blue-400">Jornada Pedagógica</h2>
          <ol className="space-y-1.5 text-sm text-gray-400 list-decimal list-inside">
            <li>🧠 Mentalidade de Programador</li>
            <li>🏗️ HTML5 Puro (sem CSS)</li>
            <li>🎨 CSS3</li>
            <li>⚙️ Lógica de Programação</li>
            <li>🟨 JavaScript Real (DOM, APIs, async)</li>
            <li>✨ JavaScript Moderno (ES6+, POO)</li>
            <li>🚀 Projeto DevEstudos 2.0</li>
            <li>⚛️ React</li>
            <li>▲ Next.js</li>
            <li>🔥 Firebase</li>
            <li>🏢 SaaS e Sistemas Reais</li>
          </ol>
        </div>

        <Link
          href="/"
          className="inline-block mt-6 px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-500 transition-all"
        >
          Voltar ao Dashboard
        </Link>
      </div>
    </main>
  )
}
