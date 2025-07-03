import express from 'express';
import { kayitOl, girisYap, cikisYap, hesabim } from '../controllers/auth.controller.js';
import { JWTKontrol } from '../middlewire/JWTKontrol.js';


const router = express.Router();

router.post('/kayitol', kayitOl);
router.post('/girisyap', girisYap);
router.post('/cikisyap', cikisYap);
router.get("/hesabim", JWTKontrol, hesabim);



export default router;