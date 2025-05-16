import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import api from "../../lib/axios";
import GorevDurumGuncelleModal from "../koordinator/modals/gorevler/gorevDurumGuncelleModal";
import GorevDetayModal from "../koordinator/modals/gorevler/GorevDetayModal";
import HaritadaGorModal from "../koordinator/modals/gorevler/HaritadaGorModal";

const GorevlerimAracSahibi = () => {
  const [arama, setArama] = useState("");
  const [seciliGorev, setSeciliGorev] = useState(null);
  const [acikModal, setAcikModal] = useState(null);
  const [durumFiltre, setDurumFiltre] = useState("hepsi");

  const { data: gorevler = [], isLoading } = useQuery({
    queryKey: ["gorevler"],
    queryFn: async () => {
      const res = await api.get("/gorevler/arac-sahibi");
      return res.data;
    },
  });

  const filtrelenmisGorevler = gorevler
    .filter((gorev) => {
      const talepID = gorev.talepId?._id?.toLowerCase() || "";
      const talepAdi = gorev.talepId?.baslik?.toLowerCase() || "";
      const kurumAdi =
        gorev?.talepId?.talepEdenKurumFirmaId?.kurumAdi?.toLowerCase() || "";
      const plaka = gorev.aracId?.plaka?.toLowerCase() || "";
      const koordinatAdres =
        gorev.talepId?.lokasyon?.adres?.toLowerCase() || "";

      const aranan = arama.toLowerCase();
      const durumUygunMu =
        durumFiltre === "hepsi" || gorev.gorevDurumu === durumFiltre;
      return (
        durumUygunMu &&
        (talepID.includes(aranan) ||
          talepAdi.includes(aranan) ||
          kurumAdi.includes(aranan) ||
          plaka.includes(aranan) ||
          koordinatAdres.includes(aranan))
      );
    })
    .sort((a, b) => {
      const durumSirasi = {
        beklemede: 0,
        başladı: 1,
        tamamlandı: 2,
        "iptal edildi": 3,
      };
      return durumSirasi[a.gorevDurumu] - durumSirasi[b.gorevDurumu];
    });

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Görevlerim</h1>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
        <input
          type="text"
          placeholder="Görev ara..."
          className="input input-bordered"
          value={arama}
          onChange={(e) => setArama(e.target.value)}
        />
        <select
          className="select select-bordered"
          value={durumFiltre}
          onChange={(e) => setDurumFiltre(e.target.value)}
        >
          <option value="hepsi">Tüm Durumlar</option>
          <option value="beklemede">Beklemede</option>
          <option value="başladı">Başladı</option>
          <option value="tamamlandı">Tamamlandı</option>
          <option value="iptal edildi">İptal Edildi</option>
        </select>
      </div>

      {isLoading ? (
        <div>Yükleniyor...</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="table table-zebra w-full">
            <thead>
              <tr>
                <th>#</th>
                <th>Talep ID</th>
                <th>Talep Başlığı</th>
                <th>Talep Eden Kurum</th>
                <th>Görevlendirilen Plaka</th>

                <th>Konumlar</th>
                <th>Durum</th>
              </tr>
            </thead>
            <tbody>
              {filtrelenmisGorevler.map((gorev, index) => (
                <tr key={gorev._id}>
                  <td>{index + 1}</td>
                  <td
                    className="flex items-center gap-2"
                    title={gorev.talepId._id}
                  >
                    <span>{`${gorev.talepId._id.slice(
                      0,
                      4
                    )}...${gorev.talepId._id.slice(-4)}`}</span>
                    <button
                      className="btn btn-xs btn-ghost"
                      onClick={() => {
                        navigator.clipboard.writeText(gorev.talepId._id);
                        toast.success("Talep ID kopyalandı");
                      }}
                      title="ID Kopyala"
                    >
                      📋
                    </button>
                  </td>
                  <td className="capitalize">{gorev.talepId.baslik}</td>
                  <td className="capitalize">
                    {gorev.talepId?.talepEdenKurumFirmaId?.kurumAdi || "-"}
                  </td>
                  <td className="uppercase">{gorev.aracId?.plaka || "-"}</td>

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
                    {gorev.gorevDurumu === "tamamlandı" && (
                      <span className="badge badge-success gap-2">
                        Tamamlandı
                      </span>
                    )}
                    {gorev.gorevDurumu === "başladı" && (
                      <span className="badge badge-warning gap-2 text-white">
                        Başladı
                      </span>
                    )}
                    {gorev.gorevDurumu === "beklemede" && (
                      <span className="badge badge-info gap-2 text-white">
                        Beklemede
                      </span>
                    )}
                    {gorev.gorevDurumu === "iptal edildi" && (
                      <span className="badge badge-error gap-2 text-white">
                        İptal Edildi
                      </span>
                    )}
                  </td>

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

export default GorevlerimAracSahibi;
