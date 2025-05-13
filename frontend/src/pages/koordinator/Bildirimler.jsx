import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import React from "react";
import { useState } from "react";
import api from "../../lib/axios";
import { useNavigate } from "react-router-dom";

const Bildirimler = () => {
  const navigate = useNavigate();

  const queryClient = useQueryClient();

  const [filtre, setFiltre] = useState("hepsi");

  const { data: bildirimler = [], isLoading } = useQuery({
    queryKey: ["bildirimler"],
    queryFn: async () => {
      const res = await api.get("/bildirimler");

      return res.data;
    },
  });

  const filtrelenmis = bildirimler.filter((b) =>
    filtre === "hepsi" ? true : b.tur === filtre
  );



  const { mutate: bildirimOkunduYap } = useMutation({
    mutationFn: async (bildirimId) => {
      const res = await api.put(`/bildirimler/${bildirimId}`);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["bildirimler"]);
    },
  });
  const okunduYap = (bildirimId) => {
    bildirimOkunduYap(bildirimId);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Bildirimler</h1>

      <div className="flex gap-2 mb-4">
        {["hepsi", "gorev", "talep", "sistem"].map((tip) => (
          <button
            key={tip}
            onClick={() => setFiltre(tip)}
            className={`btn btn-sm ${
              filtre === tip ? "btn-primary" : "btn-outline"
            }`}
          >
            {tip === "hepsi"
              ? "Tümü"
              : tip.charAt(0).toUpperCase() + tip.slice(1)}
          </button>
        ))}
      </div>

      {filtrelenmis.length === 0 ? (
        <div className="text-gray-500">Gösterilecek bildirim yok.</div>
      ) : (
        <ul className="space-y-3">
          {filtrelenmis.map((b) => (
            <li
              key={b._id}
              className="p-4 border rounded shadow-sm bg-base-100 hover:bg-base-200 transition"
            >
              <div className="flex items-center justify-between mb-1">
                <strong className="text-base">{b.baslik}</strong>
                <span className="badge badge-outline">
                  {b.tur.charAt(0).toUpperCase() + b.tur.slice(1)}
                </span>
              </div>

              <div className="text-sm text-gray-700 mb-1">{b.icerik}</div>

              <div className="flex items-center justify-between mt-2">
                <span className="text-xs text-gray-400">
                  {new Date(b.createdAt).toLocaleString("tr-TR")}
                </span>
                {b.hedefUrl && (
                  <button
                    onClick={() => {
                      okunduYap(b._id);

                      navigate(b.hedefUrl);
                    }}
                    className="btn btn-xs btn-outline btn-info"
                  >
                    Detay
                  </button>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Bildirimler;
