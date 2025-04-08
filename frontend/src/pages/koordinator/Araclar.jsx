import { useQuery } from "@tanstack/react-query";
import React, { useState } from "react";
import api from "../../lib/axios";
import AracDetay from "./modals/araclar/AracDetay";

const Araclar = () => {
  const [acikModal, setAcikModal] = useState(null);
  const [arama, setArama] = useState("");
  const [seciliArac, setSeciliArac] = useState(null);

  const { data: araclar = [], isLoading } = useQuery({
    queryKey: ["araclar"],
    queryFn: async () => {
      const res = await api.get("/araclar");

      return res.data.araclar;
    },
  });

  console.log(araclar);
  const filtrelenmisAraclar = araclar.filter((arac) => {
    const plaka = arac.plaka.toLowerCase();
    const tur= arac.aracTuru.toLowerCase();
    const adres= arac.konum?.adres.toLowerCase() || "";
    const kurumAdi = arac.kurumFirmaId?.kurumAdi?.toLowerCase() || "";
    const kullaniciAdSoyad = `${arac.kullaniciId?.ad || ""} ${arac.kullaniciId?.soyad || ""}`.toLowerCase();

    const searchTerm = arama.toLowerCase();

    return (
      plaka.includes(searchTerm) ||
      tur.includes(searchTerm) ||
      adres.includes(searchTerm) ||
      kurumAdi.includes(searchTerm) ||
      kullaniciAdSoyad.includes(searchTerm)
    );
  });

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Araçlar</h1>
      <div className="flex items-center justify-between gap-4 mb-4">
        <input
          type="text"
          placeholder="Araç ara..."
          className="input input-bordered mb-4"
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
                <th>Plaka</th>
                <th>Tür</th>
                <th>Kapasite</th>
                <th>Kullanım Amacı</th>
                <th>Durum</th>
                <th>Müsaitlik</th>
                <th>Sahiplik</th>
                <th>İşlemler</th>
              </tr>
            </thead>
            <tbody>
              {filtrelenmisAraclar.map((arac, index) => (
                <tr key={arac._id}>
                  <td>{index + 1}</td>
                  <td>{arac.plaka}</td>
                  <td>{arac.aracTuru}</td>
                  <td>{arac.kapasite}</td>
                  <td>{arac.kullanimAmaci}</td>
                  <td>
                    {arac.aracDurumu === "aktif" ? (
                      <span className="badge badge-success">Aktif</span>
                    ) : (
                      <span className="badge badge-error">Pasif</span>
                    )}
                  </td>

                  <td>
                    {arac.musaitlikDurumu ? (
                      <span className="badge badge-success">Müsait</span>
                    ) : (
                      <span className="badge badge-error">Müsait Değil</span>
                    )}
                  </td>

                  <td>
                    {" "}
                    {arac.kurumFirmaId ? (
                      <span className="badge badge-info">
                        {arac.kurumFirmaId.kurumAdi}
                      </span>
                    ) : arac.kullaniciId ? (
                      <span className="badge badge-warning">
                        {arac.kullaniciId.ad} {arac.kullaniciId.soyad}
                      </span>
                    ) : (
                      <span className="badge badge-error">Tanımsız</span>
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
                              setSeciliArac(arac);
                              setAcikModal("aracDetay");
                            }}
                          >
                            Detay
                          </button>
                        </li>
                        <li>
                          <button
                            onClick={() => {
                              setSeciliArac(arac);
                              setAcikModal("aracSilOnayModal");
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

      <AracDetay arac={seciliArac} modal={acikModal} setModal={setAcikModal} />
    </div>
  );
};

export default Araclar;
