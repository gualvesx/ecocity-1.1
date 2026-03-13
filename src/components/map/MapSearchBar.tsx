
import { Search } from 'lucide-react';

interface MapSearchBarProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export const MapSearchBar = ({ searchQuery, setSearchQuery }: MapSearchBarProps) => {
  return (
    <div className="relative flex-grow">
      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
        <Search className="h-4 w-4 text-muted-foreground" />
      </div>
      <input
        type="text"
        placeholder="Buscar pontos ecológicos..."
        className="w-full pl-10 py-2 pr-4 bg-white/90 backdrop-blur-sm rounded-md shadow-sm border border-gray-200 focus:outline-none focus:ring-2 focus:ring-eco-green/50"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
    </div>
  );
};
