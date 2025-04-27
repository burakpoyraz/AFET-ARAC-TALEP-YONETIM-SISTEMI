import mongoose from "mongoose";

const TalepSchema = mongoose.Schema({
  baslik: {
    type: String,
    required: true,
  },
  aciklama: {
    type: String,
    required: true,
  },

  talepEdenKullaniciId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Kullanici",
    required: true,
  },
  talepEdenKurumFirmaId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "KurumFirma",
    required: true,
  },
  aracTuru: {
    type: String,
    required: true,
    enum: [
      "otomobil",
      "kamyonet",
      "minibüs",
      "otobüs",
      "kamyon",
      "çekici(Tır)",
      "pick-Up",
      "tanker",
      "y.Römork",
      "lowbed",
      "motosiklet",
    ],
  },
  aracSayisi: {
    type: Number,
    required: true,
  },
  lokasyon: {
    adres: {
      type: String,
      required: true,
    },
    lat: {
      type: Number,
      required: true,
    },
    lng: {
      type: Number,
      required: true,
    },
  },

  durum: {
    type: String,
    enum: [
      "beklemede",
      "gorevlendirildi",
      "tamamlandı",
      "iptal edildi",
    ],
    default: "beklemede",
  },
});

const Talep = mongoose.model("Talep", TalepSchema);

export default Talep;
