# 🚀 Rafael Fonseca | Developer & Systems Analyst

<p align="center">
  <img src="https://img.shields.io/badge/Java-ED8B00?style=for-the-badge&logo=openjdk&logoColor=white" />
  <img src="https://img.shields.io/badge/Spring_Boot-6DB33F?style=for-the-badge&logo=spring-boot&logoColor=white" />
  <img src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white" />
  <img src="https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white" />
  <img src="https://img.shields.io/badge/Git-F05032?style=for-the-badge&logo=git&logoColor=white" />
</p>

```typescript
/**
 * @profile Rafael Fonseca
 * @role Full Stack Developer in Training & Systems Analyst
 * @location Pouso Alegre, MG - Brazil
 */

interface Skillset {
  languages: string[];
  frameworks: string[];
  databases: string[];
  tools: string[];
  currentStudy: string[];
}

interface ProfessionalJourney {
  company: string;
  role: string;
  period: string;
  highlights: string[];
}

const rafaelFonseca = {
  contacts: {
    phone: "(35) 98429-6585",
    email: "rfonseca985@gmail.com",
    linkedin: "linkedin.com/in/seu-perfil", // Atualize aqui
    github: "github.com/seu-usuario"       // Atualize aqui
  },

  bio: "Unindo a precisão da automação industrial com a lógica do desenvolvimento backend.",

  education: [
    "Pós-Graduação em Desenvolvimento de Sistemas (Foco em Java)",
    "Análise e Desenvolvimento de Sistemas (Tecnólogo)"
  ],

  stack: <Skillset>{
    languages: ["Java", "TypeScript", "JavaScript", "SQL", "C# (Learning)"],
    frameworks: ["Spring Boot", "Node.js", "Express"],
    databases: ["PostgreSQL", "MySQL", "Oracle"],
    tools: ["Git", "GitHub", "Docker", "REST APIs", "Postman"],
    currentStudy: [".NET Ecosystem", "Microservices", "Unit Testing"]
  },

  experience: <ProfessionalJourney[]>[
    {
      company: "Cimed",
      role: "Operador de Máquinas / Automação Industrial",
      period: "2025 - Presente",
      highlights: ["Monitoramento de sistemas IHM", "Controle de qualidade técnico"]
    },
    {
      company: "RF Soluções em Sistemas",
      role: "Analista de Sistemas / Desenvolvedor",
      period: "2021 - 2025",
      highlights: [
        "Desenvolvimento de APIs RESTful com Spring Boot",
        "Modelagem de dados e otimização de queries SQL",
        "Suporte técnico especializado em infraestrutura e software"
      ]
    }
  ],

  getMotivation: () => {
    return "Construir soluções escaláveis que resolvem problemas reais de negócio.";
  }
};

console.log(`Status: ${rafaelFonseca.getMotivation()}`);