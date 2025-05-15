import { FeatureCollection, Geometry } from "geojson";

export interface ProvinceProperties {
  name: string;
  cartodb_id?: number;
  created_at?: string;
  updated_at?: string;
}

export interface ProvinceGeoJSONFeature {
  type: "Feature";
  properties: ProvinceProperties;
  geometry: Geometry;
}

export interface ProvinceGeoJSON extends FeatureCollection {
  features: ProvinceGeoJSONFeature[];
}