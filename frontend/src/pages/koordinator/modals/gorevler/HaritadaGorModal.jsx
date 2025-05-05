import React, { useState, useEffect } from "react";
import HaritaAraclarKonum from "../../../../components/maps/HaritaAraclarKonum";
import api from "../../../../lib/axios";

const HaritadaGorModal = ({ gorev, modal, setModal }) => {
  const [mesafe, setMesafe] = useState(null);

  useEffect(() => {
    const modalEl = document.getElementById("haritadaGorModal");
    const handleClose = () => setModal(null);
    modalEl?.addEventListener("close", handleClose);

    if (modal === "haritadaGorModal" && modalEl) {
      modalEl.showModal();
      return () => modalEl.removeEventListener("close", handleClose);
    } else if (modalEl?.open) {
      modalEl.close();
    }
  }, [modal]);

  useEffect(() => {
    const fetchMesafe = async () => {
      if (!gorev?.hedefKonumu || !gorev?.aracId?.konum) return;

      try {
        const res = await api.post("/gorevler/mesafe-ve-sure", {
          hedefKonum: gorev.hedefKonumu,
          aracKonumlari: [gorev.aracId.konum],
        });
        setMesafe(res.data?.[0]);
      } catch (err) {
        console.error("Mesafe bilgisi alınamadı:", err);
      }
    };

    fetchMesafe();
  }, [gorev]);

  return (
    <dialog id="haritadaGorModal" className="modal">
      <div className="modal-box w-11/12 max-w-4xl">
        <h3 className="font-bold text-lg mb-4 border-b pb-2 text-teal-900">
          Hedef ve Araç Konumu
        </h3>

        <div className="bg-base-100 shadow-md border border-base-200 rounded-lg p-4 text-sm text-gray-800 space-y-2">
          <div className="font-semibold text-gray-600">🚗 Araç Bilgisi</div>
          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
            <span>
              <strong>Plaka:</strong> {gorev?.aracId?.plaka}
            </span>
           
            <span>
              <strong>Tür:</strong> {gorev?.aracId?.aracTuru}
            </span>
          </div>

          <div>
            <strong>👨‍✈️ Şoför:</strong> {gorev?.sofor?.ad} {gorev?.sofor?.soyad} – 📞 {gorev?.sofor?.telefon}
          </div>

          {mesafe && (
            <div className="mt-2 text-gray-600 flex flex-col sm:flex-row gap-4">
              <div>🕒 Tahmini Süre: <strong>{mesafe.sureText}</strong></div>
              <div>📍 Mesafe: <strong>{mesafe.mesafeText}</strong></div>
            </div>
          )}
        </div>

        <div className="mt-6">
          <h4 className="text-md font-bold text-gray-800 mb-2 border-b pb-1">
            Harita Üzerinde Konumlar
          </h4>
          <HaritaAraclarKonum
            key={gorev?._id}
            hedefKonum={gorev?.hedefKonumu}
            arac={{
              aracId: gorev?.aracId,
              sofor: gorev?.sofor,
            }}
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
