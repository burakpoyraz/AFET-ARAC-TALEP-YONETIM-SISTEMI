import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import api from "../../lib/axios";
import TalepEkleDuzenleModal from "./modals/TalepEkleDuzenleModal";
import TalepIptalModal from "../koordinator/modals/talepler/TalepIptalModal";

const Taleplerim = () => {
  const [arama, setArama] = useState("");
  const [acikModal, setAcikModal] = useState(null);
  const [seciliTalep, setSeciliTalep] = useState(null);

  const { data: talepler = [], isLoading } = useQuery({
    queryKey: ["taleplerim"],
    queryFn: async () => {
      const res = await api.get("/talepler/taleplerim");
      return res.data;
    },
  });

  const filtrelenmisTalepler = talepler.filter((talep) => {
    const talepID = talep._id?.toLowerCase() || "";
    const baslik = talep.baslik?.toLowerCase() || "";
    const aciklama = talep.aciklama?.toLowerCase() || "";
    const aracTuru = talep.aracTuru?.toLowerCase() || "";
    const searchTerm = arama.toLowerCase();
    return (
      talepID.includes(searchTerm) ||
      baslik.includes(searchTerm) ||
      aciklama.includes(searchTerm) ||
      aracTuru.includes(searchTerm)
    );
  }) .sort((a, b) => {
      const oncelik = {
        beklemede: 0,
        gorevlendirildi: 1,
        tamamlandı: 2,
        "iptal edildi": 3,
      };
      return (oncelik[a.durum] ?? 99) - (oncelik[b.durum] ?? 99);
    });

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">📋 Taleplerim</h1>
      <div className="flex justify-between items-center mb-4">
        <input
          type="text"
          placeholder="Talep ara..."
          className="input input-bordered"
          value={arama}
          onChange={(e) => setArama(e.target.value)}
        />
        <button
          className="btn btn-primary flex-shrink-0"
          onClick={() => {
            setSeciliTalep(null);
            setAcikModal("talepEkleDuzenleModal");
          }}
        >
          ➕ Yeni Talep Oluştur
        </button>
      </div>

      {isLoading ? (
        <div>Yükleniyor...</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="table table-zebra w-full">
            <thead>
              <tr>
                <th>Talep ID</th>
                <th>Başlık</th>
                <th>Açıklama</th>
                <th>Tür</th>
                <th>Sayısı</th>
                <th>Adres</th>
                <th>Durum</th>
              </tr>
            </thead>
            <tbody>
              {filtrelenmisTalepler.map((talep, index) => (
                <tr key={talep._id}>
                  <td className="flex items-center gap-2" title={talep._id}>
                    <span>{`${talep._id.slice(0, 4)}...${talep._id.slice(
                      -4
                    )}`}</span>
                    <button
                      className="btn btn-xs btn-ghost"
                      onClick={() => {
                        navigator.clipboard.writeText(talep._id);
                        toast.success("Talep ID kopyalandı");
                      }}
                      title="ID Kopyala"
                    >
                      📋
                    </button>
                  </td>
                  <td className="capitalize">{talep.baslik}</td>
                  <td className="capitalize">{talep.aciklama}</td>
                  <td className="capitalize">{talep.aracTuru}</td>
                  <td className="capitalize">{talep.aracSayisi}</td>
                  <td className="capitalize">{talep.lokasyon.adres}</td>
                  <td className="capitalize">
                    <span
                      className={`badge ${
                        talep.durum === "beklemede"
                          ? "badge badge-info gap-2"
                          : talep.durum === "gorevlendirildi"
                          ? "badge badge-warning gap-2"
                          : talep.durum === "tamamlandı"
                          ? "badge badge-success gap-2 "
                          : talep.durum === "iptal edildi"
                          ? "badge badge-error gap-2 "
                          : "badge-ghost"
                      }`}
                    >
                      {talep.durum}
                    </span>
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
                              setSeciliTalep(talep);
                              setAcikModal("talepEkleDuzenleModal");
                            }}
                          >
                            Düzenle
                          </button>
                        </li>
                        <li>
                          <button
                            onClick={() => {
                              setSeciliTalep(talep);
                              setAcikModal("talepIptalModal");
                            }}
                          >
                            İptal Et
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

      <TalepEkleDuzenleModal
        modal={acikModal}
        setModal={setAcikModal}
        duzenlenecekTalep={seciliTalep}
      />

      <TalepIptalModal
        talep={seciliTalep}
        modal={acikModal}
        setModal={setAcikModal}
      />
    </div>
  );
};

export default Taleplerim;
