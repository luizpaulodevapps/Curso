export type TipoExercicio =
  | "multipla-escolha"
  | "verdadeiro-falso"
  | "complete-codigo"
  | "arraste-e-solte"
  | "ordenacao"
  | "flashcard"
  | "desafio-pratico"
  | "projeto"
  | "texto-livre"
  | "aula"
  | "exemplo"

export interface BlocoAula {
  tipo: "texto" | "codigo" | "resultado" | "legenda"
  valor: string
  linguagem?: string
}

export interface Questao {
  id: string
  titulo: string
  tipo: TipoExercicio
  explicacao: string
  pergunta: string
  alternativas?: string[]
  correta: string
  xp: number
  nivel: "iniciante" | "intermediario" | "avancado"
  tags: string[]
  codigoInicial?: string
  /** Para aulas: blocos de conteúdo (texto, código, resultado) */
  conteudo?: BlocoAula[]
  /** Expressão JS que valida a solução do usuário.
   *  Ex: "typeof nome !== 'undefined' && nome === 'Luiz'"
   *  O código do usuário é executado antes, depois a expressão é avaliada no mesmo escopo.
   */
  validacao?: string
}

export interface Modulo {
  id: string
  nome: string
  descricao: string
  ordem: number
  questoes: Questao[]
  projeto?: string
  duracao?: string
}

export interface Curso {
  id: string
  nome: string
  nivel: string
  descricao: string
  icone: string
  modulos: number
  moduloLista: string[]
  horasEstimadas?: number
  xpTotal?: number
  projetoFinal?: string
  prerequisitos?: string[]
  desbloqueia?: string[]
}

export interface ProgressoUsuario {
  cursoId: string
  moduloId: string
  questoesRespondidas: Record<string, boolean>
  acertos: number
  erros: number
  xpGanho: number
  concluido: boolean
}

export interface Perfil {
  nome: string
  xp: number
  streak: number
  ultimoAcesso: string
  totalQuestoes: number
  acertos: number
  erros: number
  tempoEstudo: number
  conquistas: string[]
  progressoCursos: Record<string, ProgressoUsuario>
  flashcards: RegistroFlashcard[]
  /** Timestamp do início da sessão atual (ms) */
  sessaoInicio?: number
  /** Minutos acumulados na sessão atual */
  tempoSessao?: number
}

export interface Nivel {
  nivel: number
  xpMinimo: number
  titulo: string
}

export interface Conquista {
  id: string
  titulo: string
  descricao: string
  icone: string
  condicao: (perfil: Perfil) => boolean
}

export interface FaseRoadmap {
  fase: number
  titulo: string
  duracao: string
  topicos: string[]
  projeto: string
}

export interface RegistroFlashcard {
  id: string
  pergunta: string
  resposta: string
  cursoId: string
  moduloId: string
  intervalo: number
  revisoes: number
  proximaRevisao: number
  facilidade: number
}

export const NIVEIS: Nivel[] = [
  { nivel: 1, xpMinimo: 0, titulo: "Iniciante" },
  { nivel: 2, xpMinimo: 100, titulo: "Aprendiz" },
  { nivel: 3, xpMinimo: 250, titulo: "Dedicado" },
  { nivel: 4, xpMinimo: 500, titulo: "Intermediário" },
  { nivel: 5, xpMinimo: 1000, titulo: "Avançado" },
  { nivel: 6, xpMinimo: 2000, titulo: "Expert" },
  { nivel: 7, xpMinimo: 3500, titulo: "Mestre" },
  { nivel: 8, xpMinimo: 5000, titulo: "Lendário" },
]

export function calcularNivel(xp: number): Nivel {
  let nivelAtual = NIVEIS[0]
  for (const n of NIVEIS) {
    if (xp >= n.xpMinimo) nivelAtual = n
    else break
  }
  return nivelAtual
}

export function xpParaProximoNivel(xp: number): number {
  for (let i = NIVEIS.length - 1; i >= 0; i--) {
    if (xp >= NIVEIS[i].xpMinimo) {
      if (i + 1 < NIVEIS.length) {
        return NIVEIS[i + 1].xpMinimo - xp
      }
      return 0
    }
  }
  return NIVEIS[1].xpMinimo
}
