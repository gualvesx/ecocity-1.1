
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { CalendarDays, Clock, MapPin, SearchIcon, User, Phone, Globe } from 'lucide-react';
import { format, isValid, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useEventStore } from '@/hooks/useEventStore';
import { Event, EventTime, EventLocation } from '@/types/events';

export function EventList() {
  const { events, isLoading } = useEventStore();
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();
  
  const filteredEvents = events.filter((event: Event) => 
    event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    event.organizer.toLowerCase().includes(searchTerm.toLowerCase()) ||
    // Buscar também nos endereços das localizações
    (event.locations && event.locations.some(loc => 
      loc.address.toLowerCase().includes(searchTerm.toLowerCase())
    )) ||
    // Compatibilidade com campo legacy
    (event.address && event.address.toLowerCase().includes(searchTerm.toLowerCase()))
  );
  
  // Group events by month using the first date available
  type EventByMonth = Record<string, Event[]>;
  
  const eventsByMonth = filteredEvents.reduce((acc: EventByMonth, event: Event) => {
    let date;
    
    // Usar o primeiro horário disponível ou campo legacy
    const firstTime = event.times && event.times.length > 0 ? event.times[0] : 
      (event.date ? { date: event.date, time: event.time || '' } : null);
    
    if (!firstTime?.date) {
      console.warn(`Event ${event.id} has no date information, skipping grouping`);
      return acc;
    }
    
    try {
      date = parseISO(firstTime.date);
      if (!isValid(date)) {
        console.warn(`Invalid date format for event ${event.id}: ${firstTime.date}`);
        return acc;
      }
    } catch (error) {
      console.warn(`Error parsing date for event ${event.id}: ${firstTime.date}`, error);
      return acc;
    }
    
    const monthYear = format(date, 'MMMM yyyy', { locale: ptBR });
    
    if (!acc[monthYear]) {
      acc[monthYear] = [];
    }
    
    acc[monthYear].push(event);
    return acc;
  }, {} as EventByMonth);
  
  // Sort months chronologically
  const sortedMonths = Object.keys(eventsByMonth).sort((a, b) => {
    const monthA = a.split(' ')[0];
    const yearA = a.split(' ')[1];
    const monthB = b.split(' ')[0];
    const yearB = b.split(' ')[1];
    
    const dateA = new Date(`${monthA} 1, ${yearA}`);
    const dateB = new Date(`${monthB} 1, ${yearB}`);
    
    return dateA.getTime() - dateB.getTime();
  });

  const formatEventTime = (eventTime: EventTime) => {
    try {
      const parsedDate = parseISO(eventTime.date);
      if (isValid(parsedDate)) {
        return format(parsedDate, 'EEEE, d', { locale: ptBR });
      }
    } catch (error) {
      console.error('Error parsing date:', error);
    }
    return eventTime.date;
  };
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="w-8 h-8 border-4 border-eco-green border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <div className="relative">
        <SearchIcon className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Buscar eventos..."
          className="pl-10"
          value={searchTerm}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
        />
      </div>
      
      {filteredEvents.length === 0 ? (
        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-muted-foreground">Nenhum evento encontrado</p>
          </CardContent>
        </Card>
      ) : (
        sortedMonths.map((month) => (
          <div key={month} className="space-y-4">
            <h2 className="text-xl font-semibold capitalize">{month}</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {eventsByMonth[month].map((event: Event, index: number) => {
                // Usar primeiro horário e localização disponíveis
                const firstTime = event.times && event.times.length > 0 ? event.times[0] : 
                  (event.date ? { date: event.date, time: event.time || '' } : null);
                
                const firstLocation = event.locations && event.locations.length > 0 ? event.locations[0] : 
                  (event.address ? { address: event.address } : null);
                
                return (
                  <Card key={`${event.id || index}-${event.title}`} className="overflow-hidden">
                    <CardHeader className="pb-3">
                      <CardTitle className="line-clamp-2">{event.title}</CardTitle>
                      {firstTime && (
                        <CardDescription className="flex items-center gap-1">
                          <CalendarDays className="h-4 w-4" />
                          <span>{formatEventTime(firstTime)}</span>
                        </CardDescription>
                      )}
                    </CardHeader>
                    
                    <CardContent className="pb-3">
                      <div className="space-y-2 text-sm">
                        {firstTime && (
                          <div className="flex items-start gap-2">
                            <Clock className="h-4 w-4 shrink-0 mt-0.5 text-eco-green" />
                            <span>{firstTime.time}</span>
                          </div>
                        )}
                        
                        {firstLocation && (
                          <div className="flex items-start gap-2">
                            <MapPin className="h-4 w-4 shrink-0 mt-0.5 text-eco-green" />
                            <span className="line-clamp-2">{firstLocation.address}</span>
                          </div>
                        )}
                        
                        <div className="flex items-start gap-2">
                          <User className="h-4 w-4 shrink-0 mt-0.5 text-eco-green" />
                          <span>{event.organizer}</span>
                        </div>

                        {event.contact && (
                          <div className="flex items-start gap-2">
                            <Phone className="h-4 w-4 shrink-0 mt-0.5 text-eco-green" />
                            <span className="line-clamp-1">{event.contact}</span>
                          </div>
                        )}

                        {event.website && (
                          <div className="flex items-start gap-2">
                            <Globe className="h-4 w-4 shrink-0 mt-0.5 text-eco-green" />
                            <a 
                              href={event.website} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-eco-green hover:text-eco-green-dark underline line-clamp-1"
                              onClick={(e) => e.stopPropagation()}
                            >
                              Website
                            </a>
                          </div>
                        )}
                        
                        {/* Badges para múltiplos horários/localizações */}
                        <div className="flex flex-wrap gap-1 mt-2">
                          {event.times && event.times.length > 1 && (
                            <Badge variant="secondary" className="text-xs">
                              +{event.times.length - 1} horário{event.times.length > 2 ? 's' : ''}
                            </Badge>
                          )}
                          {event.locations && event.locations.length > 1 && (
                            <Badge variant="secondary" className="text-xs">
                              +{event.locations.length - 1} local{event.locations.length > 2 ? 'is' : ''}
                            </Badge>
                          )}
                        </div>
                        
                        <Separator className="my-2" />
                        
                        <p className="line-clamp-3">
                          {event.description}
                        </p>
                      </div>
                    </CardContent>
                    
                    <CardFooter>
                      <Button 
                        variant="outline" 
                        className="w-full"
                        onClick={() => navigate(`/event/${event.id}`)}
                      >
                        Ver Detalhes
                      </Button>
                    </CardFooter>
                  </Card>
                );
              })}
            </div>
          </div>
        ))
      )}
    </div>
  );
}
