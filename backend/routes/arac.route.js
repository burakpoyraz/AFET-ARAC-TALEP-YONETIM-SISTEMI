import express from 'express';
import { aracEkle, aracGetir, aracGuncelle, aracSil, kullaniciyaKurumaAitAraclariGetir, musaitAraclariGetir, tumAraclariGetir } from '../controllers/arac.controller.js';
import { JWTKontrol } from '../middlewire/JWTKontrol.js';
import { yetkiKontrol } from '../middlewire/yetkiKontrol.js';


const router = express.Router();

router.get("/araclarim", JWTKontrol,yetkiKontrol(["arac_sahibi"]), kullaniciyaKurumaAitAraclariGetir);
router.post("/",JWTKontrol,yetkiKontrol(["arac_sahibi"]),aracEkle);
router.get("/",JWTKontrol,yetkiKontrol(["koordinator"]),tumAraclariGetir);
router.get("/musaitaraclar",JWTKontrol,yetkiKontrol(["koordinator"]),musaitAraclariGetir);

router.get("/:plaka",JWTKontrol,yetkiKontrol(["arac_sahibi"]),aracGetir);
router.put("/:plaka",JWTKontrol,yetkiKontrol(["arac_sahibi"]),aracGuncelle);
router.delete("/:plaka",JWTKontrol,yetkiKontrol(["arac_sahibi","koordinator"]),aracSil);



export default router;