import { useMutation, useQueryClient } from "@tanstack/react-query";
import React, { useEffect } from "react";
import api from "../../../../lib/axios";
import { toast } from "react-hot-toast";

const KurumSilOnayModal = ({ kurum, modal, setModal }) => {
  const queryClient = useQueryClient();

  const { mutate: kurumSil } = useMutation({
    mutationFn: async (kurumId) => {
      const res = await api.delete(`/kurumlar/${kurumId}`);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["kurumlar"]);
      document.getElementById("kurumSilOnayModal")?.close();
      toast.success("Kurum başarıyla silindi.");
    },
    onError: (error) => {
      toast.error("Kurum silme işlemi başarısız oldu: " + error.message);
    },
  });

  useEffect(() => {
    if (kurum && modal === "kurumSilOnayModal") {
      document.getElementById("kurumSilOnayModal")?.showModal();
    }
  }, [kurum, modal]);

  if (!kurum || modal !== "kurumSilOnayModal") return null;

  return (
    <dialog id="kurumSilOnayModal" className="modal">
      <div className="modal-box">
        <h3 className="font-bold text-lg  border-b pb-1">Firma / Kurum Sil</h3>
        <p className="py-2 text-sm text-gray-600">
          <strong>{kurum.kurumAdi} </strong> silinecek. Onaylıyor musunuz?
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
              İptal
            </button>
          </form>
          <button
            className="btn btn-error"
            onClick={() => {
              if (!kurum._id) return;
              kurumSil(kurum._id);
            }}
          >
            Sil
          </button>
        </div>
      </div>
    </dialog>
  );
};

export default KurumSilOnayModal;
