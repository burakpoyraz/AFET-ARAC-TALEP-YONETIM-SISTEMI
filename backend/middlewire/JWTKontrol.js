import Kullanici from "../models/kullanici.model.js";
import jwt from "jsonwebtoken";

export const JWTKontrol = async (req, res, next) => {
    
    try {
        const token = req.cookies.jwt;
        
        if (!token) {
            return res.status(401).json({ error: "Bu işlem için giriş yapmanız gerekiyor." });
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        
        const kullanici = await Kullanici.findById(decoded.userId).select("-sifre").populate("kurumFirmaId", "kurumAdi")

        if (!kullanici || kullanici.isDeleted) {
            return res.status(401).json({ error: "Bu işlem için giriş yapmanız gerekiyor." });
        }

        req.kullanici = kullanici;
    
        next();
    } catch (error) {
        return res.status(401).json({ error: "Bu işlem için giriş yapmanız gerekiyor." });
    }
}