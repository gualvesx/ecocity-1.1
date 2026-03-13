
import { Link } from 'react-router-dom';
import { ArrowRight, Leaf } from 'lucide-react';

const Hero = () => {
  return (
    <div className="relative overflow-hidden pt-20 w-full">
      {/* Background pattern */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmOGY4ZjgiIGZpbGwtb3BhY2l0eT0iMC4wNCI+PHBhdGggZD0iTTM2IDM0djZoNnYtNmgtNnptNiAwaDZ2LTZoLTZ2NnptLTEyIDZoNnYtNmgtNnY2em0xMiAwaDZ2LTZoLTZ2NnptLTYtMTJoNnYtNmgtNnY2em0xMiAwaDZ2LTZoLTZ2NnptLTI0LTEyaDZ2LTZoLTZ2NnptMTIgMGg2di02aC02djZ6bTEyIDBoNnYtNmgtNnY2eiIvPjwvZz48L2c+PC9zdmc=')] opacity-50"></div>
      
      <div className="container relative pt-12 pb-16 md:pt-16 md:pb-24 w-full max-w-none px-4 md:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center w-full">
          {/* Text Content */}
          <div className="space-y-6 max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-eco-green-light/20 text-eco-green-dark text-sm font-medium">
              <Leaf className="h-4 w-4" />
              <span>Projeto Ecoloógico</span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-eco-green-dark">
              Cidades Sustentáveis para um <span className="text-eco-green">Futuro Verde</span>
            </h1>
            <p className="text-lg text-black">Juntos, somos a força que protege o amanhã! 🌿 </p>
            <p className="text-lg text-black">Cada ação conta na preservação do nosso planeta.</p>
            <div className="flex flex-wrap gap-4">
              <Link to="/map" className="inline-flex items-center gap-2 bg-eco-green text-white font-medium rounded-md px-6 py-3 shadow-sm hover:bg-eco-green-dark transition-colors">
                <span>Ver Mapa</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link to="/about" className="inline-flex items-center gap-2 bg-transparent border border-eco-green text-eco-green-dark font-medium rounded-md px-6 py-3 hover:bg-eco-green/5 transition-colors">
                Saiba Mais
              </Link>
            </div>
          </div>
          
          {/* Map Preview */}
          <div className="rounded-xl overflow-hidden shadow-xl border-4 border-white relative animate-fade-in-up">
            <div className="aspect-[4/3] bg-eco-blue-light relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-tr from-eco-green/20 to-eco-blue/20"></div>
              <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg px-3 py-2 shadow-sm z-10 text-sm font-medium">
                Monitoramento Ambiental em Tempo Real
              </div>
              
              {/* Stylized Map Placeholder */}
              <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxkZWZzPjxwYXR0ZXJuIGlkPSJzbWFsbEdyaWQiIHdpZHRoPSIxMCIgaGVpZ2h0PSIxMCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0iIzRDN0M1NCIgc3Ryb2tlLXdpZHRoPSIwLjIiIG9wYWNpdHk9IjAuMyIvPjwvcGF0dGVybj48cGF0dGVybiBpZD0iZ3JpZCIgd2lkdGg9IjEwMCIgaGVpZ2h0PSIxMDAiIHBhdHRlcm5Vbml0cz0idXNlclNwYWNlT25Vc2UiPjxyZWN0IHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiBmaWxsPSJ1cmwoI3NtYWxsR3JpZCkiLz48cGF0aCBkPSJNIDEwMCAwIEwgMCAwIDAgMTAwIiBmaWxsPSJub25lIiBzdHJva2U9IiM0QzdDNTQiIHN0cm9rZS13aWR0aD0iMC41IiBvcGFjaXR5PSIwLjUiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')]"></div>
              
              {/* Map Points */}
              <div className="absolute top-1/4 left-1/4 w-8 h-8 rounded-full bg-red-500 shadow-lg border-2 border-white animate-pulse-gentle"></div>
              <div className="absolute top-1/2 left-2/3 w-8 h-8 rounded-full bg-amber-500 shadow-lg border-2 border-white animate-pulse-gentle" style={{
                animationDelay: "0.5s"
              }}></div>
              <div className="absolute top-3/4 left-1/3 w-8 h-8 rounded-full bg-eco-green shadow-lg border-2 border-white animate-pulse-gentle" style={{
                animationDelay: "1s"
              }}></div>
            </div>
            
            {/* Call to Action Overlay */}
            <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 bg-eco-green-dark/70 transition-opacity duration-300">
              <Link to="/map" className="px-6 py-3 bg-white rounded-md font-medium text-eco-green-dark shadow-md hover:bg-eco-sand transition-colors">
                Ver Dados em Tempo Real
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
