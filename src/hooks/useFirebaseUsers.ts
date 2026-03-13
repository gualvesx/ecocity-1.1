
import { useState, useEffect } from 'react';
import { firebaseAuth } from '@/services/firebaseAuth';
import { User } from '@/contexts/AuthContext';

export const useFirebaseUsers = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = async () => {
    setIsLoading(true);
    setError(null);
    try {
      console.log("useFirebaseUsers: Fetching users from Firebase");
      const fetchedUsers = await firebaseAuth.getAllUsers();
      console.log("useFirebaseUsers: Users fetched successfully:", fetchedUsers);
      setUsers(fetchedUsers);
    } catch (err) {
      console.error("useFirebaseUsers: Error fetching users:", err);
      setError('Erro ao carregar usuários');
    } finally {
      setIsLoading(false);
    }
  };

  const updateUserAdminStatus = async (userId: string, isAdmin: boolean): Promise<boolean> => {
    try {
      const success = await firebaseAuth.updateUserAdminStatus(userId, isAdmin);
      if (success) {
        // Update local state
        setUsers(prevUsers => 
          prevUsers.map(user => 
            user.id === userId ? { ...user, isAdmin } : user
          )
        );
      }
      return success;
    } catch (error) {
      console.error('Error updating user admin status:', error);
      return false;
    }
  };

  const createUser = async (name: string, email: string, password: string, isAdmin: boolean): Promise<boolean> => {
    try {
      const success = await firebaseAuth.createUserByAdmin(name, email, password, isAdmin);
      if (success) {
        // Refresh users list
        await fetchUsers();
      }
      return success;
    } catch (error) {
      console.error('Error creating user:', error);
      return false;
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return {
    users,
    isLoading,
    error,
    fetchUsers,
    updateUserAdminStatus,
    createUser
  };
};
