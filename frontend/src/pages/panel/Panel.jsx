import React, { use } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "../../lib/axios";

const Panel = () => {

  const queryClient = useQueryClient();

  const girisYapanKullanici = queryClient.getQueryData(["girisYapanKullanici"]);

  if(girisYapanKullanici.rol ==="beklemede")
  {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <h1 className="text-2xl font-bold text-gray-800">Hesabınız onay bekliyor</h1>
        <p className="text-gray-600">Lütfen yönetici ile iletişime geçin.</p>
      </div>
    );
  }


  return (
    <>
    <div className="flex  justify-center  ">
      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md text-center">
        <h2 className="text-xl font-semibold mb-2">Ana Panel Sayfası</h2>
        <p className="text-gray-600">
          Bu sayfa, kullanıcı rolünüze göre sistemdeki güncel durumu özetleyen istatistikleri içerecektir.
          Ana panelde, görevler, talepler veya araçlarla ilgili genel bilgiler yer alacaktır.
        </p>
      </div>
    </div>
  </>
    
  );
};

export default Panel;
