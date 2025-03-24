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
      "minibus",
      "otobus",
      "kamyon",
      "cekici",
      "pickUp",
      "tanker",
      "yRomork",
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
      "onaylandi",
      "reddedildi",
      "atanmis",
      "tamamlandi",
      "iptal_edildi",
    ],
    default: "beklemede",
  },
});

const Talep = mongoose.model("Talep", TalepSchema);

export default Talep;
