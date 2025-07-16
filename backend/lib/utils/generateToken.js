import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

export const tokenVeCookieOlustur = (userId, res, isMobile = false) => {
    const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
        expiresIn: "15d"
    });

    // Mobil için token'ı response body'de dön
    if (isMobile) {
        return token;
    }

    // Web için cookie oluştur
    const cookieOptions = {
        expires: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
        httpOnly: true,
        sameSite: 'Lax',
        secure: process.env.NODE_ENV === 'production' ? true : false
    };

    res.cookie('jwt', token, cookieOptions);
    return token;
}