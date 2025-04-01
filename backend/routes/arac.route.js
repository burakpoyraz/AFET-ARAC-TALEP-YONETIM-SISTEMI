import express from 'express';
import { aracEkle, aracGetir, aracGuncelle, aracSil, kullaniciyaKurumaAitAraclariGetir, tumAraclariGetir } from '../controllers/arac.controller.js';
import { JWTKontrol } from '../middlewire/JWTKontrol.js';


const router = express.Router();

router.get("/araclarim", JWTKontrol, kullaniciyaKurumaAitAraclariGetir);
router.post("/",JWTKontrol,aracEkle);
router.get("/",JWTKontrol,tumAraclariGetir);

router.get("/:plaka",JWTKontrol,aracGetir);
router.put("/:plaka",JWTKontrol,aracGuncelle);
router.delete("/:plaka",JWTKontrol,aracSil);



export default router;