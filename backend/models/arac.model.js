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

    kullanimAmaci: {
      type: String,
    //  required: true,
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
      adres: {
        type: String,
        
      },
      
      lat: {
        type: Number,
       
      },
      lng: {
        type: Number,
        
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
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const Arac = mongoose.model("Arac", AracSchema);

export default Arac;
