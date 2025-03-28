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
    <>panel
    
    </>
    
  );
};

export default Panel;
