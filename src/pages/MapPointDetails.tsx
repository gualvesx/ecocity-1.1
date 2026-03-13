
import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, MapPin, Recycle, TreeDeciduous, Leaf, Lamp, Navigation, Info, Clock, Phone, Globe, Droplets, Pill, Smartphone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useMapPoints } from '@/hooks/useMapPoints';
import { MapPoint } from '@/types/map';
import { WeeklyHoursDisplay } from '@/components/map/WeeklyHoursDisplay';

const MapPointDetails = () => {
  const { id } = useParams<{ id: string }>();
  const { mapPoints, isLoading } = useMapPoints();
  const [point, setPoint] = useState<MapPoint | null>(null);

  useEffect(() => {
    if (!isLoading && mapPoints.length > 0 && id) {
      const foundPoint = mapPoints.find(p => p.id.toString() === id);
      if (foundPoint) {
        setPoint(foundPoint);
      }
    }
  }, [id, mapPoints, isLoading]);

  const getPointIcon = (type: string) => {
    switch (type) {
      case 'recycling-point':
        return <MapPin className="h-6 w-6 text-eco-green" />;
      case 'recycling-center':
        return <Recycle className="h-6 w-6 text-eco-blue" />;
      case 'seedling-distribution':
        return <TreeDeciduous className="h-6 w-6 text-eco-brown" />;
      case 'plant-sales':
        return <Leaf className="h-6 w-6 text-green-600" />;
      case 'lamp-collection':
        return <Lamp className="h-6 w-6 text-yellow-500" />;
      case 'oil-collection':
        return <Droplets className="h-6 w-6 text-orange-500" />;
      case 'medicine-collection':
        return <Pill className="h-6 w-6 text-red-500" />;
      case 'electronics-donation':
        return <Smartphone className="h-6 w-6 text-blue-600" />;
      default:
        return <MapPin className="h-6 w-6 text-eco-green" />;
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

  const getPointColor = (type: string) => {
    switch (type) {
      case 'recycling-point':
        return 'from-eco-green to-eco-green-dark';
      case 'recycling-center':
        return 'from-eco-blue to-eco-blue-dark';
      case 'seedling-distribution':
        return 'from-eco-brown to-orange-800';
      case 'plant-sales':
        return 'from-green-600 to-green-800';
      case 'lamp-collection':
        return 'from-yellow-500 to-yellow-700';
      case 'oil-collection':
        return 'from-orange-500 to-orange-700';
      case 'medicine-collection':
        return 'from-red-500 to-red-700';
      case 'electronics-donation':
        return 'from-blue-600 to-blue-800';
      default:
        return 'from-eco-green to-eco-green-dark';
    }
  };

  const openInMaps = () => {
    if (point && point.lat && point.lng) {
      const googleMapsUrl = `https://www.google.com/maps?q=${point.lat},${point.lng}`;
      window.open(googleMapsUrl, '_blank');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col pt-20">
        <div className="container px-4 py-8">
          <div className="flex items-center justify-center h-60">
            <div className="w-12 h-12 border-4 border-eco-green border-t-transparent rounded-full animate-spin"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!point) {
    return (
      <div className="min-h-screen flex flex-col pt-20">
        <div className="container px-4 py-8">
          <Link to="/map-summary" className="inline-flex items-center gap-1 text-muted-foreground hover:text-foreground mb-4">
            <ArrowLeft className="h-4 w-4" />
            <span>Voltar ao Sumário</span>
          </Link>
          
          <Card className="p-8 text-center">
            <h1 className="text-2xl font-bold mb-4">Ponto não encontrado</h1>
            <p className="text-muted-foreground mb-6">
              O ponto ecológico que você está procurando não existe ou foi removido.
            </p>
            <Link to="/map-summary">
              <Button>Voltar ao Sumário</Button>
            </Link>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col pt-20">
      <div className="container px-4 py-8">
        <Link to="/map-summary" className="inline-flex items-center gap-1 text-muted-foreground hover:text-foreground mb-6">
          <ArrowLeft className="h-4 w-4" />
          <span>Voltar ao Sumário</span>
        </Link>

        <div className="max-w-4xl mx-auto">
          <Card className="overflow-hidden">
            <div className={`bg-gradient-to-r ${getPointColor(point.type)} p-6 text-white`}>
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 bg-white/20 rounded-full">
                  {getPointIcon(point.type)}
                </div>
                <div>
                  <h1 className="text-3xl md:text-4xl font-bold">{point.name}</h1>
                  <p className="text-lg opacity-90">{getPointTypeLabel(point.type)}</p>
                </div>
              </div>
            </div>

            <div className="p-6 space-y-6">
              <div>
                <h2 className="text-xl font-semibold mb-3">Sobre este Local</h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  {point.description}
                </p>
              </div>

              <Separator />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold mb-3 flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-eco-green" />
                    Endereço
                  </h3>
                  <p className="text-muted-foreground mb-3">{point.address}</p>
                  {point.lat && point.lng && (
                    <Button variant="outline" size="sm" onClick={openInMaps}>
                      <Navigation className="h-4 w-4 mr-2" />
                      Abrir no Google Maps
                    </Button>
                  )}
                </div>

                <div>
                  <h3 className="font-semibold mb-3 flex items-center gap-2">
                    <Info className="h-5 w-5 text-eco-green" />
                    Coordenadas
                  </h3>
                  <div className="text-sm text-muted-foreground space-y-1">
                    <p>Latitude: {point.lat?.toFixed(6) || 'N/A'}</p>
                    <p>Longitude: {point.lng?.toFixed(6) || 'N/A'}</p>
                  </div>
                </div>
              </div>

              {/* Horários de funcionamento com calendário semanal */}
              {point.weeklyHours && Object.keys(point.weeklyHours).length > 0 && (
                <>
                  <Separator />
                  <WeeklyHoursDisplay weeklyHours={point.weeklyHours} />
                </>
              )}

              {/* Informações de contato */}
              {(point.contact || point.website) && (
                <>
                  <Separator />
                  <div>
                    <h3 className="font-semibold mb-4">Informações de Contato</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {point.contact && (
                        <div>
                          <h4 className="font-medium mb-2 flex items-center gap-2">
                            <Phone className="h-4 w-4 text-eco-green" />
                            Contato
                          </h4>
                          <p className="text-muted-foreground">{point.contact}</p>
                        </div>
                      )}

                      {point.website && (
                        <div>
                          <h4 className="font-medium mb-2 flex items-center gap-2">
                            <Globe className="h-4 w-4 text-eco-green" />
                            Website
                          </h4>
                          <a 
                            href={point.website} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-eco-green hover:text-eco-green-dark underline break-all"
                          >
                            {point.website}
                          </a>
                        </div>
                      )}
                    </div>
                  </div>
                </>
              )}

              {point.impact && (
                <>
                  <Separator />
                  <div>
                    <h3 className="font-semibold mb-3 text-eco-green-dark">Impacto Ambiental</h3>
                    <div className="bg-eco-green-light/10 p-4 rounded-lg border-l-4 border-eco-green">
                      <p className="text-muted-foreground leading-relaxed">
                        {point.impact}
                      </p>
                    </div>
                  </div>
                </>
              )}

              <Separator />

              <div className="bg-eco-sand/20 p-4 rounded-lg">
                <h3 className="font-semibold mb-2">Dicas Importantes</h3>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Verifique os horários de funcionamento antes de visitar</li>
                  <li>• Separe corretamente os materiais antes do descarte</li>
                  <li>• Consulte quais tipos de materiais são aceitos no local</li>
                  <li>• Considere usar transporte sustentável para chegar ao local</li>
                </ul>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-4">
                <Link to="/map-summary" className="flex-1">
                  <Button variant="outline" className="w-full">
                    Ver Outros Pontos
                  </Button>
                </Link>
                <Link to="/map" className="flex-1">
                  <Button className="w-full bg-eco-green hover:bg-eco-green-dark">
                    Ver no Mapa Ecológico
                  </Button>
                </Link>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default MapPointDetails;
