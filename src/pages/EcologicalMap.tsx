import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin, Plus, ListFilter, Maximize, Upload, X, RefreshCw } from 'lucide-react';
import MapaEco from '@/components/EcoMap';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/contexts/AuthContext';
import { RequestPointForm } from '@/components/map/RequestPointForm';
import { CSVImportTool } from '@/components/admin/CSVImportTool';
import { useIsMobile } from '@/hooks/use-mobile';
import { useCSVUpdater } from '@/hooks/useCSVUpdater';

const MapaEcologico = () => {
  const { t } = useLanguage();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [showRequestForm, setShowRequestForm] = useState(false);
  const [showCSVImport, setShowCSVImport] = useState(false);
  const { updatePointsFromCSV, isProcessing: isUpdatingCSV } = useCSVUpdater();
  const isMobile = useIsMobile();

  useEffect(() => {
    if (isMobile) {
      navigate('/MapaTelaCheia');
    }
  }, [isMobile, navigate]);

  const handleFullscreenClick = () => {
    navigate('/MapaTelaCheia');
  };

  const handleCSVUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.name.toLowerCase().endsWith('.csv')) {
      alert('Por favor, selecione um arquivo CSV válido.');
      return;
    }

    try {
      const text = await file.text();
      await updatePointsFromCSV(text);
    } catch (error) {
      console.error('Erro ao processar CSV:', error);
    } finally {
      event.target.value = '';
    }
  };
  
  return (
    <div className="min-h-screen flex flex-col pt-20">
      <div className="container px-4 py-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <Link to="/" className="inline-flex items-center gap-1 text-muted-foreground hover:text-foreground mb-4">
              <ArrowLeft className="h-4 w-4" />
              <span>Voltar ao início</span>
            </Link>
            <h1 className="text-3xl md:text-4xl font-bold text-eco-green-dark">Mapa Ecológico de Presidente Prudente</h1>
            <p className="text-lg text-muted-foreground mt-2">
              Descubra iniciativas ambientais e pontos de coleta em sua comunidade
            </p>
          </div>
        </div>
        
        <div className="flex justify-end gap-2 mb-4 flex-wrap">
          <Button 
            onClick={() => setShowRequestForm(true)} 
            className="bg-eco-green hover:bg-eco-green-dark"
          >
            <Plus className="mr-2 h-4 w-4" />
            Solicitar Novo Ponto
          </Button>
          
          <Link to="/map-summary">
            <Button className="bg-eco-green hover:bg-eco-green-dark">
              <ListFilter className="mr-2 h-4 w-4" />
              Ver Sumário dos Pontos
            </Button>
          </Link>

          <Button 
            onClick={handleFullscreenClick}
            className="gap-1 py-2 bg-eco-green hover:bg-eco-green-dark"
          >
            <Maximize size={16} />
            <span>Tela Cheia</span>
          </Button>
          
          {user?.isAdmin && (
            <>
              <Link to="/admin-dashboard">
                <Button variant="outline">
                  <MapPin className="mr-2 h-4 w-4" />
                  Gerenciar Solicitações
                </Button>
              </Link>
              
              <Button 
                onClick={() => setShowCSVImport(true)}
                variant="outline"
                className="border-eco-green text-eco-green hover:bg-eco-green hover:text-white"
              >
                <Upload className="mr-2 h-4 w-4" />
                Importar CSV
              </Button>

              <div>
                <Input
                  type="file"
                  accept=".csv,text/csv"
                  onChange={handleCSVUpload}
                  className="hidden"
                  id="map-csv-upload"
                  disabled={isUpdatingCSV}
                />
                <Button 
                  variant="outline" 
                  onClick={() => document.getElementById('map-csv-upload')?.click()}
                  disabled={isUpdatingCSV}
                  className="border-eco-green text-eco-green hover:bg-eco-green hover:text-white"
                >
                  <RefreshCw className="mr-2 h-4 w-4" />
                  {isUpdatingCSV ? 'Atualizando...' : 'Atualizar CSV'}
                </Button>
              </div>
            </>
          )}
        </div>
        
        <div className={`bg-white rounded-xl shadow-xl overflow-hidden mb-8 ${isMobile ? 'max-w-[90vw] mx-auto' : ''}`}>
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-eco-green/5 to-eco-blue/5 opacity-40 pointer-events-none rounded-xl"></div>
            <div className="absolute inset-0 shadow-inner pointer-events-none rounded-xl"></div>
            <MapaEco />
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6 mb-12">
          <div className="bg-white rounded-xl shadow-md p-6 border-t-4 border-eco-green">
            <h3 className="font-semibold text-lg mb-2">{t('Ponto de Coleta de Recicláveis')}</h3>
            <p className="text-muted-foreground text-sm mb-4">
              {t('Pontos com objetivo de coletar recicláveis diversos.')}
            </p>
            <div className="flex items-center gap-2 text-sm text-eco-green">
              <div className="w-3 h-3 rounded-full bg-eco-green"></div>
              <span>Marcadores verdes no mapa</span>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-md p-6 border-t-4 border-eco-blue">
            <h3 className="font-semibold text-lg mb-2">{t('Pontos de Coleta de Lixo Eletrônico')}</h3>
            <p className="text-muted-foreground text-sm mb-4">
              {t('Pontos com objetivo de coletar lixo eletrônico.')}
            </p>
            <div className="flex items-center gap-2 text-sm text-eco-blue">
              <div className="w-3 h-3 rounded-full bg-eco-blue"></div>
              <span>Marcadores azuis no mapa</span>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-md p-6 border-t-4 border-eco-brown">
            <h3 className="font-semibold text-lg mb-2">{t('Pontos de Distribuição de Mudas')}</h3>
            <p className="text-muted-foreground text-sm mb-4">
              {t('Pontos com objetivo de distribuir mudas.')}
            </p>
            <div className="flex items-center gap-2 text-sm text-eco-brown">
              <div className="w-3 h-3 rounded-full bg-eco-brown"></div>
              <span>Marcadores marrons no mapa</span>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-md p-6 border-t-4 border-green-600">
            <h3 className="font-semibold text-lg mb-2">Venda de Mudas</h3>
            <p className="text-muted-foreground text-sm mb-4">
              Pontos comerciais para compra de mudas e plantas.
            </p>
            <div className="flex items-center gap-2 text-sm text-green-600">
              <div className="w-3 h-3 rounded-full bg-green-600"></div>
              <span>Marcadores verde escuro no mapa</span>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-md p-6 border-t-4 border-yellow-500">
            <h3 className="font-semibold text-lg mb-2">Coleta de Lâmpadas</h3>
            <p className="text-muted-foreground text-sm mb-4">
              Pontos de coleta para descarte correto de lâmpadas.
            </p>
            <div className="flex items-center gap-2 text-sm text-yellow-500">
              <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
              <span>Marcadores amarelos no mapa</span>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-md overflow-hidden mb-12">
          <div className="grid grid-cols-1 lg:grid-cols-5">
            <div className="p-8 lg:col-span-3">
              <h2 className="text-2xl font-bold mb-4 text-eco-green-dark">
                Contribua com o Mapa Ecológico
              </h2>
              <p className="text-muted-foreground mb-6">
                Compartilhe suas descobertas ecológicas! Solicite a adição de novos pontos clicando no botão <span className="inline-flex items-center gap-1 bg-eco-green text-white rounded px-2 py-0.5 text-xs"><Plus size={12} /> Solicitar Novo Ponto</span> e preencha as informações solicitadas. Um administrador irá revisar sua solicitação.
              </p>
              <div className="flex items-center gap-2 text-eco-green font-medium">
                <MapPin className="h-5 w-5" />
                <span>Juntos construímos um mapa mais completo da nossa ecologia local!</span>
              </div>
            </div>
            <div className="lg:col-span-2 bg-eco-sand p-8 flex items-center justify-center">
              <div className="max-w-xs">
                <div className="text-4xl font-bold text-eco-green-dark mb-2">EcoCity em Ação!</div>
                <p className="text-lg">Apoie essa causa!</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {showRequestForm && (
        <RequestPointForm onClose={() => setShowRequestForm(false)} />
      )}
      
      {showCSVImport && user?.isAdmin && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold">Importar Dados CSV</h3>
                <Button variant="outline" onClick={() => setShowCSVImport(false)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <CSVImportTool />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MapaEcologico;
