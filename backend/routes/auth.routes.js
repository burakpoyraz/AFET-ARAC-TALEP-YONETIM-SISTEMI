
import express from 'express';
import { kayitOl,girisYap,cikisYap } from '../controllers/auth.controller.js';


const router = express.Router();

router.get('/kayitol', kayitOl);
router.get('/girisyap', girisYap);
router.get('/cikisyap', cikisYap);



export default router;


