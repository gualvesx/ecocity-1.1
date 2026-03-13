import { useState, useRef, useEffect, MouseEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { MessageCircle, X, Send, Leaf, Bot } from 'lucide-react';
import { cn } from '@/lib/utils';
import { GeminiClient } from '@/api/gemini';
import { MarkdownRenderer } from '@/components/MarkdownRenderer';

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

// Defina as posições iniciais em uma constante para fácil reutilização
const INITIAL_POSITION = { bottom: 100, right: 4 };

export const EcoAssistant = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Olá! Sou o EcoAssistant, seu assistente ecológico inteligente powered by Google Gemini. Posso ajudar com informações sobre sustentabilidade, pontos ecológicos de Presidente Prudente e práticas ambientais. Como posso ajudá-lo hoje?',
      isUser: false,
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatCardRef = useRef<HTMLDivElement>(null);

  const [isDragging, setIsDragging] = useState(false);
  // Use a constante INITIAL_POSITION aqui
  const [position, setPosition] = useState(INITIAL_POSITION); 
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (chatCardRef.current) {
      chatCardRef.current.style.bottom = `${position.bottom}px`;
      chatCardRef.current.style.right = `${position.right}px`;
    }
  }, [position]);

  const handleMouseDown = (e: MouseEvent) => {
    if (chatCardRef.current) {
      setIsDragging(true);
      const rect = chatCardRef.current.getBoundingClientRect();
      setOffset({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
    }
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging) return;

    const newRight = window.innerWidth - e.clientX - (chatCardRef.current?.offsetWidth || 0) + offset.x;
    const newBottom = window.innerHeight - e.clientY - (chatCardRef.current?.offsetHeight || 0) + offset.y;

    const boundedRight = Math.max(4, Math.min(newRight, window.innerWidth - (chatCardRef.current?.offsetWidth || 0) - 4));
    const boundedBottom = Math.max(4, Math.min(newBottom, window.innerHeight - (chatCardRef.current?.offsetHeight || 0) - 4));

    setPosition({ bottom: boundedBottom, right: boundedRight });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    } else {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, offset]);

  const generateEcoResponse = async (userMessage: string): Promise<string> => {
    const apiKey = 'AIzaSyBk2eWsY9lNQ7if7uLFAbOZjq1IK7EqrtY';
    const gemini = new GeminiClient(apiKey);

    try {
      const response = await gemini.sendMessage(userMessage);
      return response;
    } catch (error) {
      console.error('Erro ao chamar API Gemini:', error);
      throw error;
    }
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      isUser: true,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      const response = await generateEcoResponse(inputValue);

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: response,
        isUser: false,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Erro ao gerar resposta:', error);

      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: 'Desculpe, ocorreu um erro ao processar sua mensagem. Verifique sua conexão com a internet e tente novamente. Se o problema persistir, pode ser um limite de uso da API.',
        isUser: false,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Nova função para fechar e resetar a posição
  const closeChat = () => {
    setIsOpen(false);
    setPosition(INITIAL_POSITION); // Redefine a posição para o valor inicial
  };

  return (
    <div className="fixed z-50" style={{ bottom: `${position.bottom}px`, right: `${position.right}px` }}>
      {!isOpen && (
        <Button
          onClick={() => setIsOpen(true)}
          className="h-16 w-16 md:h-14 md:w-14 rounded-full bg-eco-green hover:bg-eco-green-dark shadow-lg"
        >
          <MessageCircle className="h-6 w-6" />
        </Button>
      )}

      {isOpen && (
        <Card
          ref={chatCardRef}
          className="w-96 h-[500px] shadow-xl border-eco-green/20 flex flex-col"
          style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
        >
          <CardHeader
            className="pb-3 bg-gradient-to-r from-eco-green to-eco-green-dark text-white rounded-t-lg shrink-0"
            onMouseDown={handleMouseDown}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 bg-white/20 rounded-full flex items-center justify-center">
                  <Leaf className="h-4 w-4" />
                </div>
                <CardTitle className="text-lg">EcoAssistant</CardTitle>
              </div>
              <Button
                variant="ghost"
                size="sm"
                // Atualize o onClick para chamar a nova função closeChat
                onClick={closeChat} 
                className="text-white hover:bg-white/20 h-8 w-8 p-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-sm text-white/90">Assistente Ecológico IA • Google Gemini</p>
          </CardHeader>

          <CardContent className="p-0 flex flex-col flex-1 min-h-0">
            <ScrollArea className="flex-1 p-4 max-h-[320px] overflow-y-auto">
              <div className="space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={cn(
                      "flex gap-2",
                      message.isUser ? "justify-end" : "justify-start"
                    )}
                  >
                    {!message.isUser && (
                      <div className="h-8 w-8 bg-eco-green/10 rounded-full flex items-center justify-center shrink-0 mt-1">
                        <Bot className="h-4 w-4 text-eco-green" />
                      </div>
                    )}

                    <div
                      className={cn(
                        "max-w-[280px] p-3 rounded-lg text-sm break-words",
                        message.isUser
                          ? "bg-eco-green text-white ml-auto"
                          : "bg-gray-100 dark:bg-gray-800"
                      )}
                    >
                      {message.isUser ? (
                        <p className="whitespace-pre-wrap">{message.text}</p>
                      ) : (
                        <div className="overflow-hidden">
                          <MarkdownRenderer content={message.text} />
                        </div>
                      )}
                      <p className={cn(
                        "text-xs mt-1 opacity-70",
                        message.isUser ? "text-white/70" : "text-muted-foreground"
                      )}>
                        {message.timestamp.toLocaleTimeString('pt-BR', {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>

                    {message.isUser && (
                      <div className="h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center shrink-0 mt-1">
                        <span className="text-xs font-medium text-blue-600">Você</span>
                      </div>
                    )}
                  </div>
                ))}

                {isLoading && (
                  <div className="flex gap-2 justify-start">
                    <div className="h-8 w-8 bg-eco-green/10 rounded-full flex items-center justify-center shrink-0 mt-1">
                      <Bot className="h-4 w-4 text-eco-green" />
                    </div>
                    <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded-lg">
                      <div className="flex gap-1">
                        <div className="h-2 w-2 bg-eco-green rounded-full animate-bounce" />
                        <div className="h-2 w-2 bg-eco-green rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                        <div className="h-2 w-2 bg-eco-green rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                      </div>
                    </div>
                  </div>
                )}
              </div>
              <div ref={messagesEndRef} />
            </ScrollArea>

            <Separator />

            <div className="p-4 shrink-0">
              <div className="flex gap-2">
                <Input
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Pergunte sobre ecologia e sustentabilidade..."
                  className="flex-1"
                  disabled={isLoading}
                />
                <Button
                  onClick={handleSendMessage}
                  disabled={!inputValue.trim() || isLoading}
                  size="sm"
                  className="px-3"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
              <p className="text-xs text-muted-foreground mt-2 text-center">
                Powered by Google Gemini AI • Especializado em Presidente Prudente
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
