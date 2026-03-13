
import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { firebaseFirestore } from '@/services/firebaseFirestore';
import { toast } from 'sonner';

export interface Plant {
  id: string;
  name: string;
  description: string;
  imageURL: string;
  createdBy: string;
  createdAt: string;
}

export const usePlants = () => {
  const [plants, setPlants] = useState<Plant[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const loadPlants = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const plantsData = await firebaseFirestore.plants.getAll();
      setPlants(plantsData);
    } catch (err) {
      const errorMessage = 'Erro ao carregar plantas';
      setError(errorMessage);
      console.error('Error loading plants:', err);
      if (user) {
        toast.error(errorMessage);
      }
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    loadPlants();
  }, [loadPlants]);

  const addPlant = async (plantData: { name: string; description: string; imageURL: string }): Promise<boolean> => {
    if (!user) {
      toast.error('Você precisa estar logado para adicionar plantas.');
      return false;
    }

    try {
      await firebaseFirestore.plants.add({
        ...plantData,
        createdBy: user.name || user.email,
        createdAt: new Date().toISOString()
      });
      
      await loadPlants(); // Reload to get updated list
      toast.success('Planta adicionada com sucesso!');
      return true;
    } catch (err) {
      console.error('Error adding plant:', err);
      toast.error('Erro ao adicionar planta');
      return false;
    }
  };

  const updatePlant = async (plantId: string, plantData: { name: string; description: string; imageURL: string }): Promise<boolean> => {
    if (!user) {
      toast.error('Você precisa estar logado para editar plantas.');
      return false;
    }

    try {
      await firebaseFirestore.plants.update(plantId, {
        ...plantData,
        updatedAt: new Date().toISOString(),
        updatedBy: user.name || user.email
      });
      
      await loadPlants(); // Reload to get updated list
      toast.success('Planta atualizada com sucesso!');
      return true;
    } catch (err) {
      console.error('Error updating plant:', err);
      toast.error('Erro ao atualizar planta');
      return false;
    }
  };

  const deletePlant = async (plantId: string): Promise<boolean> => {
    if (!user) {
      toast.error('Você precisa estar logado para excluir plantas.');
      return false;
    }

    try {
      await firebaseFirestore.plants.delete(plantId);
      await loadPlants(); // Reload to get updated list
      toast.success('Planta excluída com sucesso!');
      return true;
    } catch (err) {
      console.error('Error deleting plant:', err);
      toast.error('Erro ao excluir planta');
      return false;
    }
  };

  return {
    plants,
    isLoading,
    error,
    loadPlants,
    addPlant,
    updatePlant,
    deletePlant
  };
};
