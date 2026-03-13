import { Leaf } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

const DestaquesSustentabilidade = () => {
  const { t } = useLanguage();
  
  return (
    <section className="py-12 bg-eco-sand/20">
      <div className="container px-4 md:px-6">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-3xl font-bold mb-4 text-eco-green-dark">{t('sustainability-highlights')}</h2>
          <p className="text-lg text-muted-foreground">{t('sustainability-highlights-desc')}</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white rounded-xl shadow-md p-6 border-t-4 border-eco-green">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-full bg-eco-green-light/20 flex items-center justify-center text-eco-green-dark">
                <Leaf size={24} />
              </div>
              <div>
                <h3 className="font-semibold text-lg">{t('eco-friendly-initiatives')}</h3>
              </div>
            </div>
            <p className="text-muted-foreground">{t('eco-friendly-initiatives-desc')}</p>
          </div>
          
          <div className="bg-white rounded-xl shadow-md p-6 border-t-4 border-eco-blue">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-full bg-eco-blue/20 flex items-center justify-center text-eco-blue">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-recycle"><path d="M17.38 6.62A7.75 7.75 0 0 0 6.62 6.62l-3 3a1.5 1.5 0 0 0 0 2.12l3 3a7.75 7.75 0 0 0 10.76 0"/><path d="M6.62 17.38A7.75 7.75 0 0 0 17.38 17.38l3-3a1.5 1.5 0 0 0 0-2.12l-3-3a7.75 7.75 0 0 0-10.76 0"/></svg>
              </div>
              <div>
                <h3 className="font-semibold text-lg">{t('recycling-programs')}</h3>
              </div>
            </div>
            <p className="text-muted-foreground">{t('recycling-programs-desc')}</p>
          </div>
          
          <div className="bg-white rounded-xl shadow-md p-6 border-t-4 border-eco-brown">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-full bg-eco-brown/20 flex items-center justify-center text-eco-brown">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-trees"><path d="M3 19h18"/><path d="M6 5a2 2 0 1 1 0 4v4a2 2 0 1 1 0 4"/><path d="M12 5a2 2 0 1 1 0 4v4a2 2 0 1 1 0 4"/><path d="M18 5a2 2 0 1 1 0 4v4a2 2 0 1 1 0 4"/></svg>
              </div>
              <div>
                <h3 className="font-semibold text-lg">{t('conservation-efforts')}</h3>
              </div>
            </div>
            <p className="text-muted-foreground">{t('conservation-efforts-desc')}</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DestaquesSustentabilidade;
