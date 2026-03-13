
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import EventMap from '@/components/events/EventMap';
import { useIsMobile } from '@/hooks/use-mobile';

const EventMapTelaCheia = () => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  
  const handleBackClick = () => {
    if (isMobile) {
      navigate('/');
    } else {
      navigate('/events');
    }
  };
  
  return (
    <div className="fixed inset-0 bg-white overflow-hidden" style={{ zIndex: 9998 }}>
      {/* Botão Voltar - com z-index muito alto para ficar sempre visível */}
      <div className="absolute top-16 left-4" style={{ zIndex: 9999 }}>
        <Button
          onClick={handleBackClick}
          variant="outline"
          className="bg-white shadow-lg hover:bg-gray-100 border-2"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          <span>Voltar</span>
        </Button>
      </div>
      
      {/* Mapa - ocupando 100% da altura e largura */}
      <div className="absolute inset-0 h-full w-full">
        <EventMap />
      </div>
    </div>
  );
};

export default EventMapTelaCheia;
