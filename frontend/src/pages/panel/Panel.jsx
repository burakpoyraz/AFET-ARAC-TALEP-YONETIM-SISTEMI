import React from "react";
import { useQueryClient } from "@tanstack/react-query";
import KoordinatorPanel from "../../components/paneller/KoordinatorPanel";
import AracSahibiPanel from "../../components/paneller/AracSahibiPanel";
import TalepEdenPanel from "../../components/paneller/TalepEdenPanel";

const Panel = () => {
  const queryClient = useQueryClient();
  const girisYapanKullanici = queryClient.getQueryData(["girisYapanKullanici"]);

  if (!girisYapanKullanici) return null;

  if (girisYapanKullanici.rol === "beklemede") {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <h1 className="text-2xl font-bold text-gray-800">
          Hesabınız onay bekliyor
        </h1>
        <p className="text-gray-600">Lütfen yönetici ile iletişime geçin.</p>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-4">
      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-2xl mx-auto text-center">
        <h2 className="text-xl font-semibold mb-2 capitalize">
          Hoş geldiniz, {girisYapanKullanici.ad} {girisYapanKullanici.soyad}
        </h2>
        <p className="text-gray-600">
          Bu panel, güncel sistem bilgilerini ve istatistikleri göstermektedir.
        </p>
      </div>

      {/* Rol bazlı içerik */}
      {girisYapanKullanici.rol === "koordinator" && <KoordinatorPanel />}
      {girisYapanKullanici.rol === "arac_sahibi" && <AracSahibiPanel />}
      {girisYapanKullanici.rol === "talep_eden" && <TalepEdenPanel />}
    </div>
  );
};

export default Panel;
