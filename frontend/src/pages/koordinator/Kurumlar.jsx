import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import React, { useState } from "react";
import api from "../../lib/axios";
import KurumEkleDuzenleModal from "./modals/kurumlar/KurumEkleDuzenleModal";
import { set } from "mongoose";
import SilOnayModal from "./modals/kurumlar/KurumSilOnayModal";

const Kurumlar = () => {
  const [acikModal, setAcikModal] = useState(null);
  const [arama, setArama] = useState("");

  const [seciliKurum, setSeciliKurum] = useState(null);

  const { data: kurumlar = [], isLoading } = useQuery({
    queryKey: ["kurumlar"],
    queryFn: async () => {
      const res = await api.get("/kurumlar");
      return res.data;
    },
  });

  const filtrelenmisKurumlar = kurumlar.filter((kurum) => {
    const kurumAdi = kurum.kurumAdi.toLowerCase();
    const telefon = kurum.iletisim?.telefon || "";
    const adres = kurum.iletisim?.adres.toLowerCase();
    const searchTerm = arama.toLowerCase();
    const aramaUyumlu =
      kurumAdi.includes(searchTerm) ||
      telefon.includes(searchTerm) ||
      adres.includes(searchTerm);
    return aramaUyumlu;
  });

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Kurumlar</h1>
      <div className="flex items-center justify-between gap-4 mb-4">
        <input
          type="text"
          placeholder="Kurum ara..."
          className="input input-bordered mb-4"
          value={arama}
          onChange={(e) => setArama(e.target.value)}
        />
        <button
          className="btn btn-primary flex-shrink-0"
          onClick={() => {
            setSeciliKurum(null);
            setAcikModal("kurumEkleDuzenle");
          }}
        >
          ➕ Yeni Kurum Ekle
        </button>
      </div>

      {isLoading ? (
        <div>Yükleniyor...</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="table table-zebra w-full">
            <thead>
              <tr>
                <th>#</th>
                <th>Adı</th>
                <th>Türü</th>
                <th>Telefon</th>
                <th>email</th>
                <th>Adres</th>
                <th>İşlemler</th>
              </tr>
            </thead>
            <tbody>
              {filtrelenmisKurumlar.map((kurum, index) => (
                <tr key={kurum._id}>
                  <td>{index + 1}</td>
                  <td className="capitalize">{kurum.kurumAdi}</td>
                  <td className="capitalize">{kurum.kurumTuru}</td>
                  <td className="capitalize">{kurum.iletisim?.telefon}</td>
                  <td>{kurum.iletisim?.email}</td>
                  <td className="capitalize">{kurum.iletisim?.adres}</td>
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
                              setSeciliKurum(kurum);
                              setAcikModal("kurumEkleDuzenle");
                            }}
                          >
                            Düzenle
                          </button>
                        </li>
                        <li>
                          <button
                            onClick={() => {
                              setSeciliKurum(kurum);
                              setAcikModal("kurumSilOnayModal");
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

      <KurumEkleDuzenleModal
        modal={acikModal}
        setModal={setAcikModal}
        duzenlenecekKurum={seciliKurum}
      />
      <SilOnayModal
        modal={acikModal}
        setModal={setAcikModal}
        kurum={seciliKurum}
      />
    </div>
  );
};

export default Kurumlar;
