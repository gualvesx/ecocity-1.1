
import React from 'react';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

interface ProfileImageEditorProps {
  onClose: () => void;
  currentImageUrl?: string | null;
}

export const ProfileImageEditor: React.FC<ProfileImageEditorProps> = ({
  onClose,
  currentImageUrl
}) => {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6 text-center">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium">Editor de Foto do Perfil</h3>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="mb-4">
          <p className="text-muted-foreground mb-4">
            A funcionalidade de edição de foto do perfil foi temporariamente desabilitada.
          </p>
          <p className="text-sm text-muted-foreground">
            Em breve você poderá editar sua foto de perfil novamente.
          </p>
        </div>
        
        <Button onClick={onClose} variant="outline" className="w-full">
          Fechar
        </Button>
      </div>
    </div>
  );
};

export default ProfileImageEditor;
