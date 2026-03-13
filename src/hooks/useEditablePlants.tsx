
import { useState } from 'react';
import { usePlants, Plant } from '@/hooks/usePlants';
import { firebaseFirestore } from '@/services/firebaseFirestore';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';

export const useEditablePlants = () => {
  const { plants, isLoading, error, loadPlants, addPlant } = usePlants();
  const [editingPlant, setEditingPlant] = useState<Plant | null>(null);
  const { user } = useAuth();

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

  const startEditing = (plant: Plant) => {
    setEditingPlant(plant);
  };

  const cancelEditing = () => {
    setEditingPlant(null);
  };

  return {
    plants,
    isLoading,
    error,
    loadPlants,
    addPlant,
    updatePlant,
    deletePlant,
    editingPlant,
    startEditing,
    cancelEditing
  };
};
