import React from "react";

const Footer = () => {
  return (
    <footer className="bg-base-200 text-base-content mt-10">
      <div className="footer p-10 max-w-7xl mx-auto text-sm flex flex-wrap justify-between gap-8">
        <div>
          <h2 className="text-lg font-bold">🚨 Afet Araç Talep ve Yönetim Sistemi</h2>
          <p className="max-w-xs">
            Bu sistem, afet dönemlerinde yolcu ve yük taşımacılığı için araç talep ve görevlendirme süreçlerini yönetmek amacıyla T.C. Ulaştırma ve Altyapı Bakanlığı ve AFAD işbirliğiyle geliştirilmiştir.
          </p>
        </div>

        <div>
          <span className="footer-title">KURUMSAL</span>
          <p>T.C. Ulaştırma ve Altyapı Bakanlığı</p>
          <p>VI. Bölge Müdürlüğü</p>
          <p>AFAD - Afet ve Acil Durum</p>
          <p>Yönetimi Başkanlığı</p>
        </div>

        <div>
          <span className="footer-title">İLETİŞİM</span>
          <p>
            <strong>UAB VI. Bölge Müdürlüğü:</strong>
          </p>
          <p>Liman Mah. Liman Cad. 07130</p>
          <p>Konyaaltı - ANTALYA</p>
          <p>Tel: 0 242 246 20 00</p>
          <p>E-posta: antalyabolge@uab.gov.tr</p>
        </div>
      </div>

      <div className="footer footer-center p-4 bg-base-300 text-base-content text-xs">
        <div className="flex flex-col items-center gap-1">
          <p>© {new Date().getFullYear()} T.C. Ulaştırma ve Altyapı Bakanlığı & AFAD - Tüm Hakları Saklıdır.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;