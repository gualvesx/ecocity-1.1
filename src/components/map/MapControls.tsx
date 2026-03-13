import { Plus, X, Shield, Maximize } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { MapSearchBar } from './MapSearchBar';
import { MapFilterMenu } from './MapFilterMenu';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

interface MapControlsProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  filter: string;
  setFilter: (filter: string) => void;
  isFilterOpen: boolean;
  setIsFilterOpen: (isOpen: boolean) => void;
  isAddingPoint: boolean;
  toggleAddingPoint: () => void;
}

export const MapControls = ({
  searchQuery,
  setSearchQuery,
  filter,
  setFilter,
  isFilterOpen,
  setIsFilterOpen,
  isAddingPoint,
  toggleAddingPoint
}: MapControlsProps) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  return (
    <div className="absolute top-4 left-4 right-4 z-20 flex flex-col md:flex-row gap-2">
      <MapSearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
      
      <MapFilterMenu
        filter={filter}
        setFilter={setFilter}
        isFilterOpen={isFilterOpen}
        setIsFilterOpen={setIsFilterOpen}
      />
      
      {user?.isAdmin && (
        <Button 
          onClick={toggleAddingPoint}
          className={cn(
            "gap-1 py-2",
            isAddingPoint ? "bg-red-500 hover:bg-red-600" : "bg-eco-green hover:bg-eco-green-dark"
          )}
        >
          {isAddingPoint ? (
            <>
              <X size={16} />
              <span>Cancelar</span>
            </>
          ) : (
            <>
              <Plus size={16} />
              <span>Adicionar Ponto</span>
            </>
          )}
        </Button>
      )}
      
      {user?.isAdmin && (
        <Button 
          onClick={() => navigate('/admin-dashboard')}
          className="gap-1 py-2 bg-eco-brown hover:bg-eco-brown/80"
        >
          <Shield size={16} />
          <span>Painel Admin</span>
        </Button>
      )}
    </div>
  );
};
