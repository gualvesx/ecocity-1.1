
import { MapPoint } from '@/types/map';
import { Event } from '@/types/events';
import { firebaseFirestore } from './firebaseFirestore';

export const getStoredPoints = async (): Promise<MapPoint[]> => {
  try {
    console.log('Fetching map points from Firebase...');
    return await firebaseFirestore.mapPoints.getAll();
  } catch (error) {
    console.error('Error fetching points from Firebase:', error);
    // Return empty array if there's an error
    return [];
  }
};

export const storePoints = async (points: MapPoint[]): Promise<void> => {
  try {
    console.log('Storing map points to Firebase...');
    // This would be a more complex operation in a real system
    // For our simulation, we would need to find points to update, add, or delete
    
    // For demonstration purposes only - in a real system you would use transactions or batched writes
    // This implementation is simplified and would not be recommended in production
    
    // Get current points
    const existingPoints = await firebaseFirestore.mapPoints.getAll();
    const existingIds = existingPoints.map(point => String(point.id));
    
    // Points to update or add
    for (const point of points) {
      const pointId = String(point.id);
      if (existingIds.includes(pointId)) {
        // Update existing point - since we don't have a separate update method,
        // we'll simulate by deleting and re-adding
        await firebaseFirestore.mapPoints.delete(pointId);
        await firebaseFirestore.mapPoints.add({
          name: point.name,
          type: point.type,
          lat: point.lat,
          lng: point.lng,
          description: point.description,
          impact: point.impact,
          address: point.address || ''
        });
      } else {
        // Add new point
        await firebaseFirestore.mapPoints.add({
          name: point.name,
          type: point.type,
          lat: point.lat,
          lng: point.lng,
          description: point.description,
          impact: point.impact,
          address: point.address || ''
        });
      }
    }
    
    // Note: This is a simplified implementation that doesn't handle deleting
    // points that exist in Firebase but not in the points array
    
    console.log('Points stored successfully');
  } catch (error) {
    console.error('Error storing points to Firebase:', error);
    throw error;
  }
};

// Create the mapStorage object with all necessary methods
export const mapStorage = {
  // Map Points
  getMapPoints: getStoredPoints,
  addMapPoint: async (pointData: Omit<MapPoint, 'id' | 'createdAt' | 'approved'> & { userId: string; userName: string }): Promise<MapPoint | null> => {
    try {
      const result = await firebaseFirestore.mapPoints.add({
        name: pointData.name,
        type: pointData.type,
        lat: pointData.lat,
        lng: pointData.lng,
        description: pointData.description,
        impact: pointData.impact,
        address: pointData.address || '',
        userId: pointData.userId,
        userName: pointData.userName,
        website: pointData.website || '',
        weeklyHours: pointData.weeklyHours || {}
      });
      
      if (result) {
        return {
          id: result.id,
          ...pointData,
          createdAt: new Date().toISOString(),
          approved: false
        };
      }
      return null;
    } catch (error) {
      console.error('Error adding map point:', error);
      return null;
    }
  },
  updateMapPoint: async (id: string, updates: Partial<MapPoint>): Promise<boolean> => {
    try {
      await firebaseFirestore.mapPoints.update(id, updates);
      return true;
    } catch (error) {
      console.error('Error updating map point:', error);
      return false;
    }
  },
  deleteMapPoint: async (id: string): Promise<boolean> => {
    try {
      await firebaseFirestore.mapPoints.delete(id);
      return true;
    } catch (error) {
      console.error('Error deleting map point:', error);
      return false;
    }
  },
  
  // Events
  getEvents: async (): Promise<Event[]> => {
    try {
      console.log('Fetching events from Firebase...');
      return await firebaseFirestore.events.getAll();
    } catch (error) {
      console.error('Error fetching events from Firebase:', error);
      return [];
    }
  },
  addEvent: async (eventData: Omit<Event, 'id' | 'createdAt' | 'approved'> & { userId: string; userName: string }): Promise<Event | null> => {
    try {
      const result = await firebaseFirestore.events.add({
        title: eventData.title,
        description: eventData.description,
        date: eventData.date,
        time: eventData.time,
        location: eventData.location,
        lat: eventData.lat,
        lng: eventData.lng,
        category: eventData.category,
        userId: eventData.userId,
        userName: eventData.userName
      });
      
      if (result) {
        return {
          id: result.id,
          ...eventData,
          createdAt: new Date().toISOString(),
          approved: false
        };
      }
      return null;
    } catch (error) {
      console.error('Error adding event:', error);
      return null;
    }
  },
  updateEvent: async (id: string, updates: Partial<Event>): Promise<boolean> => {
    try {
      await firebaseFirestore.events.update(id, updates);
      return true;
    } catch (error) {
      console.error('Error updating event:', error);
      return false;
    }
  },
  deleteEvent: async (id: string): Promise<boolean> => {
    try {
      await firebaseFirestore.events.delete(id);
      return true;
    } catch (error) {
      console.error('Error deleting event:', error);
      return false;
    }
  }
};
