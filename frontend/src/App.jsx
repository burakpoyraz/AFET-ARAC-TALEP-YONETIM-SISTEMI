
import { Navigate, Route, Routes, useLocation, useNavigate } from "react-router-dom";
import GirisYap from "./pages/auth/GirisYap";
import KayıtOl from "./pages/auth/KayıtOl";
import { Toaster } from "react-hot-toast";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import Panel from "./pages/panel/Panel";
import api from "./lib/axios";
import {useEffect, useState } from "react";
import AppLayout from "./components/layout/AppLayout";
import Kullanicilar from "./pages/koordinator/Kullanicilar";
import Kurumlar from "./pages/koordinator/Kurumlar";
import Araclar from "./pages/koordinator/Araclar";
import Araclarim from "./pages/arac_sahibi/Araclarim";
import Taleplerim from "./pages/talep_eden/Taleplerim";
import Talepler from "./pages/koordinator/Talepler";
import Gorevler from "./pages/koordinator/Gorevler";
import GorevlerimAracSahibi from "./pages/arac_sahibi/GorevlerimAracSahibi";
import GorevlerimTalepEden from "./pages/talep_eden/GorevlerTalepEden";
import Bildirimler from "./pages/koordinator/Bildirimler";
import TalepDetay from "./pages/bildirimler/TalepDetay";
import GorevDetay from "./pages/bildirimler/GorevDetay";
import Raporlama from "./pages/koordinator/Raporlar";
import Raporlar from "./pages/koordinator/Raporlar";


function App() {
  const [yetkisiz, setYetkisiz] = useState(false);

  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const {
    data: girisYapanKullanici,
    isLoading,
  } = useQuery({
    queryKey: ["girisYapanKullanici"],
    queryFn: async () => {
      const res = await api.get("/auth/hesabim");
      return res.data.kullanici;
    },
    onError: () => {
      queryClient.setQueryData(["girisYapanKullanici"], null);
      setYetkisiz(true);
    },
  });
  

const location = useLocation();

useEffect(() => {
  const publicPaths = ["/girisyap", "/kayitol"];
  if (yetkisiz && !publicPaths.includes(location.pathname)) {
    navigate("/girisyap");
  }
}, [yetkisiz, navigate, location.pathname]);

  if (isLoading) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/70 backdrop-blur-sm">
        <div className="flex flex-col items-center space-y-4">
          <div className="loading loading-spinner loading-lg text-primary"></div>
          <p className="text-xl font-semibold text-gray-700">Yükleniyor...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Routes>
  {/* Her zaman var olacak sayfalar */}
  <Route path="/girisyap" element={ girisYapanKullanici ? <Navigate to="/" replace /> : <GirisYap />} />
  <Route path="/kayitol" element={ girisYapanKullanici ? <Navigate to="/" replace /> : <KayıtOl />} />


  {/* Koşullu içerik */}
  <Route
    path="/"
    element={
      girisYapanKullanici ? <AppLayout /> : <Navigate to="/girisyap" replace />
    }
  >
    <Route index element={<Panel />} />
    {/* KOORDİNATOR */}
    <Route path="/kullanicilar" element={<Kullanicilar />} />
    <Route path="/kurumlar" element={<Kurumlar />} />
    <Route path="/araclar" element={<Araclar/>} />
    <Route path="/talepler" element={<Talepler />} />
    <Route path="/gorevler" element={<Gorevler />} />
    <Route path="/bildirimler" element={<Bildirimler />} />
    <Route path="/raporlar" element={<Raporlar />} />




    {/* ARAÇ SAHİBİ*/}
    <Route path="/araclarim" element={<Araclarim />} />
    <Route path="/arac-sahibi/gorevler" element={<GorevlerimAracSahibi />} />

    {/* TALEP EDEN */}
    <Route path="/taleplerim" element={<Taleplerim />} />
    <Route path="/talep-eden/gorevler" element={<GorevlerimTalepEden />} />


    {/* BİLDİRİMLER */}
    <Route path="/talepler/:id" element={<TalepDetay />} />
    <Route path="/gorevler/:id" element={<GorevDetay />} />



  </Route>
</Routes>
      <Toaster />
    </div>
  );
}

export default App;
