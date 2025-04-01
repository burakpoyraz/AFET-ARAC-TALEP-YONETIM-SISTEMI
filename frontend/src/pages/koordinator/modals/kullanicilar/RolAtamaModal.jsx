import { useMutation, useQueryClient } from "@tanstack/react-query";
import React, { useEffect } from "react";
import api from "../../../../lib/axios";

const RolAtamaModal = ({ kullanici, modal, setModal }) => {
  const [yeniRol, setYeniRol] = React.useState("");
  const queryClient = useQueryClient();

  const { mutate: rolGuncelle } = useMutation({
    mutationFn: async (yeniRol) => {
      const res = await api.put(`/kullanicilar/${kullanici._id}`, {
        ...kullanici,
        rol: yeniRol,
      });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["kullanicilar"]);

      document.getElementById("rolAtamaModal")?.close();
    },
  });

  useEffect(() => {
    if (kullanici && modal === "rolAtamaModal") {
      setYeniRol(kullanici.rol);
      document.getElementById("rolAtamaModal")?.showModal();
    }
  }, [kullanici?._id, modal]);

  if (!kullanici) return null;

  return (
    <dialog id="rolAtamaModal" className="modal">
      <div className="modal-box">
        <h3 className="font-bold text-lg border-b pb-1">Rol Atama</h3>
        <p className="py-2 text-sm text-gray-600">
          {kullanici.ad} {kullanici.soyad} için yeni rol seçin:
        </p>

        <select
          className="select select-bordered w-full mb-4"
          value={yeniRol}
          onChange={(e) => setYeniRol(e.target.value)}
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
