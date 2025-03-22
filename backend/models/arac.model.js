import mongoose from "mongoose";
import { Schema } from "mongoose";

const AracSchema = mongoose.Schema(
  {
    plaka: {
      type: String,
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

    kullanimAmaci: {
      type: String,
      required: true,
      enum: ["yolcu", "yuk"],
    },
    kapasite: {
      type: Number,
      required: true,
    },
    musaitlikDurumu: {
      type: Boolean,
      default: true,
    },
    aracDurumu: {
      type: String,
      enum: ["aktif", "pasif"],
      default: "aktif",
    },
    konum: {
      lat: {
        type: Number,
       
      },
      lng: {
        type: Number,
        
      },
    },
    sofor: {
      ad: {
        type: String,
     
      },
      soyad: {
        type: String,
        
      },
      telefon: {
        type: String,
       
      },
    },
    kurumFirmaId: {
      type: Schema.Types.ObjectId,
      ref: "KurumFirma",
      default: null,
    },
    kullaniciId: {
      type: Schema.Types.ObjectId,
      ref: "Kullanici",
      default: null,
    },
  },
  { timestamps: true }
);

const Arac = mongoose.model("Arac", AracSchema);

export default Arac;
