
import { Leaf } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

export const MissionSection = () => {
  const { t } = useLanguage();
  
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
      <div>
        <h2 className="text-2xl font-bold text-eco-green-dark mb-4">{t('our-mission')}</h2>
        <p className="text-lg text-muted-foreground mb-6">
          {t('mission-description')}
        </p>
        <p className="text-lg text-muted-foreground mb-6">
          {t('map-purpose')}
        </p>
        <ul className="space-y-3 mb-6">
          {[1, 2, 3, 4].map((num) => (
            <li key={num} className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-eco-green-light/20 flex items-center justify-center text-eco-green shrink-0 mt-0.5">
                <Leaf size={14} />
              </div>
              <span>{t(`map-goal-${num}`)}</span>
            </li>
          ))}
        </ul>
      </div>
      
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="bg-[url('https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80')] h-64 bg-cover bg-center"></div>
        <div className="p-6">
          <h3 className="font-semibold text-xl mb-3">{t('vision-statement')}</h3>
          <p className="text-muted-foreground">
            {t('vision-description')}
          </p>
          <div className="mt-6 pt-6 border-t border-border">
            <h4 className="font-medium mb-2">{t('core-values')}</h4>
            <div className="grid grid-cols-2 gap-3">
              {['environmental-stewardship', 'community-collaboration', 'education-awareness', 'data-transparency'].map((value) => (
                <div key={value} className="bg-eco-green-light/10 rounded p-3">
                  <span className="font-medium">{t(value)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
