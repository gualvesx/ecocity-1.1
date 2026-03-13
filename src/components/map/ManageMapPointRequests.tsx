
import { useEffect } from 'react';
import { useMapPointRequests } from '@/hooks/useMapPointRequests';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, CheckCircle, X, MapPin } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { MapPointRequest } from '@/types/mapRequest';

export const ManageMapPointRequests = () => {
  const { 
    mapPointRequests, 
    isLoading, 
    error,
    approveRequest,
    rejectRequest,
    deleteRequest,
    refreshRequests
  } = useMapPointRequests();
  const { user } = useAuth();
  
  useEffect(() => {
    if (user?.isAdmin) {
      refreshRequests();
    }
  }, [user?.isAdmin, refreshRequests]);
  
  if (!user?.isAdmin) {
    return (
      <div className="p-8 text-center">
        <p className="text-lg text-muted-foreground">
          Você precisa ter permissões de administrador para acessar esta página.
        </p>
      </div>
    );
  }
  
  if (isLoading) {
    return (
      <div className="p-8 text-center">
        <Loader2 className="h-8 w-8 animate-spin mx-auto" />
        <p className="mt-2 text-muted-foreground">Carregando solicitações de pontos ecológicos...</p>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="p-8 text-center">
        <p className="text-red-500">Erro ao carregar solicitações: {error.message}</p>
        <Button onClick={refreshRequests} className="mt-2">
          Tentar novamente
        </Button>
      </div>
    );
  }
  
  if (mapPointRequests.length === 0) {
    return (
      <div className="p-8 text-center">
        <p className="text-lg text-muted-foreground">
          Não há solicitações de pontos ecológicos pendentes.
        </p>
      </div>
    );
  }
  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <Badge className="bg-green-600">Aprovado</Badge>;
      case 'rejected':
        return <Badge className="bg-red-600">Rejeitado</Badge>;
      case 'pending':
      default:
        return <Badge className="bg-yellow-600">Pendente</Badge>;
    }
  };

  const getPointTypeLabel = (type: string) => {
    switch (type) {
      case 'recycling-point':
        return 'Ponto de Coleta de Recicláveis';
      case 'recycling-center':
        return 'Ponto de Coleta de Lixo Eletrônico';
      case 'seedling-distribution':
        return 'Ponto de Distribuição de Mudas';
      default:
        return type;
    }
  };

  const handleApprove = async (request: MapPointRequest) => {
    await approveRequest(request.id);
  };

  const handleReject = async (request: MapPointRequest) => {
    await rejectRequest(request.id);
  };

  const handleDelete = async (request: MapPointRequest) => {
    if (window.confirm('Tem certeza que deseja excluir esta solicitação?')) {
      await deleteRequest(request.id);
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold text-eco-green-dark">
          Solicitações de Pontos no Mapa
        </h2>
        <Button onClick={refreshRequests} variant="outline" size="sm">
          Atualizar
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {mapPointRequests.map(request => (
          <Card key={request.id} className="overflow-hidden">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <CardTitle className="text-lg">{request.name}</CardTitle>
                {getStatusBadge(request.status)}
              </div>
              <CardDescription className="flex items-center gap-1">
                <span>{getPointTypeLabel(request.type)}</span>
              </CardDescription>
            </CardHeader>
            
            <CardContent className="pb-2">
              <p className="text-sm text-gray-700 mb-2">{request.description}</p>
              <div className="flex items-start gap-1 text-sm text-muted-foreground">
                <MapPin className="h-3 w-3 mt-0.5 flex-shrink-0" />
                <span>{request.address}</span>
              </div>
              {request.impact && (
                <p className="text-sm mt-2">
                  <span className="font-medium">Impacto:</span> {request.impact}
                </p>
              )}
            </CardContent>
            
            <CardFooter className="pt-2 flex justify-end gap-2">
              {request.status === 'pending' && (
                <>
                  <Button
                    onClick={() => handleReject(request)}
                    variant="outline"
                    size="sm"
                    className="text-red-500 hover:text-red-700"
                  >
                    <X className="h-4 w-4 mr-1" />
                    Recusar
                  </Button>
                  
                  <Button
                    onClick={() => handleApprove(request)}
                    size="sm"
                    className="bg-eco-green hover:bg-eco-green-dark"
                  >
                    <CheckCircle className="h-4 w-4 mr-1" />
                    Aprovar
                  </Button>
                </>
              )}
              
              {request.status !== 'pending' && (
                <Button
                  onClick={() => handleDelete(request)}
                  variant="outline"
                  size="sm"
                  className="text-red-500 hover:text-red-700"
                >
                  <X className="h-4 w-4 mr-1" />
                  Remover
                </Button>
              )}
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};
