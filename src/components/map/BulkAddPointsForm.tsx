import { useState } from 'react';
import { Upload, Download, Plus, Trash2, Save, AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { toast } from 'sonner';
import { useMapPoints } from '@/hooks/useMapPoints';
import { useAddressCorrection } from '@/hooks/useAddressCorrection';
import { geocodeAddress } from '@/services/geocoding';
import { WeeklyHoursForm } from '@/components/map/WeeklyHoursForm';
import { csvImportAPI, CSVPointData } from '@/services/csvImportApi';
import { useCSVUpdater } from '@/hooks/useCSVUpdater';

interface BulkPointData {
  name: string;
  type: string;
  description: string;
  address: string;
  impact: string;
  openingHours: string;
  contact: string;
  website: string;
  weeklyHours?: {
    monday?: { open: string; close: string; closed?: boolean };
    tuesday?: { open: string; close: string; closed?: boolean };
    wednesday?: { open: string; close: string; closed?: boolean };
    thursday?: { open: string; close: string; closed?: boolean };
    friday?: { open: string; close: string; closed?: boolean };
    saturday?: { open: string; close: string; closed?: boolean };
    sunday?: { open: string; close: string; closed?: boolean };
  };
}

export const BulkAddPointsForm = () => {
  const { addMapPoint } = useMapPoints();
  const { correctAddress } = useAddressCorrection();
  const { updatePointsFromCSV, isProcessing: isUpdating } = useCSVUpdater();
  const [points, setPoints] = useState<BulkPointData[]>([{
    name: '',
    type: '',
    description: '',
    address: '',
    impact: '',
    openingHours: '',
    contact: '',
    website: '',
    weeklyHours: {}
  }]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [importErrors, setImportErrors] = useState<string[]>([]);

  const addNewPoint = () => {
    setPoints(prev => [...prev, {
      name: '',
      type: '',
      description: '',
      address: '',
      impact: '',
      openingHours: '',
      contact: '',
      website: '',
      weeklyHours: {}
    }]);
  };

  const removePoint = (index: number) => {
    if (points.length > 1) {
      setPoints(prev => prev.filter((_, i) => i !== index));
    }
  };

  const updatePoint = (index: number, field: keyof BulkPointData, value: any) => {
    setPoints(prev => prev.map((point, i) => 
      i === index ? { ...point, [field]: value } : point
    ));
  };

  const downloadTemplate = () => {
    const template = [
      'Nome,Tipo,Descrição,Endereço,Impacto,Horario,Contato,Website',
      'Ponto Exemplo,recycling-point,Descrição do ponto,Rua Exemplo 123 - Centro - Presidente Prudente,Impacto positivo,Seg-Sex 8h-17h,(11) 1234-5678,https://exemplo.com'
    ].join('\n');
    
    const blob = new Blob([template], { type: 'text/csv;charset=utf-8' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'template_pontos_ecologicos.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
    toast.success('Template CSV baixado com sucesso!');
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.name.toLowerCase().endsWith('.csv')) {
      toast.error('Por favor, selecione um arquivo CSV válido.');
      return;
    }

    setIsImporting(true);
    setImportErrors([]);

    try {
      const result = await csvImportAPI.parseCSVFile(file);
      
      if (result.success && result.processedPoints.length > 0) {
        // Converter CSVPointData para BulkPointData
        const convertedPoints: BulkPointData[] = result.processedPoints.map(csvPoint => ({
          name: csvPoint.name,
          type: csvPoint.type,
          description: csvPoint.description,
          address: csvPoint.address,
          impact: csvPoint.impact || '',
          openingHours: csvPoint.openingHours || '',
          contact: csvPoint.contact || '',
          website: csvPoint.website || '',
          weeklyHours: csvPoint.weeklyHours || {}
        }));

        setPoints(convertedPoints);
        
        const successMessage = `${result.validRows} pontos carregados com sucesso do CSV!`;
        toast.success(successMessage);
        
        if (result.errors.length > 0) {
          setImportErrors(result.errors);
          toast.warning(`${result.errors.length} erros encontrados durante a importação.`);
        }
      } else {
        setImportErrors(result.errors);
        toast.error('Nenhum ponto válido encontrado no arquivo CSV.');
      }
    } catch (error) {
      console.error('Erro ao importar CSV:', error);
      toast.error('Erro ao processar arquivo CSV. Tente novamente.');
      setImportErrors(['Erro interno ao processar o arquivo CSV']);
    } finally {
      setIsImporting(false);
      event.target.value = '';
    }
  };

  const handleUpdateFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.name.toLowerCase().endsWith('.csv')) {
      toast.error('Por favor, selecione um arquivo CSV válido.');
      return;
    }

    try {
      const text = await file.text();
      await updatePointsFromCSV(text);
    } catch (error) {
      console.error('Erro ao atualizar pontos:', error);
      toast.error('Erro ao processar arquivo de atualização.');
    } finally {
      event.target.value = '';
    }
  };

  const handleSubmit = async () => {
    const validPoints = points.filter(point => 
      point.name.trim() && point.type && point.description.trim() && point.address.trim()
    );

    if (validPoints.length === 0) {
      toast.error('Pelo menos um ponto deve ter nome, tipo, descrição e endereço preenchidos.');
      return;
    }

    setIsSubmitting(true);
    let successCount = 0;
    let errorCount = 0;

    for (const point of validPoints) {
      try {
        console.log(`Processando ponto: ${point.name}`);
        const correctedAddress = await correctAddress(point.address);
        console.log(`Endereço corrigido: ${correctedAddress}`);

        const coordinates = await geocodeAddress(correctedAddress);
        
        if (!coordinates) {
          console.error(`Coordenadas não encontradas para: ${correctedAddress}`);
          toast.error(`Não foi possível localizar: ${correctedAddress}`);
          errorCount++;
          continue;
        }

        await addMapPoint({
          name: point.name.trim(),
          type: point.type,
          description: point.description.trim(),
          address: correctedAddress,
          impact: point.impact.trim() || 'Impacto ambiental positivo.',
          openingHours: point.openingHours.trim(),
          contact: point.contact.trim(),
          website: point.website.trim(),
          weeklyHours: point.weeklyHours,
          lat: coordinates.lat,
          lng: coordinates.lng
        });
        
        successCount++;
        console.log(`Ponto salvo: ${point.name}`);
      } catch (error) {
        console.error('Erro ao processar ponto:', error);
        errorCount++;
      }
    }

    if (successCount > 0) {
      toast.success(`${successCount} pontos adicionados com sucesso!`);
      setPoints([{
        name: '',
        type: '',
        description: '',
        address: '',
        impact: '',
        openingHours: '',
        contact: '',
        website: '',
        weeklyHours: {}
      }]);
    }

    if (errorCount > 0) {
      toast.error(`${errorCount} pontos falharam ao ser processados.`);
    }

    setIsSubmitting(false);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Plus className="h-5 w-5" />
          Importação e Adição de Pontos em Lote
        </CardTitle>
        <CardDescription>
          Importe vários pontos via CSV, atualize pontos existentes ou adicione manualmente. Os endereços são processados por IA para máxima precisão.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          <Button variant="outline" onClick={downloadTemplate}>
            <Download className="h-4 w-4 mr-1" />
            Template CSV
          </Button>
          <div>
            <Input
              type="file"
              accept=".csv,text/csv"
              onChange={handleFileUpload}
              className="hidden"
              id="csv-upload"
              disabled={isImporting}
            />
            <Label htmlFor="csv-upload" className="cursor-pointer">
              <Button variant="outline" className="w-full" asChild disabled={isImporting}>
                <span>
                  <Upload className="h-4 w-4 mr-1" />
                  {isImporting ? 'Importando...' : 'Importar CSV'}
                </span>
              </Button>
            </Label>
          </div>
          <div>
            <Input
              type="file"
              accept=".csv,text/csv"
              onChange={handleUpdateFileUpload}
              className="hidden"
              id="csv-update"
              disabled={isUpdating}
            />
            <Label htmlFor="csv-update" className="cursor-pointer">
              <Button variant="outline" className="w-full" asChild disabled={isUpdating}>
                <span>
                  <RefreshCw className="h-4 w-4 mr-1" />
                  {isUpdating ? 'Atualizando...' : 'Atualizar CSV'}
                </span>
              </Button>
            </Label>
          </div>
        </div>

        {importErrors.length > 0 && (
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              <div className="space-y-1">
                <p className="font-medium">Erros encontrados durante a importação:</p>
                <ul className="list-disc list-inside text-sm space-y-1">
                  {importErrors.slice(0, 5).map((error, index) => (
                    <li key={index}>{error}</li>
                  ))}
                  {importErrors.length > 5 && (
                    <li className="text-muted-foreground">
                      ... e mais {importErrors.length - 5} erro(s)
                    </li>
                  )}
                </ul>
              </div>
            </AlertDescription>
          </Alert>
        )}

        <Separator />

        <div className="space-y-6">
          {points.map((point, index) => (
            <Card key={index} className="p-4">
              <div className="flex justify-between items-center mb-4">
                <h4 className="font-medium">Ponto {index + 1}</h4>
                {points.length > 1 && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => removePoint(index)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Nome do Ponto *</Label>
                  <Input
                    value={point.name}
                    onChange={(e) => updatePoint(index, 'name', e.target.value)}
                    placeholder="Ex: Ponto de Coleta Norte"
                  />
                </div>

                <div>
                  <Label>Tipo *</Label>
                  <Select value={point.type} onValueChange={(value) => updatePoint(index, 'type', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="recycling-point">Ponto de Reciclagem</SelectItem>
                      <SelectItem value="recycling-center">Ponto de Lixo Eletrônico</SelectItem>
                      <SelectItem value="seedling-distribution">Distribuição de Mudas</SelectItem>
                      <SelectItem value="plant-sales">Venda de Mudas</SelectItem>
                      <SelectItem value="lamp-collection">Coleta de Lâmpadas</SelectItem>
                      <SelectItem value="oil-collection">Coleta de Óleo</SelectItem>
                      <SelectItem value="medicine-collection">Coleta de Cartela de Remédio</SelectItem>
                      <SelectItem value="electronics-donation">Doação de Eletrônicos</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="md:col-span-2">
                  <Label>Descrição *</Label>
                  <Textarea
                    value={point.description}
                    onChange={(e) => updatePoint(index, 'description', e.target.value)}
                    placeholder="Descreva o ponto ecológico..."
                  />
                </div>

                <div className="md:col-span-2">
                  <Label>Endereço *</Label>
                  <Input
                    value={point.address}
                    onChange={(e) => updatePoint(index, 'address', e.target.value)}
                    placeholder="Ex: Rua das Flores, 123, Centro - Presidente Prudente"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Será processado automaticamente pela IA para correção e geocodificação
                  </p>
                </div>

                <div>
                  <Label>Contato</Label>
                  <Input
                    value={point.contact}
                    onChange={(e) => updatePoint(index, 'contact', e.target.value)}
                    placeholder="Ex: (11) 1234-5678"
                  />
                </div>

                <div>
                  <Label>Website</Label>
                  <Input
                    value={point.website}
                    onChange={(e) => updatePoint(index, 'website', e.target.value)}
                    placeholder="Ex: https://exemplo.com"
                    type="url"
                  />
                </div>

                <div className="md:col-span-2">
                  <Label>Impacto Ambiental</Label>
                  <Textarea
                    value={point.impact}
                    onChange={(e) => updatePoint(index, 'impact', e.target.value)}
                    placeholder="Descreva o impacto ambiental positivo..."
                  />
                </div>

                <div className="md:col-span-2">
                  <WeeklyHoursForm
                    weeklyHours={point.weeklyHours || {}}
                    onChange={(weeklyHours) => updatePoint(index, 'weeklyHours', weeklyHours)}
                  />
                </div>
              </div>
            </Card>
          ))}
        </div>

        <div className="flex gap-3">
          <Button variant="outline" onClick={addNewPoint} className="flex-1">
            <Plus className="h-4 w-4 mr-1" />
            Adicionar Ponto
          </Button>
          <Button 
            onClick={handleSubmit} 
            disabled={isSubmitting || isImporting}
            className="flex-1"
          >
            <Save className="h-4 w-4 mr-1" />
            {isSubmitting ? 'Processando...' : `Salvar ${points.length} Ponto(s)`}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
