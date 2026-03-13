import { doc, collection, getDoc, getDocs, addDoc, updateDoc, deleteDoc, query, where, CollectionReference, DocumentData, serverTimestamp } from "firebase/firestore";
import { firestore, auth } from './firebaseConfig';
import { Event, EventRequest } from '@/types/events';
import { MapPoint } from '@/types/map';
import { User } from '@/types/user';
import { Plant } from '@/types/plants';
import { BlogPost } from '@/types/blogs';

// Helper function to safely execute Firestore operations
const safeFirestoreOperation = async <T>(operation: () => Promise<T>, operationName: string): Promise<T> => {
  try {
    // Check if user is authenticated before any operation
    if (!auth.currentUser) {
      throw new Error(`Usuário não autenticado para ${operationName}. Faça login novamente.`);
    }
    
    console.log(`Executing Firestore operation: ${operationName} for user:`, auth.currentUser.uid);
    return await operation();
  } catch (error: any) {
    console.error(`Error in ${operationName}:`, error);
    
    // Handle specific Firebase errors
    if (error.code === 'permission-denied') {
      throw new Error(`Permissão negada: Você não tem autorização para ${operationName}. Verifique as regras de segurança do Firebase.`);
    } else if (error.code === 'unavailable') {
      throw new Error(`Serviço indisponível: Tente novamente em alguns instantes.`);
    } else if (error.code === 'not-found') {
      throw new Error(`Documento não encontrado para ${operationName}.`);
    } else if (error.code === 'failed-precondition') {
      throw new Error(`Operação falhou: Verifique as configurações do Firebase.`);
    }
    
    throw error;
  }
};

// Helper function to convert Firebase timestamp to ISO string
const convertTimestamp = (timestamp: any): string => {
  if (!timestamp) return new Date().toISOString();
  
  // If it's a Firebase timestamp object
  if (timestamp.seconds && typeof timestamp.seconds === 'number') {
    return new Date(timestamp.seconds * 1000 + (timestamp.nanoseconds || 0) / 1000000).toISOString();
  }
  
  // If it's already a date object
  if (timestamp.toDate && typeof timestamp.toDate === 'function') {
    return timestamp.toDate().toISOString();
  }
  
  // If it's a string
  if (typeof timestamp === 'string') {
    return timestamp;
  }
  
  // If it's a number (milliseconds)
  if (typeof timestamp === 'number') {
    return new Date(timestamp).toISOString();
  }
  
  // Fallback to current date
  return new Date().toISOString();
};

// Converter MapPoint do Firestore para o tipo MapPoint da aplicação
const convertToMapPoint = (doc: any): MapPoint => {
  const data = doc.data ? doc.data() : doc;
  
  // Validate required fields
  if (!data.name || !data.type) {
    console.warn('Invalid map point data:', data);
  }
  
  return {
    id: doc.id || data.id || 0,
    firebaseId: doc.id,
    name: data.name || '',
    type: data.type || '',
    lat: typeof data.lat === 'number' ? data.lat : parseFloat(data.lat) || 0,
    lng: typeof data.lng === 'number' ? data.lng : parseFloat(data.lng) || 0,
    description: data.description || '',
    impact: data.impact || '',
    address: data.address || ''
  };
};

