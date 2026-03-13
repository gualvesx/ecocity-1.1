
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { Calendar, Check, X, Loader2, RefreshCw } from 'lucide-react';
import { useEventRequests } from '@/hooks/useEventRequests';
import { Button } from '@/components/ui/button';
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Badge } from '@/components/ui/badge';
import { EventRequest } from '@/types/events';
import { useAuth } from '@/contexts/AuthContext';

export const ManageEventRequests = () => {
  const { eventRequests, isLoading, refreshRequests, approveRequest, rejectRequest } = useEventRequests();
  const { user } = useAuth();
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('pending');

  useEffect(() => {
    console.log("ManageEventRequests - Component mounted, refreshing requests");
    if (user?.isAdmin) {
      refreshRequests();
    }
  }, [refreshRequests, user?.isAdmin]);
  
  useEffect(() => {
    console.log("ManageEventRequests - Current user:", user);
    console.log("ManageEventRequests - Event requests:", eventRequests);
  }, [user, eventRequests]);

  const handleApprove = async (id: string) => {
    if (!user?.isAdmin) {
      toast.error("Apenas administradores podem aprovar solicitações");
      return;
    }
    
    console.log("Approving request with ID:", id);
    setProcessingId(id);
    try {
      const success = await approveRequest(id);
      if (success) {
        console.log("Request approved successfully");
        toast.success("Evento aprovado com sucesso!");
        await refreshRequests();
      } else {
        console.error("Failed to approve request");
        toast.error("Erro ao aprovar evento");
      }
    } catch (error) {
      console.error("Error approving event:", error);
      toast.error("Erro ao aprovar evento");
    } finally {
      setProcessingId(null);
    }
  };

  const handleReject = async (id: string) => {
    if (!user?.isAdmin) {
      toast.error("Apenas administradores podem rejeitar solicitações");
      return;
    }
    
    console.log("Rejecting request with ID:", id);
    setProcessingId(id);
    try {
      const success = await rejectRequest(id);
      if (success) {
        console.log("Request rejected successfully");
        toast.success("Evento rejeitado com sucesso!");
        await refreshRequests();
      } else {
        console.error("Failed to reject request");
        toast.error("Erro ao rejeitar evento");
      }
    } catch (error) {
      console.error("Error rejecting event:", error);
      toast.error("Erro ao rejeitar evento");
    } finally {
      setProcessingId(null);
    }
  };

  const filteredRequests = eventRequests.filter(request => {
    if (filter === 'all') return true;
    return request.status === filter;
  });

  if (!user?.isAdmin) {
    return (
      <div className="p-8 text-center">
        <h3 className="text-lg font-medium text-muted-foreground">
          Você não tem permissão para acessar esta área.
        </h3>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Button 
            variant={filter === 'all' ? 'default' : 'outline'} 
            size="sm" 
            onClick={() => setFilter('all')}
            className={filter === 'all' ? 'bg-eco-green hover:bg-eco-green-dark' : ''}
          >
            Todas ({eventRequests.length})
          </Button>
          <Button 
            variant={filter === 'pending' ? 'default' : 'outline'} 
            size="sm" 
            onClick={() => setFilter('pending')}
            className={filter === 'pending' ? 'bg-amber-500 hover:bg-amber-600' : ''}
          >
            Pendentes ({eventRequests.filter(r => r.status === 'pending').length})
          </Button>
          <Button 
            variant={filter === 'approved' ? 'default' : 'outline'} 
            size="sm" 
            onClick={() => setFilter('approved')}
            className={filter === 'approved' ? 'bg-green-600 hover:bg-green-700' : ''}
          >
            Aprovadas ({eventRequests.filter(r => r.status === 'approved').length})
          </Button>
          <Button 
            variant={filter === 'rejected' ? 'default' : 'outline'} 
            size="sm" 
            onClick={() => setFilter('rejected')}
            className={filter === 'rejected' ? 'bg-red-500 hover:bg-red-600' : ''}
          >
            Rejeitadas ({eventRequests.filter(r => r.status === 'rejected').length})
          </Button>
        </div>
        
        <Button 
          variant="outline" 
          size="icon" 
          onClick={refreshRequests}
          disabled={isLoading}
          title="Atualizar solicitações"
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <RefreshCw className="h-4 w-4" />
          )}
        </Button>
      </div>

      {isLoading && !eventRequests.length ? (
        <div className="flex flex-col items-center justify-center py-12">
          <Loader2 className="h-8 w-8 text-eco-green animate-spin mb-4" />
          <p className="text-muted-foreground">Carregando solicitações de eventos...</p>
        </div>
      ) : filteredRequests.length === 0 ? (
        <div className="text-center py-12 border rounded-lg">
          <Calendar className="mx-auto h-12 w-12 text-muted-foreground/50 mb-4" />
          <h3 className="text-lg font-medium mb-1">Nenhuma solicitação encontrada</h3>
          <p className="text-muted-foreground">
            Não há solicitações de eventos {
              filter !== 'all' && filter === 'pending' ? 'pendentes' : 
              filter === 'approved' ? 'aprovadas' : 
              filter === 'rejected' ? 'rejeitadas' : ''
            } no momento.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {filteredRequests.map((request: EventRequest) => (
            <div key={request.id} className="bg-white rounded-lg shadow-sm border p-6">
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                <div className="flex-grow">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-semibold text-lg">{request.title}</h3>
                    <Badge 
                      variant="outline" 
                      className={`ml-2 ${
                        request.status === 'approved' 
                          ? 'bg-green-100 text-green-800 border-green-300' 
                          : request.status === 'rejected' 
                          ? 'bg-red-100 text-red-800 border-red-300' 
                          : 'bg-amber-100 text-amber-800 border-amber-300'
                      }`}
                    >
                      {request.status === 'approved' 
                        ? 'Aprovado' 
                        : request.status === 'rejected' 
                        ? 'Rejeitado' 
                        : 'Pendente'}
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground mb-1">Organizador</p>
                      <p>{request.organizer}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground mb-1">Data e Hora</p>
                      <p>{format(parseISO(request.date), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })} às {request.time}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground mb-1">Local</p>
                      <p>{request.address}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground mb-1">Solicitado por</p>
                      <p>{request.createdBy || "Usuário não identificado"}</p>
                    </div>
                  </div>
                  
                  <div className="mt-4">
                    <p className="text-sm font-medium text-muted-foreground mb-1">Descrição</p>
                    <p className="text-muted-foreground">{request.description}</p>
                  </div>
                </div>
                
                {request.status === 'pending' && (
                  <div className="flex flex-row md:flex-col gap-2 md:min-w-24">
                    <Button
                      size="sm"
                      className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                      onClick={() => handleApprove(request.id)}
                      disabled={isLoading || processingId === request.id}
                    >
                      {processingId === request.id ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <>
                          <Check className="mr-1 h-4 w-4" />
                          Aprovar
                        </>
                      )}
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex-1 border-red-300 text-red-600 hover:bg-red-50"
                      onClick={() => handleReject(request.id)}
                      disabled={isLoading || processingId === request.id}
                    >
                      {processingId === request.id ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <>
                          <X className="mr-1 h-4 w-4" />
                          Rejeitar
                        </>
                      )}
                    </Button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
