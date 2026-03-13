
import { GoogleGenerativeAI } from '@google/generative-ai';

export class GeminiClient {
  private genAI: GoogleGenerativeAI;
  private model: any;
  private chat: any;
  private pointsData: string = '';

  constructor(apiKey: string) {
    this.genAI = new GoogleGenerativeAI(apiKey);
    this.model = this.genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    
    this.initializeChat();
  }

  private initializeChat() {
    this.chat = this.model.startChat({
      history: [
        {
          role: "user",
          parts: [{ 
            text: `Você é o EcoAssistant, um assistente ecológico especializado em sustentabilidade e meio ambiente, com foco especial em Presidente Prudente, São Paulo. 

Suas principais responsabilidades:
- Sempre relacione as perguntas com ecologia e sustentabilidade
- Use linguagem acessível mas técnica quando necessário
- Mencione dados específicos de Presidente Prudente quando relevante
- Forneça dicas práticas de sustentabilidade
- Mantenha um tom inspirador mas realista
- Inclua curiosidades ecológicas relevantes
- Responda sobre pontos ecológicos específicos quando perguntado
- Use os dados dos pontos ecológicos cadastrados no sistema para responder perguntas específicas

IMPORTANTE: Quando alguém perguntar sobre pontos de coleta, reciclagem, ou locais específicos em Presidente Prudente, use os dados dos pontos ecológicos que eu forneço.

Responda sempre em português brasileiro, de forma educativa e encorajadora sobre práticas sustentáveis.`
          }],
        }
      ],
      generationConfig: {
        maxOutputTokens: 1000,
      },
    });
  }

  updatePointsData(pointsData: string) {
    this.pointsData = pointsData;
  }

  async sendMessage(prompt: string): Promise<string> {
    if (!prompt) return "Nenhuma pergunta fornecida para análise.";

    try {
      // Include points data in the context if available
      let contextualPrompt = prompt;
      if (this.pointsData) {
        contextualPrompt = `Contexto dos pontos ecológicos disponíveis:
${this.pointsData}

Pergunta do usuário: ${prompt}

Por favor, use as informações dos pontos ecológicos acima para responder quando relevante. Se a pergunta for sobre onde encontrar pontos de coleta, reciclagem, ou serviços específicos em Presidente Prudente, cite os pontos específicos com nomes, endereços e informações relevantes.`;
      }

      const result = await this.chat.sendMessage(contextualPrompt);
      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error("Erro na IA:", error);
      return "Ocorreu um erro ao processar sua mensagem. Por favor, tente novamente.";
    }
  }
}
