
import { useState, useEffect } from 'react';
import { MapPin, Save, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { MapPoint } from '@/types/map';
import { firebaseFirestore } from '@/services/firebaseFirestore';
import { WeeklyHoursForm } from './WeeklyHoursForm';
import { OpenStatusIndicator } from './OpenStatusIndicator';

interface EditMapPointFormProps {
  point: MapPoint;
  onSuccess: () => void;
  onCancel: () => void;
}

const availableTypes = [
  { value: 'recycling-point', label: 'Ponto de Reciclagem' },
  { value: 'recycling-center', label: 'Ponto de Lixo Eletrônico' },
  { value: 'seedling-distribution', label: 'Distribuição de Mudas' },
  { value: 'plant-sales', label: 'Venda de Mudas' },
  { value: 'lamp-collection', label: 'Coleta de Lâmpadas' },
  { value: 'oil-collection', label: 'Coleta de Óleo' },
  { value: 'medicine-collection', label: 'Coleta de Cartela de Remédio' },
  { value: 'electronics-donation', label: 'Doação de Eletrônicos' },
];

export const EditMapPointForm = ({ point, onSuccess, onCancel }: EditMapPointFormProps) => {
  const [formData, setFormData] = useState({
    name: point.name || '',
    types: Array.isArray(point.type) ? point.type : [point.type],
    description: point.description || '',
    address: point.address || '',
    impact: point.impact || '',
    openingHours: point.openingHours || '',
    contact: point.contact || '',
    website: point.website || '',
    weeklyHours: point.weeklyHours || {}
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleTypeChange = (typeValue: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      types: checked 
        ? [...prev.types, typeValue]
        : prev.types.filter(t => t !== typeValue)
    }));
  };

  const handleWeeklyHoursChange = (weeklyHours: MapPoint['weeklyHours']) => {
    setFormData(prev => ({
      ...prev,
      weeklyHours: weeklyHours || {}
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim() || formData.types.length === 0 || !formData.description.trim()) {
      toast.error('Por favor, preencha todos os campos obrigatórios e selecione pelo menos um tipo.');
      return;
    }

    setIsSubmitting(true);

    try {
      if (!point.firebaseId) {
        toast.error('ID do ponto não encontrado.');
        return;
      }

      const updateData = {
        name: formData.name.trim(),
        type: formData.types.length === 1 ? formData.types[0] : formData.types,
        description: formData.description.trim(),
        address: formData.address.trim(),
        impact: formData.impact.trim(),
        openingHours: formData.openingHours.trim(),
        contact: formData.contact.trim(),
        website: formData.website.trim(),
        weeklyHours: formData.weeklyHours
      };

      await firebaseFirestore.mapPoints.update(point.firebaseId, updateData);

      toast.success('Ponto atualizado com sucesso!');
      onSuccess();
    } catch (error: any) {
      console.error('Erro ao atualizar ponto:', error);
      toast.error('Erro ao atualizar ponto: ' + (error.message || 'Erro desconhecido'));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Editar Ponto Ecológico
                <OpenStatusIndicator weeklyHours={formData.weeklyHours} className="ml-2" />
              </CardTitle>
              <CardDescription>
                Edite as informações do ponto selecionado
              </CardDescription>
            </div>
            <Button variant="outline" size="sm" onClick={onCancel}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Nome do Ponto *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Ex: Ponto de Coleta Zona Norte"
                  required
                />
              </div>

              <div>
                <Label htmlFor="address">Endereço</Label>
                <Input
                  id="address"
                  value={formData.address}
                  onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                  placeholder="Ex: Rua das Flores, 123, Centro"
                />
              </div>
            </div>

            <div>
              <Label>Tipos do Ponto *</Label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2">
                {availableTypes.map((type) => (
                  <div key={type.value} className="flex items-center space-x-2">
                    <Checkbox
                      id={type.value}
                      checked={formData.types.includes(type.value)}
                      onCheckedChange={(checked) => handleTypeChange(type.value, checked as boolean)}
                    />
                    <Label htmlFor={type.value} className="text-sm cursor-pointer">
                      {type.label}
                    </Label>
                  </div>
                ))}
              </div>
              {formData.types.length === 0 && (
                <p className="text-sm text-red-500 mt-1">Selecione pelo menos um tipo</p>
              )}
            </div>

            <div>
              <Label htmlFor="description">Descrição *</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Descreva o ponto ecológico..."
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="openingHours">Horário de Funcionamento (Geral)</Label>
                <Input
                  id="openingHours"
                  value={formData.openingHours}
                  onChange={(e) => setFormData(prev => ({ ...prev, openingHours: e.target.value }))}
                  placeholder="Ex: Seg-Sex: 8h às 17h"
                />
              </div>

              <div>
                <Label htmlFor="contact">Contato</Label>
                <Input
                  id="contact"
                  value={formData.contact}
                  onChange={(e) => setFormData(prev => ({ ...prev, contact: e.target.value }))}
                  placeholder="Ex: (11) 1234-5678"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="website">Website</Label>
              <Input
                id="website"
                value={formData.website}
                onChange={(e) => setFormData(prev => ({ ...prev, website: e.target.value }))}
                placeholder="Ex: https://exemplo.com"
                type="url"
              />
            </div>

            <div>
              <Label>Horários Detalhados da Semana</Label>
              <WeeklyHoursForm
                weeklyHours={formData.weeklyHours}
                onChange={handleWeeklyHoursChange}
              />
            </div>

            <div>
              <Label htmlFor="impact">Impacto Ambiental</Label>
              <Textarea
                id="impact"
                value={formData.impact}
                onChange={(e) => setFormData(prev => ({ ...prev, impact: e.target.value }))}
                placeholder="Descreva o impacto ambiental positivo..."
              />
            </div>

            <div className="flex gap-3 pt-4">
              <Button 
                type="button" 
                variant="outline" 
                onClick={onCancel}
                className="flex-1"
              >
                <X className="h-4 w-4 mr-1" />
                Cancelar
              </Button>
              <Button 
                type="submit" 
                disabled={isSubmitting}
                className="flex-1"
              >
                <Save className="h-4 w-4 mr-1" />
                {isSubmitting ? 'Salvando...' : 'Salvar'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
