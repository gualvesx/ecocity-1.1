
import { Link } from 'react-router-dom';
import { ArrowLeft, Shield } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { ManageMapPointRequests } from '@/components/map/ManageMapPointRequests';
import { useLanguage } from '@/contexts/LanguageContext';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

const AdminMapRequests = () => {
  const { t } = useLanguage();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  useEffect(() => {
    // Redirect if not admin
    if (!user?.isAdmin) {
      navigate('/map');
    }
  }, [user, navigate]);
  
  if (!user?.isAdmin) return null;
  
  return (
    <div className="min-h-screen flex flex-col pt-20">
      <div className="container px-4 py-8">
        <div className="flex flex-col gap-4 mb-8">
          <Link to="/map" className="inline-flex items-center gap-1 text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-4 w-4" />
            <span>Voltar para Mapa</span>
          </Link>
          
          <div className="flex items-center gap-3">
            <Shield className="h-6 w-6 text-eco-green" />
            <h1 className="text-3xl md:text-4xl font-bold text-eco-green-dark">Gerenciar Solicitações de Pontos</h1>
          </div>
          
          <p className="text-lg text-muted-foreground">
            Revise e gerencie as solicitações de novos pontos ecológicos no mapa
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-md overflow-hidden mb-8 p-6">
          <ManageMapPointRequests />
        </div>
      </div>
    </div>
  );
};

export default AdminMapRequests;
