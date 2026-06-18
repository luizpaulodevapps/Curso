# DevEstudos — Sua Jornada JavaScript

Plataforma gamificada de aprendizado de programação com 11 cursos,
~300 questões interativas, editor de código embutido (CodeMirror 6),
sistema de XP e conquistas, flashcards com revisão espaçada, e
rastreador de tempo de estudo.

## Stack

- **Next.js 16** (App Router, Turbopack)
- **TypeScript** (strict)
- **Tailwind CSS v4**
- **CodeMirror 6** (editor de código com syntax highlighting)
- **localStorage** (persistência — sem backend)

## Como Usar

```bash
# instalar
cd meu-app
npm install

# rodar dev
npm run dev

# build produção
npm run build

# iniciar servidor produção
npm start
```

Abra [http://localhost:3000](http://localhost:3000).

## Jornada de Aprendizado

Os 11 cursos seguem ordem pedagógica rigorosa:

| # | Curso | O que você aprende |
|---|-------|-------------------|
| 1 | 🧠 Mentalidade de Programador | O que é um programa, variáveis, fluxo de dados |
| 2 | 🏗️ HTML5 Puro | Estrutura, formulários, tabelas, multimídia (sem CSS) |
| 3 | 🎨 CSS3 | Flexbox, Grid, responsivo, animações |
| 4 | ⚙️ Lógica de Programação | Variáveis, condições, loops, funções, objetos |
| 5 | 🟨 JavaScript Real | Arrays, map/filter/reduce, DOM, eventos, APIs, async |
| 6 | ✨ JavaScript Moderno (ES6+) | Destructuring, classes, POO, design patterns, clean code |
| 7 | 🚀 Projeto DevEstudos 2.0 | Constrói o próprio sistema: XP, conquistas, dashboard |
| 8 | ⚛️ React | JSX, hooks, contexto, formulários |
| 9 | ▲ Next.js | Server Components, Server Actions, auth, deploy |
| 10 | 🔥 Firebase | Firestore, Auth, Storage, Functions |
| 11 | 🏢 SaaS e Sistemas Reais | Multi-tenant, CRM, ERP, projeto final |

## Funcionalidades

- **Editor de código** — CodeMirror 6 com one-dark theme e validação automática via expressão JS
- **9 tipos de exercício** — múltipla escolha, V/F, código, texto livre, arraste, ordenação, flashcard, desafio, projeto
- **Sistema de XP e níveis** — cada resposta correta dá XP, sobe de nível
- **Conquistas** — badges desbloqueáveis ao atingir marcos
- **Flashcards** — repetição espaçada (SM-2) para revisão
- **Roadmap** — guia visual da jornada completa
- **Rastreador de tempo** — cronômetro automático que persiste no localStorage
- **IA Mentora** — botões "Dica" e "Explicar" em cada questão
- **100% client-side** — funciona offline após carregar, sem backend

## Estrutura de Pastas

```
meu-app/
├── app/                    # Rotas Next.js (App Router)
│   ├── licao/[id]/         # Página de questão com editor
│   ├── cursos/             # Lista e detalhe de cursos
│   ├── editor/             # Sandbox de código
│   └── ...
├── components/
│   ├── CodeEditor.tsx      # CodeMirror 6 wrapper
│   └── StudyTimer.tsx      # Rastreador de tempo
├── data/
│   ├── cursos.json         # Catálogo de 11 cursos
│   ├── mentalidade/        # 3 módulos
│   ├── html/               # 6 módulos
│   ├── css/                # 6 módulos
│   ├── logica/             # 6 módulos
│   ├── javascript/         # 8 módulos
│   ├── js-moderno/         # 5 módulos
│   ├── projetos/           # 5 módulos
│   ├── react-curso/        # 6 módulos
│   ├── next-curso/         # 6 módulos
│   ├── firebase/           # 5 módulos
│   └── saas/               # 5 módulos
├── lib/
│   ├── editor.ts           # Sandbox executor + validadores
│   ├── data-loader.ts      # Carrega módulos via import dinâmico
│   ├── types.ts            # Tipos + níveis
│   ├── storage.ts          # localStorage helpers
│   └── use-profile.ts      # Hook de perfil + XP
└── public/                 # Assets estáticos
```

## Adicionar Conteúdo

Cada módulo é um arquivo JSON em `data/<cursoId>/<moduloId>.json`.
O catálogo está em `data/cursos.json`. Veja módulos existentes como exemplo.

### Estrutura de uma questão de código:

```json
{
  "id": "exemplo-1",
  "titulo": "Somar Números",
  "tipo": "complete-codigo",
  "explicacao": "Use spread para somar...",
  "pergunta": "Crie uma função soma que aceita N argumentos.",
  "codigoInicial": "function soma(...nums) {",
  "correta": "function soma(...nums) {\n  return nums.reduce((a,b) => a+b, 0)\n}",
  "xp": 15,
  "nivel": "iniciante",
  "tags": ["spread", "reduce"],
  "validacao": "typeof soma === 'function' && soma(1,2,3) === 6"
}
```

O campo `validacao` é uma expressão JS executada após o código do usuário.
Se passar, a questão é considerada correta. Permite validação flexível sem
hardcoding de strings.

## Build

```bash
npm run build    # TypeScript check + produção
npm run lint     # ESLint
```

## Licença

Projeto educacional — Luiz.
