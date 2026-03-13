
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { MapPin, Search, Clock, Phone, Globe, Leaf, Recycle, TreeDeciduous, Calendar, User } from 'lucide-react';
import { useMapPoints } from '@/hooks/useMapPoints';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export const MapPointsDetails = () => {
  const { mapPoints, isLoading } = useMapPoints();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredPoints = mapPoints.filter(point => 
    point.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    point.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (point.contact && point.contact.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (point.website && point.website.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (point.address && point.address.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const getPointIcon = (type: string) => {
    switch (type) {
      case 'recycling-point':
        return <MapPin className="h-5 w-5 text-eco-green" />;
      case 'recycling-center':
        return <Recycle className="h-5 w-5 text-eco-blue" />;
      case 'seedling-distribution':
        return <TreeDeciduous className="h-5 w-5 text-eco-brown" />;
      case 'plant-sales':
        return <Leaf className="h-5 w-5 text-green-600" />;
      case 'lamp-collection':
        return <Clock className="h-5 w-5 text-yellow-500" />;
      case 'oil-collection':
        return <Globe className="h-5 w-5 text-orange-500" />;
      case 'medicine-collection':
        return <Phone className="h-5 w-5 text-red-500" />;
      case 'electronics-donation':
        return <Recycle className="h-5 w-5 text-purple-500" />;
      default:
        return <Leaf className="h-5 w-5 text-eco-green" />;
    }
  };

  const getPointTypeLabel = (type: string) => {
    switch (type) {
      case 'recycling-point':
        return 'Ponto de Reciclagem';
      case 'recycling-center':
        return 'Centro de Reciclagem';
      case 'seedling-distribution':
        return 'Distribuição de Mudas';
      case 'plant-sales':
        return 'Venda de Mudas';
      case 'lamp-collection':
        return 'Coleta de Lâmpadas';
      case 'oil-collection':
        return 'Coleta de Óleo';
      case 'medicine-collection':
        return 'Coleta de Cartela de Remédio';
      case 'electronics-donation':
        return 'Doação de Eletrônicos';
      default:
        return 'Ponto Ecológico';
    }
  };

  const getPointTypes = (point: any) => {
    return Array.isArray(point.type) ? point.type : [point.type];
  };

  const formatDate = (dateString: string | any) => {
    try {
      let date;
      if (typeof dateString === 'string') {
        date = new Date(dateString);
      } else if (dateString?.toDate) {
        // Firebase timestamp
        date = dateString.toDate();
      } else {
        return 'Data não disponível';
      }
      
      if (!date || isNaN(date.getTime())) {
        return 'Data inválida';
      }
      
      return format(date, "d 'de' MMM 'de' yyyy", { locale: ptBR });
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'Data não disponível';
    }
  };

  const formatWeeklyHours = (weeklyHours: any) => {
    if (!weeklyHours || typeof weeklyHours !== 'object') return null;
    
    const days = {
      seg: 'Segunda',
      ter: 'Terça',
      qua: 'Quarta',
      qui: 'Quinta',
      sex: 'Sexta',
      sab: 'Sábado',
      dom: 'Domingo'
    };

    return Object.entries(weeklyHours)
      .filter(([_, hours]) => hours)
      .map(([day, hours]) => `${days[day as keyof typeof days]}: ${hours}`)
      .join(', ');
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-60">
        <div className="w-12 h-12 border-4 border-eco-green border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Buscar por nome, contato, website, endereço..."
          className="pl-9"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPoints.map((point) => {
          const pointTypes = getPointTypes(point);
          
          return (
            <Card key={point.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-full bg-eco-sand/50">
                    {getPointIcon(pointTypes[0])}
                  </div>
                  <div className="flex-1">
                    <CardTitle className="text-lg">{point.name}</CardTitle>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {pointTypes.map((type, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {getPointTypeLabel(type)}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                {point.address && (
                  <div className="space-y-1">
                    <div className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Endereço</div>
                    <div className="flex items-start gap-2">
                      <MapPin className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
                      <span className="text-sm break-words">{point.address}</span>
                    </div>
                  </div>
                )}

                <div className="space-y-1">
                  <div className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Descrição</div>
                  <p className="text-sm text-muted-foreground">{point.description}</p>
                </div>

                {point.impact && (
                  <div className="space-y-1">
                    <div className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Impacto Ambiental</div>
                    <div className="bg-eco-green-light/10 p-3 rounded-md border-l-2 border-eco-green">
                      <p className="text-sm text-eco-green-dark">{point.impact}</p>
                    </div>
                  </div>
                )}

                {point.weeklyHours && formatWeeklyHours(point.weeklyHours) && (
                  <div className="space-y-1">
                    <div className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Horário de Funcionamento</div>
                    <div className="flex items-start gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
                      <span className="text-sm">{formatWeeklyHours(point.weeklyHours)}</span>
                    </div>
                  </div>
                )}

                {point.contact && (
                  <div className="space-y-1">
                    <div className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Contato</div>
                    <div className="flex items-start gap-2">
                      <Phone className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
                      <span className="text-sm">{point.contact}</span>
                    </div>
                  </div>
                )}

                {point.website && (
                  <div className="space-y-1">
                    <div className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Website</div>
                    <div className="flex items-start gap-2">
                      <Globe className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
                      <a 
                        href={point.website.startsWith('http') ? point.website : `https://${point.website}`} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-sm text-eco-green hover:text-eco-green-dark underline break-all"
                      >
                        {point.website}
                      </a>
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-between text-xs text-muted-foreground pt-2 border-t">
                  <div className="flex items-center gap-1">
                    <User className="h-3 w-3" />
                    <span>{point.userName || point.createdBy}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    <span>{formatDate(point.createdAt)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {filteredPoints.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">Nenhum ponto encontrado para sua busca.</p>
        </div>
      )}
    </div>
  );
};
