
import { useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { toast } from 'sonner';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useAddressCorrection } from '@/hooks/useAddressCorrection';
import { useCaptcha } from '@/hooks/useCaptcha';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { Calendar as CalendarIcon, Loader2, Wand2, CheckCircle, AlertTriangle, Plus, Trash2, MapPin, Clock } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useEventStore } from '@/hooks/useEventStore';
import { EventTime, EventLocation } from '@/types/events';

interface EventFormData {
  title: string;
  description: string;
  times: EventTime[];
  locations: EventLocation[];
  organizer: string;
  contact?: string;
  website?: string;
}

interface EventFormProps {
  isRequest: boolean;
  isAdmin?: boolean;
  eventToEdit?: EventFormData & { id: string };
}

export const EventForm = ({ isRequest, eventToEdit }: EventFormProps) => {
  const { user } = useAuth();
  const { addEventRequest, addEvent, updateEvent } = useEventStore();
  const { validateAndCorrectAddress, isCorreting, lastValidation } = useAddressCorrection();
  const { execute: executeCaptcha, loading: captchaLoading } = useCaptcha({
    action: isRequest ? 'event_request' : 'event_create'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const form = useForm<EventFormData>({
    defaultValues: eventToEdit ? {
      title: eventToEdit.title,
      description: eventToEdit.description,
      times: eventToEdit.times.length > 0 ? eventToEdit.times : [{ date: new Date().toISOString().split('T')[0], time: '08:00' }],
      locations: eventToEdit.locations.length > 0 ? eventToEdit.locations : [{ address: '' }],
      organizer: eventToEdit.organizer,
      contact: eventToEdit.contact || '',
      website: eventToEdit.website || ''
    } : {
      title: '',
      description: '',
      times: [{ date: new Date().toISOString().split('T')[0], time: '08:00' }],
      locations: [{ address: '' }],
      organizer: user?.name || '',
      contact: '',
      website: ''
    }
  });

  const { fields: timeFields, append: appendTime, remove: removeTime } = useFieldArray({
    control: form.control,
    name: "times"
  });

  const { fields: locationFields, append: appendLocation, remove: removeLocation } = useFieldArray({
    control: form.control,
    name: "locations"
  });

  const handleValidateAddress = async (index: number) => {
    const currentAddress = form.getValues(`locations.${index}.address`);
    if (!currentAddress?.trim()) {
      toast.error('Digite um endereço primeiro');
      return;
    }
    
    const result = await validateAndCorrectAddress(currentAddress);
    if (result.correctedAddress !== currentAddress) {
      form.setValue(`locations.${index}.address`, result.correctedAddress);
    }
  };
  
  const onSubmit = async (data: EventFormData) => {
    try {
      setIsSubmitting(true);
      
      // Validar endereços
      for (let i = 0; i < data.locations.length; i++) {
        const location = data.locations[i];
        if (location.address) {
          const result = await validateAndCorrectAddress(location.address);
          if (result.confidence < 50) {
            toast.error(`Por favor, valide o endereço ${i + 1} antes de continuar`);
            setIsSubmitting(false);
            return;
          }
          data.locations[i].address = result.correctedAddress;
        }
      }

      // Executar reCAPTCHA
      console.log("Executando reCAPTCHA para evento...");
      const captchaToken = await executeCaptcha();
      
      if (!captchaToken) {
        toast.error('Falha na verificação reCAPTCHA. Tente novamente.');
        setIsSubmitting(false);
        return;
      }
      
      const eventData = {
        ...data,
        createdBy: user?.id || 'anonymous',
        createdAt: new Date().toISOString(),
        captchaToken
      };
      
      if (isRequest) {
        await addEventRequest(eventData);
        toast.success("Solicitação enviada com sucesso! Aguarde a aprovação de um administrador.");
        form.reset({
          title: '',
          description: '',
          times: [{ date: new Date().toISOString().split('T')[0], time: '08:00' }],
          locations: [{ address: '' }],
          organizer: user?.name || '',
          contact: '',
          website: ''
        });
      } else if (eventToEdit) {
        await updateEvent(eventToEdit.id, eventData);
        toast.success("Evento atualizado com sucesso!");
      } else {
        await addEvent(eventData);
        toast.success("Evento adicionado com sucesso!");
        form.reset({
          title: '',
          description: '',
          times: [{ date: new Date().toISOString().split('T')[0], time: '08:00' }],
          locations: [{ address: '' }],
          organizer: user?.name || '',
          contact: '',
          website: ''
        });
      }
    } catch (error) {
      console.error('Error submitting event:', error);
      toast.error("Erro ao processar o evento. Tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Título do Evento</FormLabel>
              <FormControl>
                <Input placeholder="Ex: Plantio de Árvores no Parque" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Times Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <FormLabel className="text-base flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Horários do Evento
            </FormLabel>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => appendTime({ date: new Date().toISOString().split('T')[0], time: '08:00' })}
            >
              <Plus className="h-4 w-4 mr-1" />
              Adicionar Horário
            </Button>
          </div>
          
          {timeFields.map((field, index) => (
            <div key={field.id} className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 border rounded-lg">
              <FormField
                control={form.control}
                name={`times.${index}.date`}
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Data</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(new Date(field.value), "dd/MM/yyyy")
                            ) : (
                              <span>Selecione uma data</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value ? new Date(field.value) : undefined}
                          onSelect={(date) => field.onChange(date?.toISOString().split('T')[0])}
                          disabled={(date: Date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name={`times.${index}.time`}
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

              <FormField
                control={form.control}
                name={`times.${index}.endTime`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Horário Final (opcional)</FormLabel>
                    <div className="flex gap-2">
                      <FormControl>
                        <Input type="time" {...field} />
                      </FormControl>
                      {timeFields.length > 1 && (
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          onClick={() => removeTime(index)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          ))}
        </div>

        {/* Locations Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <FormLabel className="text-base flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              Localizações do Evento
            </FormLabel>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => appendLocation({ address: '' })}
            >
              <Plus className="h-4 w-4 mr-1" />
              Adicionar Local
            </Button>
          </div>
          
          {locationFields.map((field, index) => (
            <div key={field.id} className="p-4 border rounded-lg">
              <FormField
                control={form.control}
                name={`locations.${index}.address`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Endereço {index + 1}</FormLabel>
                    <FormControl>
                      <div className="space-y-2">
                        <div className="flex gap-2">
                          <Input 
                            placeholder="Ex: Avenida Manoel Goulart, 1000 - Centro - Presidente Prudente, SP" 
                            {...field} 
                            className="flex-1"
                          />
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => handleValidateAddress(index)}
                            disabled={isCorreting || !field.value?.trim()}
                            className="px-3 flex items-center gap-1"
                          >
                            {isCorreting ? (
                              <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                            ) : (
                              <Wand2 className="h-4 w-4" />
                            )}
                          </Button>
                          {locationFields.length > 1 && (
                            <Button
                              type="button"
                              variant="destructive"
                              size="sm"
                              onClick={() => removeLocation(index)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          ))}
        </div>
        
        <FormField
          control={form.control}
          name="organizer"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Organizador</FormLabel>
              <FormControl>
                <Input placeholder="Nome da organização ou responsável" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="contact"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Contato (opcional)</FormLabel>
                <FormControl>
                  <Input placeholder="Telefone ou email" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="website"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Website (opcional)</FormLabel>
                <FormControl>
                  <Input placeholder="https://exemplo.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Descrição do Evento</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Descreva os detalhes do evento, como atividades planejadas, objetivo e público-alvo." 
                  className="min-h-[120px]"
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
          disabled={isSubmitting || captchaLoading}
        >
          {(isSubmitting || captchaLoading) && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {isRequest ? "Enviar Solicitação" : eventToEdit ? "Atualizar Evento" : "Adicionar Evento"}
        </Button>

        <div className="text-xs text-center text-muted-foreground">
          Este formulário é protegido pelo reCAPTCHA
        </div>
      </form>
    </Form>
  );
};
