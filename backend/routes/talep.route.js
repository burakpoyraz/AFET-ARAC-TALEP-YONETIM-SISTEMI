import express from 'express';
import { JWTKontrol } from '../middlewire/JWTKontrol.js';
import { kurumaAitTalepleriGetir, talepEkle, talepGetir, talepGuncelle, talepSil, tumTalepleriGetir } from '../controllers/talep.controller.js';
import { yetkiKontrol } from '../middlewire/yetkiKontrol.js';


const router = express.Router();

router.get("/taleplerim", JWTKontrol,yetkiKontrol(["talep_eden"]), kurumaAitTalepleriGetir);
router.post("/",JWTKontrol,yetkiKontrol(["talep_eden"]),talepEkle);
router.get("/",JWTKontrol,yetkiKontrol(["koordinator"]),tumTalepleriGetir);
router.get("/:id",JWTKontrol,yetkiKontrol(["koordinator","talep_eden"]),talepGetir);
router.put("/:id",JWTKontrol,yetkiKontrol(["koordinator","talep_eden"]),talepGuncelle);
router.delete("/:id",JWTKontrol,yetkiKontrol(["koordinator","talep_eden"]),talepSil);

export default router;