import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { X, FileText } from 'lucide-react';
import { toast } from 'sonner';
import { useEventStore } from '@/hooks/useEventStore';
import { useAuth } from '@/contexts/AuthContext';

interface CSVImportEventsProps {
  onClose: () => void;
}

export const CSVImportEvents = ({ onClose }: CSVImportEventsProps) => {
  const [csvText, setCsvText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const { addEvent } = useEventStore();
  const { user } = useAuth();

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
      const titleIndex = headers.findIndex(h => h.includes('título') || h.includes('title') || h.includes('titulo'));
      const descriptionIndex = headers.findIndex(h => h.includes('descrição') || h.includes('description') || h.includes('descricao'));
      const dateIndex = headers.findIndex(h => h.includes('data') || h.includes('date'));
      const timeIndex = headers.findIndex(h => h.includes('horário') || h.includes('time') || h.includes('horario'));
      const addressIndex = headers.findIndex(h => h.includes('endereço') || h.includes('address') || h.includes('endereco'));
      const organizerIndex = headers.findIndex(h => h.includes('organizador') || h.includes('organizer'));
      
      if (titleIndex === -1 || descriptionIndex === -1 || dateIndex === -1 || addressIndex === -1) {
        toast.error('CSV deve conter pelo menos as colunas: título, descrição, data, endereço');
        return;
      }

      let successCount = 0;
      
      for (let i = 1; i < lines.length; i++) {
        const values = lines[i].split(',').map(v => v.trim());
        
        if (values.length >= 4) {
          const eventData = {
            title: values[titleIndex] || '',
            description: values[descriptionIndex] || '',
            times: [{
              date: values[dateIndex] || new Date().toISOString().split('T')[0],
              time: timeIndex !== -1 ? (values[timeIndex] || '08:00') : '08:00'
            }],
            locations: [{
              address: values[addressIndex] || ''
            }],
            organizer: organizerIndex !== -1 ? (values[organizerIndex] || user?.name || '') : (user?.name || ''),
            contact: '',
            website: '',
            createdBy: user?.id || 'admin',
            createdAt: new Date().toISOString()
          };
          
          if (eventData.title && eventData.description && eventData.locations[0].address) {
            try {
              await addEvent(eventData);
              successCount++;
            } catch (error) {
              console.error('Erro ao adicionar evento:', error);
            }
          }
        }
      }
      
      if (successCount > 0) {
        toast.success(`${successCount} eventos importados com sucesso!`);
        onClose();
      } else {
        toast.error('Nenhum evento foi importado. Verifique o formato do CSV.');
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
              Importar Eventos via CSV
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
              título,descrição,data,horário,endereço,organizador<br/>
              Plantio de Mudas,Evento de plantio no parque,2024-07-15,09:00,Parque Central - Presidente Prudente,Prefeitura<br/>
              Coleta Seletiva,Workshop sobre reciclagem,2024-07-20,14:00,Centro Comunitário,ONG Verde
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
              {isProcessing ? 'Processando...' : 'Importar Eventos'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
