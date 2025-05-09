import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import api from "../../lib/axios";
import { toast } from "react-hot-toast";

const GorevDetay = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: gorev, isLoading, isError } = useQuery({
    queryKey: ["gorev", id],
    queryFn: async () => {
      const res = await api.get(`/gorevler/${id}`);
      return res.data;
    },
  });

  if (isLoading) return <div className="p-6">Yükleniyor...</div>;
  if (isError || !gorev) return <div className="p-6 text-red-500">Görev bulunamadı.</div>;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="card bg-base-100 shadow-lg border">
        <div className="card-body">
      <div className="flex items-center justify-between mb-4">
  <h2 className="text-2xl font-bold">
    {gorev.talepId?.baslik || "Başlık Yok"}
  </h2>
  <span className="badge badge-info text-white text-xs py-2 px-4 rounded-full">
    GÖREV
  </span>
</div>
<div className="flex items-center gap-2 text-xs text-gray-500 mb-4">
  <span className="truncate">Talep ID: {gorev.talepId._id}</span>
  <button
    onClick={() => {
      navigator.clipboard.writeText(gorev.talepId._id);
      toast.success("Görev ID kopyalandı!");
    }}
    className="btn btn-xs btn-outline"
  >
    📋 Kopyala
  </button>
</div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-700">
            <div>
              <label className="font-semibold block mb-1">Talep Açıklaması</label>
              <div className="bg-base-200 p-2 rounded">
                {gorev.talepId?.aciklama || "-"}
              </div>
            </div>

            <div>
              <label className="font-semibold block mb-1">Görev Notu</label>
              <div className="bg-base-200 p-2 rounded">
                {gorev.gorevNotu || "-"}
              </div>
            </div>

            <div>
              <label className="font-semibold block mb-1">Şoför</label>
              <div className="bg-base-200 p-2 rounded">
                {gorev.sofor?.ad} {gorev.sofor?.soyad} ({gorev.sofor?.telefon})
              </div>
            </div>

            <div>
              <label className="font-semibold block mb-1">Araç</label>
              <div className="bg-base-200 p-2 rounded">
                {gorev.aracId?.plaka}
              </div>
            </div>

            <div>
              <label className="font-semibold block mb-1">Koordinatör</label>
              <div className="bg-base-200 p-2 rounded">
                {gorev.koordinatorId?.ad} {gorev.koordinatorId?.soyad} ({gorev.koordinatorId?.telefon})
              </div>
            </div>

            <div>
              <label className="font-semibold block mb-1">Hedef Konum</label>
              <div className="bg-base-200 p-2 rounded">
                {gorev.hedefKonumu?.lat}, {gorev.hedefKonumu?.lng}
              </div>
            </div>

            <div>
              <label className="font-semibold block mb-1">Başlangıç</label>
              <div className="bg-base-200 p-2 rounded">
                {gorev.baslangicZamani
                  ? new Date(gorev.baslangicZamani).toLocaleString("tr-TR")
                  : "-"}
              </div>
            </div>

            <div>
              <label className="font-semibold block mb-1">Bitiş</label>
              <div className="bg-base-200 p-2 rounded">
                {gorev.bitisZamani
                  ? new Date(gorev.bitisZamani).toLocaleString("tr-TR")
                  : "-"}
              </div>
            </div>

            <div>
              <label className="font-semibold block mb-1">Durum</label>
              <div className="mt-1">
                <span className="badge badge-outline capitalize">
                  {gorev.gorevDurumu}
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
              onClick={() => navigate("/gorevler")}
              className="btn btn-sm btn-outline"
            >
              Görevler Listesine Git →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GorevDetay;
