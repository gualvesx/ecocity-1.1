
import { Filter } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/contexts/LanguageContext';

interface MapFilterMenuProps {
  filter: string;
  setFilter: (filter: string) => void;
  isFilterOpen: boolean;
  setIsFilterOpen: (isOpen: boolean) => void;
}

export const MapFilterMenu = ({ 
  filter, 
  setFilter, 
  isFilterOpen, 
  setIsFilterOpen 
}: MapFilterMenuProps) => {
  const { t } = useLanguage();

  const handleFilterChange = (newFilter: string) => {
    setFilter(newFilter);
    setIsFilterOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsFilterOpen(!isFilterOpen)}
        className="flex items-center gap-2 py-2 px-4 bg-white/90 backdrop-blur-sm rounded-md shadow-sm border border-gray-200 hover:bg-eco-green-light/10"
      >
        <Filter className="h-4 w-4" />
        <span>Filtrar</span>
      </button>
      
      {isFilterOpen && (
        <div className="absolute top-full right-0 mt-2 w-48 bg-white rounded-md shadow-lg overflow-hidden z-30">
          <div className="p-2">
            <button
              onClick={() => handleFilterChange('all')}
              className={cn(
                "w-full text-left px-3 py-2 rounded-md",
                filter === 'all' ? "bg-eco-green-light/20 text-eco-green-dark" : "hover:bg-eco-green-light/10"
              )}
            >
              Todos os Pontos
            </button>
            
            <button
              onClick={() => handleFilterChange('recycling-point')}
              className={cn(
                "w-full text-left px-3 py-2 rounded-md flex items-center gap-2",
                filter === 'recycling-point' ? "bg-eco-green-light/20 text-eco-green-dark" : "hover:bg-eco-green-light/10"
              )}
            >
              <div className="w-3 h-3 rounded-full bg-eco-green"></div>
              Ponto Reciclagem
            </button>
            
            <button
              onClick={() => handleFilterChange('recycling-center')}
              className={cn(
                "w-full text-left px-3 py-2 rounded-md flex items-center gap-2",
                filter === 'recycling-center' ? "bg-eco-green-light/20 text-eco-green-dark" : "hover:bg-eco-green-light/10"
              )}
            >
              <div className="w-3 h-3 rounded-full bg-eco-blue"></div>
              Ponto Lixo Eletrônico
            </button>
            
            <button
              onClick={() => handleFilterChange('seedling-distribution')}
              className={cn(
                "w-full text-left px-3 py-2 rounded-md flex items-center gap-2",
                filter === 'seedling-distribution' ? "bg-eco-green-light/20 text-eco-green-dark" : "hover:bg-eco-green-light/10"
              )}
            >
              <div className="w-3 h-3 rounded-full bg-eco-brown"></div>
              Ponto Distribuição de Mudas
            </button>

            <button
              onClick={() => handleFilterChange('plant-sales')}
              className={cn(
                "w-full text-left px-3 py-2 rounded-md flex items-center gap-2",
                filter === 'plant-sales' ? "bg-eco-green-light/20 text-eco-green-dark" : "hover:bg-eco-green-light/10"
              )}
            >
              <div className="w-3 h-3 rounded-full bg-green-600"></div>
              Venda de Mudas
            </button>

            <button
              onClick={() => handleFilterChange('lamp-collection')}
              className={cn(
                "w-full text-left px-3 py-2 rounded-md flex items-center gap-2",
                filter === 'lamp-collection' ? "bg-eco-green-light/20 text-eco-green-dark" : "hover:bg-eco-green-light/10"
              )}
            >
              <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
              Coleta de Lâmpadas
            </button>

            <button
              onClick={() => handleFilterChange('oil-collection')}
              className={cn(
                "w-full text-left px-3 py-2 rounded-md flex items-center gap-2",
                filter === 'oil-collection' ? "bg-eco-green-light/20 text-eco-green-dark" : "hover:bg-eco-green-light/10"
              )}
            >
              <div className="w-3 h-3 rounded-full bg-orange-500"></div>
              Coleta de Óleo
            </button>

            <button
              onClick={() => handleFilterChange('medicine-collection')}
              className={cn(
                "w-full text-left px-3 py-2 rounded-md flex items-center gap-2",
                filter === 'medicine-collection' ? "bg-eco-green-light/20 text-eco-green-dark" : "hover:bg-eco-green-light/10"
              )}
            >
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              Coleta de Cartela de Remédio
            </button>

            <button
              onClick={() => handleFilterChange('electronics-donation')}
              className={cn(
                "w-full text-left px-3 py-2 rounded-md flex items-center gap-2",
                filter === 'electronics-donation' ? "bg-eco-green-light/20 text-eco-green-dark" : "hover:bg-eco-green-light/10"
              )}
            >
              <div className="w-3 h-3 rounded-full bg-blue-600"></div>
              Doação de Eletrônicos
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
