import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import React from "react";
import { useNavigate } from "react-router-dom";

const Panel = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { mutate: cikisYap } = useMutation({
    mutationFn: async () => {
      const res = await axios.post("/api/auth/cikisyap");
      return res.data;
    },
    onSuccess: (data) => {
      console.log("Çıkış başarılı:", data);
      queryClient.setQueryData(["girisYapanKullanici"], null);
      navigate("/girisyap");
    },
    onError: (error) => {
      console.error("Çıkış hatası:", error.message);
    },
  });

  return (
    <button
      onClick={(e) => {
        e.preventDefault();
        cikisYap();
      }}
      className="btn btn-primary"
    >
      Çıkış Yap
    </button>
  );
};

export default Panel;
