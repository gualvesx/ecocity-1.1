
import { Link } from 'react-router-dom';
import { Leaf, Instagram, Twitter, Facebook, Mail } from 'lucide-react';

const Footer = () => {
  const year = new Date().getFullYear();
  
  return (
    <footer className="bg-eco-green-dark text-white">
      <div className="container py-12 px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Leaf className="h-6 w-6" />
              <span className="font-semibold text-lg">Terra Verde Conectada</span>
            </div>
            <p className="text-sm max-w-md text-white/80">
              Promovendo consciência ambiental e práticas sustentáveis através do engajamento comunitário e visualização de dados.
            </p>
            <div className="flex space-x-4 pt-2">
              <a href="#" className="text-white/70 hover:text-white transition-colors">
                <Instagram size={20} />
              </a>
              <a href="#" className="text-white/70 hover:text-white transition-colors">
                <Twitter size={20} />
              </a>
              <a href="#" className="text-white/70 hover:text-white transition-colors">
                <Facebook size={20} />
              </a>
              <a href="#" className="text-white/70 hover:text-white transition-colors">
                <Mail size={20} />
              </a>
            </div>
          </div>
          
          {/* Quick Links */}
          <div>
            <h3 className="font-medium text-lg mb-4">Links Rápidos</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-white/70 hover:text-white transition-colors">Início</Link>
              </li>
              <li>
                <Link to="/map" className="text-white/70 hover:text-white transition-colors">Mapa Ecológico</Link>
              </li>
              <li>
                <Link to="/blog" className="text-white/70 hover:text-white transition-colors">Blog</Link>
              </li>
              <li>
                <Link to="/about" className="text-white/70 hover:text-white transition-colors">Sobre Nós</Link>
              </li>
            </ul>
          </div>
          
          {/* Newsletter */}
          <div>
            <h3 className="font-medium text-lg mb-4">Fique Atualizado</h3>
            <p className="text-sm text-white/80 mb-4">
              Inscreva-se em nossa newsletter para receber atualizações sobre iniciativas ambientais e dicas de vida sustentável.
            </p>
            <form className="flex">
              <input
                type="email"
                placeholder="Seu email"
                className="px-4 py-2 rounded-l-md w-full text-foreground focus:outline-none"
              />
              <button type="submit" className="bg-eco-leaf text-eco-green-dark px-4 py-2 rounded-r-md font-medium hover:bg-eco-leaf/90 transition-colors">
                Inscrever
              </button>
            </form>
          </div>
        </div>
        
        <div className="border-t border-white/20 mt-8 pt-8 text-center text-sm text-white/60">
          <p>© {year} Terra Verde Conectada. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
