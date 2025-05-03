import React, { useEffect, useState } from "react";
import HaritaAraclarKonum from "../../../../components/maps/HaritaAraclarKonum";
import api from "../../../../lib/axios";

const GorevDetayModal = ({ gorev, modal, setModal }) => {
  const [mesafeVerileri, setMesafeVerileri] = useState([]);

  useEffect(() => {
    const modalEl = document.getElementById("gorevDetayModal");
    const handleClose = () => setModal(null);
    modalEl?.addEventListener("close", handleClose);

    if (modal === "gorevDetayModal" && modalEl) {
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

  console.log(mesafeVerileri);

  return (
    <dialog id="gorevDetayModal" className="modal">
      <div className="modal-box w-11/12 max-w-6xl">
        <h3 className="font-bold text-lg mb-4 border-b pb-2 text-teal-900">
          Görev Detayları
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-gray-800">
          {/* Sol: Görev Bilgileri */}
          <div className="space-y-2">
            <h4 className="text-lg font-semibold text-white bg-teal-900 px-4 py-2 rounded-t-md border-b">
              {gorev?.talepId?.baslik?.toLocaleUpperCase("tr")}
            </h4>

            <div>
              <span className="font-semibold">📌 Görev Durumu:</span>
              <p>{gorev?.gorevDurumu}</p>
            </div>

            <div>
              <span className="font-semibold">📝 Görev Notu:</span>
              <p>{gorev?.gorevNotu || "-"}</p>
            </div>

            <div>
              <span className="font-semibold">⏱ Başlangıç:</span>
              <p>
                {gorev?.baslangicZamani
                  ? new Date(gorev.baslangicZamani).toLocaleString("tr-TR")
                  : "-"}
              </p>
            </div>

            <div>
              <span className="font-semibold">✅ Bitiş:</span>
              <p>
                {gorev?.bitisZamani
                  ? new Date(gorev.bitisZamani).toLocaleString("tr-TR")
                  : "-"}
              </p>
            </div>
          </div>

          {/* Sağ: Talep Eden Bilgiler */}
          <div className="bg-gray-50 rounded-lg border p-4 space-y-2">
            <h4 className="text-md font-bold border-b pb-1 mb-2">
              Talep Eden Kurum
            </h4>

            <p>
              <strong>🏢 Kurum:</strong>{" "}
              {gorev?.talepId?.talepEdenKurumFirmaId?.kurumAdi || "-"}
            </p>
            <p>
              <strong>☎️ Telefon:</strong>{" "}
              {gorev?.talepId?.talepEdenKurumFirmaId?.iletisim?.telefon || "-"}
            </p>
            <p>
              <strong>📍 Adres:</strong>{" "}
              {gorev?.talepId?.lokasyon?.adres || "-"}
            </p>
          </div>
        </div>

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

        {/* Harita */}
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

        {/* Kapat */}
        <div className="modal-action mt-6">
          <button className="btn" onClick={() => setModal(null)}>
            Kapat
          </button>
        </div>
      </div>
    </dialog>
  );
};

export default GorevDetayModal;
