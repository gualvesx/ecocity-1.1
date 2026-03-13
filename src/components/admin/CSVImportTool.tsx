
import { useState } from 'react';
import { Upload, FileText, CheckCircle, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useCSVProcessor } from '@/hooks/useCSVProcessor';
import { useAuth } from '@/contexts/AuthContext';

export const CSVImportTool = () => {
  const { user } = useAuth();
  const { processCSVData, isProcessing } = useCSVProcessor();
  const [csvInput, setCsvInput] = useState('');
  const [importResult, setImportResult] = useState<{
    success: boolean;
    successCount: number;
    errorCount: number;
    errors: string[];
  } | null>(null);

  // Default CSV data
  const defaultCsvData = `Nome,Descrição,Contato,WebSite,Impacto,Endereço,Tipo
Ilustre - Automação e Iluminação,"Ponto de coleta para descarte correto de lâmpadas, contribuindo para a redução de resíduos perigosos e a promoção da reciclagem.","(18) 3221-1250",Não informado,"Coleta de resíduos perigosos; Reciclagem de materiais; Redução de contaminação ambiental.","Avenida Manoel Goulart, 1820",lamp-collection
Eletrosul,"Ponto de coleta para descarte correto de lâmpadas, contribuindo para a redução de resíduos perigosos e a promoção da reciclagem.","(18) 3221-5050",eletrosul.com.br,"Coleta de resíduos perigosos; Reciclagem de materiais; Redução de contaminação ambiental.","Avenida Manoel Goulart, 1900",lamp-collection
Eletrosul - Centro,"Ponto de coleta para descarte correto de lâmpadas, contribuindo para a redução de resíduos perigosos e a promoção da reciclagem.","(18) 3221-5050",eletrosul.com.br,"Coleta de resíduos perigosos; Reciclagem de materiais; Redução de contaminação ambiental.","Avenida Barão do Rio Branco, 125",lamp-collection
Carrefour,"Ponto de coleta para descarte correto de lâmpadas, contribuindo para a redução de resíduos perigosos e a promoção da reciclagem.",Consultar local ou site da empresa.,carrefour.com.br,"Coleta de resíduos perigosos; Reciclagem de materiais; Redução de contaminação ambiental.","Avenida Manoel Goulart, 2400",lamp-collection
Muffato (Av. Salim Farah Maluf),"Ponto de coleta para descarte correto de lâmpadas, contribuindo para a redução de resíduos perigosos e a promoção da reciclagem.",Consultar local ou site da empresa.,supermuffato.com.br,"Coleta de resíduos perigosos; Reciclagem de materiais; Redução de contaminação ambiental.","Avenida Salim Farah Maluf, 170",lamp-collection
Muffato (Rua Siqueira Campos),"Ponto de coleta para descarte correto de lâmpadas, contribuindo para a redução de resíduos perigosos e a promoção da reciclagem.",Consultar local ou site da empresa.,supermuffato.com.br,"Coleta de resíduos perigosos; Reciclagem de materiais; Redução de contaminação ambiental.","Rua Siqueira Campos, 1545",lamp-collection
Muffato Max Guanabara,"Ponto de coleta para descarte correto de lâmpadas, contribuindo para a redução de resíduos perigosos e a promoção da reciclagem.",Consultar local ou site da empresa.,supermuffato.com.br,"Coleta de resíduos perigosos; Reciclagem de materiais; Redução de contaminação ambiental.","Av. Pres. Juscelino Kubitschek, 7764",lamp-collection
Sam S Club,"Ponto de coleta para descarte correto de lâmpadas, contribuindo para a redução de resíduos perigosos e a promoção da reciclagem.",Consultar local ou site da empresa.,samsclub.com.br,"Coleta de resíduos perigosos; Reciclagem de materiais; Redução de contaminação ambiental.","Av. Salim Farah Maluf, 17",lamp-collection
Atacadão,"Ponto de coleta para descarte correto de lâmpadas, contribuindo para a redução de resíduos perigosos e a promoção da reciclagem.",Consultar local ou site da empresa.,atacadao.com.br,"Coleta de resíduos perigosos; Reciclagem de materiais; Redução de contaminação ambiental.","R. Antônio Rota, 855 - Jardim Vale do Sol",lamp-collection
Força e Luz,"Ponto de coleta para descarte correto de lâmpadas, contribuindo para a redução de resíduos perigosos e a promoção da reciclagem.","(18) 3907-7400",Não informado,"Coleta de resíduos perigosos; Reciclagem de materiais; Redução de contaminação ambiental.","Avenida Coronel José Soares Marcondes, 4599",lamp-collection
Força e Luz - matriz,"Ponto de coleta para descarte correto de lâmpadas, contribuindo para a redução de resíduos perigosos e a promoção da reciclagem.","(18) 3907-7400",Não informado,"Coleta de resíduos perigosos; Reciclagem de materiais; Redução de contaminação ambiental.","Av. Antonio Canhetti, 693 - Jd Cambuy",lamp-collection
Assaí Presidente Prudente,"Ponto de coleta para descarte correto de lâmpadas, contribuindo para a redução de resíduos perigosos e a promoção da reciclagem.",Consultar local ou site da empresa.,assai.com.br,"Coleta de resíduos perigosos; Reciclagem de materiais; Redução de contaminação ambiental.","Avenida Joaquim Constantino, 3025",lamp-collection
Supermercados Estrela (Av. Oswaldo da Silva),"Ponto de coleta para descarte correto de lâmpadas, contribuindo para a redução de resíduos perigosos e a promoção da reciclagem.",Consultar local ou site da empresa.,supermercadosestrela.com.br,"Coleta de resíduos perigosos; Reciclagem de materiais; Redução de contaminação ambiental.","Avenida Oswaldo da Silva, 609",lamp-collection
Supermercados Estrela (Av. Cel. José Soares Marcondes),"Ponto de coleta para descarte correto de lâmpadas, contribuindo para a redução de resíduos perigosos e a promoção da reciclagem.",Consultar local ou site da empresa.,supermercadosestrela.com.br,"Coleta de resíduos perigosos; Reciclagem de materiais; Redução de contaminação ambiental.","Avenida Coronel José Soares Marcondes, 1750",lamp-collection
Telhanorte,"Ponto de coleta para descarte correto de lâmpadas, contribuindo para a redução de resíduos perigosos e a promoção da reciclagem.",Consultar local ou site da empresa.,telhanorte.com.br,"Coleta de resíduos perigosos; Reciclagem de materiais; Redução de contaminação ambiental.","Avenida Manoel Goulart, 3560",lamp-collection
WY Materiais Elétricos,"Ponto de coleta para descarte correto de lâmpadas, contribuindo para a redução de resíduos perigosos e a promoção da reciclagem.","(18) 3907-2700",Não informado,"Coleta de resíduos perigosos; Reciclagem de materiais; Redução de contaminação ambiental.","Avenida Coronel José Soares Marcondes, 3255",lamp-collection
Braçofer,"Ponto de coleta para descarte correto de lâmpadas, contribuindo para a redução de resíduos perigosos e a promoção da reciclagem.","(18) 3903-8888",Não informado,"Coleta de resíduos perigosos; Reciclagem de materiais; Redução de contaminação ambiental.","R. Mariano Arenales Benito, 1001 - Dist. Industrial",lamp-collection
Kalunga,"Ponto de coleta para descarte correto de lâmpadas, contribuindo para a redução de resíduos perigosos e a promoção da reciclagem.",Consultar local ou site da empresa.,kalunga.com.br,"Coleta de resíduos perigosos; Reciclagem de materiais; Redução de contaminação ambiental.","Av. Manoel Goulart, 1428 - Vila Santa Helena",lamp-collection
Supermercado Amigão,"Ponto de coleta para descarte correto de lâmpadas, contribuindo para a redução de resíduos perigosos e a promoção da reciclagem.",Consultar local ou site da empresa.,supermercadoamigao.com.br,"Coleta de resíduos perigosos; Reciclagem de materiais; Redução de contaminação ambiental.","Av. Joaquim Constantino, 1896 - Vl. Formosa",lamp-collection`;

  const handleLoadDefaultData = () => {
    setCsvInput(defaultCsvData);
  };

  const handleImportCSV = async () => {
    if (!user?.isAdmin) {
      alert('Apenas administradores podem importar dados CSV.');
      return;
    }

    if (!csvInput.trim()) {
      alert('Por favor, insira os dados CSV antes de importar.');
      return;
    }

    const result = await processCSVData(csvInput.trim());
    setImportResult(result);
  };

  if (!user?.isAdmin) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Importação CSV
          </CardTitle>
          <CardDescription>
            Acesso restrito para administradores
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Importação de Dados CSV - Pontos de Coleta
        </CardTitle>
        <CardDescription>
          Cole os dados CSV no formato correto e importe para o banco de dados
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-sm text-muted-foreground">
          <p>Formato esperado do CSV:</p>
          <ul className="list-disc list-inside mt-2 space-y-1">
            <li>Cabeçalho: Nome,Descrição,Contato,WebSite,Impacto,Endereço,Tipo</li>
            <li>Campos obrigatórios: Nome, Endereço, Tipo</li>
            <li>Tipos válidos: lamp-collection, recycling-point, recycling-center, etc.</li>
          </ul>
        </div>

        <div className="bg-muted p-3 rounded text-xs">
          <p className="font-medium mb-1">Mapeamento de Campos:</p>
          <div className="grid grid-cols-2 gap-1">
            <span>Nome → name</span>
            <span>Descrição → description</span>
            <span>Contato → contact</span>
            <span>WebSite → website</span>
            <span>Impacto → impact</span>
            <span>Endereço → address</span>
            <span>Tipo → type</span>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="csvInput">Dados CSV:</Label>
          <Textarea
            id="csvInput"
            placeholder="Cole seus dados CSV aqui..."
            value={csvInput}
            onChange={(e) => setCsvInput(e.target.value)}
            className="min-h-[200px] font-mono text-sm"
          />
          <div className="flex gap-2">
            <Button 
              variant="outline"
              onClick={handleLoadDefaultData}
              size="sm"
            >
              Carregar Dados Exemplo
            </Button>
            <Button 
              variant="outline"
              onClick={() => setCsvInput('')}
              size="sm"
            >
              Limpar
            </Button>
          </div>
        </div>

        <Button 
          onClick={handleImportCSV} 
          disabled={isProcessing || !csvInput.trim()}
          className="w-full"
        >
          <Upload className="h-4 w-4 mr-2" />
          {isProcessing ? 'Importando...' : 'Importar Dados CSV'}
        </Button>

        {importResult && (
          <div className="space-y-2">
            {importResult.success && (
              <Alert>
                <CheckCircle className="h-4 w-4" />
                <AlertDescription>
                  Importação concluída! {importResult.successCount} pontos importados com sucesso.
                  {importResult.errorCount > 0 && ` ${importResult.errorCount} erro(s) encontrado(s).`}
                </AlertDescription>
              </Alert>
            )}

            {!importResult.success && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  Falha na importação. {importResult.errorCount} erro(s) encontrado(s).
                </AlertDescription>
              </Alert>
            )}

            {importResult.errors.length > 0 && (
              <div className="text-xs bg-muted p-2 rounded max-h-32 overflow-y-auto">
                <p className="font-medium mb-1">Erros detalhados:</p>
                {importResult.errors.slice(0, 10).map((error, index) => (
                  <p key={index} className="text-red-600">{error}</p>
                ))}
                {importResult.errors.length > 10 && (
                  <p className="text-muted-foreground">... e mais {importResult.errors.length - 10} erro(s)</p>
                )}
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
