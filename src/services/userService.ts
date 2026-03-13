
import { firebaseFirestore } from './firebaseFirestore';
import { User } from '@/types/user';

export const userService = {
  // Obter todos os usuários
  getAllUsers: async (): Promise<User[]> => {
    try {
      console.log('userService.getAllUsers - Fetching users from Firestore');
      const users = await firebaseFirestore.users.getAll();
      console.log('userService.getAllUsers - Fetched users:', users);
      return users;
    } catch (error) {
      console.error('userService.getAllUsers - Error:', error);
      throw error;
    }
  },

  // Obter usuário por ID
  getUserById: async (id: string): Promise<User | null> => {
    try {
      return await firebaseFirestore.users.getById(id);
    } catch (error) {
      console.error('userService.getUserById - Error:', error);
      throw error;
    }
  },

  // Atualizar status de admin do usuário
  updateUserAdminStatus: async (userId: string, isAdmin: boolean): Promise<boolean> => {
    try {
      console.log(`userService.updateUserAdminStatus - Updating user ${userId} to admin: ${isAdmin}`);
      
      // Update both isAdmin and role fields for compatibility
      await firebaseFirestore.users.update(userId, {
        isAdmin,
        role: isAdmin ? 'admin' : 'user'
      });
      
      console.log('userService.updateUserAdminStatus - Successfully updated');
      return true;
    } catch (error) {
      console.error('userService.updateUserAdminStatus - Error:', error);
      return false;
    }
  },

  // Atualizar perfil do usuário
  updateUserProfile: async (userId: string, profileData: Partial<User>): Promise<boolean> => {
    try {
      console.log(`userService.updateUserProfile - Updating user ${userId}:`, profileData);
      await firebaseFirestore.users.update(userId, profileData);
      console.log('userService.updateUserProfile - Successfully updated');
      return true;
    } catch (error) {
      console.error('userService.updateUserProfile - Error:', error);
      return false;
    }
  },

  // Excluir usuário
  deleteUser: async (userId: string): Promise<boolean> => {
    try {
      console.log(`userService.deleteUser - Deleting user ${userId}`);
      await firebaseFirestore.users.delete(userId);
      console.log('userService.deleteUser - Successfully deleted');
      return true;
    } catch (error) {
      console.error('userService.deleteUser - Error:', error);
      return false;
    }
  }
};
