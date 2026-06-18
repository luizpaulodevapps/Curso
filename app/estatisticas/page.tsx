"use client"

import { useProfile } from "@/lib/use-profile"
import { NIVEIS } from "@/lib/types"

export default function EstatisticasPage() {
  const { perfil, nivel, xpRestante } = useProfile()

  const taxaAcerto = perfil.totalQuestoes > 0
    ? Math.round((perfil.acertos / perfil.totalQuestoes) * 100)
    : 0

  const horasEstudo = Math.floor(perfil.tempoEstudo / 60)
  const minutosEstudo = perfil.tempoEstudo % 60

  const nextLevel = NIVEIS[nivel.nivel]
  const xpMinimoNivelAtual = nivel.xpMinimo
  const xpProximoNivel = nextLevel ? nextLevel.xpMinimo : nivel.xpMinimo
  const xpGanhosNivelAtual = perfil.xp - xpMinimoNivelAtual
  const xpNecessarioParaNivel = xpProximoNivel - xpMinimoNivelAtual
  const percentNivel = xpNecessarioParaNivel > 0 ? Math.min(100, Math.round((xpGanhosNivelAtual / xpNecessarioParaNivel) * 100)) : 100

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-8 space-y-8">
      <div>
        <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">Estatísticas de Combate</h1>
        <p className="text-xs md:text-sm text-gray-400">Seu progresso de aprendizado e hábitos de estudo em tempo real</p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Main Level Circle Ring Card */}
        <div className="md:col-span-1 bg-white/[0.01] border border-white/[0.06] rounded-3xl p-6 flex flex-col items-center justify-center text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-purple-500/5 to-transparent pointer-events-none" />
          <div className="relative w-36 h-36 flex items-center justify-center">
            {/* SVG Circle Progress */}
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="42"
                className="stroke-white/[0.04]"
                strokeWidth="6"
                fill="transparent"
              />
              <circle
                cx="50"
                cy="50"
                r="42"
                className="stroke-purple-500 transition-all duration-700"
                strokeWidth="6"
                fill="transparent"
                strokeDasharray={263.89}
                strokeDashoffset={263.89 - (263.89 * percentNivel) / 100}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute flex flex-col items-center justify-center">
              <span className="text-3xl font-black text-white">{nivel.nivel}</span>
              <span className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Nível</span>
            </div>
          </div>
          <h2 className="text-lg font-extrabold text-purple-400 mt-4">{nivel.titulo}</h2>
          <p className="text-xs text-gray-500 mt-1 uppercase font-bold tracking-wider">
            {perfil.xp} / {xpProximoNivel} XP
          </p>
          <div className="w-full bg-white/[0.03] rounded-full h-1.5 mt-3 overflow-hidden">
            <div className="h-full bg-purple-500 rounded-full" style={{ width: `${percentNivel}%` }} />
          </div>
        </div>

        {/* Quick Stats Grid */}
        <div className="md:col-span-2 grid gap-4 grid-cols-2">
          <div className="bg-white/[0.01] border border-white/[0.06] rounded-2xl p-5 flex flex-col justify-between group hover:border-orange-500/20 transition-all">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Ofensiva</span>
              <span className="text-xl">🔥</span>
            </div>
            <div className="mt-4">
              <span className="block text-2xl font-black text-orange-400">{perfil.streak} dias</span>
              <span className="text-[10px] text-gray-500 font-semibold uppercase tracking-wider">Estudo diário consecutivo</span>
            </div>
          </div>

          <div className="bg-white/[0.01] border border-white/[0.06] rounded-2xl p-5 flex flex-col justify-between group hover:border-green-500/20 transition-all">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Taxa de Acerto</span>
              <span className="text-xl">🎯</span>
            </div>
            <div className="mt-4">
              <span className="block text-2xl font-black text-green-400">{taxaAcerto}%</span>
              <span className="text-[10px] text-gray-500 font-semibold uppercase tracking-wider">{perfil.acertos} de {perfil.totalQuestoes} corretas</span>
            </div>
          </div>

          <div className="bg-white/[0.01] border border-white/[0.06] rounded-2xl p-5 flex flex-col justify-between group hover:border-pink-500/20 transition-all">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Tempo de Estudo</span>
              <span className="text-xl">⏱️</span>
            </div>
            <div className="mt-4">
              <span className="block text-2xl font-black text-pink-400">{horasEstudo}h {minutosEstudo}m</span>
              <span className="text-[10px] text-gray-500 font-semibold uppercase tracking-wider">Tempo focado na plataforma</span>
            </div>
          </div>

          <div className="bg-white/[0.01] border border-white/[0.06] rounded-2xl p-5 flex flex-col justify-between group hover:border-yellow-500/20 transition-all">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Conquistas</span>
              <span className="text-xl">🏆</span>
            </div>
            <div className="mt-4">
              <span className="block text-2xl font-black text-yellow-400">{perfil.conquistas.length}</span>
              <span className="text-[10px] text-gray-500 font-semibold uppercase tracking-wider">Medalhas desbloqueadas</span>
            </div>
          </div>
        </div>
      </div>

      {/* Detailed Analysis Breakdown */}
      <section className="grid gap-6 md:grid-cols-2">
        <div className="bg-white/[0.01] border border-white/[0.06] rounded-3xl p-6 space-y-4">
          <h3 className="font-extrabold text-sm uppercase tracking-wider text-gray-400">📊 Detalhes de Resolução</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-400">Total de Questões Feitas</span>
              <span className="font-bold text-white">{perfil.totalQuestoes}</span>
            </div>
            <div className="h-1 bg-white/[0.03] rounded-full overflow-hidden">
              <div className="h-full bg-blue-500 rounded-full" style={{ width: "100%" }} />
            </div>

            <div className="flex justify-between items-center text-sm pt-2">
              <span className="text-gray-400">Respostas Corretas</span>
              <span className="font-bold text-green-400">{perfil.acertos}</span>
            </div>
            <div className="h-1 bg-white/[0.03] rounded-full overflow-hidden">
              <div
                className="h-full bg-green-500 rounded-full"
                style={{ width: `${perfil.totalQuestoes > 0 ? (perfil.acertos / perfil.totalQuestoes) * 100 : 0}%` }}
              />
            </div>

            <div className="flex justify-between items-center text-sm pt-2">
              <span className="text-gray-400">Respostas Erradas</span>
              <span className="font-bold text-red-400">{perfil.erros}</span>
            </div>
            <div className="h-1 bg-white/[0.03] rounded-full overflow-hidden">
              <div
                className="h-full bg-red-500 rounded-full"
                style={{ width: `${perfil.totalQuestoes > 0 ? (perfil.erros / perfil.totalQuestoes) * 100 : 0}%` }}
              />
            </div>
          </div>
        </div>

        <div className="bg-white/[0.01] border border-white/[0.06] rounded-3xl p-6 space-y-4">
          <h3 className="font-extrabold text-sm uppercase tracking-wider text-gray-400">🃏 Ferramentas Ativas</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <span className="block text-sm font-bold text-white">Revisão Spaced Repetition</span>
                <span className="text-xs text-gray-500">{perfil.flashcards.length} flashcards criados</span>
              </div>
              <span className="text-2xl">🃏</span>
            </div>
            <div className="flex justify-between items-center pt-2">
              <div>
                <span className="block text-sm font-bold text-white">Sincronização Cloud</span>
                <span className="text-xs text-gray-500">Último acesso em {perfil.ultimoAcesso}</span>
              </div>
              <span className="text-2xl">☁️</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