// Converter Event do Firestore para o tipo Event da aplicação
const convertToEvent = (doc: any): Event => {
  const data = doc.data ? doc.data() : doc;
  
  // Normalizar times e locations
  let times: EventTime[] = [];
  let locations: EventLocation[] = [];
  
  // Se já tem a estrutura nova, usar
  if (data.times && Array.isArray(data.times)) {
    times = data.times;
  } else if (data.date) {
    // Converter formato legado
    times = [{
      date: data.date,
      time: data.time || '',
      endTime: data.endTime
    }];
  }
  
  if (data.locations && Array.isArray(data.locations)) {
    locations = data.locations;
  } else if (data.address) {
    // Converter formato legado
    locations = [{
      address: data.address,
      lat: typeof data.lat === 'number' ? data.lat : parseFloat(data.lat) || undefined,
      lng: typeof data.lng === 'number' ? data.lng : parseFloat(data.lng) || undefined
    }];
  }
  
  return {
    id: doc.id,
    title: data.title || '',
    description: data.description || '',
    times,
    locations,
    organizer: data.organizer || '',
    contact: data.contact,
    website: data.website,
    createdBy: data.createdBy || '',
    createdAt: convertTimestamp(data.createdAt),
    // Manter campos legados para compatibilidade
    date: data.date,
    time: data.time,
    address: data.address,
    lat: typeof data.lat === 'number' ? data.lat : parseFloat(data.lat) || 0,
    lng: typeof data.lng === 'number' ? data.lng : parseFloat(data.lng) || 0
  };
};

// Converter EventRequest do Firestore para o tipo EventRequest da aplicação
const convertToEventRequest = (doc: any): EventRequest => {
  const data = doc.data ? doc.data() : doc;
  return {
    id: doc.id,
    title: data.title || '',
    description: data.description || '',
    date: data.date || '',
    time: data.time || '',
    address: data.address || '',
    organizer: data.organizer || '',
    createdBy: data.createdBy || '',
    status: data.status || 'pending',
    createdAt: convertTimestamp(data.createdAt)
  };
};

// Converter User do Firestore para o tipo User da aplicação
const convertToUser = (doc: any): User => {
  const data = doc.data ? doc.data() : doc;

  // Convert Firebase geopoint to string if needed
  const convertGeopoint = (geopoint: any) => {
    if (!geopoint) return '';
    if (geopoint.latitude && geopoint.longitude) {
      return `[${geopoint.latitude}° S, ${geopoint.longitude}° W]`;
    }
    return geopoint;
  };

  return {
    id: doc.id,
    name: data.name || '',
    email: data.email || '',
    bio: data.bio || '',
    photoURL: data.photoURL || '',
    isAdmin: data.role === 'admin' || data.isAdmin || false,
    emailVerified: data.emailVerified || false,
    role: data.role || 'user',
    dateOfBirth: convertTimestamp(data.dateOfBirth),
    locale: convertGeopoint(data.locale),
    customData: data.customData || '',
    createdAt: convertTimestamp(data.createdAt)
  };
};

// Converter Plant do Firestore para o tipo Plant da aplicação
const convertToPlant = (doc: any): Plant => {
  const data = doc.data ? doc.data() : doc;
  return {
    id: doc.id,
    name: data.name || '',
    description: data.description || '',
    imageURL: data.imageURL || '',
    createdBy: data.createdBy || '',
    createdAt: convertTimestamp(data.createdAt)
  };
};

// Converter BlogPost do Firestore para o tipo BlogPost da aplicação
const convertToBlogPost = (doc: any): any => {
  const data = doc.data ? doc.data() : doc;
  
  // Garantir que temos todos os campos necessários
  const title = data.title || data.name || 'Sem título';
  
  return {
    id: doc.id,
    // Campos principais
    title: title,
    name: title, // Manter compatibilidade
    author: data.author || 'Autor desconhecido',
    excerpt: data.excerpt || 'Sem descrição disponível.',
    content: data.content || '',
    
    // Timestamps
    createdAt: convertTimestamp(data.createdAt),
    publishedAt: data.publishedAt ? convertTimestamp(data.publishedAt) : undefined,
    updatedAt: data.updatedAt ? convertTimestamp(data.updatedAt) : undefined,
    
    // Categorização
    category: data.category || data.theme || 'Geral',
    theme: data.theme || data.category || 'Geral', // Manter compatibilidade
    tags: data.tags || [],
    topics: data.topics || '', // Manter compatibilidade
    
    // Metadata
    slug: data.slug || '',
    image: data.image || 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab',
    readTime: data.readTime || '5 min de leitura',
    views: data.views || 0,
    likes: data.likes || 0,
    
    // Status
    status: data.status || 'draft',
    featured: data.featured || false,
    
    // SEO
    metaTitle: data.metaTitle || title,
    metaDescription: data.metaDescription || data.excerpt || 'Sem descrição disponível.',
    
    // Autor info
    authorId: data.authorId || ''
  };
};

