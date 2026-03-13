import React, { createContext, useState, useEffect, useContext, useCallback } from 'react';
import { toast } from 'sonner';
import { firebaseAuth } from '@/services/firebaseAuth';
import { userService } from '@/services/userService';
import { onAuthStateChanged, updateProfile as updateFirebaseProfile } from 'firebase/auth';
import { auth } from '@/services/firebaseConfig';
import { User } from '@/types/user';

// User types
export interface User {
  id: string;
  name: string;
  email: string;
  bio: string;
  photoURL: string;
  isAdmin: boolean;
  emailVerified?: boolean;
  role: 'admin' | 'user';
  dateOfBirth: string;
  locale: string;
  customData: string;
  createdAt: string;
}

// Auth context types
interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  loginWithGoogle: () => Promise<boolean>;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  getAllUsers: () => User[];
  sendPasswordReset: (email: string) => Promise<boolean>;
  sendVerificationEmail: () => Promise<boolean>;
  updateUserAdminStatus: (userId: string, isAdmin: boolean) => Promise<boolean>;
  createUserByAdmin: (name: string, email: string, password: string, isAdmin: boolean) => Promise<boolean>;
  updateProfile: (data: { displayName?: string, photoURL?: string }) => Promise<boolean>;
  updateUserProfile: (data: { bio?: string, photoURL?: string, name?: string }) => Promise<boolean>;
  checkProfileCompletion: () => boolean;
}

// Creating the context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Dummy users list (apenas para fallback, o Firebase é a fonte principal)
const dummyUsers: (User & { password: string })[] = [
  {
    id: '1',
    name: 'Admin',
    email: 'admin@terraverde.com',
    password: 'admin@123',
    bio: 'Administrador do sistema EcoCity',
    photoURL: '',
    isAdmin: true,
    emailVerified: true,
    role: 'admin',
    dateOfBirth: '',
    locale: 'pt-BR',
    customData: '',
    createdAt: new Date().toISOString()
  },
  {
    id: '2',
    name: 'Usuário',
    email: 'usuario@terraverde.com',
    password: 'usuario@123',
    bio: 'Usuário comum do EcoCity',
    photoURL: '',
    isAdmin: false,
    emailVerified: true,
    role: 'user',
    dateOfBirth: '',
    locale: 'pt-BR',
    customData: '',
    createdAt: new Date().toISOString()
  }
];

