
import React from 'react';
import DestaquesSustentabilidade from '@/components/SustainabilityHighlights';
import ChamadaParaAcao from '@/components/CallToAction';
import EcoCityHelpBox from '@/components/EcoCityHelpBox';
import SecaoInterativa from '@/components/SecaoInterativa';
import { BlogCarousel } from '@/components/BlogCarousel';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTheme } from '@/contexts/ThemeContext';
import { MapPreview } from '@/components/MapPreview';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { FileText } from 'lucide-react';

const Index = () => {
  const { t } = useLanguage();
  const { theme } = useTheme();
  
  return (
    <div className="min-h-screen flex flex-col w-full">
      <MapPreview />
      
      {/* Seção de acesso rápido ao Sumário */}
      <section className="py-12 bg-white">
        <div className="container px-4">
          <div className="text-center">
            <h2 className="text-2xl md:text-3xl font-bold text-eco-green-dark mb-4">
              Explore Nosso Sumário Ecológico
            </h2>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              Acesse informações detalhadas sobre pontos ecológicos e descubra o catálogo completo de plantas do Horto Florestal.
            </p>
            <Link to="/summary">
              <Button className="bg-eco-green hover:bg-eco-green-dark">
                <FileText className="mr-2 h-4 w-4" />
                Acessar Sumário
              </Button>
            </Link>
          </div>
        </div>
      </section>
      
      <SecaoInterativa />
      <BlogCarousel />
      <EcoCityHelpBox />
      <ChamadaParaAcao />
    </div>
  );
};

export default Index;
