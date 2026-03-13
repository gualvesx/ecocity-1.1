
import { useLanguage } from '@/contexts/LanguageContext';

export const TimelineSection = () => {
  const { t } = useLanguage();
  
  const timelineEvents = [
    { title: 'project-launch', desc: 'launch-description', milestone: 'launch-milestone' },
    { title: 'community-expansion', desc: 'expansion-description', milestone: 'expansion-milestone' },
    { title: 'data-driven', desc: 'data-description', milestone: 'data-milestone' },
  ];

  return (
    <div className="mb-16">
      <h2 className="text-2xl font-bold text-eco-green-dark mb-8">{t('our-journey')}</h2>
      <div className="relative border-l-2 border-eco-green-dark pl-8 pb-8 ml-4">
        {timelineEvents.map((event, index) => (
          <div key={event.title} className={`${index !== timelineEvents.length - 1 ? 'mb-12' : ''} relative`}>
            <div className="absolute w-6 h-6 bg-eco-green-dark rounded-full -left-11 border-4 border-white"></div>
            <div className="bg-white rounded-xl shadow-md p-6">
              <h3 className="font-semibold text-lg mb-1">{t(event.title)}</h3>
              <p className="text-sm text-muted-foreground mb-4">{t(event.desc)}</p>
              <div className="bg-eco-sand/50 rounded p-3 text-sm">
                <span className="font-medium">Milestone:</span> {t(event.milestone)}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
