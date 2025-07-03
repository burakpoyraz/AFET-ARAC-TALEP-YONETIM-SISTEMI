import { useMutation, useQueryClient } from "@tanstack/react-query";
import React, { useEffect } from "react";
import api from "../../../../lib/axios";
import { toast } from "react-hot-toast";

const RolAtamaModal = ({ kullanici, modal, setModal }) => {
  const [yeniRol, setYeniRol] = React.useState("");
  const queryClient = useQueryClient();

  const { mutate: rolGuncelle } = useMutation({
    mutationFn: async (yeniRol) => {
      const res = await api.put(`/kullanicilar/${kullanici._id}/rol-ata`, {
        rol: yeniRol
      });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["kullanicilar"]);
      toast.success("Rol başarıyla güncellendi");
      document.getElementById("rolAtamaModal")?.close();
      setModal(null);
    },
    onError: (error) => {
      toast.error("Rol güncellenirken bir hata oluştu");
      console.error("Rol güncelleme hatası:", error);
    }
  });

  useEffect(() => {
    if (kullanici && modal === "rolAtamaModal") {
      setYeniRol(kullanici.rol);
      document.getElementById("rolAtamaModal")?.showModal();
    }
  }, [kullanici?._id, modal]);

  if (!kullanici) return null;

  const handleRolDegisim = (e) => {
    const secilenRol = e.target.value;
    setYeniRol(secilenRol);
    
    if (secilenRol === "talep_eden") {
      toast.success("Not: Talep Eden rolü seçildiğinde kayıt türü otomatik olarak 'Kuruluş Adına' olarak güncellenecektir.", {
        duration: 5000,
      });
    }
  };

  return (
    <dialog id="rolAtamaModal" className="modal">
      <div className="modal-box">
        <h3 className="font-bold text-lg border-b pb-1">Rol Atama</h3>
        <p className="py-2 text-sm text-gray-600">
          <span className="capitalize">{kullanici.ad} {kullanici.soyad}</span> için yeni rol seçin:
        </p>

        <select
          className="select select-bordered w-full mb-4"
          value={yeniRol}
          onChange={handleRolDegisim}
        >
          <option value="beklemede">Beklemede</option>
          <option value="koordinator">Koordinatör</option>
          <option value="arac_sahibi">Araç Sahibi</option>
          <option value="talep_eden">Talep Eden</option>
        </select>

        <div className="modal-action">
          <form method="dialog">
            <button className="btn mr-2" onClick={() => setModal(null)}>
              İptal
            </button>
          </form>
          <button
            className="btn btn-primary"
            onClick={() => {
              if (!yeniRol) return;
              rolGuncelle(yeniRol);
            }}
          >
            Kaydet
          </button>
        </div>
      </div>
    </dialog>
  );
};

export default RolAtamaModal;
