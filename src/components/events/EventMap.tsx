
import { useState } from 'react';
import EcoMap from '@/components/EcoMap';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';

const EventMap = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const isMobile = useIsMobile();

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  return (
    <div className="relative">
      <div className={cn(
        "absolute z-10",
        isMobile ? "top-4 left-4 right-4" : "top-4 left-4 right-4"
      )}>
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Buscar eventos no mapa..."
            className="pl-9 bg-white/90 backdrop-blur-sm w-full"
            value={searchQuery}
            onChange={handleSearchChange}
          />
        </div>
      </div>
      
      <div className="h-[70vh] w-full relative rounded-xl overflow-hidden shadow-2xl">
        {/* Add soft gradient overlay for better blending */}
        <div className="absolute inset-0 bg-gradient-to-br from-eco-green/5 to-eco-blue/5 z-0 opacity-70 pointer-events-none"></div>
        <div className="absolute inset-0 shadow-inner pointer-events-none"></div>
        
        <EcoMap hideControls={false} eventMode={true} searchQuery={searchQuery} nonInteractive={false} />
      </div>
    </div>
  );
};

export default EventMap;
