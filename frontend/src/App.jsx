import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import { Navigate, Route, Routes, useNavigate } from "react-router-dom";
import GirisYap from "./pages/auth/GirisYap";
import KayıtOl from "./pages/auth/KayıtOl";
import { Toaster } from "react-hot-toast";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import Panel from "./pages/panel/Panel";
import api from "./lib/axios";
import { use, useEffect, useState } from "react";
import AppLayout from "./components/layout/AppLayout";
import Kullanicilar from "./pages/koordinator/Kullanicilar";
import Kurumlar from "./pages/koordinator/Kurumlar";
import Araclar from "./pages/koordinator/Araclar";
import Araclarim from "./pages/arac_sahibi/Araclarim";

function App() {
  const [yetkisiz, setYetkisiz] = useState(false);

  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const {
    data: girisYapanKullanici,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["girisYapanKullanici"],
    queryFn: async () => {
      try {
        const res = await api.get("/auth/hesabim");
        return res.data.kullanici;
      } catch (err) {
        queryClient.setQueryData(["girisYapanKullanici"], null);
        setYetkisiz(true);
        throw err;
      }
    },
  });
  useEffect(() => {
    if (yetkisiz) {
      navigate("/girisyap");
    }
  }, [yetkisiz, navigate]);

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



    {/* ARAÇ SAHİBİ*/}
    <Route path="/araclarim" element={<Araclarim />} />


  </Route>
</Routes>
      <Toaster />
    </div>
  );
}

export default App;
