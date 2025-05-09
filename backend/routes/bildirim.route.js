


import express from 'express';
import { JWTKontrol } from '../middlewire/JWTKontrol.js';
import { bildirimleriGetir } from '../controllers/bildirim.controller.js';

const router = express.Router();


router.get('/',JWTKontrol,bildirimleriGetir);


export default router;