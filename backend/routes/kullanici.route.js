import express from 'express';
import { kullaniciGetir, kullaniciGuncelle, kullanicilariGetir, kullaniciRolveKurumFirmaAta, kullaniciSil } from '../controllers/kullanici.controller.js';
import { JWTKontrol } from '../middlewire/JWTKontrol.js';
import { yetkiKontrol } from '../middlewire/yetkiKontrol.js';



const router = express.Router();

router.get('/',JWTKontrol,yetkiKontrol(["koordinator"]),kullanicilariGetir);
router.get('/:id',JWTKontrol,yetkiKontrol(["koordinator"]),kullaniciGetir);
router.put('/:id',JWTKontrol,yetkiKontrol(["koordinator"]),kullaniciGuncelle);
router.delete('/:id',JWTKontrol,yetkiKontrol(["koordinator"]),kullaniciSil);
router.put('/:id/rol-ata',JWTKontrol,yetkiKontrol(["koordinator"]),kullaniciRolveKurumFirmaAta);




export default router;