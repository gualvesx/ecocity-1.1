
import { GeminiClient } from '@/api/gemini';

export interface AddressValidationResult {
  originalAddress: string;
  correctedAddress: string;
  confidence: number;
  isValid: boolean;
  coordinates?: {
    lat: number;
    lng: number;
  };
  suggestions?: string[];
}

export class AddressCorrectionService {
  private gemini: GeminiClient;

  constructor() {
    const apiKey = 'AIzaSyBk2eWsY9lNQ7if7uLFAbOZjq1IK7EqrtY';
    this.gemini = new GeminiClient(apiKey);
  }

  async validateAndCorrectAddress(inputAddress: string): Promise<AddressValidationResult> {
    if (!inputAddress || inputAddress.trim().length < 3) {
      return {
        originalAddress: inputAddress,
        correctedAddress: inputAddress,
        confidence: 0,
        isValid: false
      };
    }

    const prompt = `
SISTEMA DE PADRONIZAÇÃO DE ENDEREÇOS - PRESIDENTE PRUDENTE/SP

Analise e padronize o seguinte endereço para o formato brasileiro padrão:

ENDEREÇO ORIGINAL: "${inputAddress}"

INSTRUÇÕES OBRIGATÓRIAS:
1. Padronize para o formato: [Tipo] [Nome], [Número] - [Bairro] - Presidente Prudente, SP, Brasil
2. Se não mencionar cidade, assumir Presidente Prudente, SP
3. Se não mencionar bairro, tentar identificar ou usar "Centro"
4. Corrigir erros de digitação e abreviações
5. Validar se o endereço existe ou é plausível
6. Retornar APENAS um JSON no formato especificado

RUAS CONHECIDAS DE PRESIDENTE PRUDENTE:
- Av. Brasil, Av. Manoel Goulart, Av. Washington Luiz, Av. Coronel José Soares Marcondes
- R. Tenente Nicolau Maffei, R. Dr. Gurgel, R. Barão do Rio Branco
- Bairros: Centro, Vila Marcondes, Jardim Bongiovani, Vila Formosa, Jardim América, Jardim Paulista

FORMATO DE RESPOSTA (JSON):
{
  "correctedAddress": "Endereço padronizado completo",
  "confidence": número_de_0_a_100,
  "isValid": true_ou_false,
  "suggestions": ["sugestão1", "sugestão2"] (apenas se confidence < 70)
}

EXEMPLOS:
- "av brasil 500" → {"correctedAddress": "Av. Brasil, 500 - Centro - Presidente Prudente, SP, Brasil", "confidence": 95, "isValid": true}
- "manoel goulart 1000" → {"correctedAddress": "Av. Manoel Goulart, 1000 - Centro - Presidente Prudente, SP, Brasil", "confidence": 90, "isValid": true}
- "rua inexistente 999" → {"correctedAddress": "", "confidence": 10, "isValid": false, "suggestions": ["Verifique o nome da rua", "Confirme o número"]}

RESPOSTA JSON:`;

    try {
      const response = await this.gemini.sendMessage(prompt);
      
      // Extrair JSON da resposta
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('Resposta inválida da IA');
      }

      const aiResult = JSON.parse(jsonMatch[0]);
      
      return {
        originalAddress: inputAddress,
        correctedAddress: aiResult.correctedAddress || inputAddress,
        confidence: aiResult.confidence || 0,
        isValid: aiResult.isValid || false,
        suggestions: aiResult.suggestions || []
      };
    } catch (error) {
      console.error('Erro na validação de endereço:', error);
      return {
        originalAddress: inputAddress,
        correctedAddress: inputAddress,
        confidence: 0,
        isValid: false,
        suggestions: ['Erro na validação. Verifique o endereço manualmente.']
      };
    }
  }

  async correctAddress(inputAddress: string): Promise<string> {
    const result = await this.validateAndCorrectAddress(inputAddress);
    return result.correctedAddress || inputAddress;
  }
}

export const addressCorrectionService = new AddressCorrectionService();
