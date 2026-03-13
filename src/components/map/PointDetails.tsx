
import { MapPoint } from '@/types/map';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';
import { Trash2, Info, Edit, Phone, Globe, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';

interface PointDetailsProps {
  selectedPoint: MapPoint;
  setSelectedPoint: (point: MapPoint | null) => void;
  setEditingPoint: (point: MapPoint | null) => void;
  handleDeletePoint: (pointId: number | string) => void;
  centerOnPoint: (lat: number, lng: number) => void;
  typeInfo: {
    [key: string]: { 
      label: string;
      color: string; 
      description: string;
    }
  };
  getMarkerIcon: (type: string) => JSX.Element;
}

// Função para verificar se está aberto agora
const isOpenNow = (weeklyHours?: MapPoint['weeklyHours']): boolean | null => {
  if (!weeklyHours || Object.keys(weeklyHours).length === 0) return null;
  
  const now = new Date();
  const dayNames = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
  const currentDay = dayNames[now.getDay()] as keyof typeof weeklyHours;
  const currentTime = now.getHours() * 100 + now.getMinutes(); // Ex: 14:30 = 1430
  
  const todayHours = weeklyHours[currentDay];
  if (!todayHours) return null;
  
  if (todayHours.closed) return false;
  
  if (todayHours.open && todayHours.close) {
    const openTime = parseInt(todayHours.open.replace(':', ''));
    const closeTime = parseInt(todayHours.close.replace(':', ''));
    
    return currentTime >= openTime && currentTime <= closeTime;
  }
  
  return null;
};

export const PointDetails = ({
  selectedPoint,
  setSelectedPoint,
  setEditingPoint,
  handleDeletePoint,
  centerOnPoint,
  typeInfo,
  getMarkerIcon
}: PointDetailsProps) => {
  const { user } = useAuth();
  const isMobile = useIsMobile();
  
  // Helper function to get point types as array
  const getPointTypes = (point: MapPoint): string[] => {
    return Array.isArray(point.type) ? point.type : [point.type];
  };

  // Helper function to get primary type for display
  const getPrimaryType = (point: MapPoint): string => {
    const types = getPointTypes(point);
    return types[0] || 'recycling-point';
  };

  const pointTypes = getPointTypes(selectedPoint);
  const primaryType = getPrimaryType(selectedPoint);
  const openStatus = isOpenNow(selectedPoint.weeklyHours);
  
  return (
    <div className={cn(
      "absolute right-4 bg-white/95 backdrop-blur-md p-4 rounded-lg shadow-lg border border-eco-green-light/30 z-20",
      isMobile ? "bottom-16 left-4" : "bottom-4 max-w-md"
    )}>
      <div className="flex justify-between items-start">
        <div className="flex items-center gap-2">
          <div className={`w-6 h-6 rounded-full flex items-center justify-center ${typeInfo[primaryType]?.color || 'bg-eco-green'}`}>
            <div className="text-white">
              {getMarkerIcon(primaryType)}
            </div>
          </div>
          <h3 className="font-medium truncate max-w-[180px] md:max-w-xs">{selectedPoint.name}</h3>
        </div>
        <button 
          onClick={() => setSelectedPoint(null)}
          className="text-gray-500 hover:text-gray-700"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
        </button>
      </div>
      
      {/* Status de funcionamento */}
      {openStatus !== null && (
        <div className="mt-2 flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${openStatus ? 'bg-green-500' : 'bg-red-500'}`}></div>
          <span className={`text-sm font-medium ${openStatus ? 'text-green-600' : 'text-red-600'}`}>
            {openStatus ? 'Aberto agora' : 'Fechado agora'}
          </span>
        </div>
      )}
      
      {/* Display multiple types */}
      {pointTypes.length > 1 && (
        <div className="mt-2 flex flex-wrap gap-1">
          {pointTypes.map((type, index) => (
            <Badge key={index} variant="secondary" className="text-xs">
              {typeInfo[type]?.label || type}
            </Badge>
          ))}
        </div>
      )}
      
      <div className="mt-3 space-y-2 text-sm">
        <p className="line-clamp-3">{selectedPoint.description}</p>
        
        {selectedPoint.address && (
          <div className="flex items-start gap-2 mt-1">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-eco-green-dark mt-0.5 shrink-0"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
            <span className="line-clamp-2">{selectedPoint.address}</span>
          </div>
        )}
        
        {selectedPoint.contact && (
          <div className="flex items-start gap-2 mt-1">
            <Phone className="h-4 w-4 text-eco-green-dark mt-0.5 shrink-0" />
            <span className="line-clamp-1">{selectedPoint.contact}</span>
          </div>
        )}
        
        {selectedPoint.website && (
          <div className="flex items-start gap-2 mt-1">
            <Globe className="h-4 w-4 text-eco-green-dark mt-0.5 shrink-0" />
            <a 
              href={selectedPoint.website} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-eco-green hover:text-eco-green-dark underline line-clamp-1"
              onClick={(e) => e.stopPropagation()}
            >
              Visitar site
            </a>
          </div>
        )}
        
        {selectedPoint.openingHours && (
          <div className="flex items-start gap-2 mt-1">
            <Clock className="h-4 w-4 text-eco-green-dark mt-0.5 shrink-0" />
            <span className="line-clamp-1">{selectedPoint.openingHours}</span>
          </div>
        )}
        
        {/* Horários semanais resumidos */}
        {selectedPoint.weeklyHours && Object.keys(selectedPoint.weeklyHours).length > 0 && (
          <div className="flex items-start gap-2 mt-1">
            <Clock className="h-4 w-4 text-eco-green-dark mt-0.5 shrink-0" />
            <div className="flex-1">
              <span className="text-xs font-medium">Horários:</span>
              <div className="text-xs text-muted-foreground mt-1 space-y-1">
                {Object.entries(selectedPoint.weeklyHours).map(([day, hours]) => {
                  const dayNames = {
                    monday: 'Seg',
                    tuesday: 'Ter', 
                    wednesday: 'Qua',
                    thursday: 'Qui',
                    friday: 'Sex',
                    saturday: 'Sáb',
                    sunday: 'Dom'
                  };
                  
                  if (hours?.closed) {
                    return <div key={day}>{dayNames[day as keyof typeof dayNames]}: Fechado</div>;
                  }
                  
                  if (hours?.open && hours?.close) {
                    return (
                      <div key={day}>
                        {dayNames[day as keyof typeof dayNames]}: {hours.open} - {hours.close}
                      </div>
                    );
                  }
                  
                  return null;
                })}
              </div>
            </div>
          </div>
        )}
        
        {selectedPoint.impact && (
          <div className="mt-2 p-2 bg-eco-green-light/10 rounded">
            <div className="font-medium text-eco-green-dark text-xs">Impacto Ambiental:</div>
            <p className="text-xs line-clamp-2">{selectedPoint.impact}</p>
          </div>
        )}
      </div>
      
      <div className="flex justify-end gap-2 mt-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => centerOnPoint(selectedPoint.lat, selectedPoint.lng)}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1"><polygon points="3 11 22 2 13 21 11 13 3 11"></polygon></svg>
          Centralizar
        </Button>
        
        <Link to={`/map-point/${selectedPoint.id}`}>
          <Button variant="outline" size="sm">
            <Info className="h-3 w-3 mr-1" />
            Ver Detalhes
          </Button>
        </Link>
        
        {user?.isAdmin && (
          <>
            <Button 
              variant="outline"
              size="sm"
              onClick={() => setEditingPoint(selectedPoint)}
            >
              <Edit className="h-4 w-4 mr-1" />
              Editar
            </Button>
            
            <Button 
              variant="destructive"
              size="sm"
              onClick={() => handleDeletePoint(selectedPoint.id)}
            >
              <Trash2 className="h-4 w-4 mr-1" />
              Remover
            </Button>
          </>
        )}
      </div>
    </div>
  );
};
