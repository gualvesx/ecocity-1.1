
import { useState, useEffect, useCallback } from 'react';
import { MapPoint } from '@/types/map';
import { mapStorage } from '@/services/mapStorage';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';

export const useMapPoints = () => {
  const [mapPoints, setMapPoints] = useState<MapPoint[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const loadMapPoints = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const points = await mapStorage.getMapPoints();
      setMapPoints(points);
    } catch (err) {
      const errorMessage = 'Erro ao carregar pontos do mapa';
      setError(errorMessage);
      
      // Only show error toast if user is logged in
      if (user) {
        console.error('Error loading map points:', err);
        toast.error(errorMessage);
      }
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    loadMapPoints();
  }, [loadMapPoints]);

  const addMapPoint = async (pointData: Omit<MapPoint, 'id' | 'createdAt' | 'approved'>): Promise<MapPoint | null> => {
    if (!user) {
      toast.error('Você precisa estar logado para adicionar pontos.');
      return null;
    }

    try {
      const newPoint = await mapStorage.addMapPoint({
        ...pointData,
        userId: user.id,
        userName: user.name
      });
      
      if (newPoint) {
        await loadMapPoints(); // Reload to get updated list
        toast.success('Ponto adicionado com sucesso!');
        return newPoint;
      }
      
      return null;
    } catch (err) {
      console.error('Error adding map point:', err);
      toast.error('Erro ao adicionar ponto do mapa');
      return null;
    }
  };

  const updateMapPoint = async (id: string, updates: Partial<MapPoint>): Promise<boolean> => {
    if (!user?.isAdmin) {
      toast.error('Você não tem permissão para editar pontos.');
      return false;
    }

    try {
      const success = await mapStorage.updateMapPoint(id, updates);
      if (success) {
        await loadMapPoints(); // Reload to get updated list
        toast.success('Ponto atualizado com sucesso!');
        return true;
      }
      return false;
    } catch (err) {
      console.error('Error updating map point:', err);
      toast.error('Erro ao atualizar ponto do mapa');
      return false;
    }
  };

  const deleteMapPoint = async (id: string): Promise<boolean> => {
    if (!user?.isAdmin) {
      toast.error('Você não tem permissão para excluir pontos.');
      return false;
    }

    try {
      const success = await mapStorage.deleteMapPoint(id);
      if (success) {
        await loadMapPoints(); // Reload to get updated list
        toast.success('Ponto excluído com sucesso!');
        return true;
      }
      return false;
    } catch (err) {
      console.error('Error deleting map point:', err);
      toast.error('Erro ao excluir ponto do mapa');
      return false;
    }
  };

  const bulkAddMapPoints = async (points: Omit<MapPoint, 'id' | 'createdAt' | 'approved'>[]): Promise<boolean> => {
    if (!user?.isAdmin) {
      toast.error('Você não tem permissão para adicionar pontos em massa.');
      return false;
    }

    try {
      const results = await Promise.all(
        points.map(point => mapStorage.addMapPoint({
          ...point,
          userId: user.id,
          userName: user.name
        }))
      );
      
      const successCount = results.filter(result => result !== null).length;
      
      if (successCount > 0) {
        await loadMapPoints(); // Reload to get updated list
        toast.success(`${successCount} pontos adicionados com sucesso!`);
        return true;
      } else {
        toast.error('Nenhum ponto foi adicionado.');
        return false;
      }
    } catch (err) {
      console.error('Error bulk adding map points:', err);
      toast.error('Erro ao adicionar pontos em massa');
      return false;
    }
  };

  return {
    mapPoints,
    isLoading,
    error,
    loadMapPoints,
    addMapPoint,
    updateMapPoint,
    deleteMapPoint,
    bulkAddMapPoints
  };
};
