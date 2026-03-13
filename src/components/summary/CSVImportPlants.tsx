
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { X, FileText, Plus } from 'lucide-react';
import { toast } from 'sonner';
import { useEditablePlants } from '@/hooks/useEditablePlants';

interface CSVImportPlantsProps {
  onClose: () => void;
}

export const CSVImportPlants = ({ onClose }: CSVImportPlantsProps) => {
  const [csvText, setCsvText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const { addPlant } = useEditablePlants();

  const processCsvText = async () => {
    if (!csvText.trim()) {
      toast.error('Digite o conteúdo CSV primeiro.');
      return;
    }

    setIsProcessing(true);
    try {
      const lines = csvText.trim().split('\n');
      const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
      
      // Verificar se tem as colunas necessárias
      const nameIndex = headers.findIndex(h => h.includes('nome') || h.includes('name'));
      const descriptionIndex = headers.findIndex(h => h.includes('descrição') || h.includes('description') || h.includes('descricao'));
      const imageIndex = headers.findIndex(h => h.includes('imagem') || h.includes('image') || h.includes('url'));
      
      if (nameIndex === -1 || descriptionIndex === -1) {
        toast.error('CSV deve conter pelo menos as colunas: nome, descrição');
        return;
      }

      let successCount = 0;
      
      for (let i = 1; i < lines.length; i++) {
        const values = lines[i].split(',').map(v => v.trim());
        
        if (values.length >= 2) {
          const plantData = {
            name: values[nameIndex] || '',
            description: values[descriptionIndex] || '',
            imageURL: imageIndex !== -1 ? (values[imageIndex] || '') : ''
          };
          
          if (plantData.name && plantData.description) {
            const success = await addPlant(plantData);
            if (success) successCount++;
          }
        }
      }
      
      if (successCount > 0) {
        toast.success(`${successCount} plantas importadas com sucesso!`);
        onClose();
      } else {
        toast.error('Nenhuma planta foi importada. Verifique o formato do CSV.');
      }
    } catch (error) {
      console.error('Erro ao processar CSV:', error);
      toast.error('Erro ao processar CSV.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Importar Plantas via CSV
            </CardTitle>
            <Button variant="outline" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-medium mb-2">Formato esperado do CSV:</h4>
            <p className="text-sm text-muted-foreground mb-2">
              O CSV deve conter as seguintes colunas (separadas por vírgula):
            </p>
            <code className="text-xs bg-white p-2 rounded block">
              nome,descrição,imagem<br/>
              Ipê Amarelo,Árvore nativa do cerrado brasileiro,https://exemplo.com/ipe.jpg<br/>
              Pau Brasil,Árvore símbolo nacional,https://exemplo.com/pau-brasil.jpg
            </code>
          </div>

          <div className="space-y-2">
            <Label htmlFor="csv-content">Conteúdo CSV</Label>
            <Textarea
              id="csv-content"
              placeholder="Cole o conteúdo CSV aqui..."
              value={csvText}
              onChange={(e) => setCsvText(e.target.value)}
              rows={12}
              className="font-mono text-sm"
            />
          </div>

          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button 
              onClick={processCsvText} 
              disabled={isProcessing || !csvText.trim()}
              className="bg-eco-green hover:bg-eco-green-dark"
            >
              {isProcessing ? 'Processando...' : 'Importar Plantas'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
