import React, { useEffect, useRef, useState } from "react";
import { APIProvider, Map, Marker, useMap } from "@vis.gl/react-google-maps";
import HaritaIci from "./HaritaIci";

const HaritaKonumSecici = ({ konum, setKonum,readonly=false,height="430px" }) => {
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

  return (
    <APIProvider apiKey={apiKey}>
      <HaritaIci konum={konum} setKonum={setKonum} readonly={readonly} height={height} />
    </APIProvider>
  );
};

export default HaritaKonumSecici;
