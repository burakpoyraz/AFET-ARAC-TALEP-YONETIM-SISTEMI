import React from "react";
import { useEffect, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import api from "../../../../lib/axios";
import TalepAracListesiModal from "./TalepAracListesiModal";
import { set } from "mongoose";

const TalepGorevlendirModal = ({ talep, araclar, modal, setModal }) => {
  const [rotaBilgileri, setRotaBilgileri] = useState([]);
  const [modal2, setModal2] = useState(null); 

  const [seciliAraclar, setSeciliAraclar] = useState([]);




  console.log("seciliAraclar", seciliAraclar);
  const handleClose = () => {setModal(null), setSeciliAraclar([]); setModal2(null);};

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
      const filtreli = veriler
        .filter(Boolean)
        .sort((a, b) => a.sureValue - b.sureValue);
      setRotaBilgileri(filtreli);
    };
    
    const modalEl = document.getElementById("talepGorevlendirModal");

    if (modal === "talepGorevlendirModal" && talep && araclar.length > 0) {
      hesaplaRotalar();
      modalEl?.showModal();
      modalEl?.addEventListener("close", handleClose);

      return () => {
        modalEl?.removeEventListener("close", handleClose);
      }
    } else if (modalEl?.open) {
      modalEl.close();

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

        {/* 🚐 Araç Listesi Butonu */}
        <div className="mb-4">
          <button
            className="btn btn-primary"
            onClick={() => setModal2("talepAracListesiModal")}
          >
            Araç Bul
          </button>
        </div>

        {/* Seçilen Araçlar Listesi */}
        <div className="bg-slate-100 p-3 rounded-md mb-4">
  <h4 className="text-sm font-semibold mb-2 text-gray-700">
    Görevlendirilecek Araçlar
  </h4>

  {seciliAraclar.length > 0 ? (
    <div className="flex flex-wrap gap-3">
      {seciliAraclar.map((arac) => (
        <div
          key={arac._id}
          className="border border-gray-300 bg-white px-3 py-2 rounded-md shadow-sm flex items-center gap-2"
        >
          <span className="font-medium text-gray-800">{arac.plaka}</span>
          <span className="text-xs text-gray-500">{arac.aracTuru}</span>
          <button
            onClick={() =>
              setSeciliAraclar(
                seciliAraclar.filter((a) => a._id !== arac._id)
              )
            }
            className="btn btn-xs btn-outline btn-error"
            title="Kaldır"
          >
            ❌
          </button>
        </div>
      ))}
    </div>
  ) : (
    <p className="text-sm text-gray-500 italic">
      Henüz araç seçilmedi. Lütfen <strong>"Araç Bul"</strong> butonuna tıklayarak seçim yapın.
    </p>
  )}
</div>
        

        {/* 🔘 Alt buton */}
        <div className="modal-action">

          <button
            className="btn btn-primary"
            onClick={() => {
              if (seciliAraclar.length === 0) {
                alert("Lütfen en az bir araç seçin.");
                return;
              }
              setModal("soforSecModal");
            }}

          >
            Görevlendir
          </button>


          <button className="btn" onClick={handleClose}>
            Vazgeç
          </button>
        </div>
        <TalepAracListesiModal
  rotaBilgileri={rotaBilgileri}
  talep={talep}
  modal={modal2}
  setModal={setModal2}
  seciliAraclar={seciliAraclar}
  setSeciliAraclar={setSeciliAraclar}
/>
      </div>
    </dialog>
  );
};

export default TalepGorevlendirModal;
