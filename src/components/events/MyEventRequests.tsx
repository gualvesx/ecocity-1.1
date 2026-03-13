
import React, { useEffect } from 'react';
import { useEventRequests } from '@/hooks/useEventRequests';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Calendar, Clock, MapPin, Trash2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { EventStatus } from '@/types/events';

export const MyEventRequests: React.FC = () => {
  const { 
    myEventRequests, 
    isLoading, 
    error, 
    removeEventRequest, 
    refreshMyRequests 
  } = useEventRequests();
  const { user } = useAuth();
  
  useEffect(() => {
    if (user) {
      refreshMyRequests();
    }
  }, [user, refreshMyRequests]);
  
  if (!user) {
    return (
      <div className="p-8 text-center">
        <p className="text-lg text-muted-foreground">
          Você precisa estar logado para ver suas solicitações de eventos.
        </p>
      </div>
    );
  }
  
  if (isLoading) {
    return (
      <div className="p-8 text-center">
        <Loader2 className="h-8 w-8 animate-spin mx-auto" />
        <p className="mt-2 text-muted-foreground">Carregando suas solicitações...</p>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="p-8 text-center">
        <p className="text-red-500">Erro ao carregar solicitações: {error.message}</p>
        <Button onClick={refreshMyRequests} className="mt-2">
          Tentar novamente
        </Button>
      </div>
    );
  }
  
  if (myEventRequests.length === 0) {
    return (
      <div className="p-8 text-center">
        <p className="text-lg text-muted-foreground">
          Você ainda não tem solicitações de eventos.
        </p>
      </div>
    );
  }
  
  const getStatusBadge = (status?: EventStatus) => {
    switch (status) {
      case EventStatus.APPROVED:
        return <Badge className="bg-green-600">Aprovado</Badge>;
      case EventStatus.REJECTED:
        return <Badge className="bg-red-600">Rejeitado</Badge>;
      case EventStatus.PENDING:
      default:
        return <Badge className="bg-yellow-600">Pendente</Badge>;
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold text-eco-green-dark">
          Minhas Solicitações de Eventos
        </h2>
        <Button onClick={refreshMyRequests} variant="outline" size="sm">
          Atualizar
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {myEventRequests.map(request => (
          <Card key={request.id}>
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <CardTitle className="text-lg">{request.title}</CardTitle>
                {getStatusBadge(request.status)}
              </div>
              <div className="flex gap-4">
                <CardDescription className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  {request.date}
                </CardDescription>
                <CardDescription className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {request.time}
                </CardDescription>
              </div>
            </CardHeader>
            
            <CardContent className="pb-2">
              <p className="text-sm text-gray-700 mb-2">{request.description}</p>
              <div className="flex items-start gap-1 text-sm text-muted-foreground">
                <MapPin className="h-3 w-3 mt-0.5 flex-shrink-0" />
                <span>{request.address}</span>
              </div>
            </CardContent>
            
            <CardFooter className="pt-2 flex justify-end">
              {request.status === EventStatus.PENDING && (
                <Button
                  onClick={() => removeEventRequest(request.id)}
                  variant="outline"
                  size="sm"
                  className="text-red-500 hover:text-red-700"
                >
                  <Trash2 className="h-4 w-4 mr-1" />
                  Cancelar Solicitação
                </Button>
              )}
              
              {request.status === EventStatus.REJECTED && (
                <div className="text-sm text-muted-foreground">
                  Esta solicitação foi rejeitada
                </div>
              )}
              
              {request.status === EventStatus.APPROVED && (
                <div className="text-sm text-green-600 font-medium">
                  Solicitação aprovada!
                </div>
              )}
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};
