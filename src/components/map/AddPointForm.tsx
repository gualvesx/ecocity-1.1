import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin, X } from 'lucide-react';
import { toast } from 'sonner';
import { useMapPoints } from '@/hooks/useMapPoints';
import { useAddressCorrection } from '@/hooks/useAddressCorrection';
import { WeeklyHoursForm } from '@/components/map/WeeklyHoursForm';

interface AddPointFormProps {
  onClose: () => void;
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

export const AddPointForm = ({ onClose }: AddPointFormProps) => {
  const { addMapPoint } = useMapPoints();
  const { correctAddress, suggestions, isLoading: isCorrectingAddress } = useAddressCorrection();
  
  const [formData, setFormData] = useState({
    name: '',
    types: [] as string[],
    description: '',
    address: '',
    impact: '',
    contact: '',
    website: '',
    weeklyHours: {}
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [addressSuggestion, setAddressSuggestion] = useState<string>('');

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleTypeChange = (typeValue: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      types: checked 
        ? [...prev.types, typeValue]
        : prev.types.filter(t => t !== typeValue)
    }));
  };

  const handleAddressCorrection = async () => {
    if (!formData.address.trim()) return;
    
    try {
      const corrected = await correctAddress(formData.address);
      if (corrected && corrected !== formData.address) {
        setAddressSuggestion(corrected);
      }
    } catch (error) {
      console.error('Erro ao corrigir endereço:', error);
    }
  };

  const acceptAddressSuggestion = () => {
    setFormData(prev => ({ ...prev, address: addressSuggestion }));
    setAddressSuggestion('');
  };

  const handleCancel = () => {
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim() || formData.types.length === 0 || !formData.description.trim() || !formData.address.trim()) {
      toast.error('Por favor, preencha todos os campos obrigatórios e selecione pelo menos um tipo.');
      return;
    }

    setIsSubmitting(true);
    
    try {
      const finalAddress = addressSuggestion || formData.address;
      
      const result = await addMapPoint({
        name: formData.name.trim(),
        type: formData.types.length === 1 ? formData.types[0] : formData.types,
        description: formData.description.trim(),
        address: finalAddress,
        impact: formData.impact.trim() || 'Impacto ambiental positivo.',
        contact: formData.contact.trim(),
        website: formData.website.trim(),
        weeklyHours: formData.weeklyHours
      });
      
      if (result) {
        onClose();
      }
    } catch (error) {
      console.error('Erro ao adicionar ponto:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Adicionar Novo Ponto Ecológico
              </CardTitle>
              <CardDescription>
                Adicione um novo ponto de interesse ecológico ao mapa
              </CardDescription>
            </div>
            <Button variant="outline" size="sm" onClick={handleCancel}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Nome do Ponto *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="Ex: Ponto de Coleta Norte"
                  required
                />
              </div>

              <div>
                <Label htmlFor="address">Endereço *</Label>
                <div className="space-y-2">
                  <Input
                    id="address"
                    value={formData.address}
                    onChange={(e) => handleInputChange('address', e.target.value)}
                    onBlur={handleAddressCorrection}
                    placeholder="Ex: Rua das Flores, 123, Centro - Presidente Prudente"
                    required
                  />
                  
                  {addressSuggestion && (
                    <div className="p-3 bg-blue-50 border border-blue-200 rounded">
                      <p className="text-sm text-blue-800 mb-2">
                        Sugestão de endereço corrigido:
                      </p>
                      <p className="font-medium text-blue-900 mb-2">{addressSuggestion}</p>
                      <div className="flex gap-2">
                        <Button 
                          type="button" 
                          size="sm" 
                          onClick={acceptAddressSuggestion}
                          className="bg-blue-600 hover:bg-blue-700"
                        >
                          Aceitar
                        </Button>
                        <Button 
                          type="button" 
                          variant="outline" 
                          size="sm" 
                          onClick={() => setAddressSuggestion('')}
                        >
                          Manter Original
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
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
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Descreva o ponto ecológico..."
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="contact">Contato</Label>
                <Input
                  id="contact"
                  value={formData.contact}
                  onChange={(e) => handleInputChange('contact', e.target.value)}
                  placeholder="Ex: (11) 1234-5678"
                />
              </div>

              <div>
                <Label htmlFor="website">Website</Label>
                <Input
                  id="website"
                  type="url"
                  value={formData.website}
                  onChange={(e) => handleInputChange('website', e.target.value)}
                  placeholder="Ex: https://exemplo.com"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="impact">Impacto Ambiental</Label>
              <Textarea
                id="impact"
                value={formData.impact}
                onChange={(e) => handleInputChange('impact', e.target.value)}
                placeholder="Descreva o impacto ambiental positivo..."
              />
            </div>

            <WeeklyHoursForm
              weeklyHours={formData.weeklyHours}
              onChange={(weeklyHours) => setFormData(prev => ({ ...prev, weeklyHours }))}
            />

            <div className="flex justify-end gap-3 pt-4">
              <Button type="button" variant="outline" onClick={handleCancel}>
                Cancelar
              </Button>
              <Button 
                type="submit" 
                disabled={isSubmitting || isCorrectingAddress}
                className="min-w-[100px]"
              >
                {isSubmitting ? 'Salvando...' : 'Salvar Ponto'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
