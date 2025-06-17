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
    const fetchMesafe = async () => {
      if (!gorev?.hedefKonumu || !gorev?.aracId?.konum) return;

      const aracKonum = gorev.aracId.konum;

      try {
        const res = await api.post("/gorevler/mesafe-ve-sure", {
          hedefKonum: gorev.hedefKonumu,
          aracKonumlari: [aracKonum], // API aynı kalsın diye dizi gönderiyoruz
        });

        setMesafeVerileri(res.data);
      } catch (err) {
        console.error("Mesafe/süre bilgisi alınamadı:", err);
      }
    };

    fetchMesafe();
  }, [gorev]);

  const mesafe = mesafeVerileri?.[0];


  const handleGorevFormOlustur = async (gorev) => {
  try {
    const response = await api.get(`/gorevler/${gorev._id}/pdf`, {
      responseType: "blob",
    });

    const blob = new Blob([response.data], { type: "application/pdf" });
    const url = window.URL.createObjectURL(blob);

    // Yeni sekmede göster
    window.open(url, "_blank");
  } catch (err) {
    console.error("PDF görüntülenemedi:", err);
    alert("PDF oluşturulamadı.");
  }
};

  return (
    <dialog id="gorevDetayModal" className="modal">
      <div className="modal-box w-11/12 max-w-6xl">
        <h3 className="font-bold text-lg mb-4 border-b pb-2 text-teal-900">
          Görev Detayları
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-gray-800">
          {/* Sol: Görev Bilgileri */}
          <div className="bg-white border rounded-lg p-4 shadow-sm">
            <h4 className="text-md font-bold text-white bg-teal-900 px-4 py-2 rounded-md mb-4">
              {gorev?.talepId?.baslik?.toLocaleUpperCase("tr")}
            </h4>

            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="font-medium text-gray-600">
                  📌 Görev Durumu:
                </span>
                <span className="font-semibold text-gray-800 capitalize">
                  {gorev?.gorevDurumu}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="font-medium text-gray-600">
                  📝 Görev Notu:
                </span>
                <span className="text-right max-w-[60%]">
                  {gorev?.gorevNotu || "-"}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="font-medium text-gray-600">⏱ Başlangıç:</span>
                <span>
                  {gorev?.baslangicZamani
                    ? new Date(gorev.baslangicZamani).toLocaleString("tr-TR")
                    : "-"}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="font-medium text-gray-600">✅ Bitiş:</span>
                <span>
                  {gorev?.bitisZamani
                    ? new Date(gorev.bitisZamani).toLocaleString("tr-TR")
                    : "-"}
                </span>
              </div>
            </div>
          </div>

          {/* Sağ: Talep Eden Kurum Bilgileri */}
          <div className="bg-white border rounded-lg p-4 shadow-sm">
            <h4 className="text-md font-bold text-white bg-gray-800 px-4 py-2 rounded-md mb-4">
              🏢 Talep Eden Kurum
            </h4>

            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="font-medium text-gray-600">Kurum Adı:</span>
                <span className="font-semibold">
                  {gorev?.talepId?.talepEdenKurumFirmaId?.kurumAdi || "-"}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="font-medium text-gray-600">📞 Telefon:</span>
                <span>
                  {gorev?.talepId?.talepEdenKurumFirmaId?.iletisim?.telefon ||
                    "-"}
                </span>
              </div>

              <div className="flex flex-col">
                <span className="font-medium text-gray-600 mb-1">
                  📍 Adres:
                </span>
                <span className="text-sm">
                  {gorev?.talepId?.lokasyon?.adres || "-"}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Görevlendirilen Araç Bilgisi */}
        <div className="mt-6">
          <h4 className="text-md font-bold text-gray-800 mb-4 border-b pb-1">
            Görevlendirilen Araç
          </h4>

          <div className="card bg-base-100 shadow-md border border-base-200">
            <div className="card-body p-4">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="space-y-2 text-sm text-gray-700 w-full">
                  {/* Araç Plaka + Tip */}
                  <div className="flex items-center gap-2">
                    <span className="text-lg">🚗</span>
                    <span className="font-semibold text-base uppercase">
                      {gorev?.aracId?.plaka}
                    </span>
                    <span className="text-gray-400 text-sm capitalize">
                      ({gorev?.aracId?.aracTuru})
                    </span>
                  </div>

                  {/* Şoför Bilgisi */}
                  <div className="flex items-center gap-2">
                    <span className="text-gray-600">👨‍✈️</span>
                    <span className="capitalize">
                      {gorev?.sofor?.ad} {gorev?.sofor?.soyad} – 📞{" "}
                      {gorev?.sofor?.telefon}
                    </span>
                  </div>

                  {/* Mesafe Bilgisi */}
                  {mesafe && (
                    <div className="flex items-center gap-3 text-sm text-gray-600 mt-1">
                      <div className="flex items-center gap-1">
                        <span className="text-blue-500">🕒</span>
                        <span>
                          <strong>{mesafe.sureText}</strong>
                        </span>
                      </div>
                      <span className="text-gray-300">|</span>
                      <div className="flex items-center gap-1">
                        <span className="text-red-500">📍</span>
                        <span>
                          <strong>{mesafe.mesafeText}</strong>
                        </span>
                      </div>
                    </div>
                  )}
                  
                </div>
                <div className="mt-4">
  <button
    className="btn btn-outline btn-md text-teal-700 border-teal-700 hover:bg-teal-700 hover:text-white"
    onClick={() => handleGorevFormOlustur(gorev)}
  >
    📄 Araç Görev Formu
  </button>
</div>
              </div>
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
            arac={{
              aracId: gorev?.aracId,
              sofor: gorev?.sofor,
            }}
          />
        </div>

        {/* Kapat Butonu */}
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
