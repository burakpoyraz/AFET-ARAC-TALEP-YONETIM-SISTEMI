import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

export const tokenVeCookieOlustur = (userId, res) => {
    const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
        expiresIn: "15d"
    });


    const cookieOptions = {
        expires: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
        httpOnly: true, // Sadece sunucu tarafından erişile
        sameSite: 'Lax', // Sadece sunucu tarafından erişilebilir
        secure: process.env.NODE_ENV === 'production' ? true : false // Sadece HTTPS üzerinden erişilebilir
    };

    res.cookie('jwt', token, cookieOptions);

}