


import express from 'express';
import { JWTKontrol } from '../middlewire/JWTKontrol.js';
import { bildirimleriGetir, bildirimOkunduYap } from '../controllers/bildirim.controller.js';

const router = express.Router();


router.get('/',JWTKontrol,bildirimleriGetir);
router.put('/:id',JWTKontrol,bildirimOkunduYap);


export default router;