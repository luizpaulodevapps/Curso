import { ReferenceLink } from "./types"

export const REFERENCES_MAP: Record<string, ReferenceLink[]> = {
  // Mentalidade de Programador
  "mentalidade/introducao-e-historia": [
    {
      title: "Como funciona um computador? — Curso em Vídeo",
      url: "https://www.youtube.com/watch?v=1d_y2x4Hj7c",
      description: "Vídeo didático e simples sobre as partes físicas de um computador para leigos."
    },
    {
      title: "Ada Lovelace: A primeira programadora da história",
      url: "https://pt.wikipedia.org/wiki/Ada_Lovelace",
      description: "Biografia detalhada da criadora do primeiro algoritmo de computador."
    },
    {
      title: "Alan Turing e a Inteligência Artificial",
      url: "https://pt.wikipedia.org/wiki/Alan_Turing",
      description: "A história do matemático que decifrou códigos e fundou a computação moderna."
    }
  ],
  "mentalidade/o-que-e-um-programa": [
    {
      title: "Como funciona um computador por dentro?",
      url: "https://pt.wikipedia.org/wiki/Arquitetura_de_von_Neumann",
      description: "Entenda a arquitetura básica de hardware: entrada, processamento, memória e saída."
    },
    {
      title: "Introdução à Lógica de Programação — Canal DevMedia",
      url: "https://www.devmedia.com.br/primeiros-passos-na-logica-de-programacao/43004",
      description: "Um guia amigável sobre lógica para quem está dando os primeiríssimos passos."
    }
  ],
  "mentalidade/variaveis-e-memoria": [
    {
      title: "O que são variáveis e tipos de dados? — MDN",
      url: "https://developer.mozilla.org/pt-BR/docs/Learn/JavaScript/First_steps/Variables",
      description: "Como o computador reserva pequenos espaços de memória e coloca etiquetas neles."
    }
  ],
  "mentalidade/fluxo-de-dados": [
    {
      title: "Estruturas de Controle de Fluxo — MDN",
      url: "https://developer.mozilla.org/pt-BR/docs/Web/JavaScript/Guide/Control_flow_and_error_handling",
      description: "Entenda como condicionais e caminhos de decisão controlam o destino dos dados."
    }
  ],

  // HTML
  "html/meu-primeiro-site": [
    {
      title: "Guia de HTML Básico — MDN Web Docs",
      url: "https://developer.mozilla.org/pt-BR/docs/Learn/Getting_started_with_the_web/HTML_basics",
      description: "Aprenda sobre tags, elementos e a estrutura inicial de um documento HTML."
    },
    {
      title: "HTML Living Standard — Especificação Oficial (W3C)",
      url: "https://html.spec.whatwg.org/multipage/",
      description: "O manual completo e oficial que descreve todas as tags existentes da web."
    }
  ],
  "html/navegacao-e-listas": [
    {
      title: "Links e Navegação na Web — MDN",
      url: "https://developer.mozilla.org/pt-BR/docs/Learn/HTML/Introduction_to_HTML/Creating_hyperlinks",
      description: "Entenda a tag <a>, caminhos relativos/absolutos e como conectar páginas."
    }
  ],
  "html/imagens-e-multimidia": [
    {
      title: "Imagens e Multimídia em HTML — MDN",
      url: "https://developer.mozilla.org/pt-BR/docs/Learn/HTML/Multimedia_and_embedding/Images_in_HTML",
      description: "Como adicionar imagens usando a tag <img>, atributos alt e responsividade básica."
    }
  ],

  // CSS
  "css/primeiros-passos-css": [
    {
      title: "Introdução ao CSS — MDN Web Docs",
      url: "https://developer.mozilla.org/pt-BR/docs/Learn/CSS/First_steps",
      description: "Entenda a sintaxe dos seletores, propriedades e valores que vestem o HTML."
    }
  ],
  "css/box-model": [
    {
      title: "O Modelo de Caixa (Box Model) Explicado — CSS-Tricks",
      url: "https://css-tricks.com/the-css-box-model/",
      description: "O conceito mais fundamental do CSS: margem, borda, espaçamento (padding) e conteúdo."
    }
  ],
  "css/layout-flexivel": [
    {
      title: "Guia Completo de Flexbox — CSS-Tricks",
      url: "https://css-tricks.com/snippets/css/a-guide-to-flexbox/",
      description: "O melhor guia de referência visual para dominar Flexbox (flex direction, justify content, etc.)."
    }
  ],

  // JavaScript
  "javascript/fundamentos-js": [
    {
      title: "JavaScript.info — O Guia Completo do Modern JS",
      url: "https://pt.javascript.info/",
      description: "Do básico ao avançado com explicações detalhadas e exemplos práticos interativos."
    },
    {
      title: "Primeiros passos com JavaScript — MDN Web Docs",
      url: "https://developer.mozilla.org/pt-BR/docs/Learn/JavaScript/First_steps",
      description: "O ponto de partida oficial da Mozilla para dominar a linguagem da web."
    }
  ],
  "javascript/dom": [
    {
      title: "Manipulação do DOM — MDN Web Docs",
      url: "https://developer.mozilla.org/pt-BR/docs/Web/API/Document_Object_Model/Introduction",
      description: "Entenda como o JavaScript se conecta ao HTML para ler e modificar elementos em tempo real."
    }
  ],
  "javascript/async-await-avancado": [
    {
      title: "Programação Assíncrona e Promises — JavaScript.info",
      url: "https://pt.javascript.info/promise-basics",
      description: "Domine promises, callbacks, resoluções paralelas e o açúcar sintático async/await."
    }
  ],

  // React
  "react/jsx-e-componentes": [
    {
      title: "Nova Documentação do React (react.dev)",
      url: "https://react.dev/",
      description: "O guia oficial moderno do React, focado em hooks e componentes funcionais."
    },
    {
      title: "Escrevendo tags em JSX — React Docs",
      url: "https://react.dev/learn/writing-markup-with-jsx",
      description: "As regras do JSX, misturando HTML com o poder de renderização do JavaScript."
    }
  ],
  "react/hooks": [
    {
      title: "Guia de Referência dos Hooks Built-in — React Docs",
      url: "https://react.dev/reference/react/hooks",
      description: "Tabela oficial contendo as explicações e assinaturas do useState, useEffect, useContext e mais."
    }
  ],

  // Next.js
  "nextjs/fundamentos-next": [
    {
      title: "Documentação Oficial do Next.js",
      url: "https://nextjs.org/docs",
      description: "Guia completo do framework de produção da Vercel, cobrindo App Router e muito mais."
    }
  ],
  "nextjs/server-components": [
    {
      title: "React Server Components vs Client Components — Next.js Docs",
      url: "https://nextjs.org/docs/app/building-your-application/rendering/composition-patterns",
      description: "Entenda quando usar componentes renderizados no servidor (RSC) e componentes interativos no cliente."
    }
  ],

  // Postgresql / Bancos de Dados
  "postgresql/select": [
    {
      title: "Tutorial Completo de PostgreSQL — postgresqltutorial.com",
      url: "https://www.postgresqltutorial.com/",
      description: "A melhor referência prática de comandos SQL explicados de forma simples e direta."
    }
  ],

  // Engenharia de Software
  "engenharia-software/solid": [
    {
      title: "Os Princípios SOLID explicados de forma simples",
      url: "https://refactoring.guru/pt-br/design-patterns/solid",
      description: "Aprenda S.O.L.I.D. com exemplos visuais, diagramas e analogias do mundo real."
    }
  ],
  "engenharia-software/padroes-projeto": [
    {
      title: "Design Patterns — Catálogo Visual do Refactoring Guru",
      url: "https://refactoring.guru/pt-br/design-patterns",
      description: "Catálogo completo de padrões criacionais, estruturais e comportamentais com código de exemplo."
    }
  ]
}

