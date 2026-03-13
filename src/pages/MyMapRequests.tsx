
import { Link } from 'react-router-dom';
import { ArrowLeft, MapPin } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { MyMapPointRequests } from '@/components/map/MyMapPointRequests';
import { useLanguage } from '@/contexts/LanguageContext';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

const MyMapRequests = () => {
  const { t } = useLanguage();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  useEffect(() => {
    // Redirect if not logged in
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);
  
  if (!user) return null;
  
  return (
    <div className="min-h-screen flex flex-col pt-20">
      <div className="container px-4 py-8">
        <div className="flex flex-col gap-4 mb-8">
          <Link to="/map" className="inline-flex items-center gap-1 text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-4 w-4" />
            <span>Voltar para Mapa</span>
          </Link>
          
          <div className="flex items-center gap-3">
            <MapPin className="h-6 w-6 text-eco-green" />
            <h1 className="text-3xl md:text-4xl font-bold text-eco-green-dark">Minhas Solicitações de Pontos</h1>
          </div>
          
          <p className="text-lg text-muted-foreground">
            Acompanhe o status das suas solicitações de novos pontos ecológicos
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-md overflow-hidden mb-8 p-6">
          <MyMapPointRequests />
        </div>
      </div>
    </div>
  );
};

export default MyMapRequests;
