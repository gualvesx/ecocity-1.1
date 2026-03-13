
import { MapPoint } from '@/types/map';
import { Clock } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface OpenStatusIndicatorProps {
  weeklyHours?: MapPoint['weeklyHours'];
  className?: string;
}

export const OpenStatusIndicator = ({ weeklyHours, className = "" }: OpenStatusIndicatorProps) => {
  if (!weeklyHours || Object.keys(weeklyHours).length === 0) return null;
  
  const now = new Date();
  const dayNames = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
  const currentDay = dayNames[now.getDay()] as keyof typeof weeklyHours;
  const currentTime = now.getHours() * 100 + now.getMinutes(); // Ex: 14:30 = 1430
  
  const todayHours = weeklyHours[currentDay];
  if (!todayHours) return null;
  
  if (todayHours.closed) {
    return (
      <Badge variant="destructive" className={`text-xs ${className}`}>
        <div className="w-2 h-2 bg-white rounded-full mr-1"></div>
        Fechado
      </Badge>
    );
  }
  
  if (todayHours.open && todayHours.close) {
    const openTime = parseInt(todayHours.open.replace(':', ''));
    const closeTime = parseInt(todayHours.close.replace(':', ''));
    
    const isOpen = currentTime >= openTime && currentTime <= closeTime;
    
    return (
      <Badge variant={isOpen ? "default" : "destructive"} className={`text-xs ${className}`}>
        <div className={`w-2 h-2 rounded-full mr-1 ${isOpen ? 'bg-green-400' : 'bg-white'}`}></div>
        {isOpen ? 'Aberto' : 'Fechado'}
      </Badge>
    );
  }
  
  return null;
};
