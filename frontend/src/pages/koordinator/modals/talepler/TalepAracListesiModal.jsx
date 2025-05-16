import React, { useEffect, useState } from "react";

const TalepAracListesiModal = ({
  rotaBilgileri,
  modal,
  setModal,
  talep,
  seciliArac,
  setSeciliArac,
}) => {
  const [arama, setArama] = useState("");
  const [aracTuru, setAracTuru] = useState("");

  useEffect(() => {
    const modalEl = document.getElementById("talepAracListesiModal");
    const handleClose = () => setModal(null);

    if (modal === "talepAracListesiModal" && modalEl) {
      modalEl.showModal();
      modalEl.addEventListener("close", handleClose);
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
        <h3 className="font-bold text-lg border-b pb-2 mb-4"> Araç Seç</h3>

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
            <label
              key={arac._id}
              className="border p-4 rounded-lg shadow-md bg-white flex justify-between items-start gap-6 cursor-pointer"
            >
              <input
                type="radio"
                name="seciliArac"
                className="radio mt-1"
                checked={seciliArac?._id === arac._id}
                onChange={() => setSeciliArac(arac)}
              />
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
              </div>
            </label>
          ))}
        </div>

        <div className="modal-action flex justify-end items-center mt-4">
          
          <button
            className="btn btn-primary"
            onClick={() => {
              document.getElementById("talepAracListesiModal")?.close();
              setModal(null);
            }}
          >
            Aracı Ekle
          </button>
        </div>
      </div>
    </dialog>
  );
};

export default TalepAracListesiModal;
