
import { Clock } from 'lucide-react';
import { Card } from '@/components/ui/card';

interface WeeklyHours {
  monday?: { open: string; close: string; closed?: boolean };
  tuesday?: { open: string; close: string; closed?: boolean };
  wednesday?: { open: string; close: string; closed?: boolean };
  thursday?: { open: string; close: string; closed?: boolean };
  friday?: { open: string; close: string; closed?: boolean };
  saturday?: { open: string; close: string; closed?: boolean };
  sunday?: { open: string; close: string; closed?: boolean };
}

interface WeeklyHoursDisplayProps {
  weeklyHours: WeeklyHours;
}

const dayNames = {
  monday: 'Segunda-feira',
  tuesday: 'Terça-feira',
  wednesday: 'Quarta-feira',
  thursday: 'Quinta-feira',
  friday: 'Sexta-feira',
  saturday: 'Sábado',
  sunday: 'Domingo'
};

export const WeeklyHoursDisplay = ({ weeklyHours }: WeeklyHoursDisplayProps) => {
  const formatTime = (time: string) => {
    if (!time) return '';
    const [hours, minutes] = time.split(':');
    return `${hours}:${minutes}`;
  };

  const getCurrentDay = () => {
    const today = new Date().getDay();
    const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    return days[today];
  };

  const currentDay = getCurrentDay();

  return (
    <Card className="p-4">
      <div className="flex items-center gap-2 mb-4">
        <Clock className="h-5 w-5 text-eco-green" />
        <h3 className="font-semibold">Horários de Funcionamento</h3>
      </div>
      
      <div className="space-y-2">
        {Object.entries(dayNames).map(([day, dayLabel]) => {
          const dayHours = weeklyHours[day as keyof WeeklyHours];
          const isToday = day === currentDay;
          const isClosed = dayHours?.closed || !dayHours?.open || !dayHours?.close;
          
          return (
            <div 
              key={day} 
              className={`flex justify-between items-center p-2 rounded ${
                isToday ? 'bg-eco-green/10 border border-eco-green/20' : 'bg-gray-50'
              }`}
            >
              <span className={`font-medium ${isToday ? 'text-eco-green-dark' : ''}`}>
                {dayLabel}
                {isToday && <span className="ml-2 text-xs bg-eco-green text-white px-2 py-1 rounded">Hoje</span>}
              </span>
              
              <span className={`text-sm ${isClosed ? 'text-red-600' : 'text-gray-700'}`}>
                {isClosed 
                  ? 'Fechado' 
                  : `${formatTime(dayHours.open)} às ${formatTime(dayHours.close)}`
                }
              </span>
            </div>
          );
        })}
      </div>
    </Card>
  );
};
