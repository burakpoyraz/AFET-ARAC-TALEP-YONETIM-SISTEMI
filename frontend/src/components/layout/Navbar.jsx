import { useMutation, useQueryClient } from "@tanstack/react-query";
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaUserCircle, FaSignOutAlt } from "react-icons/fa";
import api from "../../lib/axios";

const Navbar = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const kullanici = queryClient.getQueryData(["girisYapanKullanici"]);

  const {mutate:logout}=useMutation({
          mutationFn: async () => {
              try{
                  const res = await api.post("/auth/cikisyap",{});
                  return res.data;
              }
              catch(err){
                  throw err;
              }
          },
          onSuccess: (data) => {
              queryClient.setQueryData(["girisYapanKullanici"],null);
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

  return (
    <div className="navbar bg-base-100 shadow-sm px-6">
      {/* Sol: Logo */}
      <div className="flex-1">
        <Link to="/" className="text-2xl font-bold text-primary">
          AFET-ARAÇ YÖNETİM SİSTEMİ
        </Link>
      </div>

      {/* Sağ: Kullanıcı bilgisi ve çıkış */}
      <div className="flex-none flex items-center gap-4">
        <div className="flex items-center gap-2">
          <FaUserCircle className="w-6 h-6 text-primary" />
          <div className="hidden sm:block text-sm text-gray-700">
            <p className="font-medium">
              {kullanici.ad} {kullanici.soyad}
            </p>
            <p className="text-xs text-gray-500">{kullanici.rol}</p>
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