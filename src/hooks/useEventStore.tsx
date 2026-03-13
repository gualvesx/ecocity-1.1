
import { useState, useEffect, useCallback } from 'react';
import { Event } from '@/types/events';
import { mapStorage } from '@/services/mapStorage';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';

export const useEventStore = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const loadEvents = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const loadedEvents = await mapStorage.getEvents();
      setEvents(loadedEvents);
    } catch (err) {
      const errorMessage = 'Erro ao carregar eventos';
      setError(errorMessage);
      
      // Only show error toast if user is logged in
      if (user) {
        console.error('Error loading events:', err);
        toast.error(errorMessage);
      }
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    loadEvents();
  }, [loadEvents]);

  const addEvent = async (eventData: Omit<Event, 'id' | 'createdAt' | 'approved'>): Promise<Event | null> => {
    if (!user) {
      toast.error('Você precisa estar logado para criar eventos.');
      return null;
    }

    try {
      const newEvent = await mapStorage.addEvent({
        ...eventData,
        userId: user.id,
        userName: user.name
      });
      
      if (newEvent) {
        await loadEvents(); // Reload to get updated list
        toast.success('Evento criado com sucesso!');
        return newEvent;
      }
      
      return null;
    } catch (err) {
      console.error('Error adding event:', err);
      toast.error('Erro ao criar evento');
      return null;
    }
  };

  const updateEvent = async (id: string, updates: Partial<Event>): Promise<boolean> => {
    if (!user) {
      toast.error('Você precisa estar logado para editar eventos.');
      return false;
    }

    try {
      const success = await mapStorage.updateEvent(id, updates);
      if (success) {
        await loadEvents(); // Reload to get updated list
        toast.success('Evento atualizado com sucesso!');
        return true;
      }
      return false;
    } catch (err) {
      console.error('Error updating event:', err);
      toast.error('Erro ao atualizar evento');
      return false;
    }
  };

  const deleteEvent = async (id: string): Promise<boolean> => {
    if (!user) {
      toast.error('Você precisa estar logado para excluir eventos.');
      return false;
    }

    try {
      const success = await mapStorage.deleteEvent(id);
      if (success) {
        await loadEvents(); // Reload to get updated list
        toast.success('Evento excluído com sucesso!');
        return true;
      }
      return false;
    } catch (err) {
      console.error('Error deleting event:', err);
      toast.error('Erro ao excluir evento');
      return false;
    }
  };

  return {
    events,
    isLoading,
    error,
    loadEvents,
    addEvent,
    updateEvent,
    deleteEvent
  };
};
