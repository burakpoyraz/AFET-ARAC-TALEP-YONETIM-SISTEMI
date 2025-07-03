import React, { useEffect, useRef, useState } from "react";
import { APIProvider, Map, Marker, useMap } from "@vis.gl/react-google-maps";
import HaritaIci from "./HaritaIci";
import toast from "react-hot-toast";

const HaritaKonumSecici = ({ konum, setKonum, readonly = false, height = "430px", icon }) => {
  console.log("[HaritaKonumSecici] Rendering with props:", { konum, readonly, height, icon });
  
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
  
  useEffect(() => {
    if (!apiKey) {
      console.error("[HaritaKonumSecici] Google Maps API key is missing!");
      toast.error("Harita yüklenemedi: API anahtarı eksik");
    }
  }, [apiKey]);

  if (!apiKey) {
    return (
      <div 
        style={{ 
          height, 
          width: "100%", 
          display: "flex", 
          alignItems: "center", 
          justifyContent: "center",
          border: "1px solid #ccc",
          borderRadius: "0.5rem",
          backgroundColor: "#f5f5f5"
        }}
      >
        Harita yüklenemedi: API anahtarı eksik
      </div>
    );
  }

  return (
    <APIProvider apiKey={apiKey}>
      <HaritaIci 
        konum={konum} 
        setKonum={setKonum} 
        readonly={readonly} 
        height={height} 
        icon={icon} 
      />
    </APIProvider>
  );
};

export default HaritaKonumSecici;
