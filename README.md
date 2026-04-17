/**
 * @file RafaelFonseca.ts
 * @description Perfil profissional de um Desenvolvedor e Analista de Sistemas
 * @author Rafael Fonseca <rfonseca985@gmail.com>
 */

interface Experiencia {
  empresa: string;
  cargo: string;
  periodo: string;
  tecnologias: string[];
  descricao: string;
}

interface Formacao {
  titulo: string;
  instituicao: string;
  nivel: 'Tecnólogo' | 'Pós-graduação' | 'Especialização';
}

type Habilidades = {
  backend: string[];
  frontend: string[];
  bancoDeDados: string[];
  ferramentas: string[];
  softSkills: string[];
};

class RafaelFonseca {
  public readonly nome: string = "Rafael Fonseca";
  public readonly local: string = "Pouso Alegre, MG";
  public readonly contato: string = "(35) 98429-6585";
  
  public resumo: string = `
    Analista de Sistemas com transição sólida para o desenvolvimento backend.
    Unindo a precisão da operação industrial com a lógica de programação para
    criar soluções escaláveis, seguras e orientadas ao negócio.
  `;

  public formacao: Formacao[] = [
    {
      titulo: "Desenvolvimento de Sistemas com foco em Java",
      instituicao: "Faculdade Unyleya",
      nivel: "Pós-graduação"
    },
    {
      titulo: "Análise e Desenvolvimento de Sistemas (ADS)",
      instituicao: "UNOPAR",
      nivel: "Tecnólogo"
    }
  ];

  public stack: Habilidades = {
    backend: ["Java (Spring Boot)", "C# / .NET (Estudando)", "Node.js (Em evolução)"],
    frontend: ["JavaScript", "TypeScript", "HTML5/CSS3"],
    bancoDeDados: ["SQL Server", "Oracle", "PostgreSQL", "MySQL"],
    ferramentas: ["Git", "GitHub", "Docker", "APIs REST", "Testes Unitários"],
    softSkills: ["Análise Crítica", "Resolução de Problemas", "Trabalho em Equipe"]
  };

  public trajetoria: Experiencia[] = [
    {
      empresa: "Cimed",
      cargo: "Operador de Máquinas / Automação",
      periodo: "2025 - Presente",
      tecnologias: ["IHM", "Sistemas de Automação", "Controle de Qualidade"],
      descricao: "Operação de alta precisão e monitoramento lógico de processos industriais."
    },
    {
      empresa: "RF Soluções em Sistemas",
      cargo: "Analista de Sistemas / Developer",
      periodo: "2021 - 2025",
      tecnologias: ["Java", "Spring Boot", "SQL", "Git"],
      descricao: "Desenvolvimento de APIs REST e gestão de bancos de dados relacionais."
    },
    {
      empresa: "Fotosensores Tecnologia",
      cargo: "Operador de Micro / Analista de Dados",
      periodo: "2019 - 2020",
      tecnologias: ["Análise de Dados", "Relatórios de Performance"],
      descricao: "Validação sistêmica e análise crítica de registros de performance."
    }
  ];

  public getObjetivo(): string {
    return "Evoluir tecnicamente em ambientes colaborativos como Dev Java/C# ou Analista de TI.";
  }

  public 