import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import api from "../../lib/axios";

import React from "react";
import TalepDetayModal from "./modals/talepler/TalepDetayModal";
import TalepIptalModal from "./modals/talepler/TalepIptalModal";
import TalepGorevlendirModal from "./modals/talepler/TalepGorevlendirModal";

const Talepler = () => {
  const [arama, setArama] = useState("");
  const [seciliTalep, setSeciliTalep] = useState(null);
  const [acikModal, setAcikModal] = useState(null);

  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

  const { data: talepler = [], isLoading } = useQuery({
    queryKey: ["talepler"],
    queryFn: async () => {
      const res = await api.get("/talepler");
      return res.data;
    },
  });

  const { data: musaitAraclar = [], isLoadingMusaitAraclar } = useQuery({
    queryKey: ["musaitAraclar"],
    queryFn: async () => {
      const res = await api.get("/araclar/musaitaraclar", );
      return res.data.musaitAraclar;
    },
  });


  const filtrelenmisTalepler = talepler
    .filter((talep) => {
      const baslik = talep.baslik?.toLowerCase() || "";
      const aciklama = talep.aciklama?.toLowerCase() || "";
      const adres = talep.lokasyon?.adres?.toLowerCase() || "";
      const kurum = talep.talepEdenKurumFirmaId?.kurumAdi?.toLowerCase() || "";
      const kullaniciAdSoyad = `${talep.talepEdenKullaniciId?.ad || ""} ${
        talep.talepEdenKullaniciId?.soyad || ""
      }`.toLowerCase();

      const aranan = arama.toLowerCase();
      return (
        baslik.includes(aranan) ||
        aciklama.includes(aranan) ||
        adres.includes(aranan) ||
        kurum.includes(aranan) ||
        kullaniciAdSoyad.includes(aranan)
      );
    })
    .sort((a, b) => {
      const oncelik = {
        beklemede: 0,
        gorevlendirme_yapildi: 1,
        tamamlandi: 2,
        iptal_edildi: 3,
      };
      return (oncelik[a.durum] ?? 99) - (oncelik[b.durum] ?? 99);
    });

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Talepler</h1>
      <div className="flex justify-between items-center mb-4">
        <input
          type="text"
          placeholder="Talep ara..."
          className="input input-bordered"
          value={arama}
          onChange={(e) => setArama(e.target.value)}
        />
      </div>

      {isLoading ? (
        <div>Yükleniyor...</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="table table-zebra w-full">
            <thead>
              <tr>
                <th>#</th>
                <th>Başlık</th>
                <th>Açıklama</th>
                <th>Araç Türü</th>
                <th>Adet</th>
                <th>Lokasyon</th>
                <th>Durum</th>
                <th>Talep Eden</th>
                <th>İşlemler</th>
              </tr>
            </thead>
            <tbody>
              {filtrelenmisTalepler.map((talep, index) => (
                <tr key={talep._id}>
                  <td>{index + 1}</td>
                  <td>{talep.baslik}</td>
                  <td>{talep.aciklama}</td>
                  <td>{talep.aracTuru}</td>
                  <td>{talep.aracSayisi}</td>
                  <td>{talep.lokasyon?.adres}</td>
                  <td>
                    <span
                      className={`badge ${
                        talep.durum === "beklemede"
                          ? "badge-error"
                          : talep.durum === "tamamlandi"
                          ? "badge-success"
                          : talep.durum === "gorevlendirildi"
                          ? "badge-warning"
                          : "badge-info"
                      }`}
                    >
                      {talep.durum}
                    </span>
                  </td>
                  <td>
                    {talep.talepEdenKurumFirmaId
                      ? talep.talepEdenKurumFirmaId.kurumAdi
                      : `${talep.talepEdenKullaniciId?.ad || ""} ${
                          talep.talepEdenKullaniciId?.soyad || ""
                        }`}
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
                              setAcikModal("talepDetayModal");
                            }}
                          >
                            Detay
                          </button>
                        </li>
                        {talep.durum === "beklemede" && (
                          <li>
                            <button
                              onClick={() => {
                                setSeciliTalep(talep);
                                setAcikModal("talepGorevlendirModal");
                              }}
                            >
                              Araç Görevlendir
                            </button>
                          </li>
                        )}

                        <li>
                          <button
                            onClick={() => {
                              setSeciliTalep(talep);
                              setAcikModal("talepIptalModal");
                            }}
                          >
                            {talep.durum === "iptal edildi"
                              ? "Aktifleştir"
                              : "İptal Et"}
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

      <TalepDetayModal
        talep={seciliTalep}
        modal={acikModal}
        setModal={setAcikModal}
      />
      <TalepIptalModal
        talep={seciliTalep}
        modal={acikModal}
        setModal={setAcikModal}
      />
      <TalepGorevlendirModal
        modal={acikModal}
        setModal={setAcikModal}
        talep={seciliTalep}
        araclar={musaitAraclar}
      />
      
    </div>
  );
};

export default Talepler;
