import React from "react";
import { Map, Marker, APIProvider } from "@vis.gl/react-google-maps";
import api from "../../lib/axios";



const containerStyle = {
  width: "100%",
  height: "430px",
  borderRadius: "0.5rem",
};

const defaultCenter = {
  lat: 36.96819544918806, // Antalya
  lng: 30.672160374656894,
};

const AracKonumSecici = ({ konum, setKonum }) => {

    const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
    console.log(import.meta.env.VITE_GOOGLE_MAPS_API_KEY);
  // Tıklama olayını Map'e doğrudan tanımlıyoruz (useMapEvents kaldırıldı çünkü yok)
  const handleMapClick = (event) => {
    const lat = event.detail.latLng.lat;
    const lng = event.detail.latLng.lng;
    setKonum({ lat, lng });

  
  };
  return (
    <div className="mb-4">
      <p className="text-sm text-gray-600 mb-2">Harita üzerinden araç konumunu belirleyin:</p>
      <APIProvider apiKey={apiKey}>
        <Map
          style={containerStyle}
          defaultCenter={konum || defaultCenter}
          defaultZoom={konum ? 15 : 10}
          gestureHandling="greedy"
          disableDefaultUI={true}
          onClick={handleMapClick} // 🧭 Harita tıklaması ile konum alımı burada
        >
          {konum && <Marker position={konum} />} {/* Konum varsa Marker göster */}
        </Map>
      </APIProvider>
    </div>
  );
};

export default AracKonumSecici;