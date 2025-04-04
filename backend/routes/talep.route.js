import express from 'express';
import { JWTKontrol } from '../middlewire/JWTKontrol.js';
import { kurumaAitTalepleriGetir, talepEkle, talepGetir, talepGuncelle, talepSil, tumTalepleriGetir } from '../controllers/talep.controller.js';


const router = express.Router();

router.get("/taleplerim", JWTKontrol, kurumaAitTalepleriGetir);
router.post("/",JWTKontrol,talepEkle);
router.get("/",JWTKontrol,tumTalepleriGetir);
router.get("/:id",JWTKontrol,talepGetir);
router.put("/:id",JWTKontrol,talepGuncelle);
router.delete("/:id",JWTKontrol,talepSil);

export default router;