
// Importa a configuração do Firebase da configuração central
import { app } from '@/config/firebase';
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Inicializa os serviços do Firebase
export const auth = getAuth(app);
export const firestore = getFirestore(app);
export const storage = getStorage(app);
