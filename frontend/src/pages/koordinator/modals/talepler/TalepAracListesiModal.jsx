import React, { useEffect, useState } from "react";

const TalepAracListesiModal = ({
  rotaBilgileri,
  modal,
  setModal,
  talep,
  handleAracEkle,
  seciliAraclar,
}) => {
  const [arama, setArama] = useState("");
  const [aracTuru, setAracTuru] = useState("");
  
  // Eski veri yapısı ile uyumluluk kontrolü
  const talepAraclar = talep?.araclar || (talep?.aracTuru ? [{ aracTuru: talep.aracTuru, aracSayisi: talep.aracSayisi || 1 }] : []);
  
  // Talepteki araç türlerini bir diziye çıkarma
  const talepAracTurleri = talepAraclar.map(arac => arac.aracTuru.toLowerCase());

  useEffect(() => {
    const modalEl = document.getElementById("talepAracListesiModal");
    const handleClose = () => setModal(null);

    if (modal === "talepAracListesiModal" && modalEl) {
      modalEl.showModal();
      modalEl.addEventListener("close", handleClose);
      
      // Talepteki ilk araç türünü seçili hale getir
      if (talepAracTurleri.length > 0 && !aracTuru) {
        setAracTuru(talepAracTurleri[0]);
      }
      
      return () => {
        modalEl.removeEventListener("close", handleClose);
      };
    } else if (modalEl?.open) {
      modalEl.close();
    }
  }, [modal]);

  if (!talep) return null;

  const filtrelenmisAraclar = rotaBilgileri.filter((arac) => {
    const plaka = arac.plaka?.toLowerCase() || "";
    const adres = arac.konum?.adres?.toLowerCase() || "";
    const firma = arac.kurumFirmaId?.kurumAdi?.toLowerCase() || "";
    const tur = arac.aracTuru?.toLowerCase() || "";
    const aranan = arama.toLowerCase();

    // Zaten seçilmiş araçları filtreleme
    const zatenSecili = seciliAraclar.some(seciliArac => seciliArac._id === arac._id);
    if (zatenSecili) return false;

    return (
      (plaka.includes(aranan) ||
        adres.includes(aranan) ||
        firma.includes(aranan)) &&
      (!aracTuru || tur === aracTuru.toLowerCase())
    );
  });
  
  // Talepteki araç türlerine göre filtreleme (zaten seçilmiş olanları hariç tut)
  const onerilen = rotaBilgileri.filter(arac => 
    talepAracTurleri.includes(arac.aracTuru?.toLowerCase()) && 
    !seciliAraclar.some(seciliArac => seciliArac._id === arac._id)
  );
  
  // Diğer araçlar (zaten seçilmiş olanları hariç tut)
  const digerAraclar = rotaBilgileri.filter(arac => 
    !talepAracTurleri.includes(arac.aracTuru?.toLowerCase()) && 
    !seciliAraclar.some(seciliArac => seciliArac._id === arac._id)
  );

  return (
    <dialog id="talepAracListesiModal" className="modal">
      <div className="modal-box max-w-5xl">
        <h3 className="font-bold text-lg border-b pb-2 mb-4">Araç Seç</h3>

        <div className="flex flex-col md:flex-row gap-3 mb-4">
          <input
            type="text"
            placeholder="Plaka, adres veya firma ara..."
            className="input input-sm input-bordered w-full"
            value={arama}
            onChange={(e) => setArama(e.target.value)}
          />
          <select
            className="select select-sm select-bordered w-full md:w-60"
            value={aracTuru}
            onChange={(e) => setAracTuru(e.target.value)}
          >
            <option value="">Tüm Türler</option>
            {/* Talepteki araç türlerini önce göster */}
            {talepAracTurleri.length > 0 && (
              <optgroup label="Talep Edilen Türler">
                {talepAracTurleri.map((tur, idx) => (
                  <option key={`talep-${idx}`} value={tur}>{tur.charAt(0).toUpperCase() + tur.slice(1)}</option>
                ))}
              </optgroup>
            )}
            <optgroup label="Tüm Araç Türleri">
              <option value="otomobil">Otomobil</option>
              <option value="kamyonet">Kamyonet</option>
              <option value="minibüs">Minibüs</option>
              <option value="otobüs">Otobüs</option>
              <option value="kamyon">Kamyon</option>
              <option value="çekici(tır)">Çekici (Tır)</option>
              <option value="pick-up">Pick-Up</option>
              <option value="tanker">Tanker</option>
              <option value="y.römork">Y. Römork</option>
              <option value="lowbed">Lowbed</option>
              <option value="motosiklet">Motosiklet</option>
            </optgroup>
          </select>
        </div>

        {seciliAraclar.length > 0 && (
          <div className="mb-4">
            <h4 className="font-semibold text-md mb-2">Seçilen Araçlar ({seciliAraclar.length})</h4>
            <div className="flex flex-wrap gap-2 mb-4">
              {seciliAraclar.map(arac => (
                <div key={arac._id} className="badge badge-primary badge-outline p-3">
                  {arac.plaka} ({arac.aracTuru})
                </div>
              ))}
            </div>
          </div>
        )}

        {!arama && !aracTuru && onerilen.length > 0 && (
          <div className="mb-4">
            <h4 className="font-semibold text-md mb-2">Önerilen Araçlar (Talep Edilen Türler)</h4>
            <div className="space-y-3 max-h-[30vh] overflow-y-auto">
              {onerilen.map((arac) => (
                <div
                  key={arac._id}
                  className="border p-4 rounded-lg shadow-md bg-white flex justify-between items-start gap-6 cursor-pointer border-primary"
                >
                  <div className="flex flex-col gap-1 w-full">
                    <div className="flex justify-between items-center capitalize">
                      <div>
                        <span className="font-bold uppercase">{arac.plaka}</span> - {arac.aracTuru}
                      </div>
                      <div className="text-right">
                        <p className="text-sm">📏 {arac.mesafe}</p>
                        <p className="text-sm">🕒 {arac.sure}</p>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 capitalize">🏢 {arac.kurumFirmaId?.kurumAdi || `${arac.kullaniciId?.ad || ""} ${arac.kullaniciId?.soyad || ""}`}</p>
                    {arac.konum?.adres && (
                      <p className="text-sm text-gray-600">📍 {arac.konum.adres}</p>
                    )}
                    <div className="mt-2 flex justify-end">
                      <button 
                        className="btn btn-sm btn-primary"
                        onClick={() => handleAracEkle(arac)}
                      >
                        Ekle
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="space-y-3 max-h-[50vh] overflow-y-auto">
          {(arama || aracTuru ? filtrelenmisAraclar : digerAraclar).map((arac) => (
            <div
              key={arac._id}
              className="border p-4 rounded-lg shadow-md bg-white flex justify-between items-start gap-6 cursor-pointer"
            >
              <div className="flex flex-col gap-1 w-full">
                <div className="flex justify-between items-center capitalize">
                  <div>
                    <span className="font-bold uppercase">{arac.plaka}</span> - {arac.aracTuru}
                  </div>
                  <div className="text-right">
                    <p className="text-sm">📏 {arac.mesafe}</p>
                    <p className="text-sm">🕒 {arac.sure}</p>
                  </div>
                </div>
                <p className="text-sm text-gray-600 capitalize">🏢 {arac.kurumFirmaId?.kurumAdi || `${arac.kullaniciId?.ad || ""} ${arac.kullaniciId?.soyad || ""}`}</p>
                {arac.konum?.adres && (
                  <p className="text-sm text-gray-600">📍 {arac.konum.adres}</p>
                )}
                <div className="mt-2 flex justify-end">
                  <button 
                    className="btn btn-sm btn-primary"
                    onClick={() => handleAracEkle(arac)}
                  >
                    Ekle
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="modal-action flex justify-end items-center mt-4">
          <button
            className="btn"
            onClick={() => setModal(null)}
          >
            Kapat
          </button>
        </div>
      </div>
    </dialog>
  );
};

export default TalepAracListesiModal;
