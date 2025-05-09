import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import api from "../../lib/axios";
import { toast } from "react-hot-toast";

const TalepDetay = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const {
    data: talep,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["talep", id],
    queryFn: async () => {
      const res = await api.get(`/talepler/${id}`);
      return res.data;
    },
  });

  if (isLoading) return <div className="p-6">Yükleniyor...</div>;
  if (isError || !talep)
    return <div className="p-6 text-red-500">Talep bulunamadı.</div>;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="card bg-base-100 shadow-lg border">
        <div className="card-body">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold">{talep.baslik}</h2>
            <span className="badge badge-info text-white text-xs py-2 px-4 rounded-full">
              TALEP
            </span>
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-500 mb-4">
  <span className="truncate">Talep ID: {talep._id}</span>
  <button
    onClick={() => {
      navigator.clipboard.writeText(talep._id);
      toast.success("Görev ID kopyalandı!");
    }}
    className="btn btn-xs btn-outline"
  >
   📋 Kopyala
  </button>
</div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-700">
            <div>
              <label className="font-semibold block mb-1">Açıklama</label>
              <div className="bg-base-200 p-2 rounded">
                {talep.aciklama || "-"}
              </div>
            </div>

            <div>
              <label className="font-semibold block mb-1">Araç Türü</label>
              <div className="bg-base-200 p-2 rounded">
                {talep.aracTuru || "-"}
              </div>
            </div>

            <div>
              <label className="font-semibold block mb-1">Araç Sayısı</label>
              <div className="bg-base-200 p-2 rounded">
                {talep.aracSayisi || "-"}
              </div>
            </div>

            <div>
              <label className="font-semibold block mb-1">Adres</label>
              <div className="bg-base-200 p-2 rounded">
                {talep.lokasyon?.adres || "Belirtilmemiş"}
              </div>
            </div>

            <div>
              <label className="font-semibold block mb-1">Durum</label>
              <div className="mt-1">
                <span className="badge badge-outline capitalize">
                  {talep.durum || "bilinmiyor"}
                </span>
              </div>
            </div>
          </div>

          <div className="mt-6 flex justify-between">
            <button
              onClick={() => navigate("/bildirimler")}
              className="btn btn-sm btn-outline"
            >
              ← Bildirimlere Dön
            </button>

            <button
              onClick={() => navigate("/talepler")}
              className="btn btn-sm btn-outline"
            >
              Talepler Listesine Git →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TalepDetay;
