
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTheme } from '@/contexts/ThemeContext';
import { TreeDeciduous, Recycle, Globe, Leaf } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { useIsMobile } from '@/hooks/use-mobile';

const SecaoInterativa = () => {
  const { t } = useLanguage();
  const isMobile = useIsMobile();
  const [selectedBox, setSelectedBox] = useState<string | null>(null);
  const navigate = useNavigate();

  const ecoBoxes = [
    {
      id: 'recycling',
      title: 'Lixo Eletrônico',
      description: 'Metais pesados de lixo eletrônico transformam a terra em um risco tóxico permanente.',
      icon: <Recycle className="h-10 w-10" />,
      color: 'from-eco-green to-eco-green-light',
      details: 'O descarte incorreto de eletrônicos envenena o solo com metais pesados como chumbo, mercúrio e cádmio, que se infiltram e permanecem por décadas. Uma única pilha pode contaminar 20 mil litros de água, e placas de circuito liberam toxinas que esterilizam a terra, inviabilizando agricultura e ecossistemas. Sem reciclagem, o solo vira um depósito tóxico.'
    },
    {
      id: 'planting',
      title: 'Contaminação no Lençol Freático',
      description: 'Resíduos infiltrando no lençol freático envenenam fontes de água potável.',
      icon: <TreeDeciduous className="h-10 w-10" />,
      color: 'from-eco-green to-eco-green-light',
      details: 'Quando chove sobre lixões eletrônicos, os poluentes atingem o lençol freático, fonte de água potável. Arsênico e níquel causam doenças como câncer e falência renal em comunidades próximas. Na China, regiões com lixos eletrônicos ilegais têm água com 2.500% mais chumbo que o limite seguro. O custo da descontaminação supera em 10x o da reciclagem correta.'
    },
    {
      id: 'footprint',
      title: 'Impacto no Clima',
      description: 'Queima e produção de eletrônicos emitem gases que aceleram a crise climática.',
      icon: <Globe className="h-10 w-10" />,
      color: 'from-eco-green to-eco-green-light',
      details: 'A queima de componentes plásticos e metálicos libera CO₂ e gases como hexafluoreto de enxofre (23.500x mais poluente que o carbono). Só em 2023, o lixo eletrônico gerou 98 milhões de toneladas de CO₂—equivalente a 20 milhões de carros anuais. Fabricar novos dispositivos para substituir os descartados agrava ainda mais a crise climática.'
    },
    {
      id: 'sustainable',
      title: 'Consequências para a Vida',
      description: 'Doenças, mortes e bilhões perdidos: O preço da irresponsabilidade.',
      icon: <Leaf className="h-10 w-10" />,
      color: 'from-eco-green to-eco-green-light',
      details: 'Além de intoxicar pessoas e animais, o lixo eletrônico custa US$ 57 bilhões/ano em saúde e limpeza ambiental (ONU). Crianças em países pobres, que desmontam peças manualmente, sofrem com mutagenicidade e danos neurológicos. Sem ação urgente, até 2050, teremos 120 milhões de toneladas/ano desse lixo—um legado mortal para as futuras gerações.'
    }
  ];
  
  const handleBoxClick = (id: string) => {
    if (selectedBox === id) {
      setSelectedBox(null);
    } else {
      setSelectedBox(id);
    }
  };
  
  // Função de navegação modificada para rolar ao topo da página
  const handleNavigation = (route) => {
    navigate(route);
    window.scrollTo(0, 0); // Rola a página para o topo
  };
  
  const ecoActions = [
    {
      title: "Explore nosso Blog",
      description: "Descubra temas atuais relacionados a Ecologia.",
      action: "Ver Blog",
      color: "bg-eco-green-light/20",
      route: "/blog"
    },
    {
      title: "Particie do EcoCity",
      description: "Solicite pontos ecológicos relacionados.",
      action: "Ver Mapa",
      color: "bg-eco-blue-light/20",
      route: "/map"
    },
    {
      title: "Eventos de Ecologia",
      description: "Participe de eventos ecológicos e solicite eventos.",
      action: "Ver Eventos",
      color: "bg-eco-green-light/20",
      route: "/events"
    }
  ];
  
  return (
    <section className="py-16 bg-white dark:bg-gray-900 w-full">
      <div className="container px-4 md:px-6 w-full max-w-none">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-eco-green-dark dark:text-eco-green-light mb-4">
            {t('Apoie a Causa!') || 'Explore Práticas Ecológicas'}
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            {t('EcoCity') || 'Descubra formas de contribuir para um futuro mais sustentável com nossas ferramentas interativas'}
          </p>
        </div>
        
        {/* Interactive Eco Boxes */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16 w-full">
          {ecoBoxes.map((box) => (
            <Card 
              key={box.id} 
              className={`cursor-pointer transition-all duration-300 hover:shadow-lg border-t-4 border-eco-green overflow-hidden ${selectedBox === box.id ? 'ring-2 ring-eco-green' : ''}`}
              onClick={() => handleBoxClick(box.id)}
            >
              <div className={`bg-gradient-to-br ${box.color} h-2 w-full`} />
              <CardHeader className="pb-2">
                <div className="w-16 h-16 rounded-full bg-eco-green-light/20 flex items-center justify-center text-eco-green-dark mb-2 mx-auto">
                  {box.icon}
                </div>
                <CardTitle className="text-center text-xl">{box.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-center">
                  {box.description}
                </CardDescription>
              </CardContent>
              
              {selectedBox === box.id && (
                <div className="px-6 pb-6 animate-fade-in">
                  <p className="text-sm text-gray-600 dark:text-gray-300">{box.details}</p>
                  <div className="mt-4 flex justify-center">
                    <Button 
                      className="bg-eco-green hover:bg-eco-green-dark text-white"
                      size="sm"
                    >
                      Ocultar
                    </Button>
                  </div>
                </div>
              )}
            </Card>
          ))}
        </div>
        
        {/* New Eco Action Section */}
        <div className="mb-12 w-full">
          <h3 className="text-xl font-semibold text-eco-green-dark dark:text-eco-green-light mb-6 text-center">
            Recursos do Site
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
            {ecoActions.map((action, index) => (
              <div key={index} className={`${action.color} rounded-xl p-6 hover:shadow-lg transition-all duration-300`}>
                <h4 className="text-lg font-semibold text-eco-green-dark mb-2">{action.title}</h4>
                <p className="text-muted-foreground mb-4">{action.description}</p>
                <Button 
                  className="bg-eco-green hover:bg-eco-green-dark text-white w-full"
                  onClick={() => handleNavigation(action.route)}
                >
                  {action.action}
                </Button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default SecaoInterativa;
