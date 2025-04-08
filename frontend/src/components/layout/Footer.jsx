import React from "react";

const Footer = () => {
  return (
    <footer className="bg-base-200 text-base-content mt-10">
     <div className="footer p-10 max-w-7xl mx-auto text-sm flex flex-wrap justify-between gap-8">
        <div>
          <h2 className="text-lg font-bold">🚨 Afet Araç Talep ve Yönetim Sistemi</h2>
          <p className="max-w-xs">
            Bu sistem, afet dönemlerinde yolcu ve yük taşımacılığı için araç talep ve görevlendirme süreçlerini yönetmek amacıyla geliştirilmiştir.
          </p>
        </div>

        <div>
          <span className="footer-title">Hazırlayan</span>
          <p>Burak Poyraz</p>
          <p>Bilgisayar Mühendisliği</p>
          <p>Proje II Dersi</p>
        </div>

        <div>
          <span className="footer-title">İletişim</span>
          <p>Email: burak.poyraz32@gmail.com</p>
          <p>GitHub: <a href="https://github.com/https://github.com/burakpoyraz/AFET-ARAC-TALEP-YONETIM-SISTEMI" className="link link-hover">AFET ARAC TALEP YONETIM SISTEMI</a></p>
        </div>
      </div>

      <div className="footer footer-center p-4 bg-base-300 text-base-content text-xs">
        <p>© {new Date().getFullYear()} Tüm Hakları Saklıdır.</p>
      </div>
    </footer>
  );
};

export default Footer;