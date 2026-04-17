# 🚀 Rafael Fonseca | Developer & Systems Analyst

```typescript
/**
 * @profile Rafael Fonseca
 * @description Analista de Sistemas e Desenvolvedor Backend em formação
 */

type TechStack = {
  languages: string[];
  frameworks: string[];
  databases: string[];
  tools: string[];
};

interface ProfessionalProfile {
  name: string;
  role: string;
  location: string;
  education: string[];
  stack: TechStack;
  currentFocus: string;
}

const rafaelFonseca: ProfessionalProfile = {
  name: "Rafael Fonseca",
  role: "Systems Analyst & Backend Developer",
  location: "Pouso Alegre, MG",
  
  education: [
    "Pós-graduação em Sistemas (Foco em Java) - Unyleya",
    "Tecnólogo em Análise e Desenvolvimento de Sistemas - UNOPAR"
  ],

  stack: {
    languages: ["Java", "TypeScript", "JavaScript", "SQL", "C#"],
    frameworks: ["Spring Boot", "Express", "Node.js"],
    databases: ["PostgreSQL", "Oracle", "MySQL"],
    tools: ["Git", "GitHub", "Docker", "REST APIs"]
  },

  currentFocus: "Aprimorando conhecimentos em Ecossistema .NET e Microserviços"
};

console.log(`Disponível para oportunidades em: ${rafaelFonseca.location}`);