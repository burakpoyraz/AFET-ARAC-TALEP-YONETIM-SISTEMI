import mongoose from "mongoose";

const GorevSchema = mongoose.Schema(
  {
    talepId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Talep",
      required: true,
    },
    aracId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Arac",
      required: true,
    },

    sofor: {
      ad: { type: String, required: true },
      soyad: { type: String, required: true },
      telefon: { type: String, required: true },
    },

    koordinatorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Kullanici",
      required: true,
    },
    gorevDurumu: {
      type: String,
      enum: ["beklemede", "başladı", "tamamlandı", "iptal edildi"],
      default: "beklemede",
    },
    gorevNotu: {
      type: String,
    },
    baslangicZamani: {
      type: Date,
    },
    bitisZamani: {
      type: Date,
    },
    hedefKonumu: {
      lat: { type: Number, required: true },
      lng: { type: Number, required: true },
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const Gorev = mongoose.model("Gorev", GorevSchema);
export default Gorev;