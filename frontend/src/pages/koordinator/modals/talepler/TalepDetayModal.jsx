import React, { useEffect } from "react";
import HaritaKonumSecici from "../../../../components/maps/HaritaKonumSecici";

const TalepDetayModal = ({ talep, modal, setModal }) => {
  const icon="/icons/hedef.png"
  
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
  
  // Eski veri yapısı ile uyumluluk kontrolü
  const araclar = talep.araclar || (talep.aracTuru ? [{ aracTuru: talep.aracTuru, aracSayisi: talep.aracSayisi || 1 }] : []);

  return (
    <dialog id="talepDetayModal" className="modal">
      <div className="modal-box w-11/12 max-w-5xl">
        <h3 className="font-bold text-lg mb-4 border-b pb-2">
          Talep Detayları
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-gray-800">
          {/* Sol: Talep Bilgileri */}
          <div className="space-y-2">
            <div>
              <h4 className="text-lg font-semibold text-white bg-teal-900 px-4 py-2 rounded-t-md border-b">
                {talep.baslik.toLocaleUpperCase("tr")}
              </h4>
            </div>

            <div>
              <span className="font-semibold">📄 Açıklama:</span>
              <p>{talep.aciklama}</p>
            </div>

            <div>
              <span className="font-semibold">🚗 Talep Edilen Araçlar:</span>
              <div className="overflow-x-auto">
                <table className="table table-xs table-zebra w-full mt-2">
                  <thead>
                    <tr>
                      <th>Araç Türü</th>
                      <th className="text-right">Adet</th>
                    </tr>
                  </thead>
                  <tbody>
                    {araclar.map((arac, index) => (
                      <tr key={index}>
                        <td className="capitalize">{arac.aracTuru}</td>
                        <td className="text-right">{arac.aracSayisi}</td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr>
                      <th>Toplam</th>
                      <th className="text-right">
                        {araclar.reduce((toplam, arac) => toplam + arac.aracSayisi, 0)}
                      </th>
                    </tr>
                  </tfoot>
                </table>
              </div>
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
                  : talep.durum === "gorevlendirildi"
                  ? "Görevlendirme Yapıldı"
                  : talep.durum === "tamamlandi"
                  ? "Tamamlandı"
                  : "İptal Edildi"}
              </p>
            </div>
          </div>

          {/* Sağ: Talep Eden Kullanıcı Bilgileri */}
          <div className="bg-gray-50 rounded-lg border p-4 space-y-2 capitalize">
            <h4 className="text-md font-bold border-b pb-1 mb-2">Talep Eden</h4>
            <div>
              <span className="font-semibold">👤 Ad Soyad:</span>
              <p>{`${talep.talepEdenKullaniciId?.ad || ""} ${
                talep.talepEdenKullaniciId?.soyad || ""
              }`}</p>
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
              <p>{talep.talepEdenKurumFirmaId?.iletisim?.telefon || "-"}</p>
            </div>
          </div>
        </div>

        {/* Harita */}
        <div className="mt-6">
          <h4 className="text-md font-bold text-gray-800 mb-2 border-b pb-1">
            Konum
          </h4>
          <HaritaKonumSecici konum={talep.lokasyon} readonly height="230px" icon={icon} />
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
