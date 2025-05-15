import axios from "axios";
import { ProvinceGeoJSON } from "../types/ProvinceGeoJSON";

export const fetchProvinceGeoJSON = async (): Promise<ProvinceGeoJSON> => {
  try {
    const response = await axios.get<ProvinceGeoJSON>(
      "https://raw.githubusercontent.com/codeforgermany/click_that_hood/main/public/data/spain-provinces.geojson"
    );
    
    if (!response.data?.features) {
      throw new Error("Invalid GeoJSON data");
    }
    
    return response.data;
  } catch (error) {
    console.error("Error fetching provinces:", error);
    throw error;
  }
};