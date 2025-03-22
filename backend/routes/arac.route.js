import express from 'express';
import { aracEkle, aracGetir, aracGuncelle, araclariGetir } from '../controllers/arac.controller.js';
import { JWTKontrol } from '../middlewire/JWTKontrol.js';


const router = express.Router();


router.post("/",JWTKontrol,aracEkle);
router.get("/",JWTKontrol,araclariGetir);
router.get("/:plaka",JWTKontrol,aracGetir);
router.put("/:plaka",JWTKontrol,aracGuncelle);
// router.delete("/:plaka",JWTKontrol,aracSil);



export default router;