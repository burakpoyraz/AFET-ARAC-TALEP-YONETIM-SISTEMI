import React from 'react'
import { useEffect, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import api from "../../../../lib/axios";


const TalepGorevlendirModal =  ({ talep, araclar, modal, setModal }) => {
    const [rotaBilgileri, setRotaBilgileri] = useState([]);
    const [seciliArac, setSeciliArac] = useState(null);
   
  
    useEffect(() => {
        if (!window.google?.maps?.DirectionsService) {
            console.warn("Google Maps henüz yüklenmedi.");
            return;
          }
      const hesaplaRotalar = async () => {
        const service = new window.google.maps.DirectionsService();
  
        const rotalar = araclar.map((arac) => {
          return new Promise((resolve) => {
            service.route(
              {
                origin: arac.konum,
                destination: talep.lokasyon,
                travelMode: window.google.maps.TravelMode.DRIVING,
              },
              (result, status) => {
                if (status === "OK") {
                  resolve({
                    ...arac,
                    mesafe: result.routes[0].legs[0].distance.text,
                    sure: result.routes[0].legs[0].duration.text,
                    mesafeValue: result.routes[0].legs[0].distance.value,
                    sureValue: result.routes[0].legs[0].duration.value,
                  });
                } else {
                  resolve(null);
                }
              }
            );
          });
        });
  
        const veriler = await Promise.all(rotalar);
        const filtreli = veriler.filter(Boolean).sort((a, b) => a.sureValue - b.sureValue);
        setRotaBilgileri(filtreli);
      };
  
      if (modal === "talepGorevlendirModal" && talep && araclar.length > 0) {
        hesaplaRotalar();
        document.getElementById("talepGorevlendirModal")?.showModal();
      }
    }, [modal, talep, araclar]);
  
    if (modal !== "talepGorevlendirModal") return null;
  
    return (
        <dialog id="talepGorevlendirModal" className="modal">
        <div className="modal-box max-w-5xl">
          <h3 className="font-bold text-lg border-b pb-2 mb-4">
            🚐 Araç Görevlendir
          </h3>
      
          {/* 📝 Talep Detayları */}
          <div className="bg-gray-100 p-4 rounded-md mb-4 space-y-2 text-sm">
            <div>
              <span className="font-semibold">📝 Başlık:</span> {talep.baslik}
            </div>
            <div>
              <span className="font-semibold">📄 Açıklama:</span> {talep.aciklama}
            </div>
            <div>
              <span className="font-semibold">📍 Talep Lokasyonu:</span>{" "}
              {talep.lokasyon?.adres}
            </div>
            <div>
              <span className="font-semibold">🚗 Talep Edilen Araç Türü:</span>{" "}
              {talep.aracTuru} ({talep.aracSayisi} adet)
            </div>
          </div>
      
          {/* 🚐 Araç Listesi */}
          <div className="space-y-3 max-h-[50vh] overflow-y-auto">
            {rotaBilgileri.map((arac) => (
              <div
                key={arac._id}
                className="border p-4 rounded-lg shadow-sm flex justify-between items-start gap-4 bg-white"
              >
                <div className="flex-1 space-y-1">
                  <p className="text-md font-semibold">{arac.plaka}</p>
                  <p className="text-sm text-gray-600">
                    Tür: {arac.aracTuru}
                  </p>
                  {arac.konum?.adres && (
                    <p className="text-sm text-gray-600">
                      🚘 Konum: {arac.konum.adres}
                    </p>
                  )}
                </div>
      
                <div className="text-right space-y-1">
                  <p className="text-sm">📏 Mesafe: {arac.mesafe}</p>
                  <p className="text-sm">🕒 Süre: {arac.sure}</p>
                  <button
                    onClick={() => {
                      setSeciliArac(arac);
                      setModal("soforSecModal");
                    }}
                    className="btn btn-primary btn-sm mt-2"
                  >
                    Görevlendir
                  </button>
                </div>
              </div>
            ))}
          </div>
      
          {/* 🔘 Alt buton */}
          <div className="modal-action">
            <button className="btn" onClick={() => setModal(null)}>
              Vazgeç
            </button>
          </div>
        </div>
      </dialog>
    );
  };

export default TalepGorevlendirModal