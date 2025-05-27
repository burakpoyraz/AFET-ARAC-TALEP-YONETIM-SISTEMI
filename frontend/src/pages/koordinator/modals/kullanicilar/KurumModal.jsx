import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import api from "../../../../lib/axios";

const KurumModal = ({ kullanici, kurumlar, modal, setModal }) => {
  if (!kurumlar) return null;

  const queryClient = useQueryClient();

  const [arama, setArama] = useState("");
  const [secilenKurumId, setSecilenKurumId] = useState(null);

  const filtrelenmisKurumlar = kurumlar.filter((kurum) => {
    const kurumAdi = kurum.kurumAdi.toLowerCase() || "";
    const telefon = kurum.iletisim.telefon || "";
    const adres = kurum.iletisim.adres?.toLowerCase() || "";
    const searchTerm = arama.toLowerCase();
    const aramaUyumlu =
      kurumAdi.includes(searchTerm) ||
      telefon.includes(searchTerm) ||
      adres.includes(searchTerm);
    return aramaUyumlu;
  });

  console.log(secilenKurumId);

  const { mutate: kurumAta } = useMutation({
    mutationFn: async (secilenKurumId) => {
      const res = await api.put(`/kullanicilar/${kullanici._id}`, {
        kurumFirmaId: secilenKurumId,
      });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["kullanicilar"]);
      document.getElementById("kurumModal")?.close();
    },
  });

  useEffect(() => {
    if (kullanici && modal == "kurumModal") {
      document.getElementById("kurumModal")?.showModal();
    }
  }, [kullanici, modal]);

  const handleKurumKaydet = () => {
    if (!secilenKurumId) return;
    kurumAta(secilenKurumId); // doğru ID gönderiliyor
  };

  return (
    <dialog id="kurumModal" className="modal">
      <div className="modal-box">
        <h3 className="font-bold text-lg  border-b pb-1">Kurum Eşle</h3>
        { kullanici && (
  <p className="text-sm text-gray-600 mb-2 pt-2">
    <span className="capitalize">{kullanici.ad} {kullanici.soyad}</span> için kurum seçin:
  </p>
)}

        <input
          type="text"
          className="input input-bordered w-full mb-4"
          placeholder="Kurum/Firma Adı"
          value={arama}
          onChange={(e) => setArama(e.target.value)}
        />

        <ul className="max-h-60 overflow-y-auto space-y-2">
          {filtrelenmisKurumlar.map((kurum) => (
            <li
              key={kurum._id}
              className={`p-2 rounded cursor-pointer border hover:bg-gray-100 ${
                secilenKurumId === kurum._id
                  ? "bg-blue-100 border-blue-500"
                  : ""
              }`}
              onClick={() => setSecilenKurumId(kurum._id)}
            >
              <p className="font-semibold">{kurum.kurumAdi}</p>
              <p className="text-sm text-gray-600">{kurum.iletisim.adres}</p>
              <p className="text-xs text-gray-500">{kurum.iletisim.telefon}</p>
            </li>
          ))}
        </ul>

        <div className="modal-action">
          <form method="dialog">
            <button className="btn" onClick={() => setModal(null)}>
              İptal
            </button>
          </form>
          <button className="btn btn-primary" onClick={handleKurumKaydet}>
            Kaydet
          </button>
        </div>
      </div>
    </dialog>
  );
};

export default KurumModal;
