import { useMutation, useQueryClient } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import api from "../../../../lib/axios";
import { toast } from "react-hot-toast";

const GorevDurumGuncelleModal = ({ gorev, modal, setModal }) => {
  const [gorevDurum, setGorevDurum] = useState();

  const queryClient = useQueryClient();
  const rol = queryClient.getQueryData(["girisYapanKullanici"])?.rol;

  const rolBazliDurumlar = {
    koordinator: ["beklemede", "başladı", "tamamlandı", "iptal edildi"],
    talep_eden: [], // Seçim yaptırmayacağız, direkt "tamamlandı"
    arac_sahibi: ["beklemede", "başladı"],
  };

  const durumSecenekleri = rolBazliDurumlar[rol] || [];

  const { mutate: gorevDurumGuncelle } = useMutation({
    mutationFn: async ({ gorevId, yeniDurum }) => {
      const res = await api.put(`/gorevler/${gorevId}`, {
        gorevDurumu: yeniDurum,
      });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["gorevler"]);
      document.getElementById("gorevDurumGuncelleModal")?.close();
      toast.success("Görev durumu güncellendi.");
      setModal(null);
    },
    onError: (err) => {
      console.error("HATA:", err);
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
          {rol === "talep_eden" ? (
            <p>Bu görevi <strong>tamamlandı</strong> olarak işaretlemek istiyor musunuz?</p>
          ) : (
            <select
              className="select select-bordered w-full"
              value={gorevDurum}
              onChange={(e) => setGorevDurum(e.target.value)}
            >
              {!gorevDurum && <option value="">Durum Seç</option>}
              {durumSecenekleri.map((durum) => (
                <option key={durum} value={durum}>
                  {durum.charAt(0).toUpperCase() + durum.slice(1)}
                </option>
              ))}
            </select>
          )}
        </div>

        <div className="modal-action">
          <button
            className="btn btn-primary"
            onClick={() =>
              gorevDurumGuncelle({
                gorevId: gorev._id,
                yeniDurum: rol === "talep_eden" ? "tamamlandı" : gorevDurum,
              })
            }
          >
            {rol === "talep_eden" ? "Evet, Tamamlandı" : "Güncelle"}
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