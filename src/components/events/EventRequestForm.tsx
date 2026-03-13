
import React, { useState } from 'react';
import { useEventRequests } from '@/hooks/useEventRequests';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { CreateEventRequestData } from '@/types/events';
import { useForm } from 'react-hook-form';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';

export const EventRequestForm: React.FC = () => {
  const { addEventRequest, isLoading } = useEventRequests();
  const { user } = useAuth();
  
  // Define form with react-hook-form
  const form = useForm<CreateEventRequestData>({
    defaultValues: {
      title: '',
      description: '',
      date: '',
      time: '',
      address: '',
      organizer: user?.name || ''
    }
  });

  const onSubmit = async (data: CreateEventRequestData) => {
    if (!user) {
      toast.error('Você precisa estar logado para solicitar um evento');
      return;
    }
    
    try {
      const result = await addEventRequest(data);
      
      if (result) {
        // Clear form on success
        form.reset();
        toast.success('Solicitação de evento enviada com sucesso!');
      }
    } catch (error) {
      console.error('Error submitting event request:', error);
      toast.error('Erro ao enviar solicitação de evento');
    }
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow">
      <h2 className="text-xl font-semibold text-eco-green-dark mb-4">Solicitar Novo Evento</h2>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Título do Evento</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="Ex: Limpeza da Praia" 
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Descrição</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="Descreva o objetivo e detalhes do evento" 
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Data</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="time"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Horário</FormLabel>
                  <FormControl>
                    <Input type="time" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          
          <FormField
            control={form.control}
            name="address"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Endereço</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="Endereço completo do evento" 
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="organizer"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Organizador</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="Nome da pessoa ou organização responsável" 
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <Button 
            type="submit" 
            className="w-full bg-eco-green hover:bg-eco-green-dark"
            disabled={isLoading || !user}
          >
            {isLoading ? 'Enviando...' : 'Solicitar Evento'}
          </Button>
          
          {!user && (
            <p className="text-sm text-center text-red-500">
              Você precisa estar logado para solicitar eventos.
            </p>
          )}
        </form>
      </Form>
    </div>
  );
};
