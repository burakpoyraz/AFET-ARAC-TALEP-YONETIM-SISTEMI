import { useMutation, useQueryClient } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import api from "../../../../lib/axios";
import { toast } from "react-hot-toast";

const KurumEkleDuzenleModal = ({ modal, setModal, duzenlenecekKurum }) => {
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState({
    kurumAdi: "",
    kurumTuru: "kamu",
    telefon: "",
    email: "",
    adres: "",
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    const kurumFormModal = document.getElementById("kurumEkleDuzenle");

    const handleClose = () => {
      setModal(null);
      setErrors({});
    };

    kurumFormModal?.addEventListener("close", handleClose);

    if (modal === "kurumEkleDuzenle") {
      kurumFormModal.showModal();

      if (duzenlenecekKurum) {
        setFormData({
          kurumAdi: duzenlenecekKurum.kurumAdi,
          kurumTuru: duzenlenecekKurum.kurumTuru,
          telefon: duzenlenecekKurum.iletisim.telefon,
          email: duzenlenecekKurum.iletisim.email,
          adres: duzenlenecekKurum.iletisim.adres,
        });
      } else {
        setFormData({
          kurumAdi: "",
          kurumTuru: "kamu",
          telefon: "",
          email: "",
          adres: "",
        });
      }

      return () => {
        kurumFormModal?.removeEventListener("close", handleClose);
      };
    } else {
      kurumFormModal.close();
    }
  }, [modal]);

  const handleInputChanges = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    // Clear error when user starts typing
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: "" });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.kurumAdi.trim()) {
      newErrors.kurumAdi = "Kurum adı zorunludur";
    }

    if (!formData.telefon.trim()) {
      newErrors.telefon = "Telefon numarası zorunludur";
    } else if (!/^\d{10}$/.test(formData.telefon.trim())) {
      newErrors.telefon = "Geçerli bir telefon numarası giriniz (10 haneli)";
    }

    if (!formData.email.trim()) {
      newErrors.email = "E-posta adresi zorunludur";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      newErrors.email = "Geçerli bir e-posta adresi giriniz";
    }

    if (!formData.adres.trim()) {
      newErrors.adres = "Adres zorunludur";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const { mutate: kurumEkleDuzenle, isLoading } = useMutation({
    mutationFn: async (data) => {
      const backendData = {
        kurumAdi: data.kurumAdi.trim(),
        kurumTuru: data.kurumTuru,
        iletisim: {
          telefon: data.telefon.trim(),
          email: data.email.trim(),
          adres: data.adres.trim(),
        },
      };
      if (duzenlenecekKurum) {
        const res = await api.put(
          `/kurumlar/${duzenlenecekKurum._id}`,
          backendData
        );
        return res.data;
      } else {
        const res = await api.post("/kurumlar", backendData);
        return res.data;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["kurumlar"]);
      setModal(null);
      toast.success(duzenlenecekKurum ? "Kurum başarıyla güncellendi" : "Kurum başarıyla eklendi");
    },
    onError: (error) => {
      const errorMessage = error.response?.data?.error || "Bir hata oluştu";
      toast.error(errorMessage);
    },
  });

  const handleKaydet = () => {
    if (!validateForm()) {
      toast.error("Lütfen tüm alanları doğru şekilde doldurun");
      return;
    }

    kurumEkleDuzenle(formData);
  };

  return (
    <dialog id="kurumEkleDuzenle" className="modal">
      <div className="modal-box">
        <h3 className="font-bold text-lg border-b pb-1">
          {duzenlenecekKurum ? "Kurum Düzenle" : "Yeni Kurum Ekle"}
        </h3>

        <div className="form-control w-full">
          <input
            name="kurumAdi"
            type="text"
            required
            placeholder="Kurum Adı"
            className={`input input-bordered w-full mb-1 mt-4 ${errors.kurumAdi ? 'input-error' : ''}`}
            value={formData.kurumAdi}
            onChange={handleInputChanges}
          />
          {errors.kurumAdi && <p className="text-error text-sm mb-2">{errors.kurumAdi}</p>}
        </div>

        <select
          name="kurumTuru"
          className="select select-bordered w-full mb-4"
          value={formData.kurumTuru}
          onChange={handleInputChanges}
        >
          <option value="kamu">Kamu</option>
          <option value="özel">Özel</option>
        </select>

        <div className="form-control w-full">
          <input
            name="telefon"
            type="text"
            required
            placeholder="Telefon (5XX XXX XXXX)"
            className={`input input-bordered w-full mb-1 ${errors.telefon ? 'input-error' : ''}`}
            value={formData.telefon}
            onChange={handleInputChanges}
          />
          {errors.telefon && <p className="text-error text-sm mb-2">{errors.telefon}</p>}
        </div>

        <div className="form-control w-full">
          <input
            name="email"
            type="email"
            required
            placeholder="E-posta"
            className={`input input-bordered w-full mb-1 ${errors.email ? 'input-error' : ''}`}
            value={formData.email}
            onChange={handleInputChanges}
          />
          {errors.email && <p className="text-error text-sm mb-2">{errors.email}</p>}
        </div>

        <div className="form-control w-full">
          <input
            name="adres"
            type="text"
            required
            placeholder="Adres"
            className={`input input-bordered w-full mb-1 ${errors.adres ? 'input-error' : ''}`}
            value={formData.adres}
            onChange={handleInputChanges}
          />
          {errors.adres && <p className="text-error text-sm mb-2">{errors.adres}</p>}
        </div>

        <div className="modal-action">
          <button 
            className="btn" 
            onClick={() => setModal(null)}
            disabled={isLoading}
          >
            İptal
          </button>
          <button 
            className={`btn btn-primary ${isLoading ? 'loading' : ''}`} 
            onClick={handleKaydet}
            disabled={isLoading}
          >
            {duzenlenecekKurum ? "Güncelle" : "Kaydet"}
          </button>
        </div>
      </div>
    </dialog>
  );
};

export default KurumEkleDuzenleModal;
