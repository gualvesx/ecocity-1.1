
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import MapaEco from '@/components/EcoMap';
import { useIsMobile } from '@/hooks/use-mobile';
import { useEffect, useState } from 'react';

const MapaTelaCheia = () => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [isMapReady, setIsMapReady] = useState(false);
  
  const handleBackClick = () => {
    if (isMobile) {
      navigate('/');
    } else {
      navigate('/map');
    }
  };

  // Garantir que o mapa seja renderizado corretamente após o carregamento
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsMapReady(true);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  // Forçar re-renderização quando a tela for redimensionada (mobile rotation)
  useEffect(() => {
    const handleResize = () => {
      // Small delay to ensure proper rendering after resize
      setTimeout(() => {
        window.dispatchEvent(new Event('resize'));
      }, 300);
    };

    window.addEventListener('orientationchange', handleResize);
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('orientationchange', handleResize);
      window.removeEventListener('resize', handleResize);
    };
  }, []);
  
  return (
    <div className="fixed inset-0 bg-white overflow-hidden" style={{ zIndex: 9998 }}>
      {/* Botão Voltar com posicionamento responsivo */}
      <div 
        className={`absolute left-4 ${isMobile ? 'top-28' : 'top-16'}`} 
        style={{ zIndex: 9999 }}
      >
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
        {isMapReady && (
          <MapaEco 
            hideControls={false} 
            fullScreen={true}
            key={`fullscreen-map-${Date.now()}`} // Force re-render with unique key
          />
        )}
      </div>

      {/* Loading overlay para mobile */}
      {!isMapReady && isMobile && (
        <div className="absolute inset-0 bg-white flex items-center justify-center z-10">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-eco-green mx-auto mb-2"></div>
            <p className="text-gray-600">Carregando mapa...</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default MapaTelaCheia;