export const AuthProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [users, setUsers] = useState<(User & { password: string })[]>([]);

  // Initialize with Firebase Auth listener and fallback to local storage
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        // Manter os dados de usuário dummy apenas para fallback
        setUsers(dummyUsers);
        console.log("AuthProvider - Dados de usuário carregados para fallback local");
        
        // Set up Firebase Auth listener
        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
          console.log("AuthProvider - Auth state changed:", firebaseUser ? `User ${firebaseUser.uid}` : "No user");
          
          if (firebaseUser) {
            // User is logged in
            const appUser = await firebaseAuth.convertToContextUser(firebaseUser);
            if (appUser) {
              setUser(appUser);
              localStorage.setItem('currentUser', JSON.stringify(appUser));
              console.log("AuthProvider - User auth state updated with emailVerified:", appUser.emailVerified);
            }
          } else {
            // Check if a user is stored locally
            const storedUser = localStorage.getItem('currentUser');
            if (storedUser) {
              setUser(JSON.parse(storedUser));
            } else {
              setUser(null);
            }
          }
          setIsLoading(false);
        });
        
        return unsubscribe;
      } catch (error) {
        console.error("AuthProvider - Error loading users:", error);
        
        // Fallback to local storage if Firebase fails
        const storedUser = localStorage.getItem('currentUser');
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }
        
        setUsers(dummyUsers);
        setIsLoading(false);
      }
    };

    fetchInitialData();
  }, []);

  // Login function with improved email verification check
  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      // Try Firebase login first
      try {
        console.log("AuthProvider - Attempting login with Firebase...");
        const { user: firebaseUser } = await firebaseAuth.signInWithEmailAndPassword(email, password);
        console.log("AuthProvider - Login successful, checking email verification status");
        
        // Explicitly check email verification status
        if (!firebaseUser.emailVerified) {
          console.log("AuthProvider - Email not verified, sending verification email and preventing login");
          toast.warning('Por favor, verifique seu email antes de fazer login.');
          await firebaseAuth.sendEmailVerification(firebaseUser);
          await firebaseAuth.signOut(); // Sign out since email isn't verified
          setIsLoading(false);
          return false;
        }
        
        console.log("AuthProvider - Email verified, proceeding with login");
        const currentUser = await firebaseAuth.convertToContextUser(firebaseUser);
        
        if (currentUser) {
          setUser(currentUser);
          localStorage.setItem('currentUser', JSON.stringify(currentUser));
          toast.success(`Bem-vindo, ${currentUser.name}!`);
          return true;
        }
      } catch (firebaseError: any) {
        console.error("AuthProvider - Firebase login failed:", firebaseError);
        console.error("AuthProvider - Error code:", firebaseError.code);
        
        // Handle specific Firebase auth errors
        if (firebaseError.code === 'auth/user-not-found') {
          toast.error('Usuário não encontrado');
        } else if (firebaseError.code === 'auth/wrong-password') {
          toast.error('Senha incorreta');
        } else if (firebaseError.code === 'auth/too-many-requests') {
          toast.error('Muitas tentativas. Tente novamente mais tarde.');
        } else {
          toast.error('Erro ao fazer login');
        }
        
        return false;
      }
      
      // Fallback to local login if Firebase fails but doesn't throw
      return loginWithLocalData(email, password);
    } catch (error) {
      toast.error('Erro ao fazer login');
      console.error('AuthProvider - Login error:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };
  
  // Google Login function with improved error handling
  const loginWithGoogle = async (): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      console.log("AuthProvider - Attempting login with Google...");
      const { user: firebaseUser } = await firebaseAuth.signInWithGoogle();
      console.log("AuthProvider - Google login successful for:", firebaseUser.email);
      
      // Google-authenticated users are already email verified
      const currentUser = await firebaseAuth.convertToContextUser(firebaseUser);
      
      if (currentUser) {
        setUser(currentUser);
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        toast.success(`Bem-vindo, ${currentUser.name}!`);
        return true;
      }
      
      return false;
    } catch (error: any) {
      console.error('AuthProvider - Google login error:', error);
      
      // Don't show error for user-initiated cancellations
      if (error.code === 'auth/popup-closed-by-user') {
        console.log("AuthProvider - User closed the Google login popup");
      } else if (error.code === 'auth/popup-blocked') {
        toast.error('Pop-up bloqueado. Permita pop-ups para continuar.');
      } else {
        toast.error('Erro ao fazer login com Google');
      }
      
      return false;
    } finally {
      setIsLoading(false);
    }
  };
  
  // Helper for local login (fallback)
  const loginWithLocalData = (email: string, password: string): boolean => {
    const foundUser = users.find(u => 
      u.email.toLowerCase() === email.toLowerCase() && 
      u.password === password
    );
    
    if (foundUser) {
      const { password, ...userWithoutPassword } = foundUser;
      setUser(userWithoutPassword);
      localStorage.setItem('currentUser', JSON.stringify(userWithoutPassword));
      toast.success(`Welcome, ${foundUser.name}!`);
      return true;
    } else {
      toast.error('Incorrect email or password');
      return false;
    }
  };
  
  // Send password reset email with improved error handling
  const sendPasswordReset = async (email: string): Promise<boolean> => {
    try {
      console.log("AuthProvider - Sending password reset email to:", email);
      await firebaseAuth.sendPasswordResetEmail(email);
      toast.success('Email de recuperação enviado com sucesso!');
      return true;
    } catch (error: any) {
      console.error('AuthProvider - Error sending password reset:', error);
      
      if (error.code === 'auth/user-not-found') {
        toast.error('Nenhum usuário encontrado com este email');
      } else {
        toast.error('Erro ao enviar email de recuperação');
      }
      
      return false;
    }
  };
  
  // Send verification email with improved error handling
  const sendVerificationEmail = async (): Promise<boolean> => {
    if (!auth.currentUser) {
      toast.error('Nenhum usuário conectado');
      return false;
    }
    
    try {
      console.log("AuthProvider - Sending verification email to:", auth.currentUser.email);
      await firebaseAuth.sendEmailVerification(auth.currentUser);
      toast.success('Email de verificação enviado com sucesso!');
      return true;
    } catch (error: any) {
      console.error('AuthProvider - Error sending verification email:', error);
      
      if (error.code === 'auth/too-many-requests') {
        toast.error('Muitos pedidos. Tente novamente mais tarde.');
      } else {
        toast.error('Erro ao enviar email de verificação');
      }
      
      return false;
    }
  };

  // Registration function - Fixed to ensure user is created properly
  const register = async (name: string, email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    console.log("AuthProvider - Starting registration process for:", name, email);
    
    try {
      // Try Firebase registration
      try {
        console.log("AuthProvider - Attempting registration with Firebase...");
        
        // 1. Create user in Firebase Auth and Firestore
        const { user: firebaseUser } = await firebaseAuth.createUserWithEmailAndPassword(email, password, name);
        console.log("AuthProvider - User created in Firebase with UID:", firebaseUser.uid);
        
        // 2. Wait a moment for Firestore write to complete (important!)
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // 3. Fetch the user data to verify it was created properly
        const newUser = await firebaseAuth.convertToContextUser(firebaseUser);
        console.log("AuthProvider - User data from Firestore:", newUser);
        
        // 4. Show toast about email verification
        toast.success('Registro realizado com sucesso! Verifique seu email para completar o cadastro.');
        
        // 5. Sign out to force email verification
        await firebaseAuth.signOut();
        
        return true;
      } catch (firebaseError: any) {
        console.error("AuthProvider - Firebase registration failed:", firebaseError);
        console.error("AuthProvider - Error code:", firebaseError.code);
        console.error("AuthProvider - Error message:", firebaseError.message);
        
        // Handle specific Firebase error codes
        if (firebaseError.code === 'auth/email-already-in-use') {
          toast.error('Este email já está em uso');
          throw new Error('Este email já está em uso');
        }
        
        // Try local registration as fallback
        return registerLocally(name, email, password);
      }
    } catch (error) {
      console.error('AuthProvider - Registration error:', error);
      
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error('Erro ao registrar usuário');
      }
      
      return false;
    } finally {
      setIsLoading(false);
    }
  };
  
  // Helper for local registration (fallback)
  const registerLocally = (name: string, email: string, password: string): boolean => {
    if (users.some(u => u.email.toLowerCase() === email.toLowerCase())) {
      toast.error('Email already registered');
      return false;
    }
    
    // Create new user
    const newUser = {
      id: Date.now().toString(),
      name,
      email,
      password,
      bio: '',
      photoURL: '',
      isAdmin: false,
      emailVerified: true,
      role: 'user' as const,
      dateOfBirth: '',
      locale: 'pt-BR',
      customData: '',
      createdAt: new Date().toISOString()
    };
    
    const updatedUsers = [...users, newUser];
    setUsers(updatedUsers);
    
    // Auto-login the user
    const { password: _, ...userWithoutPassword } = newUser;
    setUser(userWithoutPassword);
    localStorage.setItem('currentUser', JSON.stringify(userWithoutPassword));
    
    toast.success('Registro realizado com sucesso! (modo local)');
    return true;
  };

  // Logout function
  const logout = async () => {
    try {
      // Try Firebase logout first
      try {
        await firebaseAuth.signOut();
        console.log("AuthProvider - Logged out from Firebase");
      } catch (firebaseError) {
        console.log("AuthProvider - Firebase logout failed", firebaseError);
      }
    } catch (error) {
      console.error('AuthProvider - Error logging out:', error);
    }
    
    // Clear local data
    setUser(null);
    localStorage.removeItem('currentUser');
    toast.info('Você saiu do sistema');
  };

  // Function to get all users using userService
  const getAllUsers = useCallback((): User[] => {
    if (!user?.isAdmin) return [];
    
    // Return local users as fallback since this is synchronous
    return users.map(({ password, ...userWithoutPassword }) => userWithoutPassword);
  }, [users, user?.isAdmin]);

  // Function to update a user's admin status using userService
  const updateUserAdminStatus = async (userId: string, isAdmin: boolean): Promise<boolean> => {
    if (!user?.isAdmin) {
      toast.error('Você não tem permissão para realizar esta ação');
      return false;
    }
    
    try {
      console.log(`AuthProvider.updateUserAdminStatus - Updating user ${userId} admin status to ${isAdmin}`);
      
      // Try to update in Firebase first
      try {
        const success = await userService.updateUserAdminStatus(userId, isAdmin);
        if (success) {
          // Update local data for consistency
          updateLocalUserAdminStatus(userId, isAdmin);
          return true;
        }
      } catch (firebaseError) {
        console.log("AuthProvider - Firebase update failed, falling back to local methods", firebaseError);
      }
      
      // If Firebase is not available, use local update
      return updateLocalUserAdminStatus(userId, isAdmin);
    } catch (error) {
      console.error('AuthProvider - Error updating user status:', error);
      return false;
    }
  };
  
  // Helper for local admin status update
  const updateLocalUserAdminStatus = (userId: string, isAdmin: boolean): boolean => {
    const updatedUsers = users.map(u => {
      if (u.id === userId) {
        return { ...u, isAdmin, role: isAdmin ? 'admin' as const : 'user' as const };
      }
      return u;
    });
    
    // Update state
    setUsers(updatedUsers);
    
    // If the modified user is the current user, update their state too
    if (user && user.id === userId) {
      const updatedUser = { ...user, isAdmin, role: isAdmin ? 'admin' as const : 'user' as const };
      setUser(updatedUser);
      localStorage.setItem('currentUser', JSON.stringify(updatedUser));
    }
    
    return true;
  };
  
  // Function to create user by admin
  const createUserByAdmin = async (
    name: string, 
    email: string, 
    password: string, 
    isAdmin: boolean
  ): Promise<boolean> => {
    if (!user?.isAdmin) {
      toast.error('Você não tem permissão para realizar esta ação');
      return false;
    }
    
    setIsLoading(true);
    
    try {
      // Try to create user in Firebase first
      try {
        console.log("AuthProvider - Creating user in Firebase...");
        const { user: firebaseUser } = await firebaseAuth.createUserWithEmailAndPassword(email, password, name);
        
        if (isAdmin) {
          await firebaseAuth.updateUserAdmin(firebaseUser.uid, isAdmin);
        }
        
        toast.success('Usuário criado com sucesso!');
        return true;
      } catch (firebaseError) {
        console.log("AuthProvider - Firebase user creation failed, falling back to local", firebaseError);
        return createLocalUserByAdmin(name, email, password, isAdmin);
      }
    } catch (error) {
      toast.error('Erro ao criar usuário');
      console.error('AuthProvider - User creation error:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };
  
  // Helper for local user creation by admin
  const createLocalUserByAdmin = (name: string, email: string, password: string, isAdmin: boolean): boolean => {
    if (users.some(u => u.email.toLowerCase() === email.toLowerCase())) {
      toast.error('Email já cadastrado');
      return false;
    }
    
    // Create new user
    const newUser = {
      id: Date.now().toString(),
      name,
      email,
      password,
      bio: '',
      photoURL: '',
      isAdmin,
      emailVerified: true,
      role: isAdmin ? 'admin' as const : 'user' as const,
      dateOfBirth: '',
      locale: 'pt-BR',
      customData: '',
      createdAt: new Date().toISOString()
    };
    
    const updatedUsers = [...users, newUser];
    setUsers(updatedUsers);
    
    toast.success('Usuário criado com sucesso (modo local)!');
    return true;
  };

  // Fixed updateProfile function for Firebase Auth profile updates
  const updateProfile = async (data: { displayName?: string, photoURL?: string }): Promise<boolean> => {
    if (!auth.currentUser) {
      toast.error("Você precisa estar logado para atualizar seu perfil");
      return false;
    }
    
    setIsLoading(true);
    
    try {
      console.log("AuthProvider - Updating Firebase Auth profile with data:", data);
      
      // Update Firebase Auth profile
      await updateFirebaseProfile(auth.currentUser, {
        displayName: data.displayName || auth.currentUser.displayName,
        photoURL: data.photoURL || auth.currentUser.photoURL
      });
      
      // Also update Firestore data
      if (user) {
        const firestoreData: { name?: string, photoURL?: string } = {};
        if (data.displayName) firestoreData.name = data.displayName;
        if (data.photoURL) firestoreData.photoURL = data.photoURL;
        
        await firebaseAuth.updateUserProfile(user.id, firestoreData);
        
        // Update local user data
        const updatedUser = { 
          ...user, 
          name: data.displayName || user.name,
          photoURL: data.photoURL || user.photoURL
        };
        setUser(updatedUser);
        localStorage.setItem('currentUser', JSON.stringify(updatedUser));
      }
      
      toast.success("Perfil atualizado com sucesso!");
      return true;
    } catch (error) {
      console.error("AuthProvider - Error updating profile:", error);
      toast.error("Erro ao atualizar perfil");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Function to update user profile information - FIXED VERSION
  const updateUserProfile = async (data: { bio?: string, photoURL?: string, name?: string }): Promise<boolean> => {
    if (!user) {
      toast.error("Você precisa estar logado para atualizar seu perfil");
      return false;
    }
    
    setIsLoading(true);
    
    try {
      // Filter out undefined values to prevent Firebase errors
      const cleanData: { bio?: string, photoURL?: string, name?: string } = {};
      
      if (data.name !== undefined && data.name.trim() !== '') {
        cleanData.name = data.name.trim();
      }
      
      if (data.bio !== undefined) {
        cleanData.bio = data.bio;
      }
      
      if (data.photoURL !== undefined && data.photoURL.trim() !== '') {
        cleanData.photoURL = data.photoURL.trim();
      }
      
      console.log(`AuthProvider - Updating user ${user.id} profile with clean data:`, cleanData);
      
      // Try to update in Firebase first
      try {
        await firebaseAuth.updateUserProfile(user.id, cleanData);
        
        // Also update Firebase Auth profile if name or photo changed
        if (cleanData.name || cleanData.photoURL) {
          await updateProfile({
            displayName: cleanData.name,
            photoURL: cleanData.photoURL
          });
        }
        
        // Update local user data
        const updatedUser = { ...user, ...cleanData };
        setUser(updatedUser);
        localStorage.setItem('currentUser', JSON.stringify(updatedUser));
        
        toast.success("Perfil atualizado com sucesso!");
        return true;
      } catch (firebaseError) {
        console.log("AuthProvider - Firebase update failed, falling back to local methods", firebaseError);
        
        // Update local user data as fallback
        const updatedUser = { ...user, ...cleanData };
        setUser(updatedUser);
        localStorage.setItem('currentUser', JSON.stringify(updatedUser));
        
        toast.success("Perfil atualizado localmente!");
        return true;
      }
    } catch (error) {
      console.error("AuthProvider - Error updating user profile:", error);
      toast.error("Erro ao atualizar perfil");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Function to check if user profile is complete (has bio and photo)
  const checkProfileCompletion = (): boolean => {
    if (!user) return false;
    
    // Check if user has completed their bio
    const hasBio = !!user.bio && user.bio.trim().length > 0;
    
    // We don't require photo for profile completion, just bio
    return hasBio;
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      isLoading, 
      login,
      loginWithGoogle,
      register, 
      logout,
      sendPasswordReset,
      sendVerificationEmail,
      getAllUsers,
      updateUserAdminStatus,
      createUserByAdmin,
      updateProfile,
      updateUserProfile,
      checkProfileCompletion
    }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook to use the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
