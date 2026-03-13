
import { useState, useEffect } from 'react';
import { useMapPoints } from '@/hooks/useMapPoints';

interface AIPointData {
  name: string;
  type: string;
  address: string;
  description: string;
  contact?: string;
  website?: string;
  openingHours?: string;
}

export const useCSVDataForAI = () => {
  const [aiPointsData, setAiPointsData] = useState<AIPointData[]>([]);
  const { mapPoints } = useMapPoints();

  useEffect(() => {
    // Convert map points to AI-friendly format
    const aiData: AIPointData[] = mapPoints.map(point => ({
      name: point.name,
      type: Array.isArray(point.type) ? point.type.join(', ') : point.type,
      address: point.address,
      description: point.description,
      contact: point.contact,
      website: point.website,
      openingHours: point.openingHours
    }));

    setAiPointsData(aiData);
  }, [mapPoints]);

  const getPointsDataString = (): string => {
    if (aiPointsData.length === 0) {
      return "Atualmente não há pontos ecológicos cadastrados no sistema.";
    }

    return `Dados dos pontos ecológicos de Presidente Prudente:

${aiPointsData.map((point, index) => `
${index + 1}. ${point.name}
   - Tipo: ${point.type}
   - Endereço: ${point.address}
   - Descrição: ${point.description}
   ${point.contact ? `- Contato: ${point.contact}` : ''}
   ${point.website ? `- Website: ${point.website}` : ''}
   ${point.openingHours ? `- Horário: ${point.openingHours}` : ''}
`).join('')}

Total de pontos cadastrados: ${aiPointsData.length}`;
  };

  const findPointsByType = (type: string): AIPointData[] => {
    return aiPointsData.filter(point => 
      point.type.toLowerCase().includes(type.toLowerCase())
    );
  };

  const findPointsByLocation = (location: string): AIPointData[] => {
    return aiPointsData.filter(point => 
      point.address.toLowerCase().includes(location.toLowerCase()) ||
      point.name.toLowerCase().includes(location.toLowerCase())
    );
  };

  return {
    aiPointsData,
    getPointsDataString,
    findPointsByType,
    findPointsByLocation
  };
};
