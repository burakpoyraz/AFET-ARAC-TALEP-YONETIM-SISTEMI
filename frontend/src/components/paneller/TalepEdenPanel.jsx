import React from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import api from "../../lib/axios";

const TalepEdenPanel = () => {
  const navigate = useNavigate();

  const {
    data: stats,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["talepEdenIstatistik"],
    queryFn: async () => {
      const [talepler, gorevler] = await Promise.all([
        api.get("/talepler/taleplerim"),
        api.get("/gorevler/talep-eden-kurum"),
      ]);

      return {
        talep: {
          toplam: talepler.data.length,
          beklemede: talepler.data.filter((t) => t.durum === "beklemede")
            .length,
          gorevlendirildi: talepler.data.filter(
            (t) => t.durum === "gorevlendirildi"
          ).length,
          tamamlandi: talepler.data.filter((t) => t.durum === "tamamlandı")
            .length,
          iptal: talepler.data.filter((t) => t.durum === "iptal edildi").length,
        },
        gorev: {
          toplam: gorevler.data.length,
          beklemede: gorevler.data.filter((g) => g.gorevDurumu === "beklemede")
            .length,
          basladi: gorevler.data.filter((g) => g.gorevDurumu === "başladı")
            .length,
          tamamlandi: gorevler.data.filter(
            (g) => g.gorevDurumu === "tamamlandı"
          ).length,
          iptal: gorevler.data.filter((g) => g.gorevDurumu === "iptal edildi")
            .length,
        },
      };
    },
  });

  if (isLoading) return <div className="p-6">Yükleniyor...</div>;
  if (isError) return <div className="p-6 text-red-500">Hata oluştu.</div>;

  const StatCardGroup = ({ title, stats, buttonText, link }) => {
    const navigate = useNavigate();

    const digerIstatistikler = stats.filter((s) => s.title !== "Toplam");
    const toplamIstatistik = stats.find((s) => s.title === "Toplam");

    const isBekleyenDurum = (text) => {
      const t = text.toLowerCase();
      return t.includes("bekleyen") || t.includes("beklemede");
    };

    return (
      <div className="bg-white p-4 rounded shadow space-y-4 flex flex-col justify-between">
        <div>
          <h3 className="text-lg font-bold text-gray-800 mb-2">{title}</h3>
          <ul className="space-y-1 text-sm text-gray-700">
            {digerIstatistikler.map((item) => (
              <li key={item.title} className="flex justify-between">
                <span
                  className={
                    isBekleyenDurum(item.title)
                      ? "font-semibold text-red-600"
                      : ""
                  }
                >
                  {item.title}
                </span>
                <span
                  className={
                    isBekleyenDurum(item.title)
                      ? "font-bold text-red-600"
                      : "font-semibold text-blue-600"
                  }
                >
                  {item.value}
                </span>
              </li>
            ))}
          </ul>

          {toplamIstatistik && (
            <div className="mt-4 border-t pt-2 text-sm flex justify-between text-gray-600">
              <span>{toplamIstatistik.title}</span>
              <span className="font-semibold text-gray-900">
                {toplamIstatistik.value}
              </span>
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

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4 p-4">
      <StatCardGroup
        title="Taleplerim"
        stats={[
          { title: "Beklemede", value: stats.talep.beklemede },
          { title: "Görevlendirildi", value: stats.talep.gorevlendirildi },
          { title: "Tamamlandı", value: stats.talep.tamamlandi },
          { title: "İptal Edildi", value: stats.talep.iptal },
          { title: "Toplam", value: stats.talep.toplam },
        ]}
        link="/taleplerim"
        buttonText="Taleplerimi Görüntüle"
      />
      <StatCardGroup
        title="Görevler"
        stats={[
          { title: "Beklemede", value: stats.gorev.beklemede },
          { title: "Başladı", value: stats.gorev.basladi },
          { title: "Tamamlandı", value: stats.gorev.tamamlandi },
          { title: "İptal Edildi", value: stats.gorev.iptal },
          { title: "Toplam", value: stats.gorev.toplam },
        ]}
        link="/talep-eden/gorevler"
        buttonText="Görevleri Takip Et"
      />
    </div>
  );
};

export default TalepEdenPanel;
