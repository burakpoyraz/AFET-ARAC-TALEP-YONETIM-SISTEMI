import express from 'express';
import { gorevDurumGuncelle, gorevOlustur, tumGorevleriGetir } from '../controllers/gorev.controller.js';
import { JWTKontrol } from '../middlewire/JWTKontrol.js';




const router = express.Router();

router.post('/',JWTKontrol,gorevOlustur);
router.get("/", JWTKontrol, tumGorevleriGetir);

router.put("/:id", JWTKontrol, gorevDurumGuncelle);


export default router;