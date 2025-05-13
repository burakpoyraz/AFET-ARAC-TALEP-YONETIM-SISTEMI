import React from "react";
import { Link } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import api from "../../lib/axios";

const Sidebar = () => {

  

  const queryClient = useQueryClient();
  const kullanici = queryClient.getQueryData(["girisYapanKullanici"]);

 const { data: bildirimler = [] } = useQuery({
  queryKey: ["bildirimlerSidebar"],
  queryFn: async () => {
    const res = await api.get("/bildirimler");
    return res.data;
  },
  enabled: !!kullanici?._id, // Kullanıcı bilgisi geldiyse sorguyu başlat
});

 const okunmamisSayisi = bildirimler.filter(
  (bildirim) =>
    !bildirim.okundu 
   
).length;



  return (
    <aside className="w-64 bg-base-200 h-full p-4 hidden md:block">
      <nav className="flex flex-col gap-4">
        <Link to="/" className="text-xl font-bold text-primary mb-4">
          📊 Ana Panel
        </Link>

        {kullanici.rol === "koordinator" && (
          <>
            <h2 className="text-sm text-gray-500 uppercase">KOORDİNATÖR</h2>
            <Link to="/kullanicilar" className="link link-hover">
              👥 Kullanıcılar
            </Link>
            <Link to="/kurumlar" className="link link-hover">
              🏢 Kurumlar
            </Link>
            <Link to="/araclar" className="link link-hover">
              🚐 Araçlar
            </Link>
            <Link to="/talepler" className="link link-hover">
              📥 Talepler
            </Link>
            <Link to="/gorevler" className="link link-hover">
              📌 Görevler
            </Link>
               <Link
              to="/bildirimler"
              className="link link-hover flex items-center justify-between"
            >
              <span>🔔 Bildirimler</span>
              {okunmamisSayisi > 0 && (
                <span className="badge badge-error text-white text-xs">
                  {okunmamisSayisi}
                </span>
              )}
            </Link>
            <Link to="/raporlar" className="link link-hover">
              📊 Raporlar
            </Link>
          </>
        )}

        {kullanici.rol === "arac_sahibi" && (
          <>
            <h2 className="text-sm text-gray-500 uppercase">ARAÇ SAHİBİ</h2>
            <Link to="/araclarim" className="link link-hover">
              🚐 Araçlarım
            </Link>
            <Link to="/arac-sahibi/gorevler" className="link link-hover">
              📌 Görevlerim
            </Link>
               <Link
              to="/bildirimler"
              className="link link-hover flex items-center justify-between"
            >
              <span>🔔 Bildirimler</span>
              {okunmamisSayisi > 0 && (
                <span className="badge badge-error text-white text-xs">
                  {okunmamisSayisi}
                </span>
              )}
            </Link>
          </>
        )}

        {kullanici.rol === "talep_eden" && (
          <>
            <h2 className="text-sm text-gray-500 uppercase">TALEP SAHİBİ</h2>
            <Link to="/taleplerim" className="link link-hover">
              📥 Taleplerim
            </Link>
            <Link to="/talep-eden/gorevler" className="link link-hover">
              📍 Görev Takibi
            </Link>
            <Link
              to="/bildirimler"
              className="link link-hover flex items-center justify-between"
            >
              <span>🔔 Bildirimler</span>
              {okunmamisSayisi > 0 && (
                <span className="badge badge-error text-white text-xs">
                  {okunmamisSayisi}
                </span>
              )}
            </Link>
          </>
        )}
      </nav>
    </aside>
  );
};

export default Sidebar;
