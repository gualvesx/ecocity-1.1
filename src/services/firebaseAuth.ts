import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  updateProfile,
  sendPasswordResetEmail,
  sendEmailVerification,
  GoogleAuthProvider,
  signInWithPopup,
  User as FirebaseUser
} from "firebase/auth";
import { doc, setDoc, getDoc, collection, getDocs, updateDoc } from "firebase/firestore";
import { auth, firestore } from './firebaseConfig';
import { User } from '@/contexts/AuthContext';

// Google Auth Provider - Configure properly with scopes
const googleProvider = new GoogleAuthProvider();
googleProvider.addScope('profile');
googleProvider.addScope('email');
googleProvider.setCustomParameters({ prompt: 'select_account' });

// Converter FirebaseUser para User da aplicação
const convertToContextUser = async (firebaseUser: FirebaseUser | null): Promise<User | null> => {
  if (!firebaseUser) return null;
  
  try {
    // Verificar se o usuário tem dados adicionais no Firestore
    const userDoc = await getDoc(doc(firestore, "users", firebaseUser.uid));
    const userData = userDoc.data();
    
    console.log("User data from Firestore:", userData);
    
    return {
      id: firebaseUser.uid,
      name: userData?.name || firebaseUser.displayName || "Usuário",
      email: userData?.email || firebaseUser.email || "",
      bio: userData?.bio || "",
      photoURL: userData?.photoURL || firebaseUser.photoURL || "",
      isAdmin: userData?.role === 'admin', // Check role field instead of isAdmin
      emailVerified: firebaseUser.emailVerified
    };
  } catch (error) {
    console.error("Error converting user:", error);
    // Fallback para dados básicos do Firebase Auth
    return {
      id: firebaseUser.uid,
      name: firebaseUser.displayName || "Usuário",
      email: firebaseUser.email || "",
      bio: "",
      photoURL: firebaseUser.photoURL || "",
      isAdmin: false,
      emailVerified: firebaseUser.emailVerified
    };
  }
};

