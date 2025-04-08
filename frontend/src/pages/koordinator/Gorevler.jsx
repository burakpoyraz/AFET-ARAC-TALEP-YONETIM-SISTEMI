import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import api from "../../lib/axios";

const Gorevler = () => {
  const [arama, setArama] = useState("");

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
                <th>Şoför</th>
                <th>Hedef</th>
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
                  <td>
                    {gorev.gorevlendirilenAraclar.map((g) => (
                      <div key={g._id}>
                        {g.sofor.ad} {g.sofor.soyad}
                      </div>
                    ))}
                  </td>
                  <td title={gorev.talepId?.lokasyon?.adres}>
                    {gorev.talepId?.lokasyon?.adres?.length > 40
                      ? `${gorev.talepId.lokasyon.adres.slice(0, 40)}...`
                      : gorev.talepId?.lokasyon?.adres}
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
    </div>
  );
};

export default Gorevler;
