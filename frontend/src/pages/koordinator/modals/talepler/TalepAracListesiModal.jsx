import React, { useEffect, useState } from "react";

const TalepAracListesiModal = ({
  rotaBilgileri,
  modal,
  setModal,
  talep,
  seciliAraclar,
  setSeciliAraclar,
}) => {
  const [arama, setArama] = useState("");
  const [aracTuru, setAracTuru] = useState("");

  useEffect(() => {
    const modalEl = document.getElementById("talepAracListesiModal");
    const handleClose = () => setModal(null);
    modalEl?.addEventListener("close", handleClose);

    if (modal === "talepAracListesiModal" && modalEl) {
      modalEl.showModal();
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

    return (
      (plaka.includes(aranan) ||
        adres.includes(aranan) ||
        firma.includes(aranan)) &&
      (!aracTuru || tur === aracTuru.toLowerCase())
    );
  });

  return (
    <dialog id="talepAracListesiModal" className="modal">
      <div className="modal-box max-w-5xl">
        <h3 className="font-bold text-lg border-b pb-2 mb-4">🚐 Araç Bul</h3>

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
          </select>
        </div>

        <div className="space-y-3 max-h-[50vh] overflow-y-auto">
          {filtrelenmisAraclar.map((arac) => (
            <div
              key={arac._id}
              className="border p-4 rounded-lg shadow-md bg-white flex justify-between items-start gap-6"
            >
              {/* Sol taraf - Checkbox ve Plaka */}
              <div className="flex flex-col gap-2 w-1/3">
                <label className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    className="checkbox"
                    checked={seciliAraclar.some((a) => a._id === arac._id)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSeciliAraclar([...seciliAraclar, arac]);
                      } else {
                        setSeciliAraclar(
                          seciliAraclar.filter((a) => a._id !== arac._id)
                        );
                      }
                    }}
                  />
                  <span className="font-bold text-md">{arac.plaka}</span>
                </label>
                <span className="text-sm text-gray-600">
                  🚗 {arac.aracTuru}
                </span>
                <span className="text-sm text-gray-600">
                  🧭 Kullanım:{" "}
                  {arac.kullanimAmaci === "yolcu"
                    ? "Yolcu Taşıma"
                    : "Yük Taşıma"}
                </span>
                <span className="text-sm text-gray-600">
                  🧮 Kapasite: {arac.kapasite}
                  {arac.kullanimAmaci === "yuk" ? " Ton" : " Kişi"}
                </span>
              </div>

              {/* Orta - Adres ve Kurum */}
              <div className="flex flex-col gap-1 w-1/3">
                {arac.konum?.adres && (
                  <p className="text-sm text-gray-700">📍 {arac.konum.adres}</p>
                )}
                <p className="text-sm text-gray-700">
                  🏢 Firma:{" "}
                  {arac.kurumFirmaId?.kurumAdi ||
                    `${arac.kullaniciId?.ad || ""} ${
                      arac.kullaniciId?.soyad || ""
                    }` ||
                    "Tanımsız"}
                </p>
              </div>

              {/* Sağ - Mesafe ve Süre */}
              <div className="text-right w-1/3">
                <p className="text-sm">📏 Mesafe: {arac.mesafe}</p>
                <p className="text-sm">🕒 Süre: {arac.sure}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Alt Butonlar */}
        <div className="modal-action flex justify-between items-center mt-4">
          {/* Seçilen araç sayısı */}
          <p className="text-md font-bold text-gray-600 ml-2">
            {seciliAraclar.length} adet araç seçildi
          </p>
          <button
            className="btn btn-primary"
            onClick={() => {
              // modalı kapat, araçları yukarı aktar
              document.getElementById("talepAracListesiModal")?.close();
              setModal(null);
            }}
          >
            Araçları Ekle
          </button>
        </div>
      </div>
    </dialog>
  );
};

export default TalepAracListesiModal;
