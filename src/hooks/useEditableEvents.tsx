
import { useState } from 'react';
import { useEventStore, Event } from '@/hooks/useEventStore';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';

export const useEditableEvents = () => {
  const { events, addEvent, updateEvent, deleteEvent } = useEventStore();
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const { user } = useAuth();

  const updateEventData = async (eventId: string, eventData: Partial<Event>): Promise<boolean> => {
    if (!user?.isAdmin) {
      toast.error('Você não tem permissão para editar eventos.');
      return false;
    }

    try {
      await updateEvent(eventId, eventData);
      toast.success('Evento atualizado com sucesso!');
      return true;
    } catch (err) {
      console.error('Error updating event:', err);
      toast.error('Erro ao atualizar evento');
      return false;
    }
  };

  const deleteEventData = async (eventId: string): Promise<boolean> => {
    if (!user?.isAdmin) {
      toast.error('Você não tem permissão para excluir eventos.');
      return false;
    }

    try {
      await deleteEvent(eventId);
      toast.success('Evento excluído com sucesso!');
      return true;
    } catch (err) {
      console.error('Error deleting event:', err);
      toast.error('Erro ao excluir evento');
      return false;
    }
  };

  const startEditing = (event: Event) => {
    setEditingEvent(event);
  };

  const cancelEditing = () => {
    setEditingEvent(null);
  };

  return {
    events,
    addEvent,
    updateEvent: updateEventData,
    deleteEvent: deleteEventData,
    editingEvent,
    startEditing,
    cancelEditing
  };
};