// Serviço para interagir com o Firestore
export const firebaseFirestore = {
  // Método para obter referência de coleção
  collection: <T = DocumentData>(collectionPath: string): CollectionReference<T, T> => {
    return collection(firestore, collectionPath) as CollectionReference<T, T>;
  },
  
  // Métodos para eventos
  events: {
    // Obter todos os eventos
    getAll: async (): Promise<Event[]> => {
      return safeFirestoreOperation(async () => {
        const eventsRef = collection(firestore, "events");
        const snapshot = await getDocs(eventsRef);
        return snapshot.docs.map(doc => convertToEvent({ id: doc.id, data: () => doc.data() }));
      }, 'buscar eventos');
    },
    
    getById: async (id: string): Promise<Event | null> => {
      return safeFirestoreOperation(async () => {
        const eventRef = doc(firestore, "events", id);
        const eventDoc = await getDoc(eventRef);
        
        if (!eventDoc.exists()) {
          return null;
        }
        
        return convertToEvent({ id: eventDoc.id, data: () => eventDoc.data() });
      }, `buscar evento ${id}`);
    },
    
    add: async (eventData: Omit<Event, 'id'>): Promise<Event> => {
      return safeFirestoreOperation(async () => {
        const eventsRef = collection(firestore, "events");
        const docRef = await addDoc(eventsRef, {
          ...eventData,
          createdAt: new Date().toISOString()
        });
        
        const eventDoc = await getDoc(docRef);
        return convertToEvent({ id: eventDoc.id, data: () => eventDoc.data() });
      }, 'adicionar evento');
    },
    
    update: async (id: string, eventData: Partial<Event>): Promise<void> => {
      return safeFirestoreOperation(async () => {
        const eventRef = doc(firestore, "events", id);
        await updateDoc(eventRef, {
          ...eventData,
          updatedAt: new Date().toISOString()
        });
      }, `atualizar evento ${id}`);
    },
    
    delete: async (id: string): Promise<void> => {
      return safeFirestoreOperation(async () => {
        const eventRef = doc(firestore, "events", id);
        await deleteDoc(eventRef);
      }, `deletar evento ${id}`);
    }
  },
  
  // Métodos para solicitações de eventos
  eventRequests: {
    // Obter todas as solicitações de eventos
    getAll: async (): Promise<EventRequest[]> => {
      return safeFirestoreOperation(async () => {
        const requestsRef = collection(firestore, "eventRequests");
        const snapshot = await getDocs(requestsRef);
        return snapshot.docs.map(doc => convertToEventRequest({ id: doc.id, data: () => doc.data() }));
      }, 'buscar solicitações de eventos');
    },
    
    getByUser: async (userId: string): Promise<EventRequest[]> => {
      return safeFirestoreOperation(async () => {
        const requestsRef = collection(firestore, "eventRequests");
        const userQuery = query(requestsRef, where("createdBy", "==", userId));
        const snapshot = await getDocs(userQuery);
        return snapshot.docs.map(doc => convertToEventRequest({ id: doc.id, data: () => doc.data() }));
      }, `buscar solicitações de eventos do usuário ${userId}`);
    },
    
    add: async (requestData: Omit<EventRequest, 'id'>): Promise<EventRequest> => {
      return safeFirestoreOperation(async () => {
        const requestsRef = collection(firestore, "eventRequests");
        const docRef = await addDoc(requestsRef, {
          ...requestData,
          createdAt: new Date().toISOString()
        });
        
        const requestDoc = await getDoc(docRef);
        return convertToEventRequest({ id: requestDoc.id, data: () => requestDoc.data() });
      }, 'adicionar solicitação de evento');
    },
    
    update: async (id: string, requestData: Partial<EventRequest>): Promise<void> => {
      return safeFirestoreOperation(async () => {
        const requestRef = doc(firestore, "eventRequests", id);
        await updateDoc(requestRef, {
          ...requestData,
          updatedAt: new Date().toISOString()
        });
      }, `atualizar solicitação de evento ${id}`);
    },
    
    delete: async (id: string): Promise<void> => {
      return safeFirestoreOperation(async () => {
        const requestRef = doc(firestore, "eventRequests", id);
        await deleteDoc(requestRef);
      }, `deletar solicitação de evento ${id}`);
    }
  },
  
  // Métodos para mapPoints com melhor tratamento de erros e autenticação
  mapPoints: {
    // Obter todos os pontos do mapa
    getAll: async (): Promise<MapPoint[]> => {
      try {
        console.log('firebaseFirestore.mapPoints.getAll - Starting fetch');
        const pointsRef = collection(firestore, "mapPoints");
        const snapshot = await getDocs(pointsRef);
        console.log('firebaseFirestore.mapPoints.getAll - Raw docs:', snapshot.docs.length);
        
        const points = snapshot.docs.map((doc, index) => {
          const point = convertToMapPoint({ id: doc.id, data: () => doc.data() });
          // Generate numeric ID for compatibility
          point.id = index + 1;
          point.firebaseId = doc.id;
          console.log('Converted point:', point);
          return point;
        });
        
        console.log('firebaseFirestore.mapPoints.getAll - Converted points:', points);
        return points;
      } catch (error: any) {
        console.error('Error fetching map points:', error);
        
        // Return empty array for read operations that fail
        return [];
      }
    },
    
    add: async (pointData: Omit<MapPoint, 'id'> & { createdBy?: string }): Promise<MapPoint> => {
      return safeFirestoreOperation(async () => {
        console.log('firebaseFirestore.mapPoints.add - Input data:', pointData);
        
        // Validate required fields
        if (!pointData.name || !pointData.type) {
          throw new Error('Nome e tipo são obrigatórios para criar um ponto do mapa');
        }
        
        if (!auth.currentUser) {
          throw new Error('Usuário não autenticado para adicionar ponto do mapa');
        }
        
        const pointsRef = collection(firestore, "mapPoints");
        const docData = {
          ...pointData,
          createdBy: pointData.createdBy || auth.currentUser.uid,
          createdAt: serverTimestamp()
        };
        
        console.log('firebaseFirestore.mapPoints.add - Saving with data:', docData);
        
        const docRef = await addDoc(pointsRef, docData);
        
        const pointDoc = await getDoc(docRef);
        const newPoint = convertToMapPoint({ id: docRef.id, data: () => pointDoc.data() });
        // Generate numeric ID for compatibility
        newPoint.id = Date.now();
        newPoint.firebaseId = docRef.id;
        
        console.log('firebaseFirestore.mapPoints.add - Created point:', newPoint);
        return newPoint;
      }, 'adicionar ponto do mapa');
    },
    
    update: async (firebaseId: string, pointData: Partial<MapPoint>): Promise<void> => {
      return safeFirestoreOperation(async () => {
        console.log('firebaseFirestore.mapPoints.update - Updating document ID:', firebaseId);
        
        if (!firebaseId) {
          throw new Error('ID do documento Firebase é obrigatório para atualizar');
        }
        
        if (!auth.currentUser) {
          throw new Error('Usuário não autenticado para atualizar ponto do mapa');
        }
        
        const pointRef = doc(firestore, "mapPoints", firebaseId);
        await updateDoc(pointRef, {
          ...pointData,
          updatedAt: new Date().toISOString()
        });
        console.log('firebaseFirestore.mapPoints.update - Successfully updated');
      }, `atualizar ponto do mapa ${firebaseId}`);
    },
    
    delete: async (firebaseId: string): Promise<void> => {
      return safeFirestoreOperation(async () => {
        console.log('firebaseFirestore.mapPoints.delete - Deleting document ID:', firebaseId);
        
        if (!firebaseId) {
          throw new Error('ID do documento Firebase é obrigatório para deletar');
        }
        
        if (!auth.currentUser) {
          throw new Error('Usuário não autenticado para deletar ponto do mapa');
        }
        
        const pointRef = doc(firestore, "mapPoints", firebaseId);
        await deleteDoc(pointRef);
        console.log('firebaseFirestore.mapPoints.delete - Successfully deleted');
      }, `deletar ponto do mapa ${firebaseId}`);
    }
  },
  
  // Métodos para usuários atualizados
  users: {
    // Obter todos os usuários
    getAll: async (): Promise<User[]> => {
      return safeFirestoreOperation(async () => {
        const usersRef = collection(firestore, "users");
        const snapshot = await getDocs(usersRef);
        console.log('firebaseFirestore.users.getAll - Raw docs:', snapshot.docs.length);
        
        const users = snapshot.docs.map(doc => convertToUser({ id: doc.id, data: () => doc.data() }));
        
        console.log('firebaseFirestore.users.getAll - Converted users:', users);
        return users;
      }, 'buscar usuários');
    },
    
    // Obter um usuário específico por ID
    getById: async (id: string): Promise<User | null> => {
      return safeFirestoreOperation(async () => {
        const userRef = doc(firestore, "users", id);
        const userDoc = await getDoc(userRef);
        
        if (!userDoc.exists()) {
          return null;
        }
        
        return convertToUser({ id: userDoc.id, data: () => userDoc.data() });
      }, `buscar usuário ${id}`);
    },
    
    // Atualizar um usuário
    update: async (id: string, userData: Partial<User>): Promise<void> => {
      return safeFirestoreOperation(async () => {
        const userRef = doc(firestore, "users", id);
        await updateDoc(userRef, {
          ...userData,
          updatedAt: new Date().toISOString()
        });
      }, `atualizar usuário ${id}`);
    },

    // Excluir um usuário
    delete: async (id: string): Promise<void> => {
      return safeFirestoreOperation(async () => {
        const userRef = doc(firestore, "users", id);
        await deleteDoc(userRef);
      }, `deletar usuário ${id}`);
    }
  },
  
  // Métodos para plantas
  plants: {
    // Obter todas as plantas
    getAll: async (): Promise<Plant[]> => {
      try {
        console.log('firebaseFirestore.plants.getAll - Starting fetch');
        const plantsRef = collection(firestore, "plants");
        const snapshot = await getDocs(plantsRef);
        console.log('firebaseFirestore.plants.getAll - Raw docs:', snapshot.docs.length);
        
        const plants = snapshot.docs.map(doc => convertToPlant({ id: doc.id, data: () => doc.data() }));
        
        console.log('firebaseFirestore.plants.getAll - Converted plants:', plants);
        return plants;
      } catch (error: any) {
        console.error('Error fetching plants:', error);
        return [];
      }
    },
    
    add: async (plantData: Omit<Plant, 'id'>): Promise<Plant> => {
      return safeFirestoreOperation(async () => {
        console.log('firebaseFirestore.plants.add - Input data:', plantData);
        
        if (!plantData.name || !plantData.description) {
          throw new Error('Nome e descrição são obrigatórios para criar uma planta');
        }
        
        if (!auth.currentUser) {
          throw new Error('Usuário não autenticado para adicionar planta');
        }
        
        const plantsRef = collection(firestore, "plants");
        const docData = {
          ...plantData,
          createdAt: serverTimestamp()
        };
        
        console.log('firebaseFirestore.plants.add - Saving with data:', docData);
        
        const docRef = await addDoc(plantsRef, docData);
        
        const plantDoc = await getDoc(docRef);
        const newPlant = convertToPlant({ id: docRef.id, data: () => plantDoc.data() });
        
        console.log('firebaseFirestore.plants.add - Created plant:', newPlant);
        return newPlant;
      }, 'adicionar planta');
    },
    
    update: async (id: string, plantData: Partial<Plant>): Promise<void> => {
      return safeFirestoreOperation(async () => {
        const plantRef = doc(firestore, "plants", id);
        await updateDoc(plantRef, {
          ...plantData,
          updatedAt: new Date().toISOString()
        });
      }, `atualizar planta ${id}`);
    },
    
    delete: async (id: string): Promise<void> => {
      return safeFirestoreOperation(async () => {
        const plantRef = doc(firestore, "plants", id);
        await deleteDoc(plantRef);
      }, `deletar planta ${id}`);
    }
  },

  // Métodos para blogs
  blogs: {
    // Obter todos os blogs
    getAll: async (): Promise<any[]> => {
      try {
        console.log('firebaseFirestore.blogs.getAll - Starting fetch');
        const blogsRef = collection(firestore, "blogs");
        const snapshot = await getDocs(blogsRef);
        console.log('firebaseFirestore.blogs.getAll - Raw docs:', snapshot.docs.length);
        
        const blogs = snapshot.docs.map(doc => {
          const convertedBlog = convertToBlogPost({ id: doc.id, data: () => doc.data() });
          console.log('Blog convertido:', convertedBlog);
          return convertedBlog;
        });
        
        console.log('firebaseFirestore.blogs.getAll - Converted blogs:', blogs);
        return blogs;
      } catch (error: any) {
        console.error('Error fetching blogs:', error);
        return [];
      }
    },
    
    add: async (blogData: Omit<BlogPost, 'id'>): Promise<BlogPost> => {
      return safeFirestoreOperation(async () => {
        console.log('firebaseFirestore.blogs.add - Input data:', blogData);
        
        if (!blogData.name || !blogData.author) {
          throw new Error('Nome e autor são obrigatórios para criar um blog');
        }
        
        if (!auth.currentUser) {
          throw new Error('Usuário não autenticado para adicionar blog');
        }
        
        const blogsRef = collection(firestore, "blogs");
        const docData = {
          ...blogData,
          createdAt: new Date().toISOString()
        };
        
        console.log('firebaseFirestore.blogs.add - Saving with data:', docData);
        
        const docRef = await addDoc(blogsRef, docData);
        
        const blogDoc = await getDoc(docRef);
        const newBlog = convertToBlogPost({ id: docRef.id, data: () => blogDoc.data() });
        
        console.log('firebaseFirestore.blogs.add - Created blog:', newBlog);
        return newBlog;
      }, 'adicionar blog');
    },

    update: async (id: string, blogData: Partial<any>): Promise<void> => {
      return safeFirestoreOperation(async () => {
        console.log('firebaseFirestore.blogs.update - Updating blog ID:', id);
        
        if (!id) {
          throw new Error('ID do blog é obrigatório para atualizar');
        }
        
        if (!auth.currentUser) {
          throw new Error('Usuário não autenticado para atualizar blog');
        }
        
        const blogRef = doc(firestore, "blogs", id);
        await updateDoc(blogRef, {
          ...blogData,
          updatedAt: new Date().toISOString()
        });
        console.log('firebaseFirestore.blogs.update - Successfully updated');
      }, `atualizar blog ${id}`);
    },

    delete: async (id: string): Promise<void> => {
      return safeFirestoreOperation(async () => {
        console.log('firebaseFirestore.blogs.delete - Deleting blog ID:', id);
        
        if (!id) {
          throw new Error('ID do blog é obrigatório para deletar');
        }
        
        if (!auth.currentUser) {
          throw new Error('Usuário não autenticado para deletar blog');
        }
        
        const blogRef = doc(firestore, "blogs", id);
        await deleteDoc(blogRef);
        console.log('firebaseFirestore.blogs.delete - Successfully deleted');
      }, `deletar blog ${id}`);
    }
  },

  // Utilitários
  convertToEvent,
  convertToEventRequest,
  convertToMapPoint,
  convertToUser,
  convertToPlant,
  convertToBlogPost
};
