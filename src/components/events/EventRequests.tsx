
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useEventStore } from '@/hooks/useEventStore';
import { useAuth } from '@/contexts/AuthContext';
import { Check, X, Calendar, Clock, MapPin, Users } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { toast } from 'sonner';

interface EventRequest {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  address: string;
  organizer: string;
  status: string;
}

export const EventRequests = () => {
  const { user } = useAuth();
  const { events, updateEvent } = useEventStore();
  const [pendingEvents, setPendingEvents] = useState<EventRequest[]>([]);

  useEffect(() => {
    if (events) {
      setPendingEvents(
        events.filter((event: Event) => event.status === "pending")
      );
    }
  }, [events]);

  const handleApproveEvent = (eventId: string) => {
    updateEvent(eventId, { status: "APPROVED" });
    toast.success('Evento aprovado com sucesso!');
  };

  const handleRejectEvent = (eventId: string) => {
    updateEvent(eventId, { status: "REJECTED" });
    toast.error('Evento rejeitado.');
  };

  if (!user?.isAdmin) {
    return (
      <div className="text-center py-6">
        <p className="text-muted-foreground">
          Você precisa ser administrador para acessar esta área.
        </p>
      </div>
    );
  }

  if (pendingEvents.length === 0) {
    return (
      <div className="text-center py-6">
        <p className="text-muted-foreground">
          Não há solicitações de eventos pendentes.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="font-semibold text-lg">Solicitações Pendentes</h3>
      
      {pendingEvents.map((event: EventRequest) => (
        <Card key={event.id} className="p-4">
          <div className="flex flex-col sm:flex-row justify-between gap-4">
            <div>
              <h4 className="font-medium">{event.title}</h4>
              <div className="flex flex-col gap-2 mt-2 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Calendar size={14} />
                  <span>
                    {format(new Date(event.date), "dd 'de' MMMM", {
                      locale: ptBR,
                    })}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock size={14} />
                  <span>{format(new Date(event.date), "HH:mm")}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin size={14} />
                  <span>{event.location}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users size={14} />
                  <span>Organizador: {event.organizer}</span>
                </div>
              </div>
              <div className="mt-2">
                <div 
                  className="inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 bg-yellow-100 text-yellow-800 border-yellow-200"
                >
                  Aguardando aprovação
                </div>
              </div>
            </div>
            
            <div className="flex sm:flex-col gap-2 sm:justify-between">
              <Button
                onClick={() => handleApproveEvent(event.id)}
                size="sm"
                className="bg-green-600 hover:bg-green-700 gap-1 sm:w-24"
              >
                <Check size={16} />
                <span>Aprovar</span>
              </Button>
              
              <Button
                onClick={() => handleRejectEvent(event.id)}
                variant="destructive"
                size="sm"
                className="gap-1 sm:w-24"
              >
                <X size={16} />
                <span>Rejeitar</span>
              </Button>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};
