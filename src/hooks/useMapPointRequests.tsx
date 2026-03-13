
import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import { MapPointRequest, NewMapPointRequest } from '@/types/mapRequest';
import {
  getAllMapPointRequests,
  getUserMapPointRequests,
  createMapPointRequest,
  approveMapPointRequest,
  rejectMapPointRequest,
  deleteMapPointRequest
} from '@/services/firebaseMapRequests';

export const useMapPointRequests = () => {
  const [mapPointRequests, setMapPointRequests] = useState<MapPointRequest[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const { user } = useAuth();

  const fetchMapPointRequests = useCallback(async () => {
    if (!user) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      let requests: MapPointRequest[] = [];
      
      if (user.isAdmin) {
        // Admin sees all requests
        requests = await getAllMapPointRequests();
      } else {
        // Regular users see only their requests
        requests = await getUserMapPointRequests(user.id);
      }
      
      setMapPointRequests(requests);
    } catch (err) {
      console.error('Error fetching map point requests:', err);
      setError(err instanceof Error ? err : new Error('Failed to fetch map point requests'));
      toast.error('Erro ao carregar solicitações de pontos no mapa');
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  const createRequest = async (data: NewMapPointRequest) => {
    if (!user) {
      toast.error('Você precisa estar logado para solicitar a adição de um ponto');
      return null;
    }
    
    setIsLoading(true);
    try {
      const newRequest = await createMapPointRequest(data, user.id);
      setMapPointRequests(prev => [...prev, newRequest]);
      toast.success('Solicitação enviada com sucesso! Aguarde aprovação de um administrador.');
      return newRequest;
    } catch (err) {
      console.error('Error creating map point request:', err);
      toast.error('Erro ao criar solicitação');
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const approveRequest = async (requestId: string) => {
    if (!user?.isAdmin) {
      toast.error('Apenas administradores podem aprovar solicitações');
      return false;
    }
    
    setIsLoading(true);
    try {
      const success = await approveMapPointRequest(requestId);
      
      if (success) {
        toast.success('Solicitação aprovada com sucesso!');
        // Update the request in the local state
        setMapPointRequests(prev => 
          prev.map(req => 
            req.id === requestId ? { ...req, status: 'approved' } : req
          )
        );
        return true;
      } else {
        toast.error('Erro ao aprovar solicitação');
        return false;
      }
    } catch (err) {
      console.error('Error approving map point request:', err);
      toast.error('Erro ao aprovar solicitação');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const rejectRequest = async (requestId: string) => {
    if (!user?.isAdmin) {
      toast.error('Apenas administradores podem rejeitar solicitações');
      return false;
    }
    
    setIsLoading(true);
    try {
      const success = await rejectMapPointRequest(requestId);
      
      if (success) {
        toast.success('Solicitação rejeitada');
        // Update the request in the local state
        setMapPointRequests(prev => 
          prev.map(req => 
            req.id === requestId ? { ...req, status: 'rejected' } : req
          )
        );
        return true;
      } else {
        toast.error('Erro ao rejeitar solicitação');
        return false;
      }
    } catch (err) {
      console.error('Error rejecting map point request:', err);
      toast.error('Erro ao rejeitar solicitação');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const deleteRequest = async (requestId: string) => {
    setIsLoading(true);
    try {
      await deleteMapPointRequest(requestId);
      toast.success('Solicitação removida');
      
      // Remove the request from the local state
      setMapPointRequests(prev => prev.filter(req => req.id !== requestId));
      return true;
    } catch (err) {
      console.error('Error deleting map point request:', err);
      toast.error('Erro ao remover solicitação');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMapPointRequests();
  }, [fetchMapPointRequests]);

  return {
    mapPointRequests,
    isLoading,
    error,
    createRequest,
    approveRequest,
    rejectRequest,
    deleteRequest,
    refreshRequests: fetchMapPointRequests
  };
};
