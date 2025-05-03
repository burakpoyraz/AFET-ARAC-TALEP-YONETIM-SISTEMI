import express from 'express';
import { gorevDetayGetir, gorevDurumGuncelle, gorevOlustur, tahminiSureleriGetir, tumGorevleriGetir } from '../controllers/gorev.controller.js';
import { JWTKontrol } from '../middlewire/JWTKontrol.js';




const router = express.Router();

router.post('/',JWTKontrol,gorevOlustur);
router.get("/", JWTKontrol, tumGorevleriGetir);
router.get("/:id", JWTKontrol, gorevDetayGetir); //bağımsız bir talep için detayları getirirken kullanılacak 
router.post("/mesafe-ve-sure", tahminiSureleriGetir); // araç görev arası mesafe ve süre hesaplamak için kullanılacak
router.put("/:id", JWTKontrol, gorevDurumGuncelle);


export default router;