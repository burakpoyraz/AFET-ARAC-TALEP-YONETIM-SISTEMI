import { useQuery, useQueryClient } from "@tanstack/react-query";
import React from "react";
import api from "../../lib/axios";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import RolAtamaModal from "./modals/kullanicilar/RolAtamaModal";
import KurumModal from "./modals/kullanicilar/KurumModal";
import { set } from "mongoose";
import SilOnayModal from "./modals/kullanicilar/SilOnayModal";
import DetayModal from "./modals/kullanicilar/DetayModal";

const Kullanicilar = () => {
  const [seciliKullanici, setSeciliKullanici] = useState(null);
  const [arama, setArama] = useState("");
  const [rolFiltre, setRolFiltre] = useState("");

  const [acikModal, setAcikModal] = useState(null);

  const {
    data: kullanicilar,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["kullanicilar"],
    queryFn: async () => {
      const res = await api.get("/kullanicilar");
      return res.data;
    },
  });

  const { data: kurumlar } = useQuery({
    queryKey: ["kurumlar"],
    queryFn: async () => {
      const res = await api.get("/kurumlar");
      return res.data;
    },
  });

  const filtrelenmisKullanicilar = kullanicilar?.filter((kullanici) => {
    const adSoyad = `${kullanici.ad} ${kullanici.soyad}`.toLowerCase();
    const email = kullanici.email?.toLowerCase() || "";
    const searchTerm = arama.toLowerCase();
    const aramaUyumlu =
      adSoyad.includes(searchTerm) || email.includes(searchTerm);
    const rolUyumlu = rolFiltre ? kullanici.rol === rolFiltre : true;
    return aramaUyumlu && rolUyumlu;
  });

  if (isLoading) return <div className="text-center mt-10">Yükleniyor...</div>;
  if (error)
    return <div className="text-center text-red-500">Veri alınamadı!</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">👥 Tüm Kullanıcılar</h1>

      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-4">
        <input
          type="text"
          placeholder="Ad, soyad ya da email ara..."
          className="input input-bordered w-full max-w-sm"
          value={arama}
          onChange={(e) => setArama(e.target.value)}
        />

        <select
          className="select select-bordered"
          value={rolFiltre}
          onChange={(e) => setRolFiltre(e.target.value)}
        >
          <option value="">Tüm Roller</option>
          <option value="beklemede">Beklemede</option>
          <option value="koordinator">Koordinatör</option>
          <option value="arac_sahibi">Araç Sahibi</option>
          <option value="talep_eden">Talep Eden</option>
        </select>
      </div>

      <div className="overflow-x-auto">
        <table className="table table-zebra w-full overflow-visible">
          <thead>
            <tr>
              <th>#</th>
              <th>Ad Soyad</th>
              <th>Email</th>
              <th>Rol</th>
              <th>Kayıt Türü</th>
              <th>Bağlı Kurum/Firma</th>
            </tr>
          </thead>
          <tbody className="overflow-visible relative z-10">
            {filtrelenmisKullanicilar.map((kullanici, index) => (
              <tr key={kullanici._id}>
                <td>{index + 1}</td>
                <td>
                  {kullanici.ad} {kullanici.soyad}
                </td>
                <td>{kullanici.email}</td>
                <td>
                  {kullanici.rol === "beklemede"
                    ? "Beklemede"
                    : kullanici.rol === "koordinator"
                    ? "Koordinatör"
                    : kullanici.rol === "arac_sahibi"
                    ? "Araç Sahibi"
                    : kullanici.rol === "talep_eden"
                    ? "Talep Eden"
                    : "-"}
                </td>

                <td>
                  {kullanici.kullaniciBeyanBilgileri?.kurumFirmaTuru ===
                  "kurulus_adina"
                    ? "Kuruluş Adına"
                    : kullanici.kullaniciBeyanBilgileri?.kurumFirmaTuru ===
                      "kendi_adima"
                    ? "Kendi Adına"
                    : "-"}
                </td>

                <td>{kullanici.kurumFirmaId?.kurumAdi || "-"}</td>
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
                            setSeciliKullanici(kullanici);
                            setAcikModal("detayModal");
                          }}
                        >
                          Detay
                        </button>
                      </li>
                      <li>
                        <button
                          onClick={() => {
                            setSeciliKullanici(kullanici);
                            setAcikModal("rolAtamaModal");
                          }}
                        >
                          Rol Ata
                        </button>
                      </li>
                      {kullanici.kullaniciBeyanBilgileri?.kurumFirmaTuru ===
                        "kurulus_adina" && (
                        <li>
                          <button
                            onClick={() => {
                              setSeciliKullanici(kullanici);
                              setAcikModal("kurumModal");
                            }}
                          >
                            Kurum Eşle
                          </button>
                        </li>
                      )}
                      <li>
                        <button
                          onClick={() => {
                            setSeciliKullanici(kullanici);
                            setAcikModal("silOnayModal");
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

      <DetayModal
        kullanici={seciliKullanici}
        modal={acikModal}
        setModal={setAcikModal}
      />

      <RolAtamaModal
        kullanici={seciliKullanici}
        modal={acikModal}
        setModal={setAcikModal}
      />
      <KurumModal
        kullanici={seciliKullanici}
        kurumlar={kurumlar}
        modal={acikModal}
        setModal={setAcikModal}
      />
      <SilOnayModal
        kullanici={seciliKullanici}
        modal={acikModal}
        setModal={setAcikModal}
      />
    </div>
  );
};

export default Kullanicilar;
