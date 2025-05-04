import { useMutation, useQueryClient } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import api from "../../../../lib/axios";
import { toast } from "react-hot-toast";

const GorevDurumGuncelleModal = ({ gorev, modal, setModal }) => {
  const [gorevDurum, setGorevDurum] = useState();

  const queryClient = useQueryClient();



  const { mutate: gorevDurumGuncelle } = useMutation({
    mutationFn: async (gorevId) => {
      const res = await api.put(`/gorevler/${gorevId}`, {
        ...gorev,
        gorevDurumu: gorevDurum,
      });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["gorevler"]);
      document.getElementById("gorevDurumGuncelleModal")?.close();
      toast.success("Görev durumu güncellendi.");
      
    },
    onError: (err) => {
      console.log("HATA:", err);
      const message = err?.response?.data?.message || "Bir hata oluştu";
      toast.error(message); 
    },
  });

  useEffect(() => {
    const modalEl = document.getElementById("gorevDurumGuncelleModal");
    const handleClose = () => setModal(null);
    modalEl?.addEventListener("close", handleClose);

    if (modal === "gorevDurumGuncelleModal" && modalEl) {
        setGorevDurum(gorev.gorevDurumu);
      modalEl.showModal();
      return () => {
        modalEl.removeEventListener("close", handleClose);
      };
    } else if (modalEl?.open) {
      modalEl.close();
    
    }
  }, [modal]);

  if (!gorev) return null;

  return (
    <dialog id="gorevDurumGuncelleModal" className="modal">
      <div className="modal-box">
        <h3 className="font-bold text-lg mb-4">Görev Durumu Güncelle</h3>
        <div className="form-control mb-4">
       
          <select
            className="select select-bordered"
            value={gorevDurum}
            onChange={(e) => setGorevDurum(e.target.value)}
          >
            <option value="beklemede">Beklemede</option>
            <option value="başladı">Başladı</option>
            <option value="tamamlandı">Tamamlandı</option>
            <option value="iptal edildi">İptal Edildi</option>
          </select>
        </div>

        <div className="modal-action">
          <button
            className="btn btn-primary"
            onClick={() => gorevDurumGuncelle(gorev._id)}
          >
            Güncelle
          </button>
          <button
            className="btn"
            onClick={() => {
              document.getElementById("gorevDurumGuncelleModal")?.close();
              setModal(null);
            }}
          >
            Vazgeç
          </button>
        </div>
      </div>
    </dialog>
  );
};

export default GorevDurumGuncelleModal;
