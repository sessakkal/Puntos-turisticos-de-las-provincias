import { MapContainer, TileLayer, Marker, Popup, GeoJSON } from "react-leaflet";
import { useEffect, useState, useCallback } from "react";
import { fetchProvinceGeoJSON } from "../api/provinces";
import { fetchTouristSpots } from "../api/geoapify";
import { ProvinceGeoJSON, ProvinceGeoJSONFeature } from "../types/ProvinceGeoJSON";
import { TouristSpot } from "../types/TouristSpot";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const createIcon = (iconUrl: string) => new L.Icon({
  iconUrl,
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
});

const spotIcon = createIcon("https://cdn-icons-png.flaticon.com/512/3179/3179068.png");

interface MapViewProps {
}

const MapView: React.FC<MapViewProps> = () => {
  const [provinces, setProvinces] = useState<ProvinceGeoJSON | null>(null);
  const [spots, setSpots] = useState<TouristSpot[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchProvinceGeoJSON()
      .then(setProvinces)
      .catch(console.error);
  }, []);

  const handleProvinceClick = useCallback(async (feature: ProvinceGeoJSONFeature) => {
    setIsLoading(true);
    try {
      const geoJSON = L.geoJSON(feature.geometry);
      const center = geoJSON.getBounds().getCenter();
      
      const spots = await fetchTouristSpots(center.lat, center.lng);
      setSpots(spots);
    } catch (error) {
      console.error("Error loading spots:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const provinceStyle = useCallback(() => ({
    fillColor: "#3388ff",
    weight: 2,
    opacity: 1,
    color: "white",
    fillOpacity: 0.7,
  }), []);

  return (
    <div style={{ position: 'relative', height: '100vh', width: '100%' }}>
      <MapContainer
        center={[40.4168, -3.7038]}
        zoom={6}
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        />

        {provinces && (
          <GeoJSON
            data={provinces}
            style={provinceStyle}
            onEachFeature={(feature: ProvinceGeoJSONFeature, layer) => {
              layer.on({
                click: () => handleProvinceClick(feature)
              });
              layer.bindPopup(feature.properties.name);
            }}
          />
        )}

        {spots.map((spot, index) => (
          <Marker
            key={`${spot.latitude}-${spot.longitude}-${index}`}
            position={[spot.latitude, spot.longitude]}
            icon={spotIcon}
          >
            <Popup>
              <div style={{ minWidth: '200px' }}>
                <h3>{spot.name}</h3>
                <p>{spot.address}</p>
                {spot.website && (
                  <a href={spot.website} target="_blank" rel="noreferrer">
                    Visitar web
                  </a>
                )}
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      {isLoading && (
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          padding: '20px',
          background: 'white',
          borderRadius: '5px',
          boxShadow: '0 0 10px rgba(0,0,0,0.1)',
          zIndex: 1000
        }}>
          Cargando puntos turísticos...
        </div>
      )}
    </div>
  );
};

export default MapView;