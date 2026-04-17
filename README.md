// 👋 Olá! Bem-vindo ao meu perfil.

const rafaelFonseca: Developer = {

  // ℹ️ Sobre Mim
  nome: "Rafael Fonseca",
  localização: "Pouso Alegre, MG 🇧🇷",
  contato: {
    email: "rfonseca985@gmail.com",
    telefone: "(35) 98429-6585",
  },

  resumo: `
    Desenvolvedor e Analista de Sistemas com visão full-stack.
    Transformo problemas complexos em soluções lógicas e escaláveis.
    Minha experiência vai do chão de fábrica ao código limpo,
    o que me dá uma perspectiva única para resolver desafios reais.
  `,

  // 🎓 Formação Acadêmica
  formacao: [
    {
      curso: "Pós-Graduação em Desenvolvimento de Sistemas",
      foco: "Java",
      instituicao: "Faculdade Unyleya",
      status: "✅ Concluído",
    },
    {
      curso: "Tecnólogo em Análise e Desenvolvimento de Sistemas",
      instituicao: "UNOPAR",
      status: "✅ Concluído",
    },
  ],

  // 🛠️ Stack Técnica
  stack: {
    linguagens: ["Java", "SQL", "JavaScript", "C# (em evolução)"],
    backend: ["Spring Boot", "APIs REST", "JPA / Hibernate"],
    bancosDeDados: ["PostgreSQL", "MySQL", "Oracle"],
    ferramentas: ["Git", "GitHub", "VS Code", "IntelliJ IDEA"],
    conceitos: [
      "Arquitetura REST",
      "Modelagem de Dados",
      "Testes de Software",
      "Análise de Processos",
      "Manutenção de Hardware",
      "Suporte Técnico",
    ],
  },

  // 💼 Trajetória Profissional
  experiencia: [
    {
      empresa: "Cimed",
      cargo: "Operador de Máquinas | Automação Industrial",
      periodo: "Jul/2025 - Atual",
      destaques: [
        "Operação de sistemas automatizados via IHM",
        "Monitoramento lógico de indicadores de produção",
        "Manutenção autônoma e controle de processos",
      ],
    },
    {
      empresa: "RF Soluções em Sistemas",
      cargo: "Analista de Sistemas / Desenvolvedor",
      periodo: "Mar/2021 - Abr/2025",
      destaques: [
        "Desenvolvimento de APIs REST com Java + Spring Boot",
        "Gestão e modelagem de bancos de dados relacionais",
        "Suporte técnico em hardware, software e redes",
        "Automação de processos internos",
      ],
    },
    {
      empresa: "Fotosensores Tecnologia",
      cargo: "Operador de Micro / Analista de Dados",
      periodo: "Out/2019 - Jun/2020",
      destaques: [
        "Análise crítica de dados e validação sistêmica",
        "Geração de relatórios de performance",
      ],
    },
    {
      empresa: "Qualivale",
      cargo: "Auxiliar de Controle de Qualidade",
      periodo: "Jan/2019 - Set/2019",
      destaques: [
        "Inspeção técnica no setor automobilístico",
        "Foco em conformidade e redução de retrabalho",
      ],
    },
  ],

  // 🚀 Projetos em Destaque
  projetos: [
    {
      nome: "API REST com Spring Boot",
      descricao: "CRUD completo com endpoints RESTful",
      tecnologias: ["Java", "Spring Boot", "PostgreSQL", "Git"],
    },
    {
      nome: "Sistema de Gestão de Dados",
      descricao: "Consultas SQL avançadas para relatórios operacionais",
      tecnologias: ["SQL", "Oracle", "MySQL"],
    },
  ],

  // 📊 O que estou estudando agora
  aprendendo: [
    "JavaScript avançado",
    "Fundamentos de .NET / C#",
    "Docker & Containers",
    "Testes automatizados",
  ],

  // 🎯 Objetivo
  objetivo: `
    Evoluir como desenvolvedor em ambientes colaborativos,
    contribuindo com soluções escaláveis e orientadas ao negócio.
    Aberto a oportunidades em Desenvolvimento Backend,
    Suporte de TI e Análise de Sistemas.
  `,

  // ⚡ Fun Fact
  funFact: "Codifico com a mesma precisão que opero máquinas industriais. 🏭💻",
};


// 📫 Vamos conversar?
function entrarEmContato(dev: Developer): string {
  return `
    ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    📧 ${dev.contato.email}
    📱 ${dev.contato.telefone}
    📍 ${dev.localização}
    ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    "Código bom é código que resolve problemas reais."
  `;
}

console.log(entrarEmContato(rafaelFonseca));