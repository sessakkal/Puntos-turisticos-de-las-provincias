import { useEffect, useState } from "react";
import MapView from "./components/MapView";
import { fetchProvinceGeoJSON } from "./api/provinces";
import "./App.css";

function App() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadProvinces = async () => {
      try {
        setLoading(true);
        await fetchProvinceGeoJSON();
      } catch (err) {
        setError("Error al cargar las provincias");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadProvinces();
  }, []);

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="spinner"></div>
        <p>Cargando mapa de provincias...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-screen">
        <p>{error}</p>
        <button onClick={() => window.location.reload()}>Reintentar</button>
      </div>
    );
  }

  return (
    <div className="app-container">
      <header>
        <h1>Mapa de Provincias de España</h1>
        <p>Haz clic en una provincia para ver sus puntos turísticos</p>
      </header>
      <main>
        <MapView />
      </main>
    </div>
  );
}

export default App;