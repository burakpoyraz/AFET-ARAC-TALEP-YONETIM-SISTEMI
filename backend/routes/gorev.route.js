import express from "express";
import {
  aracSahibiGorevleriGetir,
  gorevDetayGetir,
  gorevDurumGuncelle,
  gorevOlustur,
  tahminiSureleriGetir,
  talepEdenGorevleriGetir,
  tumGorevleriGetir,
} from "../controllers/gorev.controller.js";
import { JWTKontrol } from "../middlewire/JWTKontrol.js";

const router = express.Router();
console.log("Gorev route yüklendi");
router.post("/", JWTKontrol, gorevOlustur);
router.get("/", JWTKontrol, tumGorevleriGetir);
//arac_sahibi için gorevleri getirirken kullanılacak
router.get("/arac-sahibi", JWTKontrol, aracSahibiGorevleriGetir);
//talep eden kurum için gorevleri getirirken kullanılacak
router.get("/talep-eden-kurum", JWTKontrol, talepEdenGorevleriGetir);
router.post("/mesafe-ve-sure", tahminiSureleriGetir); // araç görev arası mesafe ve süre hesaplamak için kullanılacak
router.get("/:id", JWTKontrol, gorevDetayGetir); //bağımsız bir talep için detayları getirirken kullanılacak
router.put("/:id", JWTKontrol, gorevDurumGuncelle); // görev durumu güncelleme işlemi için kullanılacak

export default router;
