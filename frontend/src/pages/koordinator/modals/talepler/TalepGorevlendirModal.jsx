import React, { useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import api from "../../../../lib/axios";
import TalepAracListesiModal from "./TalepAracListesiModal";
import toast from "react-hot-toast";

const TalepGorevlendirModal = ({ talep, araclar, modal, setModal }) => {
  const [rotaBilgileri, setRotaBilgileri] = useState([]);
  const [modal2, setModal2] = useState(null);
  const [seciliArac, setSeciliArac] = useState(null);
  const [gorevNotu, setGorevNotu] = useState("");
  const queryClient = useQueryClient();

  const handleClose = () => {
    setModal(null);
    setSeciliArac(null);
    setModal2(null);
  };

  useEffect(() => {
    if (!window.google?.maps?.DirectionsService) return;

    const hesaplaRotalar = async () => {
      const service = new window.google.maps.DirectionsService();
      const rotalar = araclar.map((arac) => {
        return new Promise((resolve) => {
          service.route(
            {
              origin: arac.konum,
              destination: talep.lokasyon,
              travelMode: window.google.maps.TravelMode.DRIVING,
            },
            (result, status) => {
              if (status === "OK") {
                resolve({
                  ...arac,
                  mesafe: result.routes[0].legs[0].distance.text,
                  sure: result.routes[0].legs[0].duration.text,
                  mesafeValue: result.routes[0].legs[0].distance.value,
                  sureValue: result.routes[0].legs[0].duration.value,
                });
              } else {
                resolve(null);
              }
            }
          );
        });
      });

      const veriler = await Promise.all(rotalar);
      setRotaBilgileri(
        veriler.filter(Boolean).sort((a, b) => a.sureValue - b.sureValue)
      );
    };

    const modalEl = document.getElementById("talepGorevlendirModal");
    if (modal === "talepGorevlendirModal" && talep && araclar.length > 0) {
      hesaplaRotalar();
      modalEl?.showModal();
      modalEl?.addEventListener("close", handleClose);
      return () => modalEl?.removeEventListener("close", handleClose);
    } else if (modalEl?.open) {
      modalEl.close();
    }
  }, [modal, talep, araclar]);

  if (modal !== "talepGorevlendirModal") return null;

  const handleGorevOlustur = async () => {
    if (!seciliArac) {
      return alert("Araç seçilmedi");
    }

    if (
      !seciliArac.sofor?.ad ||
      !seciliArac.sofor?.soyad ||
      !seciliArac.sofor?.telefon
    ) {
      return alert("Şoför bilgileri eksik");
    }

    try {
      const veri = {
        talepId: talep._id,
        aracId: seciliArac._id,
        sofor: seciliArac.sofor,
        gorevNotu,
      };

      await api.post("/gorevler", veri);

      toast.success("Görev başarıyla oluşturuldu.");
      queryClient.invalidateQueries(["talepler"]);
      handleClose();
    } catch (err) {
      console.error(err);
      toast.error("Görev oluşturulurken hata oluştu: " + err?.response?.data?.message);
    }
  };

  return (
    <dialog id="talepGorevlendirModal" className="modal">
      <div className="modal-box max-w-5xl">
        <h3 className="font-bold text-lg border-b pb-2 mb-4">Araç Görevlendir</h3>

        <div className="bg-gray-100 p-4 rounded-md mb-4 text-sm space-y-2">
          <div><strong>Başlık:</strong> {talep.baslik}</div>
          <div><strong>Açıklama:</strong> {talep.aciklama}</div>
          <div><strong>Lokasyon:</strong> {talep.lokasyon?.adres}</div>
          <div><strong>İstenen Araç:</strong> {talep.aracTuru} ({talep.aracSayisi} adet)</div>
        </div>

        <div className="mb-4">
          <button className="btn btn-primary" onClick={() => setModal2("talepAracListesiModal")}>
            Araç Bul
          </button>
        </div>

        <div className="space-y-4">
          {seciliArac ? (
            <div className="bg-white border p-3 rounded-md">
              <div className="flex justify-between items-center mb-2">
                <div><strong>{seciliArac.plaka}</strong> ({seciliArac.aracTuru})</div>
                <button
                  className="btn btn-xs btn-error"
                  onClick={() => setSeciliArac(null)}
                >
                  ❌
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <input
                  className="input input-bordered"
                  placeholder="Şoför Adı"
                  value={seciliArac.sofor?.ad || ""}
                  onChange={(e) =>
                    setSeciliArac({
                      ...seciliArac,
                      sofor: { ...seciliArac.sofor, ad: e.target.value },
                    })
                  }
                />
                <input
                  className="input input-bordered"
                  placeholder="Şoför Soyadı"
                  value={seciliArac.sofor?.soyad || ""}
                  onChange={(e) =>
                    setSeciliArac({
                      ...seciliArac,
                      sofor: { ...seciliArac.sofor, soyad: e.target.value },
                    })
                  }
                />
                <input
                  className="input input-bordered"
                  placeholder="Telefon"
                  value={seciliArac.sofor?.telefon || ""}
                  onChange={(e) =>
                    setSeciliArac({
                      ...seciliArac,
                      sofor: { ...seciliArac.sofor, telefon: e.target.value },
                    })
                  }
                />
              </div>
            </div>
          ) : (
            <p className="text-sm text-gray-500 italic">Henüz araç seçilmedi.</p>
          )}
        </div>

        <div className="mt-4">
          <label className="label font-semibold">📝 Görev Notu</label>
          <textarea
            className="textarea textarea-bordered w-full"
            rows={3}
            value={gorevNotu}
            onChange={(e) => setGorevNotu(e.target.value)}
            placeholder="Görevle ilgili açıklama"
          />
        </div>

        <div className="modal-action">
          <button className="btn btn-primary" onClick={handleGorevOlustur}>
            Görevlendir
          </button>
          <button className="btn" onClick={handleClose}>
            Vazgeç
          </button>
        </div>

        <TalepAracListesiModal
          rotaBilgileri={rotaBilgileri}
          talep={talep}
          modal={modal2}
          setModal={setModal2}
          seciliArac={seciliArac}
          setSeciliArac={setSeciliArac}
        />
      </div>
    </dialog>
  );
};

export default TalepGorevlendirModal;
