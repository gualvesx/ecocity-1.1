
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, MapPin, Recycle, TreeDeciduous, Info, Leaf, Lamp, Droplets, Pill, Smartphone, Clock, Phone, Globe } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useMapPoints } from '@/hooks/useMapPoints';
import { cn } from '@/lib/utils';

const MapSummary = () => {
  const { mapPoints, isLoading } = useMapPoints();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');

  const filteredPoints = mapPoints.filter(point => {
    const matchesSearch = 
      point.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      point.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (point.address && point.address.toLowerCase().includes(searchTerm.toLowerCase()));
      
    const matchesFilter = activeFilter === 'all' || point.type === activeFilter;
    
    return matchesSearch && matchesFilter;
  });

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
        return <Lamp className="h-5 w-5 text-yellow-500" />;
      case 'oil-collection':
        return <Droplets className="h-5 w-5 text-orange-500" />;
      case 'medicine-collection':
        return <Pill className="h-5 w-5 text-red-500" />;
      case 'electronics-donation':
        return <Smartphone className="h-5 w-5 text-blue-600" />;
      default:
        return <MapPin className="h-5 w-5 text-eco-green" />;
    }
  };

  const getPointColor = (type: string) => {
    switch (type) {
      case 'recycling-point':
        return 'border-eco-green';
      case 'recycling-center':
        return 'border-eco-blue';
      case 'seedling-distribution':
        return 'border-eco-brown';
      case 'plant-sales':
        return 'border-green-600';
      case 'lamp-collection':
        return 'border-yellow-500';
      case 'oil-collection':
        return 'border-orange-500';
      case 'medicine-collection':
        return 'border-red-500';
      case 'electronics-donation':
        return 'border-blue-600';
      default:
        return 'border-eco-green';
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

  return (
    <div className="min-h-screen flex flex-col pt-20">
      <div className="container px-4 py-8">
        <div className="flex flex-col space-y-4">
          <Link to="/map" className="inline-flex items-center gap-1 text-muted-foreground hover:text-foreground w-fit">
            <ArrowLeft className="h-4 w-4" />
            <span>Voltar para o Mapa</span>
          </Link>
          
          <h1 className="text-3xl md:text-4xl font-bold text-eco-green-dark">
            Sumário dos Pontos Ecológicos
          </h1>
          
          <p className="text-lg text-muted-foreground">
            Explore informações detalhadas sobre os pontos ecológicos disponíveis em nossa cidade.
          </p>
        </div>
        
        <div className="flex flex-col md:flex-row gap-4 mt-6 mb-8">
          <div className="relative flex-grow">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Buscar pontos por nome, descrição ou endereço..."
              className="pl-9"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="flex flex-wrap gap-2">
            <Button
              variant={activeFilter === 'all' ? 'default' : 'outline'} 
              className={activeFilter === 'all' ? 'bg-eco-green hover:bg-eco-green-dark' : ''}
              onClick={() => setActiveFilter('all')}
            >
              Todos
            </Button>
            <Button 
              variant={activeFilter === 'recycling-point' ? 'default' : 'outline'}
              className={activeFilter === 'recycling-point' ? 'bg-eco-green hover:bg-eco-green-dark' : ''}
              onClick={() => setActiveFilter('recycling-point')}
            >
              <MapPin className="mr-1 h-4 w-4" />
              Reciclagem
            </Button>
            <Button 
              variant={activeFilter === 'recycling-center' ? 'default' : 'outline'}
              className={activeFilter === 'recycling-center' ? 'bg-eco-blue hover:bg-eco-blue-dark' : ''}
              onClick={() => setActiveFilter('recycling-center')}
            >
              <Recycle className="mr-1 h-4 w-4" />
              Lixo Eletrônico
            </Button>
            <Button 
              variant={activeFilter === 'seedling-distribution' ? 'default' : 'outline'}
              className={activeFilter === 'seedling-distribution' ? 'bg-eco-brown hover:bg-eco-brown/80' : ''}
              onClick={() => setActiveFilter('seedling-distribution')}
            >
              <TreeDeciduous className="mr-1 h-4 w-4" />
              Mudas
            </Button>
            <Button 
              variant={activeFilter === 'plant-sales' ? 'default' : 'outline'}
              className={activeFilter === 'plant-sales' ? 'bg-green-600 hover:bg-green-700' : ''}
              onClick={() => setActiveFilter('plant-sales')}
            >
              <Leaf className="mr-1 h-4 w-4" />
              Venda
            </Button>
            <Button 
              variant={activeFilter === 'lamp-collection' ? 'default' : 'outline'}
              className={activeFilter === 'lamp-collection' ? 'bg-yellow-500 hover:bg-yellow-600' : ''}
              onClick={() => setActiveFilter('lamp-collection')}
            >
              <Lamp className="mr-1 h-4 w-4" />
              Lâmpadas
            </Button>
            <Button 
              variant={activeFilter === 'oil-collection' ? 'default' : 'outline'}
              className={activeFilter === 'oil-collection' ? 'bg-orange-500 hover:bg-orange-600' : ''}
              onClick={() => setActiveFilter('oil-collection')}
            >
              <Droplets className="mr-1 h-4 w-4" />
              Óleo
            </Button>
            <Button 
              variant={activeFilter === 'medicine-collection' ? 'default' : 'outline'}
              className={activeFilter === 'medicine-collection' ? 'bg-red-500 hover:bg-red-600' : ''}
              onClick={() => setActiveFilter('medicine-collection')}
            >
              <Pill className="mr-1 h-4 w-4" />
              Remédios
            </Button>
            <Button 
              variant={activeFilter === 'electronics-donation' ? 'default' : 'outline'}
              className={activeFilter === 'electronics-donation' ? 'bg-blue-600 hover:bg-blue-700' : ''}
              onClick={() => setActiveFilter('electronics-donation')}
            >
              <Smartphone className="mr-1 h-4 w-4" />
              Eletrônicos
            </Button>
          </div>
        </div>
        
        {isLoading ? (
          <div className="flex justify-center items-center h-60">
            <div className="w-12 h-12 border-4 border-eco-green border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : filteredPoints.length === 0 ? (
          <div className="bg-eco-sand/30 rounded-lg p-8 text-center my-8">
            <Info className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h2 className="text-xl font-medium mb-2">Nenhum ponto encontrado</h2>
            <p className="text-muted-foreground">
              Tente ajustar seus filtros ou termos de busca para encontrar pontos ecológicos.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 my-8">
            {filteredPoints.map((point) => (
              <Card key={point.id} className={cn("overflow-hidden border-l-4", getPointColor(point.type))}>
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <div className="p-2 rounded-full bg-eco-sand/50">
                        {getPointIcon(point.type)}
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg">{point.name}</h3>
                        <span className="text-sm text-muted-foreground">{getPointTypeLabel(point.type)}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
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
                      <p className="text-sm text-muted-foreground line-clamp-3">{point.description}</p>
                    </div>

                    {point.impact && (
                      <div className="space-y-1">
                        <div className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Impacto Ambiental</div>
                        <div className="bg-eco-green-light/10 p-3 rounded-md border-l-2 border-eco-green">
                          <p className="text-sm text-eco-green-dark font-medium line-clamp-2">{point.impact}</p>
                        </div>
                      </div>
                    )}

                    <div className="grid grid-cols-1 gap-3">
                      {point.openingHours && (
                        <div className="space-y-1">
                          <div className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Horário</div>
                          <div className="flex items-start gap-2">
                            <Clock className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
                            <span className="text-sm break-words">{point.openingHours}</span>
                          </div>
                        </div>
                      )}

                      {point.contact && (
                        <div className="space-y-1">
                          <div className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Contato</div>
                          <div className="flex items-start gap-2">
                            <Phone className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
                            <span className="text-sm break-words">{point.contact}</span>
                          </div>
                        </div>
                      )}

                      {point.website && (
                        <div className="space-y-1">
                          <div className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Website</div>
                          <div className="flex items-start gap-2">
                            <Globe className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
                            <a 
                              href={point.website} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-sm text-eco-green hover:text-eco-green-dark underline break-all"
                            >
                              {point.website}
                            </a>
                          </div>
                        </div>
                      )}
                    </div>
                    
                    <div className="pt-2 flex gap-2">
                      <Link to={`/map-point/${point.id}`} className="flex-1">
                        <Button variant="outline" size="sm" className="w-full">
                          Ver Detalhes
                        </Button>
                      </Link>
                      <Link to={`/map?point=${point.id}`}>
                        <Button size="sm">
                          <MapPin className="h-3.5 w-3.5 mr-1" />
                          Mapa
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MapSummary;