export const firebaseAuth = {
  // Registrar novo usuário
  createUserWithEmailAndPassword: async (email: string, password: string, name: string): Promise<{ user: FirebaseUser }> => {
    try {
      console.log(`Creating user with email: ${email}, name: ${name}`);
      
      // 1. Create user in Firebase Auth - handles password securely
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      console.log("User created in Firebase Auth with UID:", userCredential.user.uid);
      
      // 2. Update profile with display name
      await updateProfile(userCredential.user, {
        displayName: name
      });
      console.log("Profile updated with displayName:", name);
      
      // 3. Send email verification
      await sendEmailVerification(userCredential.user);
      console.log("Verification email sent");
      
      // 4. Store additional data in Firestore - WITHOUT the password
      const userRef = doc(firestore, "users", userCredential.user.uid);
      
      // Create user document with EXACTLY the specified fields
      await setDoc(userRef, {
        name: name,
        email: email,
        role: 'user', // Default role is 'user' not 'admin'
        createdAt: new Date(),
        bio: "",
        photoURL: userCredential.user.photoURL || "" // In case of Google auth
      });
      
      console.log("User document created in Firestore");
      
      return { user: userCredential.user };
    } catch (error: any) {
      console.error("Error creating user:", error);
      console.error("Error code:", error.code);
      console.error("Error message:", error.message);
      throw error;
    }
  },
  
  // Login de usuário
  signInWithEmailAndPassword: async (email: string, password: string): Promise<{ user: FirebaseUser }> => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      return { user: userCredential.user };
    } catch (error) {
      console.error("Error signing in:", error);
      throw error;
    }
  },

  // Google Sign In - Reimplemented with proper error handling
  signInWithGoogle: async (): Promise<{ user: FirebaseUser }> => {
    try {
      console.log("Starting Google sign-in process...");
      const userCredential = await signInWithPopup(auth, googleProvider);
      console.log("Google sign-in successful:", userCredential.user.uid);
      
      // Check if it's a new user (first sign-in)
      const isNewUser = userCredential.user.metadata.creationTime === userCredential.user.metadata.lastSignInTime;
      
      if (isNewUser) {
        console.log("New Google user detected, creating Firestore document");
        // Create user document in Firestore for new Google users
        const userRef = doc(firestore, "users", userCredential.user.uid);
        await setDoc(userRef, {
          name: userCredential.user.displayName || 'Usuário Google',
          email: userCredential.user.email || '',
          role: 'user',
          createdAt: new Date(),
          bio: "",
          photoURL: userCredential.user.photoURL || ""
        });
        console.log("New Google user document created in Firestore");
      }
      
      return { user: userCredential.user };
    } catch (error: any) {
      console.error("Error signing in with Google:", error);
      console.error("Google auth error code:", error.code);
      console.error("Google auth error message:", error.message);
      
      // Handle specific Google auth errors
      if (error.code === 'auth/popup-closed-by-user') {
        console.log("User closed the Google sign-in popup");
      } else if (error.code === 'auth/popup-blocked') {
        console.log("Google sign-in popup was blocked");
      }
      
      throw error;
    }
  },
  
  // Send Password Reset Email - Fixed implementation
  sendPasswordResetEmail: async (email: string): Promise<void> => {
    try {
      console.log("Sending password reset email to:", email);
      await sendPasswordResetEmail(auth, email);
      console.log("Password reset email sent successfully");
    } catch (error: any) {
      console.error("Error sending password reset email:", error);
      console.error("Reset email error code:", error.code);
      console.error("Reset email error message:", error.message);
      throw error;
    }
  },
  
  // Send Email Verification - Fixed implementation
  sendEmailVerification: async (user: FirebaseUser): Promise<void> => {
    try {
      console.log("Sending verification email to user:", user.email);
      await sendEmailVerification(user);
      console.log("Verification email sent successfully");
    } catch (error: any) {
      console.error("Error sending verification email:", error);
      console.error("Verification email error code:", error.code);
      console.error("Verification email error message:", error.message);
      throw error;
    }
  },
  
  // Sair
  signOut: async (): Promise<void> => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Error signing out:", error);
      throw error;
    }
  },
  
  // Atualizar status de administrador
  updateUserAdmin: async (uid: string, isAdmin: boolean): Promise<void> => {
    try {
      const userRef = doc(firestore, "users", uid);
      // Update the role field instead of isAdmin
      await setDoc(userRef, { role: isAdmin ? 'admin' : 'user' }, { merge: true });
      console.log(`Updated user ${uid} role to ${isAdmin ? 'admin' : 'user'}`);
    } catch (error) {
      console.error(`Error updating user ${uid} admin status:`, error);
      throw error;
    }
  },
  
  // Update user profile information - FIXED VERSION
  updateUserProfile: async (uid: string, data: { bio?: string, photoURL?: string, name?: string }): Promise<void> => {
    try {
      console.log(`firebaseAuth.updateUserProfile - Updating user ${uid} with data:`, data);
      
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
      
      console.log(`firebaseAuth.updateUserProfile - Clean data to update:`, cleanData);
      
      const userRef = doc(firestore, "users", uid);
      await updateDoc(userRef, cleanData);
      console.log(`firebaseAuth.updateUserProfile - Successfully updated user ${uid}`);
    } catch (error) {
      console.error(`firebaseAuth.updateUserProfile - Error updating user ${uid} profile:`, error);
      throw error;
    }
  },
  
  // Obter todos os usuários - Modified for more reliable user fetching
  getAllUsers: async (): Promise<User[]> => {
    try {
      console.log("Fetching all users from Firestore");
      const usersRef = collection(firestore, "users");
      const snapshot = await getDocs(usersRef);
      
      if (snapshot.empty) {
        console.log("No users found in Firestore");
        return [];
      }
      
      console.log(`Found ${snapshot.size} users in Firestore`);
      
      const users = snapshot.docs.map(doc => {
        const data = doc.data();
        console.log(`User data for ${doc.id}:`, data);
        
        return {
          id: doc.id,
          name: data.name || "Usuário",
          email: data.email || "",
          bio: data.bio || "",
          photoURL: data.photoURL || "",
          isAdmin: data.role === 'admin', // Check role field instead of isAdmin
          emailVerified: false // Default, will be overwritten by actual Firebase auth state
        };
      });
      
      console.log("Processed users:", users);
      return users;
    } catch (error) {
      console.error("Error getting all users:", error);
      console.error(JSON.stringify(error));
      return [];
    }
  },
  
  // Utilitários
  convertToContextUser
};
