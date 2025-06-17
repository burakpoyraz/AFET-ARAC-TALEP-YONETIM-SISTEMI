import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  ChevronRight,
  Home,
  Users,
  Building,
  Truck,
  Inbox,
  MapPin,
  Bell,
  Car,
  Clipboard
} from "lucide-react";
import api from "../../lib/axios";

const Sidebar = () => {
  const location = useLocation();
  const queryClient = useQueryClient();
  const kullanici = queryClient.getQueryData(["girisYapanKullanici"]);
  const [hoveredItem, setHoveredItem] = useState(null);

  const { data: bildirimler = [] } = useQuery({
    queryKey: ["bildirimlerSidebar"],
    queryFn: async () => {
      const res = await api.get("/bildirimler");
      return res.data;
    },
    enabled: !!kullanici?._id,
  });

  const okunmamisSayisi = bildirimler.filter(b => !b.okundu).length;

  // Menü öğesi
  const MenuItem = ({ to, icon: Icon, label, badge }) => {
  const isActive =
  to === "/" ? location.pathname === "/" : location.pathname.startsWith(to);

    return (
      <Link
        to={to}
        className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 relative
          ${isActive ? "bg-primary bg-opacity-10 text-primary font-medium" : "hover:bg-base-300"}`}
        onMouseEnter={() => setHoveredItem(to)}
        onMouseLeave={() => setHoveredItem(null)}
      >
        <Icon
          size={18}
          className={`transition-all duration-200 ${isActive ? "text-amber-50" : ""}`}
        />
       <span
  className={`transition-colors duration-200 ${
    isActive ? " font-medium text-amber-50" : "text-base-content"
  }`}
>
  {label}
</span>

        {badge > 0 && (
          <span className="absolute right-3 px-2 py-0.5 bg-error text-white text-xs font-bold rounded-full">
            {badge}
          </span>
        )}

        {(isActive || hoveredItem === to) && (
          <ChevronRight
            size={16}
            className={`absolute transition-all duration-200 
              ${badge > 0 ? "right-8" : "right-3"} 
              ${isActive ? "text-primary" : "text-gray-500"}`}
          />
        )}
      </Link>
    );
  };

  const SectionTitle = ({ title }) => (
    <div className="mt-6 mb-2 px-4">
      <h2 className="text-xs font-semibold tracking-wider text-gray-500 uppercase">{title}</h2>
      <div className="h-0.5 w-12 bg-primary mt-1 rounded-full"></div>
    </div>
  );

  return (
    <aside className="w-72 bg-base-200 h-full py-6 px-2 hidden md:flex flex-col border-r border-base-300 shadow-sm">
     

      <div className="overflow-y-auto flex-1">
        <nav className="flex flex-col gap-1">
          <MenuItem to="/" icon={Home} label="Ana Panel" />

          {kullanici?.rol === "koordinator" && (
            <>
              <SectionTitle title="Koordinatör" />
              <MenuItem to="/kullanicilar" icon={Users} label="Kullanıcılar" />
              <MenuItem to="/kurumlar" icon={Building} label="Kurumlar" />
              <MenuItem to="/araclar" icon={Truck} label="Araçlar" />
              <MenuItem to="/talepler" icon={Inbox} label="Talepler" />
              <MenuItem to="/gorevler" icon={MapPin} label="Görevler" />
              <MenuItem to="/bildirimler" icon={Bell} label="Bildirimler" badge={okunmamisSayisi} />
              <MenuItem to="/raporlar" icon={Clipboard} label="Raporlar" />
              
            </>
          )}

          {kullanici?.rol === "arac_sahibi" && (
            <>
              <SectionTitle title="Araç Sahibi" />
              <MenuItem to="/araclarim" icon={Car} label="Araçlarım" />
              <MenuItem to="/arac-sahibi/gorevler" icon={MapPin} label="Görevlerim" />
              <MenuItem to="/bildirimler" icon={Bell} label="Bildirimler" badge={okunmamisSayisi} />
            </>
          )}

          {kullanici?.rol === "talep_eden" && (
            <>
              <SectionTitle title="Talep Sahibi" />
              <MenuItem to="/taleplerim" icon={Inbox} label="Taleplerim" />
              <MenuItem to="/talep-eden/gorevler" icon={Clipboard} label="Görev Takibi" />
              <MenuItem to="/bildirimler" icon={Bell} label="Bildirimler" badge={okunmamisSayisi} />
            </>
          )}
        </nav>
      </div>
    </aside>
  );
};

export default Sidebar;