export function getReferencesForModule(cursoId: string, moduloId: string): ReferenceLink[] {
  const key = `${cursoId}/${moduloId}`
  if (REFERENCES_MAP[key]) {
    return REFERENCES_MAP[key]
  }

  // Fallbacks inteligentes baseados no cursoId
  const baseDocs: Record<string, ReferenceLink[]> = {
    mentalidade: [
      {
        title: "Guia de Lógica para Iniciantes",
        url: "https://pt.javascript.info/first-steps",
        description: "O melhor lugar para começar a entender algoritmos simples."
      }
    ],
    html: [
      {
        title: "MDN Web Docs — Referência de HTML",
        url: "https://developer.mozilla.org/pt-BR/docs/Web/HTML",
        description: "Guia de referência completo de todas as tags e atributos HTML."
      }
    ],
    css: [
      {
        title: "MDN Web Docs — Guia de CSS",
        url: "https://developer.mozilla.org/pt-BR/docs/Web/CSS",
        description: "Aprenda a aplicar cores, estilizar fontes e montar layouts modernos com CSS."
      }
    ],
    logica: [
      {
        title: "JavaScript.info — Lógica e Primeiros Passos",
        url: "https://pt.javascript.info/first-steps",
        description: "Aprenda operadores, variáveis, condicionais e loops explicados passo a passo."
      }
    ],
    git: [
      {
        title: "Pro Git Book — Livro Oficial Gratúito",
        url: "https://git-scm.com/book/pt-br/v2",
        description: "O manual definitivo de uso do Git, do iniciante ao fluxo de trabalho corporativo."
      },
      {
        title: "Guias oficiais do GitHub",
        url: "https://docs.github.com/pt",
        description: "Documentação oficial para Pull Requests, Issues, Repositórios e GitHub Flow."
      }
    ],
    javascript: [
      {
        title: "Modern JavaScript Tutorial (JavaScript.info)",
        url: "https://pt.javascript.info/",
        description: "Guia moderno, conciso e completo de JavaScript, abrangendo desde fundamentos até APIs avançadas."
      },
      {
        title: "MDN Web Docs — JavaScript",
        url: "https://developer.mozilla.org/pt-BR/docs/Web/JavaScript",
        description: "Referência completa de tipos, métodos de array, objetos e manipulação assíncrona."
      }
    ],
    "banco-dados": [
      {
        title: "Modelagem de Bancos de Dados Relacionais",
        url: "https://www.devmedia.com.br/modelagem-de-dados-conceitos-iniciais/1912",
        description: "Aprenda modelagem de dados, chaves primárias, tabelas e integridade referencial."
      }
    ],
    postgresql: [
      {
        title: "PostgreSQL Tutorial",
        url: "https://www.postgresqltutorial.com/",
        description: "Exemplos práticos de SELECT, JOINs, agregações e modificações em tabelas Postgres."
      },
      {
        title: "Documentação Oficial do PostgreSQL",
        url: "https://www.postgresql.org/docs/",
        description: "O manual de referência absoluto e completo do banco de dados PostgreSQL."
      }
    ],
    "apis-rest": [
      {
        title: "HTTP Status Codes — MDN Web Docs",
        url: "https://developer.mozilla.org/pt-BR/docs/Web/HTTP/Status",
        description: "Aprenda o significado dos códigos 200, 201, 400, 401, 404, 500 etc."
      },
      {
        title: "O que é uma API REST? — Guia de Referência",
        url: "https://restfulapi.net/",
        description: "Entenda os princípios REST, verbos HTTP (GET, POST, etc.) e boas práticas de design."
      }
    ],
    supabase: [
      {
        title: "Documentação Oficial do Supabase",
        url: "https://supabase.com/docs",
        description: "Aprenda a configurar banco de dados, Row Level Security, Auth e storage do Supabase."
      }
    ],
    react: [
      {
        title: "Documentação Oficial do React",
        url: "https://react.dev/learn",
        description: "Escreva componentes, use hooks de estado e de efeitos de forma nativa e moderna."
      }
    ],
    nextjs: [
      {
        title: "Next.js App Router Documentation",
        url: "https://nextjs.org/docs",
        description: "Aprenda sobre Server Components, Server Actions, roteamento de pastas e otimizações."
      }
    ],
    firebase: [
      {
        title: "Documentação do Firebase para Web",
        url: "https://firebase.google.com/docs/web/setup",
        description: "Aprenda a integrar Firestore, Firebase Auth, Storage e Cloud Functions no seu site."
      }
    ],
    "arquitetura-saas": [
      {
        title: "Multi-Tenant SaaS Database Architecture",
        url: "https://learn.microsoft.com/en-us/azure/azure-sql/database/saas-tenancy-database-architectures",
        description: "Padrões de design de banco para sistemas SaaS multi-inquilino (compartilhado vs isolado)."
      }
    ],
    "engenharia-software": [
      {
        title: "Refactoring.guru — Padrões de Projeto e Refatoração",
        url: "https://refactoring.guru/pt-br",
        description: "O guia interativo mais famoso para aprender SOLID, Refatoração e Padrões de Projeto."
      }
    ],
    "ia-assistido": [
      {
        title: "Prompt Engineering Guide (promptingguide.ai)",
        url: "https://www.promptingguide.ai/pt",
        description: "Aprenda técnicas de prompting: few-shot, zero-shot, Chain-of-Thought e agentes inteligentes."
      }
    ]
  }

  return baseDocs[cursoId] || [
    {
      title: "Documentação de Tecnologia para Desenvolvedores — MDN",
      url: "https://developer.mozilla.org/pt-BR/",
      description: "Encontre tutoriais e referências de qualidade para todas as tecnologias web."
    }
  ]
}
