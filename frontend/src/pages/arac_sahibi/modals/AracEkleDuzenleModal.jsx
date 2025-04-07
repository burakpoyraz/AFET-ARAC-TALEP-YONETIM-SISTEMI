import { useMutation, useQueryClient } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import api from "../../../lib/axios";
import toast from "react-hot-toast";
import HaritaKonumSecici from "../../../components/maps/HaritaKonumSecici";

const AracEkleDuzenleModal = ({ modal, setModal, duzenlenecekArac }) => {
  const queryClient = useQueryClient();
  
 const icon="/icons/arac.png"

  const [formData, setFormData] = useState({
    plaka: "",
    aracTuru: "otomobil",
    kullanimAmaci: "yolcu",
    kapasite: 1,
    aracDurumu: "aktif",
    konum: null,
    musaitlikDurumu: true,
  });

  const [konum, setKonum] = useState(null);

  useEffect(() => {
    const modalEl = document.getElementById("aracEkleDuzenleModal");

    const handleClose = () => {
      setModal(null);
    };

    modalEl?.addEventListener("close", handleClose);

    if (modal === "aracEkleDuzenleModal") {
      modalEl.showModal();

      if (duzenlenecekArac) {
        setFormData({
          plaka: duzenlenecekArac.plaka,
          aracTuru: duzenlenecekArac.aracTuru,
          kullanimAmaci: duzenlenecekArac.kullanimAmaci,
          kapasite: duzenlenecekArac.kapasite,
        
          aracDurumu: duzenlenecekArac.aracDurumu,
          musaitlikDurumu: duzenlenecekArac.musaitlikDurumu,
        });

        setKonum({
          adres: duzenlenecekArac.konum.adres,
          lat: duzenlenecekArac.konum.lat,
          lng: duzenlenecekArac.konum.lng,
        });
      } else {
        setFormData({
          plaka: "",
          aracTuru: "otomobil",
          kullanimAmaci: "yolcu",
          kapasite: 1,
          aracDurumu: "aktif",
          konum: null,
          musaitlikDurumu: true,
        });
        setKonum(null);
      }

      return () => {
        modalEl?.removeEventListener("close", handleClose);
      };
    } else {
      modalEl.close();
    }
  }, [modal]);

  useEffect(() => {
    if (konum?.adres) {
      setFormData((prev) => ({
        ...prev,
        konum: {
          lat: konum.lat,
          lng: konum.lng,
          adres: konum.adres,
        },
        adres: konum.adres, // input'u da güncellemek için
      }));
    }
  }, [konum]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const { mutate: aracEkleDuzenle } = useMutation({
    mutationFn: async (data) => {
      try {
        const backendData = {
          plaka: data.plaka,
          aracTuru: data.aracTuru,
          kullanimAmaci: data.kullanimAmaci,
          kapasite: Number(data.kapasite),
          aracDurumu: data.aracDurumu,
          musaitlikDurumu: data.musaitlikDurumu,
          konum: data.konum,
        };

        if (duzenlenecekArac) {
          const res = await api.put(
            `/araclar/${duzenlenecekArac.plaka}`,
            backendData
          );
          return res.data;
        } else {
          const res = await api.post("/araclar", backendData);
          return res.data;
        }
      } catch (error) {
        console.error("Araç ekleme/düzenleme hatası:", error.message);
        console.error("Hata detayları:", error.response?.data);

        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["araclar"]);
      setModal(null);
      toast.success(duzenlenecekArac ? "Araç güncellendi" : "Araç eklendi");
    },
    onError: (error) => {
      console.error("Araç ekleme/düzenleme hatası:", error.response.data.error);
      toast.error(error.response.data.error);
    },
  });

  const handleSubmit = () => {
    if (!konum || konum.lat === undefined || konum.lng === undefined || !formData.adres) {
      toast.error("Lütfen harita üzerinden bir konum seçin.");
      return;
    }

    console.log("Gönderilen veri:", formData);
    aracEkleDuzenle(formData);
  
  };

  return (
    <dialog id="aracEkleDuzenleModal" className="modal">
      <div className="modal-box w-11/12 max-w-5xl">
        {" "}
        {/* Genişliği büyüttük */}
        <h3 className="font-bold text-lg border-b pb-2 mb-4">
          {duzenlenecekArac ? "Araç Düzenle" : "Yeni Araç Ekle"}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* 🧾 Sol taraf: Form bilgileri */}
          <div>
            {" "}
            <label className="label">
              <span className="label-text font-semibold">Araç Plakası</span>
            </label>
            <input
              name="plaka"
              type="text"
              placeholder="Plaka"
              className="input input-bordered w-full mb-4"
              value={formData.plaka}
              onChange={handleInputChange}
            />
            <label className="label">
              <span className="label-text font-semibold">Araç Türü</span>
            </label>
            <select
              name="aracTuru"
              className="select select-bordered w-full mb-4"
              value={formData.aracTuru}
              onChange={handleInputChange}
            >
              {[
                "otomobil",
                "kamyonet",
                "minibüs",
                "otobüs",
                "kamyon",
                "çekici(Tır)",
                "pick-Up",
                "tanker",
                "y.Römork",
                "lowbed",
                "motosiklet",
              ].map((tur) => (
                <option key={tur} value={tur}>
                  {tur}
                </option>
              ))}
            </select>
            <label className="label">
              <span className="label-text font-semibold">Kullanım Amacı</span>
            </label>
            <select
              name="kullanimAmaci"
              className="select select-bordered w-full mb-4"
              value={formData.kullanimAmaci}
              onChange={handleInputChange}
            >
              <option value="yolcu">Yolcu</option>
              <option value="yuk">Yük</option>
            </select>
            <label className="label">
              <span className="label-text font-semibold">
                {formData.kullanimAmaci === "yolcu"
                  ? "Kapasite (Kişi)"
                  : "Kapasite (Ton)"}
              </span>
            </label>
            <input
              name="kapasite"
              type="number"
              placeholder="Kapasite"
              className="input input-bordered w-full mb-4"
              value={formData.kapasite}
              onChange={handleInputChange}
            />

<label className="label"><span className="label-text font-semibold">Adres</span></label>
<input name="adres" className="input input-bordered w-full mb-2" value={formData.adres || ""} onChange={handleInputChange} />

            <label className="label">
              <span className="label-text font-semibold">Araç Durumu</span>
            </label>
            <select
              name="aracDurumu"
              className="select select-bordered w-full mb-4"
              value={formData.aracDurumu}
              onChange={handleInputChange}
            >
              <option value="aktif">Aktif</option>
              <option value="pasif">Pasif</option>
            </select>
            <label className="label">
              <span className="label-text font-semibold">Müsaitlik Durumu</span>
            </label>
            <select
              name="musaitlikDurumu"
              className="select select-bordered w-full mb-4"
              value={formData.musaitlikDurumu}
              onChange={handleInputChange}
            >
              <option value={true}>Müsait</option>
              <option value={false}>Müsait Değil</option>
            </select>
          </div>

          {/* 🗺️ Sağ taraf: Harita */}
          <div className="mb-4">
                <p className="text-sm text-gray-600 mb-2">Harita üzerinden araç konumunu belirleyin:</p>
            <HaritaKonumSecici konum={konum} setKonum={setKonum} icon={icon} />
      
          </div>
        </div>
        {/* 🔘 Butonlar */}
        <div className="modal-action mt-6">
          <button className="btn" onClick={() => setModal(null)}>
            İptal
          </button>
          <button className="btn btn-primary" onClick={handleSubmit}>
            {duzenlenecekArac ? "Güncelle" : "Kaydet"}
          </button>
        </div>
      </div>
    </dialog>
  );
};

export default AracEkleDuzenleModal;
