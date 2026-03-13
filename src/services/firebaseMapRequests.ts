
import { doc, collection, getDoc, getDocs, addDoc, updateDoc, deleteDoc, query, where } from "firebase/firestore";
import { firestore } from './firebaseConfig';
import { MapPointRequest, NewMapPointRequest } from '@/types/mapRequest';
import { geocodeAddress } from '@/services/geocoding';
import { firebaseFirestore } from './firebaseFirestore';
import { MapPoint } from '@/types/map';

// Convert Firestore document to MapPointRequest
const convertToMapPointRequest = (doc: any): MapPointRequest => {
  const data = doc.data ? doc.data() : doc;
  return {
    id: doc.id,
    name: data.name,
    type: data.type,
    address: data.address,
    description: data.description,
    impact: data.impact,
    lat: data.lat,
    lng: data.lng,
    status: data.status || 'pending',
    createdBy: data.createdBy,
    createdAt: data.createdAt || new Date().toISOString()
  };
};

// Get all map point requests
export const getAllMapPointRequests = async (): Promise<MapPointRequest[]> => {
  try {
    const requestsRef = collection(firestore, "mapRequests");
    const snapshot = await getDocs(requestsRef);
    return snapshot.docs.map(doc => convertToMapPointRequest({ id: doc.id, data: () => doc.data() }));
  } catch (error) {
    console.error('Error getting map point requests:', error);
    throw error;
  }
};

// Get user's map point requests
export const getUserMapPointRequests = async (userId: string): Promise<MapPointRequest[]> => {
  try {
    const requestsRef = collection(firestore, "mapRequests");
    const q = query(requestsRef, where("createdBy", "==", userId));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => convertToMapPointRequest({ id: doc.id, data: () => doc.data() }));
  } catch (error) {
    console.error('Error getting user map point requests:', error);
    return [];
  }
};

// Create a new map point request
export const createMapPointRequest = async (data: NewMapPointRequest, userId: string): Promise<MapPointRequest> => {
  try {
    const requestsRef = collection(firestore, "mapRequests");
    const requestData = {
      ...data,
      status: 'pending',
      createdBy: userId,
      createdAt: new Date().toISOString()
    };
    
    const docRef = await addDoc(requestsRef, requestData);
    const requestDoc = await getDoc(docRef);
    return convertToMapPointRequest({ id: docRef.id, data: () => requestDoc.data() });
  } catch (error) {
    console.error('Error creating map point request:', error);
    throw error;
  }
};

// Update map point request status
export const updateMapPointRequestStatus = async (
  requestId: string, 
  status: 'pending' | 'approved' | 'rejected'
): Promise<void> => {
  try {
    const requestRef = doc(firestore, "mapRequests", requestId);
    await updateDoc(requestRef, { status });
  } catch (error) {
    console.error('Error updating map point request status:', error);
    throw error;
  }
};

// Approve and convert a map point request to a real map point
export const approveMapPointRequest = async (requestId: string): Promise<boolean> => {
  try {
    // 1. Get the request
    const requestRef = doc(firestore, "mapRequests", requestId);
    const requestDoc = await getDoc(requestRef);
    
    if (!requestDoc.exists()) {
      throw new Error(`Map point request with ID ${requestId} not found`);
    }
    
    const request = convertToMapPointRequest({ id: requestDoc.id, data: () => requestDoc.data() });
    
    // 2. Update request status
    await updateMapPointRequestStatus(requestId, 'approved');
    
    // 3. Get coordinates if they don't exist
    let lat = request.lat;
    let lng = request.lng;
    
    if (!lat || !lng) {
      const geoLocation = await geocodeAddress(request.address);
      if (!geoLocation) {
        throw new Error('Could not geocode the address');
      }
      lat = geoLocation.lat;
      lng = geoLocation.lng;
    }
    
    // 4. Create a new map point
    const mapPointData: Omit<MapPoint, 'id'> = {
      name: request.name,
      type: request.type,
      lat: lat,
      lng: lng,
      description: request.description,
      impact: request.impact,
      address: request.address
    };
    
    await firebaseFirestore.mapPoints.add(mapPointData);
    return true;
  } catch (error) {
    console.error('Error approving map point request:', error);
    return false;
  }
};

// Reject a map point request
export const rejectMapPointRequest = async (requestId: string): Promise<boolean> => {
  try {
    await updateMapPointRequestStatus(requestId, 'rejected');
    return true;
  } catch (error) {
    console.error('Error rejecting map point request:', error);
    return false;
  }
};

// Delete a map point request
export const deleteMapPointRequest = async (requestId: string): Promise<void> => {
  try {
    const requestRef = doc(firestore, "mapRequests", requestId);
    await deleteDoc(requestRef);
  } catch (error) {
    console.error('Error deleting map point request:', error);
    throw error;
  }
};
