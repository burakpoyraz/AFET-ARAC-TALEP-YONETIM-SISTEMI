import React from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import api from "../../lib/axios";

const AracSahibiPanel = () => {
  const navigate = useNavigate();

  const { data: stats, isLoading, isError } = useQuery({
    queryKey: ["aracSahibiIstatistik"],
    queryFn: async () => {
      const [araclarRes, gorevlerRes] = await Promise.all([
        api.get("/araclar/araclarim"), 
        api.get("/gorevler/arac-sahibi"),
      ]);

      const araclar = araclarRes.data.araclar; 
      const gorevler = gorevlerRes.data;

      return {
        arac: {
          toplam: araclar.length,
          musait: araclar.filter(a => a.musaitlikDurumu).length,
          gorevde: araclar.filter(a => !a.musaitlikDurumu).length,
          aktif: araclar.filter(a => a.aracDurumu === "aktif").length,
          pasif: araclar.filter(a => a.aracDurumu === "pasif").length,
        },
        gorev: {
          toplam: gorevler.length,
          bekleyen: gorevler.filter(g => g.gorevDurumu === "beklemede").length,
          basladi: gorevler.filter(g => g.gorevDurumu === "başladı").length,
          tamamlanan: gorevler.filter(g => g.gorevDurumu === "tamamlandı").length,
          iptal: gorevler.filter(g => g.gorevDurumu === "iptal edildi").length,
        }
      };
    }
  });

  // 🧱 Kontroller burada olmalı
  if (isLoading) return <div>Yükleniyor...</div>;
  if (isError || !stats?.arac || !stats?.gorev) return <div>Hata oluştu</div>;

  // 📦 İstatistik kart bileşeni
  const StatCardGroup = ({ title, stats, buttonText, link }) => {
    const digerIstatistikler = stats.filter((s) => s.title !== "Toplam");
    const toplamIstatistik = stats.find((s) => s.title === "Toplam");

    const isBekleyenDurum = (text) =>
      text.toLowerCase().includes("bekleyen") || text.toLowerCase().includes("beklemede");

    return (
      <div className="bg-white p-4 rounded shadow space-y-4 flex flex-col justify-between">
        <div>
          <h3 className="text-lg font-bold text-gray-800 mb-2">{title}</h3>
          <ul className="space-y-1 text-sm text-gray-700">
            {digerIstatistikler.map((item) => (
              <li key={item.title} className="flex justify-between">
                <span className={isBekleyenDurum(item.title) ? "font-semibold text-red-600" : ""}>
                  {item.title}
                </span>
                <span className={isBekleyenDurum(item.title) ? "font-bold text-red-600" : "font-semibold text-blue-600"}>
                  {item.value}
                </span>
              </li>
            ))}
          </ul>
          {toplamIstatistik && (
            <div className="mt-4 border-t pt-2 text-sm flex justify-between text-gray-600">
              <span>{toplamIstatistik.title}</span>
              <span className="font-semibold text-gray-900">{toplamIstatistik.value}</span>
            </div>
          )}
        </div>
        <button
          onClick={() => navigate(link)}
          className="btn btn-sm btn-outline btn-primary w-full"
        >
          {buttonText}
        </button>
      </div>
    );
  };

  // 🧩 Ekranda iki kart: araçlar ve görevler
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4 mt-4">
      <StatCardGroup
        title="Araç Durumları"
        stats={[
          { title: "Toplam", value: stats.arac.toplam },
          { title: "Müsait", value: stats.arac.musait },
          { title: "Görevde", value: stats.arac.gorevde },
          { title: "Aktif", value: stats.arac.aktif },
          { title: "Pasif", value: stats.arac.pasif },
        ]}
        buttonText="Araçlarım"
        link="/araclarim"
      />

      <StatCardGroup
        title="Görev Durumları"
        stats={[
          { title: "Toplam", value: stats.gorev.toplam },
          { title: "Bekleyen", value: stats.gorev.bekleyen },
          { title: "Başladı", value: stats.gorev.basladi },
          { title: "Tamamlandı", value: stats.gorev.tamamlanan },
          { title: "İptal Edilen", value: stats.gorev.iptal },
        ]}
        buttonText="Görevlerim"
        link="/gorevlerim"
      />
    </div>
  );
};

export default AracSahibiPanel;
