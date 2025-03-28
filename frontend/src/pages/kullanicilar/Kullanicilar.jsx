import { useQuery, useQueryClient } from "@tanstack/react-query";
import React from "react";
import api from "../../lib/axios";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";

const Kullanicilar = () => {
  const [seciliKullanici, setSeciliKullanici] = useState(null);
  const [yeniRol, setYeniRol] = useState("");
  const [arama, setArama] = useState("");
  const [rolFiltre, setRolFiltre] = useState("");

  const queryClient = useQueryClient();

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

  const rolGuncelleMutation = useMutation({
    mutationFn: async ({ id, rol }) => {
      await api.put(`/kullanicilar/${id}/rol`, { rol });
    },
    onSuccess: () => {
      toast.success("Rol başarıyla güncellendi!");
      queryClient.invalidateQueries(["kullanicilar"]);
      setSeciliKullanici(null);
    },
    onError: () => {
      toast.error("Rol güncelleme başarısız!");
    },
  });

  const handleRolKaydet = () => {
    if (!yeniRol || !seciliKullanici) return;
    rolGuncelleMutation.mutate({ id: seciliKullanici._id, rol: yeniRol });
  };

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

      {/* Filtre Alanları */}
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

      {/* Tablo */}
      <div className="overflow-x-auto">
        <table className="table table-zebra w-full">
          <thead>
            <tr>
              <th>#</th>
              <th>Ad Soyad</th>
              <th>Email</th>
              <th>Rol</th>
              <th>Kayıt Türü</th>
              <th>Kurum</th>
              <th>İşlemler</th>
            </tr>
          </thead>
          <tbody>
            {filtrelenmisKullanicilar.map((kullanici, index) => (
              <tr key={kullanici._id}>
                <td>{index + 1}</td>
                <td>
                  {kullanici.ad} {kullanici.soyad}
                </td>
                <td>{kullanici.email}</td>
                <td>{kullanici.rol}</td>
                <td>
                  {kullanici.kullaniciBeyanBilgileri?.kurumFirmaTuru ===
                  "kurulus_adina"
                    ? "Kuruluş Adına"
                    : kullanici.kullaniciBeyanBilgileri?.kurumFirmaTuru ===
                      "kendi_adima"
                    ? "Kendi Adıma"
                    : "-"}
                </td>
                
                <td>
                  {kullanici.kullaniciBeyanBilgileri?.kurumFirmaAdi || "-"}
                </td>
                <td>
                  <button
                    className="btn btn-xs btn-primary"
                    onClick={() => {
                      setSeciliKullanici(kullanici);
                      setYeniRol(kullanici.rol);
                      document.getElementById("rolAtamaModal").showModal();
                    }}
                  >
                    Rol Ata
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      <dialog id="rolAtamaModal" className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg">Rol Atama</h3>
          <p className="py-2 text-sm text-gray-600">
            {seciliKullanici?.ad} {seciliKullanici?.soyad} için yeni rol seçin:
          </p>

          <select
            className="select select-bordered w-full mb-4"
            value={yeniRol}
            onChange={(e) => setYeniRol(e.target.value)}
          >
            <option value="">Rol Seçin</option>
            <option value="koordinator">Koordinatör</option>
            <option value="arac_sahibi">Araç Sahibi</option>
            <option value="talep_eden">Talep Eden</option>
          </select>

          <div className="modal-action">
            <form method="dialog">
              <button className="btn mr-2">İptal</button>
            </form>
            <button className="btn btn-primary" onClick={handleRolKaydet}>
              Kaydet
            </button>
          </div>
        </div>
      </dialog>
    </div>
  );
};

export default Kullanicilar;
