
import { useState } from 'react';
import { addressCorrectionService, AddressValidationResult } from '@/services/addressCorrection';
import { toast } from 'sonner';

export const useAddressCorrection = () => {
  const [isCorreting, setIsCorreting] = useState(false);
  const [lastValidation, setLastValidation] = useState<AddressValidationResult | null>(null);

  const validateAndCorrectAddress = async (inputAddress: string): Promise<AddressValidationResult> => {
    if (!inputAddress || inputAddress.trim().length < 3) {
      const result: AddressValidationResult = {
        originalAddress: inputAddress,
        correctedAddress: inputAddress,
        confidence: 0,
        isValid: false
      };
      setLastValidation(result);
      return result;
    }

    setIsCorreting(true);
    
    try {
      const result = await addressCorrectionService.validateAndCorrectAddress(inputAddress);
      setLastValidation(result);
      
      if (result.confidence >= 70 && result.correctedAddress !== inputAddress) {
        toast.success('Endereço corrigido pela IA', {
          description: `Confiança: ${result.confidence}%`
        });
      } else if (result.confidence < 70 && result.suggestions && result.suggestions.length > 0) {
        toast.warning('Endereço pode estar incorreto', {
          description: result.suggestions.join(', ')
        });
      } else if (!result.isValid) {
        toast.error('Endereço não foi validado', {
          description: 'Verifique se o endereço está correto'
        });
      }
      
      return result;
    } catch (error) {
      console.error('Erro na correção de endereço:', error);
      toast.error('Erro ao validar endereço com IA');
      const errorResult: AddressValidationResult = {
        originalAddress: inputAddress,
        correctedAddress: inputAddress,
        confidence: 0,
        isValid: false
      };
      setLastValidation(errorResult);
      return errorResult;
    } finally {
      setIsCorreting(false);
    }
  };

  const correctAddress = async (inputAddress: string): Promise<string> => {
    const result = await validateAndCorrectAddress(inputAddress);
    return result.correctedAddress;
  };

  return {
    correctAddress,
    validateAndCorrectAddress,
    isCorreting,
    lastValidation
  };
};
