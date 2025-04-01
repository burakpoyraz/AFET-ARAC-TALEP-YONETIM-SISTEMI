import React, { useEffect } from "react";

const DetayModal = ({ kullanici, modal,setModal }) => {
  useEffect(() => {
    if (kullanici && modal === "detayModal") {
      document.getElementById("detayModal")?.showModal();
    }
  }, [kullanici, modal]);

  if (!kullanici || modal !== "detayModal") return null;

  return (
    <dialog id="detayModal" className="modal">
      <div className="modal-box">
        <h3 className="font-bold text-lg mb-4 border-b pb-1">Kullanıcı Detayları</h3>

        <div className="grid grid-cols-2 gap-y-2 gap-x-4 text-sm text-gray-700">
          <div className="font-semibold">Ad Soyad:</div>
          <div>
            {kullanici.ad} {kullanici.soyad}
          </div>

          <div className="font-semibold">Email:</div>
          <div>{kullanici.email}</div>

          <div className="font-semibold">Rol:</div>
          <div>
            {kullanici.rol === "beklemede"
              ? "Beklemede"
              : kullanici.rol === "koordinator"
              ? "Koordinatör"
              : kullanici.rol === "arac_sahibi"
              ? "Araç Sahibi"
              : kullanici.rol === "talep_eden"
              ? "Talep Eden"
              : "-"}
          </div>

          <div className="font-semibold">Kayıt Türü:</div>
          <div>
            {kullanici.kullaniciBeyanBilgileri?.kurumFirmaTuru ===
            "kurulus_adina"
              ? "Kuruluş Adına"
              : "Kendi Adına"}
          </div>

          <div className="font-semibold">Kurum/Firma:</div>
          <div>{kullanici.kurumFirmaId?.kurumAdi || "-"}</div>

          <div className="font-semibold">Telefon:</div>
          <div>{kullanici.telefon || "-"}</div>
        </div>
        {kullanici.kullaniciBeyanBilgileri?.kurumFirmaTuru ===
          "kurulus_adina" && (
          <div className="mt-6">
            <h4 className="text-md font-bold text-gray-800 mb-2 border-b pb-1">
              Beyan Edilen Bilgiler
            </h4>

            <div className="grid grid-cols-2 gap-y-2 gap-x-4 text-sm text-gray-700">
              <div className="font-semibold">Kurum/Firma Adı:</div>
              <div>
                {kullanici.kullaniciBeyanBilgileri?.kurumFirmaAdi || "-"}
              </div>

              <div className="font-semibold">Pozisyon:</div>
              <div>{kullanici.kullaniciBeyanBilgileri?.pozisyon || "-"}</div>
            </div>
          </div>
        )}

        <div className="modal-action">
          <form method="dialog">
            <button className="btn" onClick={(e) => 
              {
                e.preventDefault();
                setModal(null)}}>Kapat</button>
          </form>
        </div>
      </div>
    </dialog>
  );
};

export default DetayModal;
