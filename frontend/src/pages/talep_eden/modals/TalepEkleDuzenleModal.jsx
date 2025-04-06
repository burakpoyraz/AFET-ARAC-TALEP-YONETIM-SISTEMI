import React, { useEffect, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import api from "../../../lib/axios";
import HaritaKonumSecici from "../../../components/maps/HaritaKonumSecici";

const TalepEkleDuzenleModal = ({ modal, setModal, duzenlenecekTalep }) => {
  const queryClient = useQueryClient();

  const girisYapanKullanici = queryClient.getQueryData(["girisYapanKullanici"]);


  const [formData, setFormData] = useState({
    baslik: "",
    aciklama: "",
    aracTuru: "otomobil",
    aracSayisi: 1,
    adres: "",
    durum: "beklemede",
  });
  const [lokasyon, setLokasyon] = useState(null);

  useEffect(() => {
    const modalEl = document.getElementById("talepEkleDuzenleModal");
    const handleClose = () => setModal(null);
    modalEl?.addEventListener("close", handleClose);

    if (modal === "talepEkleDuzenleModal") {
      modalEl.showModal();

      if (duzenlenecekTalep) {
        setFormData({
          baslik: duzenlenecekTalep.baslik,
          aciklama: duzenlenecekTalep.aciklama,
          aracTuru: duzenlenecekTalep.aracTuru,
          aracSayisi: duzenlenecekTalep.aracSayisi,
          adres: duzenlenecekTalep.lokasyon.adres,
          talepEdenKullaniciId: girisYapanKullanici._id,
          talepEdenKurumFirmaId: girisYapanKullanici.kurumFirmaId._id,

        });
        setLokasyon({
          adres: duzenlenecekTalep.lokasyon.adres,
          lat: duzenlenecekTalep.lokasyon.lat,
          lng: duzenlenecekTalep.lokasyon.lng,
        });
      } else {
        setFormData({
          baslik: "",
          aciklama: "",
          aracTuru: "otomobil",
          aracSayisi: 1,
          adres: "",
          talepEdenKullaniciId: girisYapanKullanici._id,
          talepEdenKurumFirmaId: girisYapanKullanici.kurumFirmaId._id,
        });
        setLokasyon(null);
      }

      return () => {
        modalEl?.removeEventListener("close", handleClose);
      };
    } else {
      modalEl.close();
    }
  }, [modal]);

  useEffect(() => {
    if (lokasyon?.adres) {
      setFormData((prev) => ({ ...prev, adres: lokasyon.adres }));
    }
  }, [lokasyon?.adres]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const { mutate: talepEkleDuzenle } = useMutation({
    mutationFn: async (data) => {
      const payload = {
        ...data,
        lokasyon: {
          adres: data.adres,
          lat: lokasyon.lat,
          lng: lokasyon.lng,
        },
      };
      const res = duzenlenecekTalep
        ? await api.put(`/talepler/${duzenlenecekTalep._id}`, payload)
        : await api.post("/talepler", payload);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["talepler"]);
      setModal(null);
      toast.success(duzenlenecekTalep ? "Talep güncellendi" : "Talep oluşturuldu");
    },
    onError: (error) => {
      toast.error(error?.response?.data?.error || "Talep işlemi başarısız.");
    },
  });

  const handleSubmit = () => {
    if (!lokasyon || !formData.adres) {
      toast.error("Adres ve konum bilgisi zorunludur.");
      return;
    }
    talepEkleDuzenle(formData);
  };

  return (
    <dialog id="talepEkleDuzenleModal" className="modal">
      <div className="modal-box w-11/12 max-w-5xl">
        <h3 className="font-bold text-lg border-b pb-2 mb-4">
          {duzenlenecekTalep ? "Talep Düzenle" : "Yeni Talep Oluştur"}
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Sol: Form Bilgileri */}
          <div>
            <label className="label"><span className="label-text">Başlık</span></label>
            <input name="baslik" className="input input-bordered w-full mb-2" value={formData.baslik} onChange={handleInputChange} />

            <label className="label"><span className="label-text">Açıklama</span></label>
            <textarea name="aciklama" className="textarea textarea-bordered w-full mb-2" value={formData.aciklama} onChange={handleInputChange} />

            <label className="label"><span className="label-text">Araç Türü</span></label>
            <select name="aracTuru" className="select select-bordered w-full mb-2" value={formData.aracTuru} onChange={handleInputChange}>
              {["otomobil", "kamyonet", "minibüs", "otobüs", "kamyon", "çekici(Tır)", "pick-Up", "tanker", "y.Römork", "lowbed", "motosiklet"].map((tur) => (
                <option key={tur} value={tur}>{tur}</option>
              ))}
            </select>

            <label className="label"><span className="label-text">Araç Sayısı</span></label>
            <input name="aracSayisi" type="number" className="input input-bordered w-full mb-2" value={formData.aracSayisi} onChange={handleInputChange} />

            <label className="label"><span className="label-text">Adres</span></label>
            <input name="adres" className="input input-bordered w-full mb-2" value={formData.adres} onChange={handleInputChange} />
            
          </div>

          

          {/* Sağ: Harita */}
          <div>
            <p className="text-sm text-gray-600 mb-2">📍 Harita üzerinden lokasyon seçin:</p>
            <HaritaKonumSecici konum={lokasyon} setKonum={setLokasyon} />
          </div>
        </div>

        <div className="modal-action mt-6">
          <button className="btn" onClick={() => setModal(null)}>İptal</button>
          <button className="btn btn-primary" onClick={handleSubmit}>
            {duzenlenecekTalep ? "Güncelle" : "Kaydet"}
          </button>
        </div>
      </div>
    </dialog>
  );
};

export default TalepEkleDuzenleModal;
