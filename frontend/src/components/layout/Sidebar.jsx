import React from "react";
import { Link } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";

const Sidebar = () => {

    const queryClient = useQueryClient();
    const kullanici = queryClient.getQueryData(["girisYapanKullanici"]);

    


  return (
    <aside className="w-64 bg-base-200 h-screen p-4 hidden md:block">
      <nav className="flex flex-col gap-4">
        <Link to="/" className="text-xl font-bold text-primary mb-4">
          📊 Ana Panel
        </Link>

        
        {kullanici.rol === "koordinator" && (
          <>
            <h2 className="text-sm text-gray-500 uppercase">Yönetim</h2>
            <Link to="/kullanicilar" className="link link-hover">👥 Kullanıcılar</Link>
            <Link to="/kurumlar" className="link link-hover">🏢 Kurumlar</Link>
            <Link to="/araclar" className="link link-hover">🚐 Araçlar</Link>
            <Link to="/talepler" className="link link-hover">📥 Talepler</Link>
            <Link to="/gorev-atama" className="link link-hover">📌 Görev Atama</Link>
            <Link to="/raporlar" className="link link-hover">📊 Raporlar</Link>
          </>
        )}

        
        {kullanici.rol === "arac_sahibi" && (
          <>
            <h2 className="text-sm text-gray-500 uppercase">Araç Sahibi</h2>
            <Link to="/araclarim" className="link link-hover">🚐 Araçlarım</Link>
            <Link to="/gorevlerim" className="link link-hover">📌 Görevlerim</Link>
            <Link to="/gorev-durum" className="link link-hover">🔄 Görev Durumu</Link>
          </>
        )}

        
        {kullanici.rol === "talep_eden" && (
          <>
            <h2 className="text-sm text-gray-500 uppercase">Talep Yönetimi</h2>
            <Link to="/talep-olustur" className="link link-hover">➕ Talep Oluştur</Link>
            <Link to="/taleplerim" className="link link-hover">📥 Taleplerim</Link>
            <Link to="/gorev-takip" className="link link-hover">📍 Görev Takibi</Link>
          </>
        )}
      </nav>
    </aside>
  );
};

export default Sidebar;