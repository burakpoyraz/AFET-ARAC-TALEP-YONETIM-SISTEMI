import React from "react";
import { APIProvider, Map, AdvancedMarker } from "@vis.gl/react-google-maps";

const HaritaAraclarKonum = ({ hedefKonum, araclar }) => {
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
  const mapId = import.meta.env.VITE_GOOGLE_MAP_ID;

  const containerStyle = {
    width: "100%",
    height: "400px",
    borderRadius: "0.5rem",
  };

  const defaultCenter = hedefKonum || {
    lat: 36.96819544918806,
    lng: 30.672160374656894,
  };

  return (
    <APIProvider apiKey={apiKey}>
      <Map
        style={containerStyle}
        defaultCenter={defaultCenter}
        defaultZoom={12}
        gestureHandling="greedy"
        disableDefaultUI={false}
        zoomControl
        mapTypeControl={false}
        streetViewControl={false}
        fullscreenControl={false}
        mapId={mapId}
      >
        {/* Hedef Marker */}
        {hedefKonum && (
          <AdvancedMarker position={hedefKonum}>
            <div style={{ textAlign: "center" }}>
              <div
                style={{
                  fontSize: "12px",
                  fontWeight: "bold",
                  backgroundColor: "white",
                  padding: "2px 6px",
                  borderRadius: "4px",
                  boxShadow: "0 1px 4px rgba(0,0,0,0.2)",
                  display: "inline-block",
                }}
              >
                Hedef
              </div>
              <img src="/icons/hedef.png" alt="Hedef" width={36} height={36} />
            </div>
          </AdvancedMarker>
        )}

        {/* Araç Markerları */}
        {araclar?.map((arac, index) => {
          const konum = arac.aracId?.konum;
          if (!konum || konum.lat == null || konum.lng == null) return null;

          return (
            <AdvancedMarker
              key={index}
              position={{ lat: konum.lat, lng: konum.lng }}
              title={`Şoför: ${arac.sofor.ad} ${arac.sofor.soyad}`}
            >
              <div style={{ textAlign: "center" }}>
                <div
                  style={{
                    fontSize: "14px",
                    fontWeight: "bold",
                    backgroundColor: "white",
                    padding: "2px 6px",
                    borderRadius: "4px",
                    boxShadow: "0 1px 4px rgba(0,0,0,0.2)",
                    display: "inline-block",
                  }}
                >
                  {arac.aracId?.plaka || `Araç ${index + 1}`}
                </div>
                <img src="/icons/arac.png" alt="Araç" width={36} height={36} />
              </div>
            </AdvancedMarker>
          );
        })}
      </Map>
    </APIProvider>
  );
};

export default HaritaAraclarKonum;
