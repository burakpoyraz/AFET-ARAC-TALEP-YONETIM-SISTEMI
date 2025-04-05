import React, { useEffect } from "react";
import HaritaKonumSecici from "../../../../components/maps/HaritaKonumSecici";

const AracDetay = ({ arac, modal, setModal }) => {


  useEffect(() => {
    const modalEl = document.getElementById("aracDetay");
    const handleClose = () => setModal(null);
    modalEl?.addEventListener("close", handleClose);

    if (modal === "aracDetay" && modalEl) {
        modalEl.showModal();
        return () => {
          modalEl.removeEventListener("close", handleClose);
        };
      } else if (modalEl?.open) {
        modalEl.close();
      
    }
  }, [modal]);


  if (!arac) return null;
  return (
    <dialog id="aracDetay" className="modal">
    <div className="modal-box w-11/12 max-w-5xl">
      <h3 className="font-bold text-lg mb-4 border-b pb-2">Araç Detayları</h3>

      <div className="grid grid-cols-2 gap-x-6 gap-y-3 text-sm text-gray-800">
        <div className="font-semibold">🚘 Plaka:</div>
        <div>{arac.plaka}</div>

        <div className="font-semibold">🚗 Araç Türü:</div>
        <div>{arac.aracTuru}</div>

        <div className="font-semibold">🎯 Kullanım Amacı:</div>
        <div>{arac.kullanimAmaci === "yolcu" ? "Yolcu Taşıma" : "Yük Taşıma"}</div>

        <div className="font-semibold">🧮 Kapasite:</div>
        <div>
          {arac.kapasite} {arac.kullanimAmaci === "yolcu" ? "Kişi" : "Ton"}
        </div>

        <div className="font-semibold">📍 Adres:</div>
        <div>{arac.konum?.adres || "Belirtilmemiş"}</div>

        <div className="font-semibold">📌 Durum:</div>
        <div>{arac.aracDurumu === "aktif" ? "Aktif" : "Pasif"}</div>

        <div className="font-semibold">📆 Müsaitlik:</div>
        <div>{arac.musaitlikDurumu ? "Müsait" : "Müsait Değil"}</div>

        <div className="font-semibold">👤 Sahip:</div>
        <div>
          {arac.kurumFirmaId
            ? arac.kurumFirmaId.kurumAdi
            : arac.kullaniciId
            ? `${arac.kullaniciId.ad} ${arac.kullaniciId.soyad}`
            : "Tanımsız"}
        </div>
      </div>

      {/* Harita */}
      <div className="mt-6">
        <h4 className="text-md font-bold text-gray-800 mb-2 border-b pb-1">Konum</h4>
        <HaritaKonumSecici konum={arac.konum} readonly height="230px" />
      </div>

      {/* Alt: Kapat butonu */}
      <div className="modal-action mt-6">
        <button className="btn" onClick={() => setModal(null)}>
          Kapat
        </button>
      </div>
    </div>
  </dialog>
  );
};

export default AracDetay;
