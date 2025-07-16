import Kullanici from "../models/kullanici.model.js";
import jwt from "jsonwebtoken";

export const JWTKontrol = async(req, res, next) => {
    try {
        // Önce Authorization header'ı kontrol et (mobil için)
        // Authorization header genellikle "Bearer <token>" formatında gelir.
        // Burada, header varsa boşluk karakterine göre ayırıp ikinci kısmı (token) alıyoruz.
        let token = undefined;
        if (req.headers.authorization) {
            // Eğer authorization header varsa, "Bearer <token>" formatında olmalı
            // split ile ayırıp ikinci elemanı (index 1) alıyoruz
            token = req.headers.authorization.split(' ')[1];
        }

        // Header'da token yoksa cookie'den kontrol et (web için)
        if (!token) {
            token = req.cookies.jwt;
        }

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