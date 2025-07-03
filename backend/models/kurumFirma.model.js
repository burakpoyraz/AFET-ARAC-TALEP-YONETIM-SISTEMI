import mongoose from "mongoose";
import { Schema } from "mongoose";

const KurumFirmaSchema = mongoose.Schema(
  {
    kurumAdi: {
      type: String,
      required: true,
    },
    kurumTuru: {
      type: String,
      enum: ["kamu", "özel"],
    },
    iletisim: {
      telefon: {
        type: String,
      },
      email: {
        type: String,
      },
      adres: {
        type: String,
      },
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamp: true }
);

const KurumFirma = mongoose.model("KurumFirma", KurumFirmaSchema);

export default KurumFirma;
