import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Volume2, Moon, Sun, Palette, Accessibility } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';

export function AccessibilityPanel() {
  const [isOpen, setIsOpen] = useState(false);
  const [textToRead, setTextToRead] = useState('');
  const { theme, colorblindMode, setTheme, toggleColorblindMode } = useTheme();

  const speakText = () => {
    if (!textToRead.trim()) {
      toast.error('Digite um texto para ser lido');
      return;
    }

    if ('speechSynthesis' in window) {
      // Parar qualquer leitura em andamento
      speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(textToRead);
      utterance.lang = 'pt-BR';
      utterance.rate = 0.8;
      utterance.pitch = 1;
      utterance.volume = 1;

      utterance.onstart = () => {
        toast.success('Iniciando leitura em voz alta');
      };

      utterance.onend = () => {
        toast.success('Leitura concluída');
      };

      utterance.onerror = () => {
        toast.error('Erro na síntese de voz');
      };

      speechSynthesis.speak(utterance);
    } else {
      toast.error('Síntese de voz não suportada neste navegador');
    }
  };

  const stopSpeaking = () => {
    if ('speechSynthesis' in window) {
      speechSynthesis.cancel();
      toast.success('Leitura interrompida');
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="fixed bottom-80 right-3 z-50 bg-eco-green hover:bg-eco-green-dark text-white shadow-lg"
          aria-label="Abrir painel de acessibilidade"
        >
          <Accessibility className="h-5 w-5" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Accessibility className="h-5 w-5" />
            Painel de Acessibilidade
          </DialogTitle>
        </DialogHeader>
        
        <div className="grid gap-6">
          {/* Configurações de Tema */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Configurações Visuais</h3>
            
            <div className="flex items-center justify-between">
              <Label htmlFor="theme-toggle" className="flex items-center gap-2">
                {theme === 'dark' ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
                Modo {theme === 'dark' ? 'Escuro' : 'Claro'}
              </Label>
              <Switch
                id="theme-toggle"
                checked={theme === 'dark'}
                onCheckedChange={(checked) => setTheme(checked ? 'dark' : 'light')}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="colorblind-toggle" className="flex items-center gap-2">
                <Palette className="h-4 w-4" />
                Modo Daltonismo (Alto Contraste)
              </Label>
              <Switch
                id="colorblind-toggle"
                checked={colorblindMode}
                onCheckedChange={toggleColorblindMode}
              />
            </div>
          </div>

          {/* Text-to-Speech para Cegos */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Volume2 className="h-5 w-5" />
              Leitor de Texto (Para Deficientes Visuais)
            </h3>
            
            <div className="space-y-2">
              <Label htmlFor="text-to-read">Digite o texto para ser lido em voz alta:</Label>
              <Textarea
                id="text-to-read"
                placeholder="Digite aqui o texto que deseja ouvir..."
                value={textToRead}
                onChange={(e) => setTextToRead(e.target.value)}
                className="min-h-[100px]"
              />
            </div>
            
            <div className="flex gap-2">
              <Button onClick={speakText} className="bg-eco-green hover:bg-eco-green-dark">
                <Volume2 className="mr-2 h-4 w-4" />
                Ler Texto
              </Button>
              <Button onClick={stopSpeaking} variant="outline">
                Parar Leitura
              </Button>
            </div>
          </div>

          {/* Informação sobre VLibras */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Tradutor de Libras</h3>
            <div className="p-4 bg-eco-sand/20 rounded-md">
              <p className="text-sm text-muted-foreground mb-2">
                <strong>VLibras:</strong> Este site conta com o tradutor oficial de Libras do governo brasileiro.
              </p>
              <p className="text-sm text-muted-foreground">
                Procure pelo botão azul do VLibras no canto inferior direito da tela para ativar a tradução automática em Libras de todo o conteúdo da página.
              </p>
            </div>
          </div>

          <div className="text-sm text-muted-foreground">
            <p><strong>Dica:</strong> Este painel pode ser acessado rapidamente usando o botão flutuante no canto inferior direito da tela.</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
