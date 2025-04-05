import { useEffect } from "react";
import { Map, Marker, useMap } from "@vis.gl/react-google-maps";



const HaritaIci = ({ konum, setKonum, readonly,height}) => {

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
    if (map && konum) {
      map.panTo({ lat: konum.lat, lng: konum.lng });
    }
  }, [konum, map]);

  const handleMapClick = async (event) => {
    if (readonly) return; // Eğer readonly ise haritaya tıklanamaz
    // Haritaya tıklanırsa konum bilgilerini al
    const lat = event.detail.latLng.lat;
    const lng = event.detail.latLng.lng;

    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${
          import.meta.env.VITE_GOOGLE_MAPS_API_KEY
        }`
      );
      const data = await response.json();

      const address =
        data.status === "OK" ? data.results[0].formatted_address : "";
      setKonum({ lat, lng, adres: address });
    } catch (err) {
      console.error("Adres alınamadı:", err);
      setKonum({ lat, lng, adres: "" });
    }
  };

  return (
    <Map
      style={containerStyle}
      defaultCenter={konum || defaultCenter}
      defaultZoom={konum ? 15 : 10}
      gestureHandling={readonly ? "none" : "greedy"}
      disableDefaultUI={readonly}
      zoomControl={!readonly}
      streetViewControl={false}
      mapTypeControl={false}
      fullscreenControl={false}
      onClick={readonly ? undefined : handleMapClick}
    >
      {konum && <Marker position={{ lat: konum.lat, lng: konum.lng }} />}
    </Map>
  );
};

export default HaritaIci;
