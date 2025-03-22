import express from 'express';
import { kurumFirmaAra, kurumFirmaGetir, kurumFirmaGuncelle, kurumFirmaOlustur, kurumFirmaSil, tumKurumFirmalariGetir } from '../controllers/kurumFirma.controller.js';
import { yetkiKontrol } from '../middlewire/yetkiKontrol.js';
import { JWTKontrol } from '../middlewire/JWTKontrol.js';



const router = express.Router();


router.post("/",JWTKontrol,yetkiKontrol(["koordinator"]),kurumFirmaOlustur);
router.get("/",JWTKontrol,yetkiKontrol(["koordinator"]),tumKurumFirmalariGetir);
router.get("/firmaara",JWTKontrol,yetkiKontrol(["koordinator"]),kurumFirmaAra);
router.get("/:id",JWTKontrol,yetkiKontrol(["koordinator"]),kurumFirmaGetir);
router.put("/:id",JWTKontrol,yetkiKontrol(["koordinator"]),kurumFirmaGuncelle);
router.delete("/:id",JWTKontrol,yetkiKontrol(["koordinator"]),kurumFirmaSil);


export default router;