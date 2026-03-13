
export interface User {
  id: string;
  name: string;
  email: string;
  bio: string;
  photoURL: string;
  isAdmin: boolean;
  emailVerified?: boolean;
  role?: 'admin' | 'user';
  dateOfBirth?: any; // Firebase timestamp or date string
  locale?: any; // Firebase geopoint or string  
  customData?: string;
  createdAt?: any; // Firebase timestamp or date string
}
