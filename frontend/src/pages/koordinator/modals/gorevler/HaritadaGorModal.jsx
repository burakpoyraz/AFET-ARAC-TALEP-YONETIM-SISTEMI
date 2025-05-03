import React, { useState, useEffect } from "react";
import HaritaAraclarKonum from "../../../../components/maps/HaritaAraclarKonum";
import api from "../../../../lib/axios";

const HaritadaGorModal = ({ gorev, modal, setModal }) => {
  const [mesafeVerileri, setMesafeVerileri] = useState([]);

  useEffect(() => {
    const modalEl = document.getElementById("haritadaGorModal");
    const handleClose = () => setModal(null);
    modalEl?.addEventListener("close", handleClose);

    if (modal === "haritadaGorModal" && modalEl) {
      modalEl.showModal();
      return () => {
        modalEl.removeEventListener("close", handleClose);
      };
    } else if (modalEl?.open) {
      modalEl.close();
    }
  }, [modal]);

  useEffect(() => {
    const fetchMesafeler = async () => {
      if (!gorev?.hedefKonumu || !gorev?.gorevlendirilenAraclar) return;

      const aracKonumlari = gorev.gorevlendirilenAraclar
        .map((a) => a.aracId?.konum)
        .filter((k) => k?.lat && k?.lng);

      console.log("aracKonumlari:", aracKonumlari);
      console.log("hedefKonum:", gorev.hedefKonumu);

      try {
        const res = await api.post("/gorevler/mesafe-ve-sure", {
          hedefKonum: gorev.hedefKonumu,
          aracKonumlari,
        });
        console.log("API response:", res);
        setMesafeVerileri(res.data);
      } catch (err) {
        console.error("Mesafeler alınamadı:", err);
      }
    };

    fetchMesafeler();
  }, [gorev]);

  return (
    <dialog id="haritadaGorModal" className="modal">
      <div className="modal-box w-11/12 max-w-6xl">
        <h3 className="font-bold text-lg mb-4 border-b pb-2 text-teal-900">
          Hedef ve Araç Konumları
        </h3>
        <div className="mt-6">
          <div className="mt-6">
            <h4 className="text-md font-bold text-gray-800 mb-4 border-b pb-1">
              Görevlendirilen Araçlar
            </h4>

            <div className="grid gap-4">
              {gorev?.gorevlendirilenAraclar?.map((arac, i) => {
                const mesafe = mesafeVerileri[i];
                return (
                  <div
                    key={i}
                    className="card bg-base-100 shadow-md border border-base-200"
                  >
                    <div className="card-body p-4">
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        {/* Sol: Araç Bilgileri */}
                        <div className="flex flex-col sm:flex-row sm:items-center gap-3 text-gray-700 w-full md:w-2/3">
                          <div className="flex items-center gap-2">
                            <span className="text-lg">🚗</span>
                            <span className="font-semibold">
                              {arac.aracId?.plaka}
                            </span>
                          </div>
                          <span className="hidden sm:block text-gray-300">
                            |
                          </span>
                          <div>
                            {arac.aracId?.marka} {arac.aracId?.model} (
                            {arac.aracId?.aracTuru})
                          </div>
                          <span className="hidden sm:block text-gray-300">
                            |
                          </span>
                          <div className="flex items-center gap-1">
                            👨‍✈️ {arac.sofor.ad} {arac.sofor.soyad} – 📞{" "}
                            {arac.sofor.telefon}
                          </div>
                        </div>

                        {/* Sağ: Mesafe Bilgisi */}
                        {mesafe && (
                          <div className="bg-base-200 rounded-lg px-4 py-2 text-sm flex flex-col sm:flex-row items-start sm:items-center gap-3">
                            <div className="flex items-center gap-1">
                              <span className="text-teal-600">🕒</span>
                              <span className="font-medium text-gray-700">
                                Tahmini Süre:
                              </span>
                              <span className="font-semibold text-teal-700">
                                {mesafe.sureText}
                              </span>
                            </div>
                            <div className="flex items-center gap-1 border-l border-gray-300 pl-3">
                              <span className="text-rose-500">📍</span>
                              <span className="font-medium text-gray-700">
                                Mesafe:
                              </span>
                              <span className="font-semibold text-rose-600">
                                {mesafe.mesafeText}
                              </span>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
        <div className="mt-6">
        <h4 className="text-md font-bold text-gray-800 mb-2 border-b pb-1">
            Harita Üzerinde Konumlar
          </h4>
          <HaritaAraclarKonum
            key={gorev?._id}
            hedefKonum={gorev?.hedefKonumu}
            araclar={gorev?.gorevlendirilenAraclar}
          />
        </div>
        <div className="modal-action mt-6">
          <button className="btn" onClick={() => setModal(null)}>
            Kapat
          </button>
        </div>
      </div>
      
    </dialog>
  );
};

export default HaritadaGorModal;
