
import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface MessageCarouselProps {
  messages: string[];
}

export const MessageCarousel = ({ messages }: MessageCarouselProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Auto-rotate messages every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % messages.length);
    }, 5000);
    
    return () => clearInterval(interval);
  }, [messages.length]);

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? messages.length - 1 : prevIndex - 1));
  };

  const goToNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % messages.length);
  };

  return (
    <div className="relative bg-eco-green text-white rounded-xl p-8 mb-8">
      <div className="min-h-[120px] flex items-center justify-center">
        <p className="text-xl font-medium text-center animate-fade-in">
          {messages[currentIndex]}
        </p>
      </div>
      
      <div className="flex justify-center gap-2 mt-4">
        {messages.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-3 h-3 rounded-full transition-colors ${
              index === currentIndex ? 'bg-white' : 'bg-white/40'
            }`}
            aria-label={`Ir para mensagem ${index + 1}`}
          />
        ))}
      </div>
      
      <button
        onClick={goToPrevious}
        className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30 transition-colors"
        aria-label="Mensagem anterior"
      >
        <ChevronLeft className="text-white" />
      </button>
      
      <button
        onClick={goToNext}
        className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30 transition-colors"
        aria-label="Próxima mensagem"
      >
        <ChevronRight className="text-white" />
      </button>
    </div>
  );
};
