
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { X, Leaf } from 'lucide-react';

interface AddPlantFormProps {
  plant?: any;
  onSubmit: (plantData: { name: string; description: string; imageURL: string }) => Promise<void>;
  onCancel: () => void;
}

export const AddPlantForm = ({ plant, onSubmit, onCancel }: AddPlantFormProps) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [imageURL, setImageURL] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (plant) {
      setName(plant.name || '');
      setDescription(plant.description || '');
      setImageURL(plant.imageURL || '');
    }
  }, [plant]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim() || !description.trim()) {
      return;
    }

    setIsLoading(true);
    try {
      await onSubmit({
        name: name.trim(),
        description: description.trim(),
        imageURL: imageURL.trim()
      });
      
      // Reset form if not editing
      if (!plant) {
        setName('');
        setDescription('');
        setImageURL('');
      }
    } catch (error) {
      console.error('Erro ao salvar planta:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="border-eco-green/20">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Leaf className="h-5 w-5 text-eco-green" />
            {plant ? 'Editar Planta' : 'Adicionar Nova Planta'}
          </CardTitle>
          <Button variant="ghost" size="sm" onClick={onCancel}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="plant-name">Nome da Planta</Label>
            <Input
              id="plant-name"
              type="text"
              placeholder="Ex: Ipê Amarelo"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="plant-description">Descrição</Label>
            <Textarea
              id="plant-description"
              placeholder="Descreva as características da planta, seu habitat natural, benefícios ecológicos..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="plant-image">URL da Imagem (opcional)</Label>
            <Input
              id="plant-image"
              type="url"
              placeholder="https://exemplo.com/imagem.jpg"
              value={imageURL}
              onChange={(e) => setImageURL(e.target.value)}
            />
            {imageURL && (
              <div className="mt-2">
                <img 
                  src={imageURL} 
                  alt="Preview" 
                  className="w-32 h-32 object-cover rounded-md border"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
              </div>
            )}
          </div>
          
          <div className="flex gap-2 pt-4">
            <Button
              type="submit"
              disabled={isLoading || !name.trim() || !description.trim()}
              className="bg-eco-green hover:bg-eco-green-dark flex-1"
            >
              {isLoading ? 'Salvando...' : plant ? 'Atualizar Planta' : 'Adicionar Planta'}
            </Button>
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancelar
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
