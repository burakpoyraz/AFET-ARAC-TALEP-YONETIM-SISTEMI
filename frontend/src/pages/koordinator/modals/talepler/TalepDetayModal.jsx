import React, { useEffect } from "react";
import HaritaKonumSecici from "../../../../components/maps/HaritaKonumSecici";

const TalepDetayModal = ({ talep, modal, setModal }) => {
  useEffect(() => {
    const modalEl = document.getElementById("talepDetayModal");
    const handleClose = () => setModal(null);
    modalEl?.addEventListener("close", handleClose);

    if (modal === "talepDetayModal" && modalEl) {
      modalEl.showModal();
      return () => {
        modalEl.removeEventListener("close", handleClose);
      };
    } else if (modalEl?.open) {
      modalEl.close();
    }
  }, [modal]);

  if (!talep) return null;

  return (
    <dialog id="talepDetayModal" className="modal">
  <div className="modal-box w-11/12 max-w-5xl">
    <h3 className="font-bold text-lg mb-4 border-b pb-2">Talep Detayları</h3>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-gray-800">
      {/* Sol: Talep Bilgileri */}
      <div className="space-y-2">
        <div>
          <span className="font-semibold">📝 Başlık:</span>
          <p>{talep.baslik}</p>
        </div>

        <div>
          <span className="font-semibold">📄 Açıklama:</span>
          <p>{talep.aciklama}</p>
        </div>

        <div>
          <span className="font-semibold">🚗 Araç Türü:</span>
          <p>{talep.aracTuru}</p>
        </div>

        <div>
          <span className="font-semibold">🔢 Araç Sayısı:</span>
          <p>{talep.aracSayisi}</p>
        </div>

        <div>
          <span className="font-semibold">📍 Adres:</span>
          <p>{talep.lokasyon?.adres || "Belirtilmemiş"}</p>
        </div>

        <div>
          <span className="font-semibold">📌 Durum:</span>
          <p>
            {talep.durum === "beklemede"
              ? "Beklemede"
              : talep.durum === "gorevlendirme_yapildi"
              ? "Görevlendirme Yapıldı"
              : talep.durum === "tamamlandi"
              ? "Tamamlandı"
              : "İptal Edildi"}
          </p>
        </div>
      </div>

      {/* Sağ: Talep Eden Kullanıcı Bilgileri */}
      <div className="bg-gray-50 rounded-lg border p-4 space-y-2">
        <h4 className="text-md font-bold border-b pb-1 mb-2">Talep Eden</h4>
        <div>
          <span className="font-semibold">👤 Ad Soyad:</span>
          <p>{`${talep.talepEdenKullaniciId?.ad || ""} ${talep.talepEdenKullaniciId?.soyad || ""}`}</p>
        </div>

        <div>
          <span className="font-semibold">📞 Telefon:</span>
          <p>{talep.talepEdenKullaniciId?.telefon || "-"}</p>
        </div>

        <div>
          <span className="font-semibold">🏢 Kurum Adı:</span>
          <p>{talep.talepEdenKurumFirmaId?.kurumAdi || "-"}</p>
        </div>

        <div>
          <span className="font-semibold">☎️ Kurum Telefon:</span>
          <p>{talep.talepEdenKurumFirmaId?.iletisim.telefon || "-"}</p>
        </div>
      </div>
    </div>

    {/* Harita */}
    <div className="mt-6">
      <h4 className="text-md font-bold text-gray-800 mb-2 border-b pb-1">Konum</h4>
      <HaritaKonumSecici konum={talep.lokasyon} readonly height="230px" />
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

export default TalepDetayModal;