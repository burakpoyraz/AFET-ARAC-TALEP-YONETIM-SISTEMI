import { useEffect, useState } from "react";
import { Map, Marker, useMap } from "@vis.gl/react-google-maps";
import toast from "react-hot-toast";

const HaritaIci = ({ konum, setKonum, readonly, height, icon }) => {
  console.log("[HaritaIci] Rendering with props:", { konum, readonly, height, icon });
  const [mapError, setMapError] = useState(null);

  const containerStyle = {
    width: "100%",
    height,
    borderRadius: "0.5rem",
  };
      
  const defaultCenter = {
    lat: 36.96819544918806,
    lng: 30.672160374656894,
  };

  const map = useMap(); // Harita objesine erişim

  // Haritayı yeni konuma ortala
  useEffect(() => {
    try {
      if (map && konum) {
        console.log("[HaritaIci] Panning map to:", konum);
        map.panTo({ lat: konum.lat, lng: konum.lng });
      }
    } catch (error) {
      console.error("[HaritaIci] Error panning map:", error);
      setMapError("Harita konumu güncellenirken hata oluştu");
    }
  }, [konum, map]);

  const handleMapClick = async (event) => {
    try {
      if (readonly) return; // Eğer readonly ise haritaya tıklanamaz
      
      console.log("[HaritaIci] Map clicked:", event.detail);
      // Haritaya tıklanırsa konum bilgilerini al
      const lat = event.detail.latLng.lat;
      const lng = event.detail.latLng.lng;

      try {
        console.log("[HaritaIci] Fetching address for:", { lat, lng });
        const response = await fetch(
          `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${
            import.meta.env.VITE_GOOGLE_MAPS_API_KEY
          }`
        );
        const data = await response.json();
        console.log("[HaritaIci] Geocoding response:", data);

        if (data.status !== "OK") {
          console.warn("[HaritaIci] Geocoding status not OK:", data.status);
          toast.error("Adres bilgisi alınamadı");
        }

        const address = data.status === "OK" ? data.results[0].formatted_address : "";
        setKonum({ lat, lng, adres: address });
      } catch (err) {
        console.error("[HaritaIci] Error fetching address:", err);
        toast.error("Adres bilgisi alınamadı");
        setKonum({ lat, lng, adres: "" });
      }
    } catch (error) {
      console.error("[HaritaIci] Error handling map click:", error);
      toast.error("Harita işlemi sırasında hata oluştu");
    }
  };

  if (mapError) {
    return (
      <div 
        style={{ 
          ...containerStyle, 
          display: "flex", 
          alignItems: "center", 
          justifyContent: "center",
          backgroundColor: "#f5f5f5",
          border: "1px solid #ccc"
        }}
      >
        {mapError}
      </div>
    );
  }

  return (
    <Map
      style={containerStyle}
      defaultCenter={konum || defaultCenter}
      defaultZoom={konum ? 15 : 10}
      gestureHandling="greedy"
      disableDefaultUI={readonly}
      zoomControl={!readonly}
      streetViewControl={false}
      mapTypeControl={false}
      fullscreenControl={false}
      onClick={readonly ? undefined : handleMapClick}
      onError={(error) => {
        console.error("[HaritaIci] Map error:", error);
        setMapError("Harita yüklenirken hata oluştu");
      }}
    >
      {konum && (
        <Marker 
          position={{ lat: konum.lat, lng: konum.lng }}  
          icon={{
            url: icon,
            scaledSize: { width: 40, height: 40 },
          }}
          onError={(error) => {
            console.error("[HaritaIci] Marker error:", error);
            toast.error("Konum işaretleyici yüklenemedi");
          }}
        />
      )}
    </Map>
  );
};

export default HaritaIci;
