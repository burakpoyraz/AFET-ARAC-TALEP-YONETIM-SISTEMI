import { useMutation, useQueryClient } from "@tanstack/react-query";
import React, { useEffect } from "react";
import api from "../../../../lib/axios";

const SilOnayModal = ({ kullanici, modal, setModal }) => {
  const queryClient = useQueryClient();

  const { mutate: kullaniciSil } = useMutation({
    mutationFn: async (kullaniciId) => {
      const res = await api.delete(`/kullanicilar/${kullaniciId}`);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["kullanicilar"]);
      document.getElementById("silOnayModal")?.close();
    },
  });

  useEffect(() => {
    if (kullanici && modal === "silOnayModal") {
      document.getElementById("silOnayModal")?.showModal();
    }
  }, [kullanici, modal]);

  if (!kullanici || modal !== "silOnayModal") return null;

  return (
    <dialog id="silOnayModal" className="modal">
      <div className="modal-box">
        <h3 className="font-bold text-lg  border-b pb-1">Kullanıcı Sil</h3>
        <p className="py-2 text-sm text-gray-600">
          <strong>
            {kullanici.ad} {kullanici.soyad}{" "}
          </strong>{" "}
          kullanıcısı silinecek. Onaylıyor musunuz?
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
              if (!kullanici._id) return;
              kullaniciSil(kullanici._id);
            }}
          >
            Sil
          </button>
        </div>
      </div>
    </dialog>
  );
};

export default SilOnayModal;
