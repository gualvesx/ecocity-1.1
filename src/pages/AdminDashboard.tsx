
import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { ArrowLeft, Users, Map, Calendar, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UserManagementSection } from '@/components/admin/UserManagementSection';
import { ManageMapPointRequests } from '@/components/map/ManageMapPointRequests';
import { ManageEventRequests } from '@/components/events/ManageEventRequests';
import { toast } from 'sonner';

const AdminDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("users");
  const [isLoading, setIsLoading] = useState(true);
  
  console.log("AdminDashboard - Current user:", user);
  console.log("Admin status:", user?.isAdmin);
  
  useEffect(() => {
    // Add a small delay to ensure user data is loaded properly
    const checkAdminStatus = setTimeout(() => {
      setIsLoading(false);
      
      if (!user) {
        console.log("No user found, redirecting to login");
        navigate('/login');
      } else if (!user.isAdmin) {
        console.log("User is not admin, redirecting to map");
        toast.error("Você não tem permissão para acessar esta página");
        navigate('/map');
      } else {
        console.log("User is admin, showing admin dashboard");
      }
    }, 500);
    
    return () => clearTimeout(checkAdminStatus);
  }, [user, navigate]);

  // Show loading state while checking permissions
  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center pt-20">
        <div className="w-12 h-12 border-4 border-eco-green border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-muted-foreground">Verificando permissões de administrador...</p>
      </div>
    );
  }
  
  // Additional check to prevent render if user is not admin
  if (!user?.isAdmin) {
    return null;
  }

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
            <h1 className="text-3xl md:text-4xl font-bold text-eco-green-dark">Painel de Administração</h1>
          </div>
          
          <p className="text-lg text-muted-foreground">
            Gerencie usuários, solicitações de eventos e pontos no mapa em um único lugar
          </p>
        </div>

        <Tabs defaultValue="users" className="w-full" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-3 mb-8">
            <TabsTrigger value="users" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              <span>Usuários</span>
            </TabsTrigger>
            <TabsTrigger value="events" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span>Solicitações de Eventos</span>
            </TabsTrigger>
            <TabsTrigger value="map-points" className="flex items-center gap-2">
              <Map className="h-4 w-4" />
              <span>Solicitações de Pontos</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="users" className="space-y-4">
            <UserManagementSection />
          </TabsContent>
          
          <TabsContent value="events" className="space-y-4">
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              <div className="flex items-center justify-between p-6 border-b">
                <div className="flex items-center gap-3">
                  <Calendar className="h-5 w-5 text-eco-green" />
                  <h2 className="text-xl font-semibold">Solicitações de Eventos</h2>
                </div>
              </div>
              <div className="p-6">
                <ManageEventRequests />
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="map-points" className="space-y-4">
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              <div className="flex items-center justify-between p-6 border-b">
                <div className="flex items-center gap-3">
                  <Map className="h-5 w-5 text-eco-green" />
                  <h2 className="text-xl font-semibold">Solicitações de Pontos no Mapa</h2>
                </div>
              </div>
              <div className="p-6">
                <ManageMapPointRequests />
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminDashboard;
