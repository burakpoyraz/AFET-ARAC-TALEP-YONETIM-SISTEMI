import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import api from "../../lib/axios";
import GorevDurumGuncelleModal from "./modals/gorevler/gorevDurumGuncelleModal";
import GorevDetayModal from "./modals/gorevler/GorevDetayModal";
import HaritadaGorModal from "./modals/gorevler/HaritadaGorModal";

const Gorevler = () => {
  const [arama, setArama] = useState("");
  const [seciliGorev, setSeciliGorev] = useState(null);
  const [acikModal, setAcikModal] = useState(null);


  const { data: gorevler = [], isLoading } = useQuery({
    queryKey: ["gorevler"],
    queryFn: async () => {
      const res = await api.get("/gorevler");
      return res.data;
    },
  });

  const filtrelenmisGorevler = gorevler.filter((gorev) => {
    const talepAdi = gorev.talepId?.baslik?.toLowerCase() || "";
    const kurumAdi =
      gorev?.talepId?.talepEdenKurumFirmaId?.kurumAdi?.toLowerCase() || "";
    const plakaListesi = gorev.gorevlendirilenAraclar
      .map((g) => g.aracId?.plaka?.toLowerCase())
      .join(" ");
    const koordinatAdres = gorev.talepId?.lokasyon?.adres?.toLowerCase() || "";

    const aranan = arama.toLowerCase();
    return (
      talepAdi.includes(aranan) ||
      kurumAdi.includes(aranan) ||
      plakaListesi.includes(aranan) ||
      koordinatAdres.includes(aranan)
    );
  });

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Görevler</h1>
      <input
        type="text"
        placeholder="Görev ara..."
        className="input input-bordered mb-4"
        value={arama}
        onChange={(e) => setArama(e.target.value)}
      />

      {isLoading ? (
        <div>Yükleniyor...</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="table table-zebra w-full">
            <thead>
              <tr>
                <th>#</th>
                <th>Talep Başlığı</th>
                <th>Talep Eden Kurum</th>
                <th>Görevlendirilen Plaka</th>
               
                <th>Konumlar</th>
                <th>Durum</th>
                <th>Not</th>
              </tr>
            </thead>
            <tbody>
              {filtrelenmisGorevler.map((gorev, index) => (
                <tr key={gorev._id}>
                  <td>{index + 1}</td>
                  <td>{gorev.talepId.baslik}</td>
                  <td>
                    {gorev.talepId?.talepEdenKurumFirmaId?.kurumAdi || "-"}
                  </td>
                  <td>
                    {gorev.gorevlendirilenAraclar.map((g) => (
                      <div key={g._id}>{g.aracId?.plaka} {g.aracId?.aracTuru}</div>
                   
                    ))}
                  </td>
                  
                  <td className="whitespace-nowrap">
  <div className="flex flex-col">
    <span
      title={gorev.talepId?.lokasyon?.adres}
      className="truncate max-w-[180px]"
    >
      {gorev.talepId?.lokasyon?.adres || "-"}
    </span>
    <button
      className="btn btn-xs btn-outline btn-info mt-1"
      onClick={() => {
        setSeciliGorev(gorev);
        setAcikModal("haritadaGorModal");
      }}
    >
      Haritada Gör
    </button>
  </div>
</td>
                  <td>
                    <span
                      className={`badge badge-${
                        gorev.gorevDurumu === "tamamlandi"
                          ? "success"
                          : gorev.gorevDurumu === "başladı"
                          ? "warning"
                          : "info"
                      }`}
                    >
                      {gorev.gorevDurumu}
                    </span>
                  </td>

                  <td>{gorev.gorevNotu}</td>
                  <td>
                    <div className="dropdown dropdown-end">
                      <button tabIndex={0} className="btn btn-xs btn-outline">
                        İşlemler
                      </button>
                      <ul
                        tabIndex={0}
                        className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-40"
                      >
                        <li>
                          <button
                            onClick={() => {
                              setSeciliGorev(gorev);
                              setAcikModal("gorevDetayModal");
                            }}
                          >
                            Görev Detayı
                          </button>
                        </li>

                        <li>
                          <button
                            onClick={() => {
                              setSeciliGorev(gorev);
                              setAcikModal("gorevDurumGuncelleModal");
                            }}
                          >
                            Durum Güncelle
                          </button>
                        </li>
                        <li>
                          <button
                            onClick={() => {
                              setSeciliGorev(gorev);
                              setAcikModal("gorevSilOnayModal");
                            }}
                          >
                            Sil
                          </button>
                        </li>
                      </ul>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <GorevDurumGuncelleModal
      
        gorev={seciliGorev}
        modal={acikModal}
        setModal={setAcikModal}
      />
      <GorevDetayModal
        gorev={seciliGorev}
        modal={acikModal}
        setModal={setAcikModal}
      />

      <HaritadaGorModal
        gorev={seciliGorev}
        modal={acikModal}
        setModal={setAcikModal}
      />

     
    </div>
  );
};

export default Gorevler;
