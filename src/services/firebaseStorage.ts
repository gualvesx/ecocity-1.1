
import { getStorage, ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { app } from '@/config/firebase';

// Initialize Firebase Storage
const storage = getStorage(app);

export const firebaseStorage = {
  // Upload profile image
  uploadProfileImage: async (file: File, userId: string): Promise<string | null> => {
    if (!file) {
      console.log("Nenhum arquivo selecionado!");
      return null;
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      console.error('Apenas arquivos de imagem são permitidos');
      return null;
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      console.error('A imagem deve ter no máximo 5MB');
      return null;
    }

    // Create a reference for the file with better naming
    const fileExtension = file.name.split('.').pop();
    const fileName = `profile-${userId}-${Date.now()}.${fileExtension}`;
    const storageRef = ref(storage, `profile-images/${fileName}`);

    try {
      console.log('Iniciando upload da imagem de perfil...');
      
      // Upload the file
      const snapshot = await uploadBytes(storageRef, file);
      console.log('Upload da imagem de perfil concluído!', snapshot);

      // Get the download URL
      const downloadURL = await getDownloadURL(snapshot.ref);
      console.log('URL da imagem:', downloadURL);
      
      return downloadURL;
    } catch (error) {
      console.error("Erro ao fazer upload da imagem:", error);
      return null;
    }
  },

  // Delete profile image
  deleteProfileImage: async (imageUrl: string): Promise<boolean> => {
    try {
      // Extract the path from the URL to create storage reference
      const url = new URL(imageUrl);
      const pathStartIndex = url.pathname.indexOf('/o/') + 3;
      const pathEndIndex = url.pathname.indexOf('?');
      const path = decodeURIComponent(
        url.pathname.substring(pathStartIndex, pathEndIndex !== -1 ? pathEndIndex : undefined)
      );
      
      const imageRef = ref(storage, path);
      await deleteObject(imageRef);
      console.log('Imagem removida com sucesso');
      return true;
    } catch (error) {
      console.error("Erro ao remover imagem:", error);
      return false;
    }
  },

  // Upload general images with custom path
  uploadImage: async (file: File, path: string, customName?: string): Promise<string | null> => {
    if (!file) {
      console.log("Nenhum arquivo selecionado!");
      return null;
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      console.error('Apenas arquivos de imagem são permitidos');
      return null;
    }

    const fileExtension = file.name.split('.').pop();
    const fileName = customName || `image-${Date.now()}.${fileExtension}`;
    const storageRef = ref(storage, `${path}/${fileName}`);

    try {
      const snapshot = await uploadBytes(storageRef, file);
      console.log('Upload da imagem concluído!', snapshot);

      const downloadURL = await getDownloadURL(snapshot.ref);
      console.log('URL da imagem:', downloadURL);
      
      return downloadURL;
    } catch (error) {
      console.error("Erro ao fazer upload da imagem:", error);
      return null;
    }
  }
};

export { storage };
