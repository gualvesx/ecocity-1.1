
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Users, MapPin, Calendar, Database } from 'lucide-react';
import { UserManagementSection } from './UserManagementSection';
import { ManageMapPointRequests } from '@/components/map/ManageMapPointRequests';
import { ManageEventRequests } from '@/components/events/ManageEventRequests';
import { CSVImportTool } from './CSVImportTool';

export const AdminDashboard = () => {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Painel de Administração</h1>
          <p className="text-muted-foreground">
            Gerencie usuários, pontos do mapa, eventos e importe dados
          </p>
        </div>
      </div>

      <Tabs defaultValue="users" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="users" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Usuários
          </TabsTrigger>
          <TabsTrigger value="map-points" className="flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            Pontos do Mapa
          </TabsTrigger>
          <TabsTrigger value="events" className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Eventos
          </TabsTrigger>
          <TabsTrigger value="data-import" className="flex items-center gap-2">
            <Database className="h-4 w-4" />
            Importação CSV
          </TabsTrigger>
        </TabsList>

        <TabsContent value="users" className="space-y-6">
          <UserManagementSection />
        </TabsContent>

        <TabsContent value="map-points" className="space-y-6">
          <ManageMapPointRequests />
        </TabsContent>

        <TabsContent value="events" className="space-y-6">
          <ManageEventRequests />
        </TabsContent>

        <TabsContent value="data-import" className="space-y-6">
          <CSVImportTool />
        </TabsContent>
      </Tabs>
    </div>
  );
};
