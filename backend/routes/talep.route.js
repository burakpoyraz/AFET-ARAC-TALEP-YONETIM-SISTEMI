import express from 'express';
import { JWTKontrol } from '../middlewire/JWTKontrol.js';
import { talepEkle, talepGetir, talepGuncelle, talepleriGetir, talepSil } from '../controllers/talep.controller.js';


const router = express.Router();

router.post("/",JWTKontrol,talepEkle);
router.get("/",JWTKontrol,talepleriGetir);
router.get("/:id",JWTKontrol,talepGetir);
router.put("/:id",JWTKontrol,talepGuncelle);
router.delete("/:id",JWTKontrol,talepSil);

export default router;