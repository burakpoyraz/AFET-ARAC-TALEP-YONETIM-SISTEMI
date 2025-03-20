import mongoose from "mongoose";
import { Schema } from "mongoose";

const KullaniciSchema = mongoose.Schema(
  {
    adSoyad: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      unique: true, // Email alanı benzersiz olacak
      required: true,
    },
    sifre: {
      type: String, // bcrypt hash
      required: true,
    },
    telefon: {
      type: String,
      required: true,
      unique: true, // Telefon alanı benzersiz olacak
    },
    rol: {
      type: String,
      enum: ["beklemede", "arac_sahibi", "talep_eden", "koordinator"],
    default: "beklemede",
    },
    kurumFirmaId: {
      type: Schema.Types.ObjectId,
      ref: "KurumFirma",
      default: null,
    },
    kullaniciBeyanBilgileri: {
      kurumFirmaAdi: {
        type: String,
        required: true,
      },
      kurumFirmaTuru: {
        type: String,
        enum: ["kamu", "tüzel", "şahıs"],
      },
      pozisyon: {
        type: String,
      },
    },
    rolAtamaTarihi: {
      type: Date,
    },
    rolAtayanKoordinatorId: {
      type: Schema.Types.ObjectId,
      ref: "Kullanici",
    },
  },
  { timestamps: true }
);

const Kullanici = mongoose.model("Kullanici", KullaniciSchema);

export default Kullanici;
