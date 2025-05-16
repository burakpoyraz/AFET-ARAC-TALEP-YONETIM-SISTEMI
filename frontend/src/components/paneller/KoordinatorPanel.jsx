import React from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import api from "../../lib/axios";

const KoordinatorPanel = () => {
  const navigate = useNavigate();

  const {
    data: stats,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["koordinatorIstatistik"],
    queryFn: async () => {
      const [kullanicilar, talepler, gorevler, araclar] = await Promise.all([
        api.get("/kullanicilar"),
        api.get("/talepler"),
        api.get("/gorevler"),
        api.get("/araclar"),
      ]);

      return {
        kullanici: {
          toplam: kullanicilar.data.length,
          beklemede: kullanicilar.data.filter((k) => k.rol === "beklemede")
            .length,
          koordinator: kullanicilar.data.filter((k) => k.rol === "koordinator")
            .length,
          arac_sahibi: kullanicilar.data.filter((k) => k.rol === "arac_sahibi")
            .length,
          talep_eden: kullanicilar.data.filter((k) => k.rol === "talep_eden")
            .length,
        },
        talep: {
          toplam: talepler.data.length,
          bekleyen: talepler.data.filter((t) => t.durum === "beklemede").length,
          gorevlendirildi: talepler.data.filter(
            (t) => t.durum === "gorevlendirildi"
          ).length,
          iptal: talepler.data.filter((t) => t.durum === "iptal edildi").length,
          tamamlanan: talepler.data.filter((t) => t.durum === "tamamlandı")
            .length,
        },
        gorev: {
          toplam: gorevler.data.length,
          bekleyen: gorevler.data.filter((g) => g.gorevDurumu === "beklemede")
            .length,
          basladi: gorevler.data.filter((g) => g.gorevDurumu === "başladı")
            .length,
          tamamlanan: gorevler.data.filter(
            (g) => g.gorevDurumu === "tamamlandı"
          ).length,
          iptal: gorevler.data.filter((g) => g.gorevDurumu === "iptal edildi")
            .length,
        },
        arac: {
          toplam: araclar.data.araclar.length,
          musait: araclar.data.araclar.filter((a) => a.musaitlikDurumu === true)
            .length,
          gorevde: araclar.data.araclar.filter(
            (a) => a.musaitlikDurumu === false
          ).length,
          aktif: araclar.data.araclar.filter((a) => a.aracDurumu === "aktif")
            .length,
          pasif: araclar.data.araclar.filter((a) => a.aracDurumu === "pasif")
            .length,
        },
      };
    },
  });

  if (isLoading) return <div>Yükleniyor...</div>;
  if (isError) return <div>Hata oluştu.</div>;

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
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
      <StatCardGroup
        title="Kullanıcı Bilgileri"
        stats={[
          { title: "Beklemede", value: stats.kullanici.beklemede },
          { title: "Toplam", value: stats.kullanici.toplam },
          { title: "Koordinatör", value: stats.kullanici.koordinator },
          { title: "Araç Sahibi", value: stats.kullanici.arac_sahibi },
          { title: "Talep Eden", value: stats.kullanici.talep_eden },
        ]}
        buttonText="Kullanıcıları Yönet"
        link="/kullanicilar"
      />

      <StatCardGroup
        title="Talep Durumları"
        stats={[
          { title: "Toplam", value: stats.talep.toplam },
          { title: "Bekleyen", value: stats.talep.bekleyen },
          { title: "Görevlendirilen", value: stats.talep.gorevlendirildi },

          { title: "Tamamlanan", value: stats.talep.tamamlanan },
          { title: "İptal Edilen", value: stats.talep.iptal },
        ]}
        buttonText="Talepleri Görüntüle"
        link="/talepler"
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
        buttonText="Görevleri Yönet"
        link="/gorevler"
      />
      <StatCardGroup
        title="Araç Durumları"
        stats={[
          { title: "Toplam", value: stats.arac.toplam },
          { title: "Müsait", value: stats.arac.musait },
          { title: "Görevde", value: stats.arac.gorevde },
          { title: "Aktif", value: stats.arac.aktif },
          { title: "Pasif", value: stats.arac.pasif },
        ]}
        buttonText="Araçları Yönet"
        link="/araclar"
      />
    </div>
  );
};

export default KoordinatorPanel;
