
import { ArrowLeft, Leaf, Map } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';

export const HeroSection = () => {
  const { t } = useLanguage();
  
  return (
    <>
      <Link to="/" className="inline-flex items-center gap-1 text-muted-foreground hover:text-foreground mb-4">
        <ArrowLeft className="h-4 w-4" />
        <span>Voltar ao início</span>
      </Link>
      
      <div className="bg-eco-green-light/20 rounded-xl p-8 md:p-12 mb-12">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-eco-green-dark mb-4">
              Sobre o EcoCity
            </h1>
            <p className="text-lg max-w-2xl">
              Uma plataforma tecnológica que une inovação e sustentabilidade para promover
              práticas ecológicas em Presidente Prudente.
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 rounded-full bg-eco-green-light/30 flex items-center justify-center">
              <Leaf size={32} className="text-eco-green-dark" />
            </div>
            <div className="h-16 w-16 rounded-full bg-eco-green-light/30 flex items-center justify-center">
              <Map size={32} className="text-eco-green-dark" />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
