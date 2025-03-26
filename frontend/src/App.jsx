
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import { Route, Routes } from "react-router-dom";
import GirisYap from "./pages/auth/GirisYap";
import AnaSayfa from "./pages/home/AnaSayfa";
import KayıtOl from "./pages/auth/KayıtOl";

function App() {


  return (
    <div>
      <Routes>
        <Route path="/" element={<AnaSayfa />} />
        <Route path="/girisyap" element={<GirisYap />} />
        <Route path="/kayitol" element={<KayıtOl />} />
      </Routes>
    </div>
  );
}

export default App;
