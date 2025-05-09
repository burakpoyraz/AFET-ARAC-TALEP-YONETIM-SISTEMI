import { useMutation, useQueryClient } from "@tanstack/react-query";
import React, { useEffect } from "react";
import api from "../../../../lib/axios";
import { toast } from "react-hot-toast";

const TalepIptalModal = ({ talep, modal, setModal }) => {


  const queryClient = useQueryClient();
  const { mutate: talepIptal } = useMutation({
    mutationFn: async (talepId) => {
      const res = await api.put(`/talepler/${talepId}`, {
        ...talep,

        durum: talep.durum === "iptal edildi" ? "beklemede" : "iptal edildi",
      });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["talepler"]);
      document.getElementById("talepIptalModal")?.close();
      toast.success("Talep durum güncellemesi başarılı.");


    },
    onError: (error) => {
      toast.error(error.response?.data?.error || "Bir hata oluştu.");
    },
  });

  const talebiIptalEt = () => {
    talepIptal(talep._id);
  };

  useEffect(() => {
    const modalEl = document.getElementById("talepIptalModal");

    const handleClose = () => {
      setModal(null); // ESC ile kapanırsa da modal state sıfırlansın
    };

    if (talep && modal === "talepIptalModal") {
      modalEl?.showModal();
      modalEl?.addEventListener("close", handleClose);
    }

    return () => {
      modalEl?.removeEventListener("close", handleClose);
    };
  }, [talep?._id, modal]);

  if (!talep || modal !== "talepIptalModal") return null;

  return (
    <dialog id="talepIptalModal" className="modal">
      <div className="modal-box">
        <h3 className="font-bold text-lg  border-b pb-1">
          {talep.durum === "iptal edildi"
            ? "Talep Aktifleştir"
            : "Talep İptali"}
        </h3>
        <p className="py-2 text-sm text-gray-600">
          <strong>{talep.baslik} </strong> başlıklı talep
          {talep.durum === "iptal edildi"
            ? " aktifleştirilerek bekleme durumuna alınacak. "
            : " iptal edilecek. "}
          Onaylıyor musunuz?
        </p>
        <div className="modal-action">
          <form method="dialog">
            <button
              className="btn mr-2"
              onClick={(e) => {
                e.preventDefault();
                setModal(null);
              }}
            >
              Vazgeç
            </button>
          </form>
          <button
            className={`btn ${
              talep.durum === "iptal edildi" ? "btn-primary" : "btn-error"
            }`}
            onClick={() => {
              if (!talep._id) return;
              talebiIptalEt(talep._id);
            }}
          >
            {talep.durum === "iptal edildi" ? "Aktifleştir" : "İptal Et"}
          </button>
        </div>
      </div>
    </dialog>
  );
};

export default TalepIptalModal;
