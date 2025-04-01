import { useMutation, useQueryClient } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import api from "../../../../lib/axios";

const KurumEkleDuzenleModal = ({ modal, setModal, duzenlenecekKurum }) => {
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState({
    kurumAdi: "",
    kurumTuru: "kamu",
    telefon: "",
    email: "",
    adres: "",
  });

  useEffect(() => {
    const kurumFormModal = document.getElementById("kurumEkleDuzenle");

    const handleClose = () => {
      setModal(null);
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
  };

  const { mutate: kurumEkleDuzenle } = useMutation({
    mutationFn: async (data) => {
      const backendData = {
        kurumAdi: data.kurumAdi,
        kurumTuru: data.kurumTuru,
        iletisim: {
          telefon: data.telefon,
          email: data.email,
          adres: data.adres,
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
    },
  });

  const handleKaydet = () => {
    const trimmedMail = formData.email.trim();

    kurumEkleDuzenle({
      ...formData,
      email: trimmedMail,
    });
  };

  return (
    <dialog id="kurumEkleDuzenle" className="modal">
      <div className="modal-box">
        <h3 className="font-bold text-lg border-b pb-1">
          {duzenlenecekKurum ? "Kurum Düzenle" : "Yeni Kurum Ekle"}
        </h3>

        <input
          name="kurumAdi"
          type="text"
          required
          placeholder="Kurum Adı"
          className="input input-bordered w-full mb-4 mt-4"
          value={formData.kurumAdi}
          onChange={handleInputChanges}
        />

        <select
          name="kurumTuru"
          className="select select-bordered w-full mb-4"
          value={formData.kurumTuru}
          onChange={handleInputChanges}
        >
          <option value="kamu">Kamu</option>
          <option value="özel">Özel</option>
        </select>

        <input
          name="telefon"
          type="text"
          required
          placeholder="Telefon"
          className="input input-bordered w-full mb-4"
          value={formData.telefon}
          onChange={handleInputChanges}
        />

        <input
          name="email"
          type="email"
          required
          placeholder="E-posta"
          className="input input-bordered w-full mb-4"
          value={formData.email}
          onChange={handleInputChanges}
        />

        <input
          name="adres"
          type="text"
          required
          placeholder="Adres"
          className="input input-bordered w-full mb-4"
          value={formData.adres}
          onChange={handleInputChanges}
        />

        <div className="modal-action">
          <button className="btn" onClick={() => setModal(null)}>
            İptal
          </button>
          <button className="btn btn-primary" onClick={handleKaydet}>
            {duzenlenecekKurum ? "Güncelle" : "Kaydet"}
          </button>
        </div>
      </div>
    </dialog>
  );
};

export default KurumEkleDuzenleModal;
