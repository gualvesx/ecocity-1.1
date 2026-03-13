
export const geocodeAddress = async (address: string): Promise<{lat: number, lng: number} | null> => {
  try {
    const fullAddress = `${address}, Presidente Prudente, SP, Brasil`;
    console.log("Geocoding address:", fullAddress);
    
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(fullAddress)}&format=json&limit=1&addressdetails=1`
    );
    
    if (!response.ok) {
      throw new Error(`Geocoding request failed with status ${response.status}`);
    }
    
    const data = await response.json();
    console.log("Geocoding response:", data);
    
    if (data && data.length > 0) {
      return {
        lat: parseFloat(data[0].lat),
        lng: parseFloat(data[0].lon)
      };
    }
    
    return null;
  } catch (error) {
    console.error('Geocoding error:', error);
    return null;
  }
};
