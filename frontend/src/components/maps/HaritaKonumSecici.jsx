import React, { useEffect, useRef, useState } from "react";
import { APIProvider, Map, Marker, useMap } from "@vis.gl/react-google-maps";

const containerStyle = {
  width: "100%",
  height: "430px",
  borderRadius: "0.5rem",
};

const defaultCenter = {
  lat: 36.96819544918806,
  lng: 30.672160374656894,
};

const HaritaIci = ({ konum, setKonum }) => {
  const map = useMap(); // Harita objesine erişim

  // Haritayı yeni konuma ortala
  useEffect(() => {
    if (map && konum) {
      map.panTo({ lat: konum.lat, lng: konum.lng });
    }
  }, [konum, map]);

  const handleMapClick = async (event) => {
    const lat = event.detail.latLng.lat;
    const lng = event.detail.latLng.lng;

    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${import.meta.env.VITE_GOOGLE_MAPS_API_KEY}`
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
      gestureHandling="greedy"
      disableDefaultUI={false}
      zoomControl={true}
      streetViewControl={false}
      mapTypeControl={false}
      fullscreenControl={false}
      onClick={handleMapClick}
    >
      {konum && <Marker position={{ lat: konum.lat, lng: konum.lng }} />}
    </Map>
  );
};

const HaritaKonumSecici = ({ konum, setKonum }) => {
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

  return (
    <APIProvider apiKey={apiKey}>
      <HaritaIci konum={konum} setKonum={setKonum} />
    </APIProvider>
  );
};

export default HaritaKonumSecici;
