
import { useState } from 'react';
import { useMapPoints } from '@/hooks/useMapPoints';
import { geocodeAddress } from '@/services/geocoding';
import { useAddressCorrection } from '@/hooks/useAddressCorrection';
import { toast } from 'sonner';

interface CSVData {
  Id?: string;
  Nome: string;
  Descrição: string;
  Contato: string;
  WebSite: string;
  Impacto: string;
  Endereço: string;
  Tipo: string;
}

export const useCSVUpdater = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const { mapPoints, updateMapPoint } = useMapPoints();
  const { correctAddress } = useAddressCorrection();

  const updatePointsFromCSV = async (csvContent: string) => {
    setIsProcessing(true);
    
    try {
      // Parse CSV content
      const lines = csvContent.trim().split('\n');
      const headers = lines[0].split(',').map(h => h.trim());
      
      console.log('CSV Headers:', headers);
      
      let successCount = 0;
      let errorCount = 0;
      const errors: string[] = [];

      // Process each data line (skip header)
      for (let i = 1; i < lines.length; i++) {
        try {
          const values = parseCSVLine(lines[i]);
          
          if (values.length !== headers.length) {
            console.warn(`Linha ${i + 1}: Número de valores não coincide com cabeçalhos`);
            continue;
          }

          // Create object from CSV data
          const rowData: Partial<CSVData> = {};
          headers.forEach((header, index) => {
            rowData[header as keyof CSVData] = values[index]?.trim() || '';
          });

          const data = rowData as CSVData;

          // Validate required fields
          if (!data.Nome || !data.Endereço || !data.Tipo) {
            errors.push(`Linha ${i + 1}: Campos obrigatórios faltando (Nome, Endereço, Tipo)`);
            errorCount++;
            continue;
          }

          // Find existing point by ID or name
          let existingPoint = null;
          if (data.Id) {
            existingPoint = mapPoints.find(p => p.id === data.Id);
          }
          if (!existingPoint) {
            existingPoint = mapPoints.find(p => p.name.toLowerCase() === data.Nome.toLowerCase());
          }

          if (!existingPoint) {
            errors.push(`Linha ${i + 1}: Ponto não encontrado: ${data.Nome}`);
            errorCount++;
            continue;
          }

          console.log(`Atualizando ponto: ${data.Nome}`);

          // Correct address using AI
          const correctedAddress = await correctAddress(data.Endereço);
          console.log(`Endereço corrigido: ${correctedAddress}`);

          // Get coordinates
          const coordinates = await geocodeAddress(correctedAddress);
          
          if (!coordinates) {
            console.error(`Coordenadas não encontradas para: ${correctedAddress}`);
            errors.push(`Linha ${i + 1}: Não foi possível localizar o endereço: ${correctedAddress}`);
            errorCount++;
            continue;
          }

          // Map CSV type to system type
          const pointType = mapTypeToSystem(data.Tipo);

          // Update map point
          const result = await updateMapPoint(existingPoint.id, {
            name: data.Nome,
            type: pointType,
            description: data.Descrição || existingPoint.description,
            address: correctedAddress,
            impact: data.Impacto || existingPoint.impact,
            contact: data.Contato || existingPoint.contact,
            website: data.WebSite || existingPoint.website,
            lat: coordinates.lat,
            lng: coordinates.lng,
          });

          if (result) {
            successCount++;
            console.log(`Ponto atualizado: ${data.Nome}`);
          } else {
            errors.push(`Linha ${i + 1}: Falha ao atualizar ponto: ${data.Nome}`);
            errorCount++;
          }

        } catch (error) {
          console.error(`Erro ao processar linha ${i + 1}:`, error);
          errors.push(`Linha ${i + 1}: ${error}`);
          errorCount++;
        }
      }

      // Show results
      if (successCount > 0) {
        toast.success(`${successCount} pontos atualizados com sucesso!`);
      }
      
      if (errorCount > 0) {
        toast.error(`${errorCount} pontos falharam. Verifique o console para detalhes.`);
        console.error('Erros de atualização:', errors);
      }

      return {
        success: successCount > 0,
        successCount,
        errorCount,
        errors
      };

    } catch (error) {
      console.error('Erro ao processar CSV:', error);
      toast.error('Erro ao processar arquivo CSV');
      return {
        success: false,
        successCount: 0,
        errorCount: 1,
        errors: [String(error)]
      };
    } finally {
      setIsProcessing(false);
    }
  };

  const parseCSVLine = (line: string): string[] => {
    const result: string[] = [];
    let current = '';
    let inQuotes = false;
    
    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        result.push(current.trim());
        current = '';
      } else {
        current += char;
      }
    }
    
    result.push(current.trim());
    return result;
  };

  const mapTypeToSystem = (csvType: string): string => {
    const type = csvType.toLowerCase().trim();
    
    // Map CSV types to system types
    if (type.includes('lamp') || type.includes('lâmpada')) {
      return 'lamp-collection';
    }
    if (type.includes('recicl') || type.includes('reciclagem')) {
      return 'recycling-point';
    }
    if (type.includes('eletrônico') || type.includes('eletronico')) {
      return 'recycling-center';
    }
    if (type.includes('óleo') || type.includes('oleo')) {
      return 'oil-collection';
    }
    if (type.includes('medicament') || type.includes('remédio') || type.includes('remedio')) {
      return 'medicine-collection';
    }
    if (type.includes('muda')) {
      return 'seedling-distribution';
    }
    
    // Default fallback
    return 'recycling-point';
  };

  return {
    updatePointsFromCSV,
    isProcessing
  };
};
