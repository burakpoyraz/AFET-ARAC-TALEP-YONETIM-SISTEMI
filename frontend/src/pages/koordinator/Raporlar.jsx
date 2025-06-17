import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import api from "../../lib/axios";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const Raporlar = () => {
  const [arama, setArama] = useState("");
  const [durumFiltre, setDurumFiltre] = useState("hepsi");

  const [baslangicTarihi, setBaslangicTarihi] = useState("");
  const [bitisTarihi, setBitisTarihi] = useState("");

  const { data: gorevler = [], isLoading } = useQuery({
    queryKey: ["gorevler"],
    queryFn: async () => {
      const res = await api.get("/gorevler");
      return res.data;
    },
  });

  const filtrelenmisGorevler = gorevler
    .filter((gorev) => {
      const aranan = arama.toLowerCase();
      const durumUygunMu =
        durumFiltre === "hepsi" || gorev.gorevDurumu === durumFiltre;

      const baslik = gorev.talepId?.baslik?.toLowerCase() || "";
      const kurum =
        gorev.talepId?.talepEdenKurumFirmaId?.kurumAdi?.toLowerCase() || "";

      const baslangicZamani = gorev.baslangicZamani
        ? new Date(gorev.baslangicZamani)
        : null;

      const baslangic = baslangicTarihi ? new Date(baslangicTarihi) : null;
      const bitis = bitisTarihi
        ? new Date(new Date(bitisTarihi).setHours(23, 59, 59, 999))
        : null;

      const tarihUygunMu =
        (!baslangic || (baslangicZamani && baslangicZamani >= baslangic)) &&
        (!bitis || (baslangicZamani && baslangicZamani <= bitis));

      return (
        durumUygunMu &&
        tarihUygunMu &&
        (baslik.includes(aranan) || kurum.includes(aranan))
      );
    })
    .sort((a, b) => new Date(b.baslangicZamani) - new Date(a.baslangicZamani));

  const toplamTalep = gorevler.length;
  const bekleyen = gorevler.filter((g) => g.gorevDurumu === "beklemede").length;
  const tamamlanan = gorevler.filter(
    (g) => g.gorevDurumu === "tamamlandı"
  ).length;
  const iptalEdilen = gorevler.filter(
    (g) => g.gorevDurumu === "iptal edildi"
  ).length;
  const devamEden = gorevler.filter((g) => g.gorevDurumu === "başladı").length;

  const kurumBazliTalep = Object.values(
    gorevler.reduce((acc, gorev) => {
      const kurum =
        gorev.talepId?.talepEdenKurumFirmaId?.kurumAdi || "Bilinmiyor";
      acc[kurum] = acc[kurum] || { name: kurum, count: 0 };
      acc[kurum].count++;
      return acc;
    }, {})
  );

  const handleExcelDownload = async () => {
    try {
      const response = await api.get("/gorevler/excel", {
        responseType: "blob", // Excel binary dosyası için bu önemli
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "gorev-raporu.xlsx");
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error("Excel indirme hatası:", error);
      alert("Excel dosyası indirilemedi.");
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Raporlama</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
        <div className="stats shadow">
          <div className="stat">
            <div className="stat-title">Toplam Talep</div>
            <div className="stat-value">{toplamTalep}</div>
          </div>
        </div>
        <div className="stats shadow">
          <div className="stat">
            <div className="stat-title">Bekleyen Görevler</div>
            <div className="stat-value">{bekleyen}</div>
          </div>
        </div>
        <div className="stats shadow">
          <div className="stat">
            <div className="stat-title">Devam Edenler</div>
            <div className="stat-value">{devamEden}</div>
          </div>
        </div>
        <div className="stats shadow">
          <div className="stat">
            <div className="stat-title">Tamamlanan Görevler</div>
            <div className="stat-value">{tamamlanan}</div>
          </div>
        </div>
        <div className="stats shadow">
          <div className="stat">
            <div className="stat-title">İptal Edilenler</div>
            <div className="stat-value">{iptalEdilen}</div>
          </div>
        </div>
      </div>

      <button
        onClick={handleExcelDownload}
        className="btn btn-outline btn-success mb-4"
      >
        📥 Excel Olarak İndir
      </button>

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <input
          type="text"
          placeholder="Talep başlığı veya kurum ara..."
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
        <input
          type="date"
          className="input input-bordered"
          value={baslangicTarihi}
          onChange={(e) => setBaslangicTarihi(e.target.value)}
        />
        <input
          type="date"
          className="input input-bordered"
          value={bitisTarihi}
          onChange={(e) => setBitisTarihi(e.target.value)}
        />
      </div>

      <div className="overflow-x-auto mb-8">
        <table className="table table-zebra w-full">
          <thead>
            <tr>
              <th>#</th>
              <th>Talep Başlığı</th>
              <th>Talep Eden Kurum</th>
              <th>Araç</th>
              <th>Durum</th>
              <th>Başlangıç</th>
              <th>Bitiş</th>
            </tr>
          </thead>
          <tbody>
            {filtrelenmisGorevler.map((gorev, index) => (
              <tr key={gorev._id}>
                <td>{index + 1}</td>
                <td className="capitalize">{gorev.talepId?.baslik}</td>
                <td className="capitalize">
                  {gorev.talepId?.talepEdenKurumFirmaId?.kurumAdi || "-"}
                </td>
                <td>
                  {gorev.aracId && (
                    <span className="uppercase">
                      {gorev.aracId.plaka}{" "}
                      <span className="capitalize text-gray-600">
                        ({gorev.aracId.aracTuru})
                      </span>
                    </span>
                  )}
                </td>
                <td className="capitalize">{gorev.gorevDurumu}</td>
                <td>
                  {gorev.baslangicZamani
                    ? new Date(gorev.baslangicZamani).toLocaleString("tr-TR")
                    : "-"}
                </td>
                <td>
                  {gorev.bitisZamani
                    ? new Date(gorev.bitisZamani).toLocaleString("tr-TR")
                    : "-"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="bg-base-100 p-4 shadow rounded">
        <h2 className="text-lg font-semibold mb-4">
          Kurum Bazlı Talep Sayıları
        </h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart
            data={kurumBazliTalep}
            layout="vertical"
            margin={{ left: 50 }}
          >
            <XAxis type="number" />
            <YAxis dataKey="name" type="category" />
            <Tooltip />
            <Bar dataKey="count" fill="#3b82f6" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default Raporlar;
