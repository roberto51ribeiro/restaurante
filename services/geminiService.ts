
import { GoogleGenAI } from "@google/genai";
import { TimeRecord, Task, User } from '../types';

// Assume process.env.API_KEY is configured in the environment
const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  // In a real app, you might want to handle this more gracefully.
  // For this example, we'll log an error.
  console.error("Gemini API key not found. Please set the API_KEY environment variable.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY! });

export const generateReportSummary = async (
  records: TimeRecord[], 
  tasks: Task[],
  employees: User[]
): Promise<string> => {
  if (!API_KEY) {
    return "API Key do Gemini não configurada. Não é possível gerar o resumo.";
  }

  const prompt = `
    Você é um assistente de gerenciamento de restaurantes. Analise os seguintes dados e gere um resumo conciso em português (PT-BR) sobre a eficiência da equipe.
    
    Dados de Ponto dos Funcionários:
    ${records.map(r => {
        const employee = employees.find(e => e.id === r.employeeId);
        return `- Funcionário: ${employee?.name || 'Desconhecido'}, Tipo: ${r.type}, Horário: ${new Date(r.timestamp).toLocaleString('pt-BR')}`;
    }).join('\n')}

    Dados de Tarefas:
    ${tasks.map(t => {
        const employee = employees.find(e => e.id === t.assigneeId);
        return `- Tarefa: ${t.description}, Atribuída a: ${employee?.name || 'Desconhecido'}, Status: ${t.completed ? 'Concluída' : 'Pendente'}`;
    }).join('\n')}

    Com base nesses dados, forneça um resumo sobre a pontualidade dos funcionários e a taxa de conclusão de tarefas. Destaque pontos positivos e áreas que precisam de atenção. Formate o resultado em markdown.
  `;

  try {
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
    });
    return response.text;
  } catch (error) {
    console.error("Error generating report summary:", error);
    return "Ocorreu um erro ao gerar o resumo do relatório. Por favor, tente novamente.";
  }
};
