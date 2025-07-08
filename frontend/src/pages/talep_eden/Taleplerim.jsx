import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import api from "../../lib/axios";
import TalepEkleDuzenleModal from "./modals/TalepEkleDuzenleModal";
import TalepIptalModal from "../koordinator/modals/talepler/TalepIptalModal";
import { toast } from "react-hot-toast";

const Taleplerim = () => {
  const [arama, setArama] = useState("");
  const [acikModal, setAcikModal] = useState(null);
  const [seciliTalep, setSeciliTalep] = useState(null);

  const { data: girisYapanKullanici } = useQuery({
    queryKey: ["girisYapanKullanici"],
  });

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
    const searchTerm = arama.toLowerCase();
    
    // Araç türlerinde de arama yap
    let araclarMatch = false;
    if (talep.araclar && Array.isArray(talep.araclar)) {
      araclarMatch = talep.araclar.some(arac => 
        arac.aracTuru?.toLowerCase().includes(searchTerm)
      );
    } else if (talep.aracTuru) {
      araclarMatch = talep.aracTuru.toLowerCase().includes(searchTerm);
    }
    
    return (
      talepID.includes(searchTerm) ||
      baslik.includes(searchTerm) ||
      aciklama.includes(searchTerm) ||
      araclarMatch
    );
  }).sort((a, b) => {
    const oncelik = {
      beklemede: 0,
      gorevlendirildi: 1,
      tamamlandı: 2,
      "iptal edildi": 3,
    };
    return (oncelik[a.durum] ?? 99) - (oncelik[b.durum] ?? 99);
  });

  // Kullanıcının talebi düzenleyebilme yetkisi var mı?
  const kullaniciDuzenleyebilirMi = (talep) => {
    return (
      talep.talepEdenKullaniciId._id === girisYapanKullanici._id && 
      talep.durum === "beklemede"
    );
  };

  // Araç türlerini ve sayılarını özet olarak göstermek için yardımcı fonksiyon
  const aracOzetiGetir = (talep) => {
    // Eski veri yapısı ile uyumluluk kontrolü
    if (!talep.araclar && talep.aracTuru) {
      return `${talep.aracTuru} (${talep.aracSayisi})`;
    }
    
    if (!talep.araclar || talep.araclar.length === 0) {
      return "-";
    }
    
    if (talep.araclar.length === 1) {
      return `${talep.araclar[0].aracTuru} (${talep.araclar[0].aracSayisi})`;
    }
    
    const toplamArac = talep.araclar.reduce((toplam, arac) => toplam + arac.aracSayisi, 0);
    return `${talep.araclar.length} türde ${toplamArac} araç`;
  };

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
                <th>Araçlar</th>
                <th>Adres</th>
                <th>Durum</th>
                <th>İşlemler</th>
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
                  <td className="capitalize">{aracOzetiGetir(talep)}</td>
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
                    {kullaniciDuzenleyebilirMi(talep) && (
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
                    )}
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
