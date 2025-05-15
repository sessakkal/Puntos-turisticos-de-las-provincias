import axios from "axios";
import { TouristSpot } from "../types/TouristSpot";

const API_KEY = process.env.REACT_APP_GEOAPIFY_API_KEY || "2fae9d86da1f49d89a8b1bc567ab02e5";

export const fetchTouristSpots = async (lat: number, lon: number): Promise<TouristSpot[]> => {
  try {
    const radius = 50000;
    const categories = [
      "tourism.sights",
      "entertainment.museum",
      "building.historic",
      "entertainment"
    ].join(",");
    
    const url = `https://api.geoapify.com/v2/places?categories=${categories}&filter=circle:${lon},${lat},${radius}&limit=20&apiKey=${API_KEY}`;
    
    const response = await axios.get(url);
    
    if (!response.data?.features) {
      return [];
    }
    
    return response.data.features.map((feature: any) => ({
      name: feature.properties.name || "Lugar turístico",
      address: feature.properties.formatted || "Dirección no disponible",
      latitude: feature.properties.lat ?? feature.geometry.coordinates[1],
      longitude: feature.properties.lon ?? feature.geometry.coordinates[0],
      website: feature.properties.website,
      phone: feature.properties.phone,
    }));
  } catch (error) {
    console.error("Error fetching tourist spots:", error);
    return [];
  }
};