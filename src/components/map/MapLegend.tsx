
import { useLanguage } from '@/contexts/LanguageContext';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from "@/lib/utils";
import { ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';

export const MapLegend = () => {
  const { t } = useLanguage();
  const isMobile = useIsMobile();
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <div className={cn(
      "absolute bottom-4 left-4 z-20",
      isMobile ? "max-w-[calc(100%-2rem)]" : ""
    )}>
      <div className={cn(
        "bg-white/90 backdrop-blur-sm rounded-md shadow-md border border-eco-green-light/30 transition-all duration-300",
        isMobile ? "text-xs" : ""
      )}>
        {/* Header with expand/collapse button */}
        <div className="flex items-center justify-between p-3 border-b border-eco-green-light/20">
          <h4 className="text-sm font-medium">Legenda</h4>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1 hover:bg-eco-green-light/10 rounded transition-colors"
            title={isExpanded ? "Ocultar legenda" : "Mostrar legenda"}
          >
            {isExpanded ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </button>
        </div>

        {/* Legend content */}
        {isExpanded && (
          <div className="p-3 space-y-2 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-eco-green shadow-sm flex-shrink-0"></div>
              <span className="line-clamp-2">{t('Ponto Reciclagem')}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-eco-blue shadow-sm flex-shrink-0"></div>
              <span className="line-clamp-2">{t('Ponto Lixo Eletrônico')}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-eco-brown shadow-sm flex-shrink-0"></div>
              <span className="line-clamp-2">{t('Ponto Distribuição de Mudas')}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-green-600 shadow-sm flex-shrink-0"></div>
              <span className="line-clamp-2">Venda de Mudas</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-yellow-500 shadow-sm flex-shrink-0"></div>
              <span className="line-clamp-2">Coleta de Lâmpadas</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-orange-500 shadow-sm flex-shrink-0"></div>
              <span className="line-clamp-2">Coleta de Óleo</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500 shadow-sm flex-shrink-0"></div>
              <span className="line-clamp-2">Coleta de Cartela de Remédio</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-blue-600 shadow-sm flex-shrink-0"></div>
              <span className="line-clamp-2">Doação de Eletrônicos</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
