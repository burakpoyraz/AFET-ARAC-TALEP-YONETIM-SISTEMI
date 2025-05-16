import { useMutation, useQueryClient } from "@tanstack/react-query";
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaUserCircle, FaSignOutAlt, FaTruck, FaHardHat } from "react-icons/fa";
import api from "../../lib/axios";

const Navbar = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const kullanici = queryClient.getQueryData(["girisYapanKullanici"]);

  const { mutate: logout } = useMutation({
    mutationFn: async () => {
      try {
        const res = await api.post("/auth/cikisyap", {});
        return res.data;
      } catch (err) {
        throw err;
      }
    },
    onSuccess: (data) => {
      queryClient.setQueryData(["girisYapanKullanici"], null);
      navigate("/girisyap");
    },
    onError: (error) => {
      console.error("Çıkış hatası:", error.message);
    },
  });

  const cikisYap = (e) => {
    e.preventDefault();
    logout();
  };

  const rolGoster = (rol) => {
    switch (rol) {
      case "arac_sahibi":
        return "Araç Sahibi";
      case "talep_eden":
        return "Talep Eden";
      case "koordinator":
        return "Koordinatör";
      default:
        return rol;
    }
  };

  return (
    <div className="navbar bg-base-200 shadow-sm px-6">
      {/* Sol: Logo */}
      <div className="flex-1">
        <Link to="/" className="flex items-center space-x-2">
          <div className="bg-primary rounded-lg p-2 flex items-center justify-center">
            <FaTruck className="text-white h-6 w-6" />
          </div>
          <div>
            <span className="text-xl font-bold text-primary">AFET NAKLİYE</span>
            <span className="hidden md:inline text-xl font-bold text-primary"> YÖNETİM SİSTEMİ</span>
            <div className="text-xs text-gray-500 -mt-1 hidden md:block">Afet Döneminde Hızlı ve Etkin Nakliye Koordinasyonu</div>
          </div>
        </Link>
      </div>

      {/* Sağ: Kullanıcı bilgisi ve çıkış */}
      <div className="flex-none flex items-center gap-4">
        <div className="flex items-center gap-2">
          <FaUserCircle className="w-8 h-8 text-primary" />
          <div className="hidden sm:block text-sm text-gray-700">
            <p className="font-medium capitalize">
              {kullanici.ad} {kullanici.soyad}
            </p>
            <p className="text-xs text-gray-500 capitalize">{rolGoster(kullanici.rol)}</p>
            <p className="text-xs italic text-gray-400 capitalize">
              {kullanici.kurumFirmaId?.kurumAdi}
            </p>
          </div>
        </div>

        <button
          onClick={cikisYap}
          className="btn btn-sm btn-outline btn-error flex items-center gap-1"
        >
          <FaSignOutAlt className="w-4 h-4" />
          <span>Çıkış</span>
        </button>
      </div>
    </div>
  );
};

export default Navbar;