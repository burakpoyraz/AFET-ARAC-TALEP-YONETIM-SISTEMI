import React, { useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import api from "../../../../lib/axios";
import TalepAracListesiModal from "./TalepAracListesiModal";
import toast from "react-hot-toast";

const TalepGorevlendirModal = ({ talep, araclar, modal, setModal }) => {
  const [rotaBilgileri, setRotaBilgileri] = useState([]);
  const [modal2, setModal2] = useState(null);
  const [seciliAraclar, setSeciliAraclar] = useState([]);
  const [gorevNotu, setGorevNotu] = useState("");
  const queryClient = useQueryClient();
  
  // Eski veri yapısı ile uyumluluk kontrolü
  const talepAraclar = talep?.araclar || (talep?.aracTuru ? [{ aracTuru: talep.aracTuru, aracSayisi: talep.aracSayisi || 1 }] : []);

  const handleClose = () => {
    setModal(null);
    setSeciliAraclar([]);
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
  
  // Araç ekleme fonksiyonu
  const handleAracEkle = (arac) => {
    // Araç zaten eklenmişse ekleme
    if (seciliAraclar.some(item => item._id === arac._id)) {
      toast.error("Bu araç zaten eklenmiş");
      return;
    }
    
    // Araç bilgilerini şoför bilgileriyle birlikte ekle
    setSeciliAraclar([...seciliAraclar, {
      ...arac,
      sofor: {
        ad: "",
        soyad: "",
        telefon: ""
      }
    }]);
    
    setModal2(null); // Araç listesi modalını kapat
  };
  
  // Araç silme fonksiyonu
  const handleAracSil = (aracId) => {
    setSeciliAraclar(seciliAraclar.filter(arac => arac._id !== aracId));
  };
  
  // Şoför bilgilerini güncelleme
  const handleSoforGuncelle = (index, field, value) => {
    const yeniAraclar = [...seciliAraclar];
    yeniAraclar[index].sofor = {
      ...yeniAraclar[index].sofor,
      [field]: value
    };
    setSeciliAraclar(yeniAraclar);
  };

  const handleGorevOlustur = async () => {
    if (seciliAraclar.length === 0) {
      return toast.error("En az bir araç seçmelisiniz");
    }

    // Tüm araçların şoför bilgilerini kontrol et
    const eksikSoforBilgisi = seciliAraclar.some(
      arac => !arac.sofor?.ad || !arac.sofor?.soyad || !arac.sofor?.telefon
    );
    
    if (eksikSoforBilgisi) {
      return toast.error("Tüm araçlar için şoför bilgilerini eksiksiz girmelisiniz");
    }

    try {
      // Her bir araç için görev oluştur
      const gorevler = [];
      
      for (const arac of seciliAraclar) {
        const veri = {
          talepId: talep._id,
          aracId: arac._id,
          sofor: arac.sofor,
          gorevNotu,
        };
        
        const response = await api.post("/gorevler", veri);
        gorevler.push(response.data);
      }

      toast.success(`${gorevler.length} araç için görev başarıyla oluşturuldu.`);
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
          
          <div>
            <strong>İstenen Araçlar:</strong>
            <div className="overflow-x-auto">
              <table className="table table-xs table-zebra w-full mt-2">
                <thead>
                  <tr>
                    <th>Araç Türü</th>
                    <th className="text-right">Adet</th>
                  </tr>
                </thead>
                <tbody>
                  {talepAraclar.map((arac, index) => (
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
                      {talepAraclar.reduce((toplam, arac) => toplam + arac.aracSayisi, 0)}
                    </th>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        </div>

        <div className="mb-4 flex justify-between items-center">
          <button className="btn btn-primary" onClick={() => setModal2("talepAracListesiModal")}>
            Araç Ekle
          </button>
          
          <div className="text-sm">
            <span className="font-semibold">Seçili Araç Sayısı:</span> {seciliAraclar.length}
          </div>
        </div>

        <div className="space-y-4">
          {seciliAraclar.length > 0 ? (
            seciliAraclar.map((arac, index) => (
              <div key={arac._id} className="bg-white border p-3 rounded-md mb-3">
                <div className="flex justify-between items-center mb-2">
                  <div><strong>{arac.plaka}</strong> ({arac.aracTuru})</div>
                  <button
                    className="btn btn-xs btn-error"
                    onClick={() => handleAracSil(arac._id)}
                  >
                    ❌
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <input
                    className="input input-bordered"
                    placeholder="Şoför Adı"
                    value={arac.sofor?.ad || ""}
                    onChange={(e) => handleSoforGuncelle(index, "ad", e.target.value)}
                  />
                  <input
                    className="input input-bordered"
                    placeholder="Şoför Soyadı"
                    value={arac.sofor?.soyad || ""}
                    onChange={(e) => handleSoforGuncelle(index, "soyad", e.target.value)}
                  />
                  <input
                    className="input input-bordered"
                    placeholder="Telefon"
                    value={arac.sofor?.telefon || ""}
                    onChange={(e) => handleSoforGuncelle(index, "telefon", e.target.value)}
                  />
                </div>
              </div>
            ))
          ) : (
            <p className="text-sm text-gray-500 italic">Henüz araç seçilmedi. Lütfen "Araç Ekle" butonuna tıklayarak araç ekleyin.</p>
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
          <button 
            className="btn btn-primary" 
            onClick={handleGorevOlustur}
            disabled={seciliAraclar.length === 0}
          >
            {seciliAraclar.length > 1 ? `${seciliAraclar.length} Aracı Görevlendir` : "Görevlendir"}
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
          handleAracEkle={handleAracEkle}
          seciliAraclar={seciliAraclar}
        />
      </div>
    </dialog>
  );
};

export default TalepGorevlendirModal;
