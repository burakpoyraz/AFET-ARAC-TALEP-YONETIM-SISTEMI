import express from "express";
import {
  aracSahibiGorevleriGetir,
  gorevDetayGetir,
  gorevDurumGuncelle,
  gorevOlustur,
  gorevPdfIndir,
  tahminiSureleriGetir,
  talepEdenGorevleriGetir,
  tumGorevleriGetir,
} from "../controllers/gorev.controller.js";
import { JWTKontrol } from "../middlewire/JWTKontrol.js";
import { yetkiKontrol } from "../middlewire/yetkiKontrol.js";

const router = express.Router();

router.post("/", JWTKontrol,yetkiKontrol(["koordinator"]), gorevOlustur);
router.get("/", JWTKontrol,yetkiKontrol(["koordinator"]), tumGorevleriGetir);
//arac_sahibi için gorevleri getirirken kullanılacak
router.get("/arac-sahibi", JWTKontrol,yetkiKontrol(["arac_sahibi"]), aracSahibiGorevleriGetir);
//talep eden kurum için gorevleri getirirken kullanılacak
router.get("/talep-eden-kurum", JWTKontrol,yetkiKontrol(["talep_eden"]), talepEdenGorevleriGetir);
router.post("/mesafe-ve-sure",JWTKontrol, tahminiSureleriGetir); // araç görev arası mesafe ve süre hesaplamak için kullanılacak
router.get("/:id/pdf", JWTKontrol, gorevPdfIndir);
router.get("/:id", JWTKontrol, gorevDetayGetir); //bağımsız bir talep için detayları getirirken kullanılacak
router.put("/:id", JWTKontrol,gorevDurumGuncelle); // görev durumu güncelleme işlemi için kullanılacak


export default router;
