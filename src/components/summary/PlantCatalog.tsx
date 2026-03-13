import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Plus, Search, Leaf, Calendar, User, Edit, Trash2, Upload, FileText } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { AddPlantForm } from './AddPlantForm';
import { CSVImportPlants } from './CSVImportPlants';
import { useEditablePlants } from '@/hooks/useEditablePlants';
import { format, isValid } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useCSVUpdater } from '@/hooks/useCSVUpdater';

export const PlantCatalog = () => {
  const { user } = useAuth();
  const { 
    plants, 
    isLoading, 
    addPlant, 
    updatePlant, 
    deletePlant,
    editingPlant,
    startEditing,
    cancelEditing
  } = useEditablePlants();
  const { updatePointsFromCSV, isProcessing: isUpdatingCSV } = useCSVUpdater();
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [showCSVImport, setShowCSVImport] = useState(false);

  const filteredPlants = plants.filter(plant =>
    plant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    plant.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddPlant = async (plantData: { name: string; description: string; imageURL: string }) => {
    const success = await addPlant(plantData);
    if (success) {
      setShowAddForm(false);
    }
  };

  const handleUpdatePlant = async (plantData: { name: string; description: string; imageURL: string }) => {
    if (!editingPlant) return;
    
    const success = await updatePlant(editingPlant.id, plantData);
    if (success) {
      cancelEditing();
      setShowAddForm(false);
    }
  };

  const handleEditPlant = (plant: any) => {
    startEditing(plant);
    setShowAddForm(true);
  };

  const handleDeletePlant = async (plantId: string) => {
    if (window.confirm('Tem certeza que deseja excluir esta planta?')) {
      await deletePlant(plantId);
    }
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

  const handleCancelForm = () => {
    setShowAddForm(false);
    cancelEditing();
  };

  const formatPlantDate = (dateString: string) => {
    try {
      if (!dateString) return 'Data não disponível';
      
      const date = new Date(dateString);
      
      if (!isValid(date)) {
        console.warn('Invalid date:', dateString);
        return 'Data inválida';
      }
      
      return format(date, "d 'de' MMM 'de' yyyy", { locale: ptBR });
    } catch (error) {
      console.error('Error formatting date:', error, 'for date:', dateString);
      return 'Data não disponível';
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-60">
        <div className="w-12 h-12 border-4 border-eco-green border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4 justify-between">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Buscar plantas por nome ou descrição..."
            className="pl-9"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="flex gap-2">
          {user && (
            <>
              <Button 
                onClick={() => {
                  cancelEditing();
                  setShowAddForm(true);
                }} 
                className="bg-eco-green hover:bg-eco-green-dark"
              >
                <Plus className="mr-2 h-4 w-4" />
                Adicionar Planta
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
                  id="plants-csv-upload"
                  disabled={isUpdatingCSV}
                />
                <Button 
                  variant="outline" 
                  onClick={() => document.getElementById('plants-csv-upload')?.click()}
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

      {showAddForm && (
        <AddPlantForm 
          plant={editingPlant}
          onSubmit={editingPlant ? handleUpdatePlant : handleAddPlant}
          onCancel={handleCancelForm}
        />
      )}

      {showCSVImport && (
        <CSVImportPlants onClose={() => setShowCSVImport(false)} />
      )}

      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-eco-green-dark mb-2">
          Catálogo de Plantas do Horto Florestal
        </h2>
        <p className="text-muted-foreground">
          Presidente Prudente - SP
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPlants.map((plant) => (
          <Card key={plant.id} className="overflow-hidden hover:shadow-lg transition-shadow">
            {plant.imageURL && (
              <div className="relative h-48 overflow-hidden">
                <img 
                  src={plant.imageURL} 
                  alt={plant.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-3 left-3">
                  <Badge className="bg-eco-green hover:bg-eco-green-dark text-white">
                    <Leaf className="mr-1 h-3 w-3" />
                    Horto Florestal
                  </Badge>
                </div>
                {user && (
                  <div className="absolute top-3 right-3 flex gap-1">
                    <Button
                      size="sm"
                      variant="secondary"
                      className="h-8 w-8 p-0"
                      onClick={() => handleEditPlant(plant)}
                    >
                      <Edit className="h-3 w-3" />
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      className="h-8 w-8 p-0"
                      onClick={() => handleDeletePlant(plant.id)}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                )}
              </div>
            )}
            
            <CardHeader>
              <div className="flex items-start justify-between">
                <CardTitle className="text-lg text-eco-green-dark flex-1">{plant.name}</CardTitle>
                {user && !plant.imageURL && (
                  <div className="flex gap-1">
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-8 w-8 p-0"
                      onClick={() => handleEditPlant(plant)}
                    >
                      <Edit className="h-3 w-3" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-8 w-8 p-0 text-red-500 hover:text-red-700"
                      onClick={() => handleDeletePlant(plant.id)}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                )}
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <div className="space-y-1">
                <div className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Descrição</div>
                <p className="text-sm text-muted-foreground">{plant.description}</p>
              </div>

              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <div className="flex items-center gap-1">
                  <User className="h-3 w-3" />
                  <span>{plant.createdBy}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  <span>{formatPlantDate(plant.createdAt)}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredPlants.length === 0 && !isLoading && (
        <div className="text-center py-12">
          <Leaf className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium mb-2">Nenhuma planta encontrada</h3>
          <p className="text-muted-foreground mb-4">
            {searchTerm ? 'Tente ajustar sua busca' : 'Ainda não há plantas cadastradas no catálogo'}
          </p>
          {user && !searchTerm && (
            <Button 
              onClick={() => {
                cancelEditing();
                setShowAddForm(true);
              }}
              className="bg-eco-green hover:bg-eco-green-dark"
            >
              <Plus className="mr-2 h-4 w-4" />
              Adicionar a primeira planta
            </Button>
          )}
        </div>
      )}
    </div>
  );
};
