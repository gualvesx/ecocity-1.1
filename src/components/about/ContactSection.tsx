
import { Leaf } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

export const ContactSection = () => {
  const { t } = useLanguage();
  
  const involvementPoints = ['Solicite Pontos', 'Sugira Eventos Faltantes', 'Relate Bugs', 'Relate Pontos com Erro'];
  const faqQuestions = [
    { title: 'Contato', answer: '(18) 98826-9379' },
    { title: 'Email', answer: 'ecocity.gg@gmail.com' },
    { title: 'Instagram', answer: '@ecocity.gg' },
  ];

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden mb-16">
      <div className="grid grid-cols-1 lg:grid-cols-2">
        <div className="p-8">
          <h2 className="text-2xl font-bold text-eco-green-dark mb-4">{t('get-involved')}</h2>
          <p className="text-muted-foreground mb-6">{t('involvement-description')}</p>
          <ul className="space-y-4 mb-6">
            {involvementPoints.map((point) => (
              <li key={point} className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-eco-green-light/20 flex items-center justify-center text-eco-green shrink-0 mt-0.5">
                  <Leaf size={14} />
                </div>
                <span>{t(point)}</span>
              </li>
            ))}
          </ul>
          <button className="bg-eco-green text-white font-medium rounded-md px-6 py-3 shadow-sm hover:bg-eco-green-dark transition-colors">
            {t('Contate-nos')}
          </button>
        </div>
        <div className="bg-eco-green p-8 flex flex-col justify-center">
          <h3 className="text-xl font-semibold text-white mb-6">{t('FAQ')}</h3>
          <div className="space-y-4">
            {faqQuestions.map((faq) => (
              <div key={faq.title} className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                <h4 className="font-medium text-white mb-2">{t(faq.title)}</h4>
                <p className="text-white/80 text-sm">{t(faq.answer)}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
