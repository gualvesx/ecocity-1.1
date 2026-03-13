import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, CalendarPlus, MapPin, Send, Shield, Edit, Upload, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { EventForm } from '@/components/events/EventForm';
import { EventList } from '@/components/events/EventList';
import { EventRequests } from '@/components/events/EventRequests';
import { CSVImportEvents } from '@/components/events/CSVImportEvents';
import EventMap from '@/components/events/EventMap';
import { useIsMobile } from '@/hooks/use-mobile';
import { MyEventRequests } from '@/components/events/MyEventRequests';
import { useEditableEvents } from '@/hooks/useEditableEvents';
import { useCSVUpdater } from '@/hooks/useCSVUpdater';
import { cn } from '@/lib/utils';

const Events = () => {
  const { t } = useLanguage();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<string>("eventos");
  const isMobile = useIsMobile();
  const { editingEvent, startEditing, cancelEditing } = useEditableEvents();
  const { updatePointsFromCSV, isProcessing: isUpdatingCSV } = useCSVUpdater();
  const [showEditForm, setShowEditForm] = useState(false);
  const [showCSVImport, setShowCSVImport] = useState(false);
  
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
            <h1 className="text-3xl md:text-4xl font-bold text-eco-green-dark">Eventos Ecológicos</h1>
            <p className="text-lg text-muted-foreground mt-2">
              Fique por dentro dos eventos ecológicos na cidade e região
            </p>
          </div>
          
          <div className="flex gap-2">
            {user?.isAdmin && (
              <>
                <Button
                  onClick={() => setActiveTab("adicionar")}
                  className="bg-eco-green hover:bg-eco-green-dark"
                >
                  <CalendarPlus className="mr-2 h-5 w-5" />
                  Adicionar Evento
                </Button>
                
                <Button 
                  variant="outline" 
                  onClick={() => setShowCSVImport(true)}
                  className="border-eco-green text-eco-green hover:bg-eco-green hover:text-white"
                >
                  <FileText className="mr-2 h-4 w-4" />
                  Importar CSV
                </Button>
                
                <div>
                  <Input
                    type="file"
                    accept=".csv,text/csv"
                    onChange={handleCSVUpload}
                    className="hidden"
                    id="events-csv-upload"
                    disabled={isUpdatingCSV}
                  />
                  <Button 
                    variant="outline" 
                    onClick={() => document.getElementById('events-csv-upload')?.click()}
                    disabled={isUpdatingCSV}
                    className="border-eco-green text-eco-green hover:bg-eco-green hover:text-white"
                  >
                    <Upload className="mr-2 h-4 w-4" />
                    {isUpdatingCSV ? 'Atualizando...' : 'Atualizar CSV'}
                  </Button>
                </div>
              </>
            )}
          </div>
        </div>
        
        {showCSVImport && (
          <CSVImportEvents onClose={() => setShowCSVImport(false)} />
        )}
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <div className="overflow-x-auto -mx-4 px-4">
            <TabsList className={cn(
              "grid w-full",
              user?.isAdmin 
                ? (isMobile ? "grid-cols-5 min-w-[600px]" : "grid-cols-5") 
                : (isMobile ? "grid-cols-3 min-w-[500px]" : "grid-cols-3")
            )}>
              <TabsTrigger value="eventos">
                <CalendarPlus className="mr-2 h-4 w-4" />
                Eventos
              </TabsTrigger>
              <TabsTrigger value="mapa">
                <MapPin className="mr-2 h-4 w-4" />
                Mapa
              </TabsTrigger>
              <TabsTrigger value="solicitar">
                <Send className="mr-2 h-4 w-4" />
                Solicitar
              </TabsTrigger>
              {user?.isAdmin && (
                <>
                  <TabsTrigger value="adicionar">
                    <Shield className="mr-2 h-4 w-4" />
                    Admin
                  </TabsTrigger>
                  <TabsTrigger value="editar">
                    <Edit className="mr-2 h-4 w-4" />
                    Editar
                  </TabsTrigger>
                </>
              )}
            </TabsList>
          </div>
          
          <TabsContent value="eventos" className="space-y-4">
            <EventList />
          </TabsContent>
          
          <TabsContent value="mapa" className="space-y-4">
            <Card className="p-0 overflow-hidden">
              <EventMap /> 
            </Card>
          </TabsContent>
          
          <TabsContent value="solicitar" className="space-y-4">
            <Card className="p-6">
              <h2 className="text-2xl font-semibold mb-4">Solicite a Adição de um Evento</h2>
              <p className="text-muted-foreground mb-6">
                Preencha o formulário abaixo para solicitar a adição de um evento ecológico. 
                Nossa equipe irá revisar e aprovar sua solicitação em breve.
              </p>
              <EventForm isRequest={true} />
            </Card>
            
            {user && (
              <Card className="p-6">
                <MyEventRequests />
              </Card>
            )}
          </TabsContent>
          
          {user?.isAdmin && (
            <>
              <TabsContent value="adicionar" className="space-y-4">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card className="p-6">
                    <h2 className="text-2xl font-semibold mb-4">Adicionar Novo Evento</h2>
                    <p className="text-muted-foreground mb-6">
                      Como administrador, você pode adicionar eventos diretamente ao mapa e à lista.
                    </p>
                    <EventForm isRequest={false} isAdmin={true} />
                  </Card>
                  
                  <Card className="p-6">
                    <h2 className="text-2xl font-semibold mb-4">Solicitações de Eventos</h2>
                    <p className="text-muted-foreground mb-6">
                      Gerencie as solicitações de eventos enviadas pelos usuários.
                    </p>
                    <EventRequests />
                  </Card>
                </div>
              </TabsContent>
              
              <TabsContent value="editar" className="space-y-4">
                <Card className="p-6">
                  <h2 className="text-2xl font-semibold mb-4">Editar Eventos Existentes</h2>
                  <p className="text-muted-foreground mb-6">
                    Selecione um evento da lista para editar suas informações.
                  </p>
                  {showEditForm && editingEvent ? (
                    <EventForm 
                      isRequest={false} 
                      isAdmin={true} 
                      eventToEdit={editingEvent}
                      onCancel={() => {
                        setShowEditForm(false);
                        cancelEditing();
                      }}
                    />
                  ) : (
                    <EventList 
                      showEditOptions={true}
                      onEditEvent={(event) => {
                        startEditing(event);
                        setShowEditForm(true);
                      }}
                    />
                  )}
                </Card>
              </TabsContent>
            </>
          )}
        </Tabs>
      </div>
    </div>
  );
};

export default Events;
