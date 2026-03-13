import { MapPin, Recycle, TreeDeciduous, BarChart } from 'lucide-react';
import { Link } from 'react-router-dom';
import { DataCard } from './DataCard';
import { useLanguage } from '@/contexts/LanguageContext';

interface DataItem {
  icon: any;
  titleKey: string;
  descKey: string;
}

export const MapDataSection = () => {
  const { t } = useLanguage();
  
  const dataCards: DataItem[] = [
    { icon: <MapPin />, titleKey: "recycle-points", descKey: "recycle-points-desc" },
    { icon: <Recycle />, titleKey: "electronic-points", descKey: "electronic-points-desc" },
    { icon: <TreeDeciduous />, titleKey: "seedling-points", descKey: "seedling-points-desc" },
    { icon: <BarChart />, titleKey: "mapping-results", descKey: "mapping-results-desc" }
  ];
  
  return (
    <section className="py-16 bg-eco-sand/30">
      <div className="container px-4 md:px-6">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl font-bold mb-4 text-eco-green-dark">{t('map-data-title')}</h2>
          <p className="text-lg text-muted-foreground">{t('map-data-subtitle')}</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {dataCards.map((card, index) => (
            <DataCard 
              key={index} // Use index as the key
              icon={card.icon} 
              title={t(card.titleKey)} 
              description={t(card.descKey)} 
            />
          ))}
        </div>
        
        <div className="mt-16 text-center">
          <Link 
            to="/map" 
            className="inline-flex items-center gap-2 bg-eco-green px-6 py-3 rounded-md text-white font-medium shadow-sm hover:bg-eco-green-dark transition-colors"
          >
            {t('explore-map')}
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"></path><path d="m12 5 7 7-7 7"></path></svg>
          </Link>
        </div>
      </div>
    </section>
  );
};
