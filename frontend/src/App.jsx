
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import { Route, Routes } from "react-router-dom";
import GirisYap from "./pages/auth/GirisYap";
import KayıtOl from "./pages/auth/KayıtOl";
import { Toaster } from "react-hot-toast";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import Panel from "./pages/home/Panel";

function App() {


  const {data:girisYapanKullanici, isLoading, error} = useQuery({
    queryKey: ["girisYapanKullanici"],
    queryFn: async () => {
      const res = await axios.get("/api/auth/hesabim");

      return res.data;
    },
    onSuccess: (data) => {
      console.log("Kullanıcı bilgileri:", data);
    },
    onError: (error) => {
      console.error("Kullanıcı bilgileri alınamadı:", error.message);
      return null;
    },
  });
  
  return (
    <div>
      <Routes>
        <Route path="/" element={girisYapanKullanici ? <Panel /> : <GirisYap />} />

        <Route path="/girisyap" element={girisYapanKullanici ? <Panel /> :  <GirisYap />} />
        <Route path="/kayitol" element={girisYapanKullanici ? <Panel /> :  <KayıtOl />} />
      </Routes>
      <Toaster />
    </div>
  );
}

export default App;
