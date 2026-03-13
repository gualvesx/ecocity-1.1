
import { useState } from 'react';
import { firebaseStorage } from '@/services/firebaseStorage';
import { useAuth } from '@/contexts/AuthContext';
import { auth } from '@/config/firebase';
import { toast } from 'sonner';

interface UseImageUploadReturn {
  uploadImage: (file: File, userId: string, oldImageUrl?: string) => Promise<string | null>;
  uploadProgress: number;
  isUploading: boolean;
}

export const useImageUpload = (): UseImageUploadReturn => {
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const { user } = useAuth();

  const uploadImage = async (file: File, userId: string, oldImageUrl?: string): Promise<string | null> => {
    if (!file || !userId) {
      toast.error('Erro: Arquivo ou ID do usuário não fornecido.');
      return null;
    }

    // Check if user is authenticated in context
    if (!user || user.id !== userId) {
      toast.error('Erro: Usuário não autenticado ou não autorizado.');
      return null;
    }

    // Wait for Firebase auth to be ready and verify user matches
    let attempts = 0;
    const maxAttempts = 10;
    
    while (attempts < maxAttempts) {
      if (auth.currentUser && auth.currentUser.uid === userId) {
        console.log('Firebase auth verified - user authenticated:', auth.currentUser.uid);
        break;
      }
      
      console.log(`Waiting for Firebase auth... Attempt ${attempts + 1}/${maxAttempts}`);
      await new Promise(resolve => setTimeout(resolve, 500));
      attempts++;
    }

    // Final verification
    if (!auth.currentUser || auth.currentUser.uid !== userId) {
      toast.error('Erro: Autenticação Firebase não verificada. Tente fazer login novamente.');
      console.error('Firebase auth verification failed:', {
        firebaseUser: auth.currentUser?.uid,
        expectedUserId: userId,
        hasFirebaseUser: !!auth.currentUser,
        attempts
      });
      return null;
    }

    setIsUploading(true);
    setUploadProgress(0);
    toast.info('Iniciando upload da imagem...');

    try {
      // Simulate progress for better UX
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => Math.min(prev + 10, 90));
      }, 200);

      // Upload new image
      const downloadURL = await firebaseStorage.uploadProfileImage(file, userId);
      
      clearInterval(progressInterval);
      setUploadProgress(100);

      if (!downloadURL) {
        throw new Error('Falha ao obter URL da imagem');
      }

      // Delete old image if it exists and is from Firebase Storage
      if (oldImageUrl && oldImageUrl.includes('firebasestorage.googleapis.com')) {
        try {
          await firebaseStorage.deleteProfileImage(oldImageUrl);
          console.log('Imagem antiga removida com sucesso');
        } catch (deleteError) {
          console.warn('Não foi possível remover a imagem antiga:', deleteError);
          // Continue anyway, as the new upload was successful
        }
      }

      setIsUploading(false);
      setUploadProgress(0);
      toast.success('Imagem carregada com sucesso!');
      
      return downloadURL;
    } catch (error) {
      console.error('Erro no upload da imagem:', error);
      setIsUploading(false);
      setUploadProgress(0);
      toast.error('Erro ao fazer upload da imagem.');
      return null;
    }
  };

  return {
    uploadImage,
    uploadProgress,
    isUploading
  };
};
