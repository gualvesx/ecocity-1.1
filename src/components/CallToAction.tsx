
import { ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ChamadaParaAcao = () => {
  const navigate = useNavigate();
  
  // Função que combina navegação e rolagem para o topo
  const navigateAndScrollToTop = (path) => {
    // Primeiro, role para o topo
    window.scrollTo(0, 0);
    // Depois, navegue para a rota
    navigate(path);
  };
  
  return (
    <section className="py-16 md:py-24 w-full">
      <div className="container px-4 md:px-6 max-w-none w-full">
        <div className="relative overflow-hidden rounded-2xl bg-eco-green p-8 md:p-12 w-full">
          {/* Background Pattern */}
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNMzYgMzR2Nmg2di02aC02em02IDBoNnYtNmgtNnY2em0tMTIgNmg2di02aC02djZ6bTEyIDBoNnYtNmgtNnY2em0tNi0xMmg2di02aC02djZ6bTEyIDBoNnYtNmgtNnY2em0tMjQtMTJoNnYtNmgtNnY2em0xMiAwaDZ2LTZoLTZ2NnptMTIgMGg2di02aC02djZ6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-30"></div>
          
          <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6 text-white w-full">
            <div className="max-w-lg">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Junte-se à Nossa Comunidade de Defensores Ecológicos
              </h2>
              <p className="text-white/80 text-lg">
                Torne-se parte da nossa crescente rede de entusiastas ambientais fazendo um impacto positivo. Contribua para o mapa, participe de eventos ou compartilhe recursos.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={() => navigateAndScrollToTop('/map')}
                className="inline-flex items-center gap-2 bg-white text-eco-green-dark font-medium rounded-md px-6 py-3 shadow-md hover:bg-eco-sand transition-colors cursor-pointer"
              >
                <span>Explorar o Mapa</span>
                <ArrowRight className="h-4 w-4" />
              </button>
              
              <button
                onClick={() => navigateAndScrollToTop('/about')}
                className="inline-flex items-center gap-2 bg-transparent border border-white text-white font-medium rounded-md px-6 py-3 hover:bg-white/10 transition-colors cursor-pointer"
              >
                <span>Saiba Mais</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ChamadaParaAcao;
