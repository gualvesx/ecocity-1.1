
import { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Card } from '@/components/ui/card';
import { Clock } from 'lucide-react';

interface WeeklyHours {
  monday?: { open: string; close: string; closed?: boolean };
  tuesday?: { open: string; close: string; closed?: boolean };
  wednesday?: { open: string; close: string; closed?: boolean };
  thursday?: { open: string; close: string; closed?: boolean };
  friday?: { open: string; close: string; closed?: boolean };
  saturday?: { open: string; close: string; closed?: boolean };
  sunday?: { open: string; close: string; closed?: boolean };
}

interface WeeklyHoursFormProps {
  weeklyHours: WeeklyHours;
  onChange: (weeklyHours: WeeklyHours) => void;
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

export const WeeklyHoursForm = ({ weeklyHours, onChange }: WeeklyHoursFormProps) => {
  const handleDayChange = (day: keyof WeeklyHours, field: string, value: string | boolean) => {
    const updatedHours = {
      ...weeklyHours,
      [day]: {
        ...weeklyHours[day],
        [field]: value
      }
    };
    onChange(updatedHours);
  };

  return (
    <Card className="p-4">
      <div className="flex items-center gap-2 mb-4">
        <Clock className="h-4 w-4 text-eco-green" />
        <Label className="text-sm font-medium">Horários de Funcionamento</Label>
      </div>
      
      <div className="space-y-3">
        {Object.entries(dayNames).map(([day, dayLabel]) => {
          const dayHours = weeklyHours[day as keyof WeeklyHours];
          const isClosed = dayHours?.closed || false;
          
          return (
            <div key={day} className="flex items-center gap-3 p-2 bg-eco-sand/20 rounded">
              <div className="w-24 text-xs font-medium">{dayLabel}</div>
              
              <div className="flex items-center gap-2">
                <Checkbox
                  checked={isClosed}
                  onCheckedChange={(checked) => 
                    handleDayChange(day as keyof WeeklyHours, 'closed', checked)
                  }
                />
                <span className="text-xs">Fechado</span>
              </div>
              
              {!isClosed && (
                <div className="flex items-center gap-2 flex-1">
                  <Input
                    type="time"
                    value={dayHours?.open || ''}
                    onChange={(e) => handleDayChange(day as keyof WeeklyHours, 'open', e.target.value)}
                    className="w-20 h-8 text-xs"
                    placeholder="Abertura"
                  />
                  <span className="text-xs">às</span>
                  <Input
                    type="time"
                    value={dayHours?.close || ''}
                    onChange={(e) => handleDayChange(day as keyof WeeklyHours, 'close', e.target.value)}
                    className="w-20 h-8 text-xs"
                    placeholder="Fechamento"
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </Card>
  );
};
