import express from 'express';
import { gorevOlustur, tumGorevleriGetir } from '../controllers/gorev.controller.js';
import { JWTKontrol } from '../middlewire/JWTKontrol.js';




const router = express.Router();

router.post('/',JWTKontrol,gorevOlustur);
router.get("/", JWTKontrol, tumGorevleriGetir);


export default router;