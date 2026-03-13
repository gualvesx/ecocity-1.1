
import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Calendar, Clock, MapPin, User, Navigation, Phone, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { format, parseISO, isValid } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useEventStore } from '@/hooks/useEventStore';
import { Event, EventTime, EventLocation } from '@/types/events';

const EventDetails = () => {
  const { id } = useParams<{ id: string }>();
  const { events, isLoading } = useEventStore();
  const [event, setEvent] = useState<Event | null>(null);

  useEffect(() => {
    if (!isLoading && events.length > 0 && id) {
      const foundEvent = events.find(e => e.id === id);
      if (foundEvent) {
        setEvent(foundEvent);
      }
    }
  }, [id, events, isLoading]);

  const openInMaps = (location: EventLocation) => {
    if (location.lat && location.lng) {
      const googleMapsUrl = `https://www.google.com/maps?q=${location.lat},${location.lng}`;
      window.open(googleMapsUrl, '_blank');
    } else {
      const searchUrl = `https://www.google.com/maps/search/${encodeURIComponent(location.address)}`;
      window.open(searchUrl, '_blank');
    }
  };

  const formatEventTime = (eventTime: EventTime) => {
    try {
      const parsedDate = parseISO(eventTime.date);
      if (isValid(parsedDate)) {
        const dateStr = format(parsedDate, "EEEE, d 'de' MMMM 'de' yyyy", { locale: ptBR });
        const timeStr = eventTime.endTime ? `${eventTime.time} - ${eventTime.endTime}` : eventTime.time;
        return `${dateStr} às ${timeStr}`;
      }
    } catch (error) {
      console.error('Error parsing date:', error);
    }
    return `${eventTime.date} às ${eventTime.time}`;
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

  if (!event) {
    return (
      <div className="min-h-screen flex flex-col pt-20">
        <div className="container px-4 py-8">
          <Link to="/events" className="inline-flex items-center gap-1 text-muted-foreground hover:text-foreground mb-4">
            <ArrowLeft className="h-4 w-4" />
            <span>Voltar aos Eventos</span>
          </Link>
          
          <Card className="p-8 text-center">
            <h1 className="text-2xl font-bold mb-4">Evento não encontrado</h1>
            <p className="text-muted-foreground mb-6">
              O evento que você está procurando não existe ou foi removido.
            </p>
            <Link to="/events">
              <Button>Voltar aos Eventos</Button>
            </Link>
          </Card>
        </div>
      </div>
    );
  }

  // Usar dados dos arrays se disponíveis, senão usar campos legados
  const eventTimes = event.times && event.times.length > 0 ? event.times : 
    (event.date && event.time ? [{ date: event.date, time: event.time }] : []);
  
  const eventLocations = event.locations && event.locations.length > 0 ? event.locations :
    (event.address ? [{ address: event.address, lat: event.lat, lng: event.lng }] : []);

  return (
    <div className="min-h-screen flex flex-col pt-20">
      <div className="container px-4 py-8">
        <Link to="/events" className="inline-flex items-center gap-1 text-muted-foreground hover:text-foreground mb-6">
          <ArrowLeft className="h-4 w-4" />
          <span>Voltar aos Eventos</span>
        </Link>

        <div className="max-w-4xl mx-auto">
          <Card className="overflow-hidden">
            <div className="bg-gradient-to-r from-eco-green to-eco-blue p-6 text-white">
              <h1 className="text-3xl md:text-4xl font-bold mb-2">{event.title}</h1>
              <div className="flex flex-wrap items-center gap-4 text-eco-green-light">
                <div className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  <span>{event.organizer}</span>
                </div>
              </div>
            </div>

            <div className="p-6 space-y-6">
              <div>
                <h2 className="text-xl font-semibold mb-3">Descrição do Evento</h2>
                <p className="text-muted-foreground leading-relaxed">
                  {event.description}
                </p>
              </div>

              <Separator />

              {/* Horários do Evento */}
              {eventTimes.length > 0 && (
                <div>
                  <h3 className="font-semibold mb-3 flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-eco-green" />
                    {eventTimes.length > 1 ? 'Horários do Evento' : 'Horário do Evento'}
                  </h3>
                  <div className="space-y-2">
                    {eventTimes.map((eventTime, index) => (
                      <Badge key={index} variant="outline" className="text-sm p-2">
                        <Clock className="h-4 w-4 mr-2" />
                        {formatEventTime(eventTime)}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              <Separator />

              {/* Localizações do Evento */}
              {eventLocations.length > 0 && (
                <div>
                  <h3 className="font-semibold mb-3 flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-eco-green" />
                    {eventLocations.length > 1 ? 'Localizações' : 'Localização'}
                  </h3>
                  <div className="space-y-4">
                    {eventLocations.map((location, index) => (
                      <div key={index} className="flex items-start justify-between p-3 bg-muted/50 rounded-lg">
                        <div className="flex-1">
                          <p className="text-muted-foreground">{location.address}</p>
                          {location.lat && location.lng && (
                            <p className="text-xs text-muted-foreground mt-1">
                              {location.lat.toFixed(6)}, {location.lng.toFixed(6)}
                            </p>
                          )}
                        </div>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => openInMaps(location)}
                          className="ml-3"
                        >
                          <Navigation className="h-4 w-4 mr-1" />
                          Abrir
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Informações de Contato */}
              {(event.contact || event.website) && (
                <>
                  <Separator />
                  <div>
                    <h3 className="font-semibold mb-4">Informações de Contato</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {event.contact && (
                        <div>
                          <h4 className="font-medium mb-2 flex items-center gap-2">
                            <Phone className="h-4 w-4 text-eco-green" />
                            Contato
                          </h4>
                          <p className="text-muted-foreground">{event.contact}</p>
                        </div>
                      )}

                      {event.website && (
                        <div>
                          <h4 className="font-medium mb-2 flex items-center gap-2">
                            <Globe className="h-4 w-4 text-eco-green" />
                            Website
                          </h4>
                          <a 
                            href={event.website} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-eco-green hover:text-eco-green-dark underline break-all"
                          >
                            {event.website}
                          </a>
                        </div>
                      )}
                    </div>
                  </div>
                </>
              )}

              <Separator />

              <div className="bg-eco-sand/20 p-4 rounded-lg">
                <h3 className="font-semibold mb-2">Informações Importantes</h3>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Participe de eventos ecológicos e contribua para um futuro sustentável</li>
                  <li>• Traga sua própria garrafa de água para reduzir o uso de plástico</li>
                  <li>• Use transporte público ou compartilhado sempre que possível</li>
                  <li>• Respeite o meio ambiente e descarte o lixo adequadamente</li>
                </ul>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-4">
                <Link to="/events" className="flex-1">
                  <Button variant="outline" className="w-full">
                    Ver Outros Eventos
                  </Button>
                </Link>
                <Link to="/events" className="flex-1">
                  <Button className="w-full bg-eco-green hover:bg-eco-green-dark">
                    Ver no Mapa de Eventos
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

export default EventDetails;
