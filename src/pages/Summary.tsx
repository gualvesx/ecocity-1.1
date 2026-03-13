
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthContext';
import { MapPointsDetails } from '@/components/summary/MapPointsDetails';
import { PlantCatalog } from '@/components/summary/PlantCatalog';

const Summary = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen flex flex-col pt-20">
      <div className="container px-4 py-8">
        <div className="flex flex-col space-y-4">
          <Link to="/" className="inline-flex items-center gap-1 text-muted-foreground hover:text-foreground w-fit">
            <ArrowLeft className="h-4 w-4" />
            <span>Voltar ao início</span>
          </Link>
          
          <h1 className="text-3xl md:text-4xl font-bold text-eco-green-dark">
            Sumário Ecológico
          </h1>
          
          <p className="text-lg text-muted-foreground">
            Informações detalhadas sobre pontos ecológicos e catálogo de plantas do Horto Florestal
          </p>
        </div>

        <Tabs defaultValue="points" className="mt-8">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="points">Pontos Ecológicos</TabsTrigger>
            <TabsTrigger value="plants">Catálogo de Plantas</TabsTrigger>
          </TabsList>
          
          <TabsContent value="points" className="mt-6">
            <MapPointsDetails />
          </TabsContent>
          
          <TabsContent value="plants" className="mt-6">
            <PlantCatalog />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Summary;
