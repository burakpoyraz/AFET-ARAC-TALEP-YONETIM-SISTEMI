import { useMutation, useQueryClient } from "@tanstack/react-query";
import React, { useEffect } from "react";
import api from "../../../lib/axios";
import { toast } from "react-hot-toast";

const AracSilOnayModal = ({ arac, modal, setModal }) => {
  const queryClient = useQueryClient();

  const { mutate: aracSil } = useMutation({
    mutationFn: async (plaka) => {
      const res = await api.delete(`/araclar/${plaka}`);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["araclar"]);
      document.getElementById("aracSilOnayModal")?.close();
      toast.success("Araç başarıyla silindi.");
    },
    onError: (error) => {
      toast.error("Arac silme işlemi başarısız oldu: " + error.message);
    },
  });

  useEffect(() => {
    if (arac && modal === "aracSilOnayModal") {
      document.getElementById("aracSilOnayModal")?.showModal();
    }
  }, [arac, modal]);

  if (!arac || modal !== "aracSilOnayModal") return null;

  return (
    <dialog id="aracSilOnayModal" className="modal">
      <div className="modal-box">
        <h3 className="font-bold text-lg  border-b pb-1">Aracı Sil</h3>
        <p className="py-2 text-sm text-gray-600">
          <strong>{arac.plaka} </strong> plakalı araç silinecek. Onaylıyor musunuz?
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
              if (!arac.plaka) return;
              aracSil(arac.plaka);
            }}
          >
            Sil
          </button>
        </div>
      </div>
    </dialog>
  );
};

export default AracSilOnayModal;
