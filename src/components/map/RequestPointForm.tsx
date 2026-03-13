
import { useState } from 'react';
import { X, Wand2, CheckCircle, AlertTriangle } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { useMapPointRequests } from '@/hooks/useMapPointRequests';
import { useAuth } from '@/contexts/AuthContext';
import { useAddressCorrection } from '@/hooks/useAddressCorrection';
import { useCaptcha } from '@/hooks/useCaptcha';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export const RequestPointForm = ({ onClose }: { onClose: () => void }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { createRequest, isLoading } = useMapPointRequests();
  const { validateAndCorrectAddress, isCorreting, lastValidation } = useAddressCorrection();
  const { execute: executeCaptcha, loading: captchaLoading } = useCaptcha({
    action: 'map_point_request'
  });
  
  const [name, setName] = useState('');
  const [type, setType] = useState<string>('recycling-point');
  const [address, setAddress] = useState('');
  const [description, setDescription] = useState('');
  const [impact, setImpact] = useState('');
  const [addressValidated, setAddressValidated] = useState(false);
  
  const handleValidateAddress = async () => {
    if (!address.trim()) {
      toast.error('Digite um endereço primeiro');
      return;
    }
    
    const result = await validateAndCorrectAddress(address);
    if (result.correctedAddress !== address) {
      setAddress(result.correctedAddress);
    }
    setAddressValidated(true);
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast.error("Você precisa estar logado para solicitar pontos.");
      navigate("/login");
      return;
    }
    
    if (!name || !type || !address || !description) {
      toast.error("Por favor, preencha todos os campos obrigatórios.");
      return;
    }

    // Validar endereço antes de submeter
    if (!addressValidated) {
      const result = await validateAndCorrectAddress(address);
      if (result.confidence < 50) {
        toast.error('Por favor, valide o endereço antes de continuar');
        return;
      }
      setAddress(result.correctedAddress);
    }

    try {
      // Executar reCAPTCHA
      console.log("Executando reCAPTCHA para solicitação de ponto...");
      const captchaToken = await executeCaptcha();
      
      if (!captchaToken) {
        toast.error('Falha na verificação reCAPTCHA. Tente novamente.');
        return;
      }

      await createRequest({
        name,
        type: type as 'recycling-point' | 'recycling-center' | 'seedling-distribution' | 'plant-sales' | 'lamp-collection' | 'oil-collection' | 'medicine-collection' | 'electronics-donation',
        description,
        impact,
        address,
        captchaToken,
      });
      
      onClose();
    } catch (error) {
      console.error("Error creating map point request:", error);
      toast.error("Erro ao criar solicitação. Tente novamente mais tarde.");
    }
  };
  
  const getAddressValidationIcon = () => {
    if (!lastValidation) return null;
    
    if (lastValidation.confidence >= 70) {
      return <CheckCircle className="h-4 w-4 text-green-500" />;
    } else if (lastValidation.confidence >= 40) {
      return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
    } else {
      return <AlertTriangle className="h-4 w-4 text-red-500" />;
    }
  };
  
  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>Solicitar Novo Ponto Ecológico</DialogTitle>
          <DialogDescription>
            Preencha o formulário abaixo para solicitar a adição de um novo ponto ecológico no mapa. Sua solicitação será analisada por um administrador.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          <div>
            <Label htmlFor="name" className="font-medium">Nome do Ponto*</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ex: Ponto de Coleta Vila Marcondes"
              required
            />
            <p className="text-sm text-muted-foreground mt-1">
              Escolha um nome descritivo e claro
            </p>
          </div>
          
          <div>
            <Label htmlFor="type" className="font-medium">Tipo de Ponto*</Label>
            <Select value={type} onValueChange={setType}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione o tipo de ponto" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="recycling-point">Ponto de Reciclagem</SelectItem>
                <SelectItem value="recycling-center">Ponto de Lixo Eletrônico</SelectItem>
                <SelectItem value="seedling-distribution">Distribuição de Mudas</SelectItem>
                <SelectItem value="plant-sales">Venda de Mudas</SelectItem>
                <SelectItem value="lamp-collection">Coleta de Lâmpadas</SelectItem>
                <SelectItem value="oil-collection">Coleta de Óleo</SelectItem>
                <SelectItem value="medicine-collection">Coleta de Cartela de Remédio</SelectItem>
                <SelectItem value="electronics-donation">Doação de Eletrônicos</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="address" className="font-medium">Endereço Completo*</Label>
            <div className="space-y-2">
              <div className="flex gap-2">
                <Input
                  id="address"
                  value={address}
                  onChange={(e) => {
                    setAddress(e.target.value);
                    setAddressValidated(false);
                  }}
                  placeholder="Ex: Av. Brasil, 500, Centro - Presidente Prudente"
                  required
                  className="flex-1"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleValidateAddress}
                  disabled={isCorreting || !address.trim()}
                  className="px-3 flex items-center gap-1"
                >
                  {isCorreting ? (
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                  ) : (
                    <>
                      <Wand2 className="h-4 w-4" />
                      {getAddressValidationIcon()}
                    </>
                  )}
                </Button>
              </div>
              
              {lastValidation && (
                <div className={cn(
                  "text-xs p-2 rounded",
                  lastValidation.confidence >= 70 ? "bg-green-50 text-green-700" :
                  lastValidation.confidence >= 40 ? "bg-yellow-50 text-yellow-700" :
                  "bg-red-50 text-red-700"
                )}>
                  <div className="flex justify-between">
                    <span>Confiança: {lastValidation.confidence}%</span>
                    <span>{lastValidation.isValid ? '✓ Válido' : '⚠ Atenção'}</span>
                  </div>
                  {lastValidation.suggestions && lastValidation.suggestions.length > 0 && (
                    <div className="mt-1">
                      <strong>Sugestões:</strong> {lastValidation.suggestions.join(', ')}
                    </div>
                  )}
                </div>
              )}
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              Use o botão da varinha mágica para validar e corrigir o endereço com IA
            </p>
          </div>
          
          <div>
            <Label htmlFor="description" className="font-medium">Descrição*</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Descreva o ponto ecológico e seu propósito"
              rows={3}
              required
            />
          </div>
          
          <div>
            <Label htmlFor="impact" className="font-medium">Impacto Ambiental</Label>
            <Textarea
              id="impact"
              value={impact}
              onChange={(e) => setImpact(e.target.value)}
              placeholder="Descreva qual é o impacto ambiental positivo deste ponto"
              rows={2}
            />
            <p className="text-sm text-muted-foreground mt-1">
              Campo opcional
            </p>
          </div>
          
          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isLoading || captchaLoading}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              className="bg-eco-green hover:bg-eco-green-dark"
              disabled={isLoading || captchaLoading}
            >
              {(isLoading || captchaLoading) ? 'Verificando...' : 'Enviar Solicitação'}
            </Button>
          </DialogFooter>

          <div className="text-xs text-center text-muted-foreground">
            Este formulário é protegido pelo reCAPTCHA
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
