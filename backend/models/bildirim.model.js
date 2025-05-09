import mongoose from "mongoose";

const BildirimShema= mongoose.Schema(
  {
    kullaniciId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Kullanici",
      default: null,
    },
    kurumFirmaId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "KurumFirma",
      default: null,
    },
    baslik: {
      type: String,
      required: true,
    },
    icerik: {
      type: String,
      required: true,
    },
    hedefUrl: {
      type: String,
    },
    okundu: {
      type: Boolean,
      default: false,
    },
    tur: {
      type: String,
      enum: ["gorev", "talep", "sistem"],
      default: "sistem",
    },
      gizlilik: {
      type: String,
      enum: ["bireysel", "kurumsal"],
      default: "bireysel",
    },
  },
  { timestamps: true }
);

const Bildirim = mongoose.model("Bildirim", BildirimShema);
export default Bildirim;