
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const BannerImagem = () => {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-eco-green/80 to-eco-blue/80 mix-blend-multiply z-10"></div>
      <div 
        className="relative min-h-[600px] bg-cover bg-center"
        style={{ 
          backgroundImage: "url('https://turismodagente.com.br/wp-content/uploads/2021/12/PARQUE-DO-POVO-presidente-prudente.png')",
          backgroundPosition: "center 50%"
        }}
      >
        <div className="container flex flex-col justify-center h-full px-4 py-16 relative z-20">
          <div className="max-w-xl">
            <span className="inline-block px-4 py-1 rounded-full bg-white/20 backdrop-blur-sm text-white text-sm font-medium mb-4">
              Natureza & Sustentabilidade
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Preserve o Meio Ambiente Para as Futuras Gerações
            </h2>
            <p className="text-white/90 text-lg mb-6">
              Nossa missão é proteger os recursos naturais e promover práticas sustentáveis para garantir um planeta saudável para todos.
            </p>
            <Link 
              to="/about" 
              className="inline-flex items-center gap-2 bg-white text-eco-green-dark font-medium rounded-md px-5 py-2.5 shadow hover:bg-eco-sand transition-colors"
            >
              Saiba Mais <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BannerImagem;
