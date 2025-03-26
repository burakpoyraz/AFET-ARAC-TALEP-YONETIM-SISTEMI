import express from 'express';
import { gorevOlustur } from '../controllers/gorev.controller.js';
import { JWTKontrol } from '../middlewire/JWTKontrol.js';




const router = express.Router();

router.post('/',JWTKontrol,gorevOlustur);


export default router;