import { tokenVeCookieOlustur } from "../lib/utils/generateToken.js";
import Kullanici from "../models/kullanici.model.js";
import bcrypt from "bcryptjs";

export const kayitOl = async(req, res) => {
    try {
        console.log('Registration request received:', {
            ...req.body,
            sifre: '[HIDDEN]',
            sifreTekrar: '[HIDDEN]'
        });

        const { ad, soyad, email, sifre, telefon, kurumFirmaAdi, kurumFirmaTuru, isMobile } = req.body;

        // Input validation
        if (!ad || !soyad || !email || !sifre || !telefon) {
            console.log('Missing required fields:', { ad, soyad, email, telefon });
            return res.status(400).json({ error: "Tüm zorunlu alanları doldurunuz" });
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const telefonRegex = /^\d{10}$/;

        if (!emailRegex.test(email)) {
            console.log('Invalid email:', email);
            return res.status(400).json({ error: "Geçerli bir email adresi giriniz" });
        }
        if (!telefonRegex.test(telefon)) {
            console.log('Invalid phone:', telefon);
            return res.status(400).json({ error: "Geçerli bir telefon numarası giriniz" });
        }
        if (sifre.length < 6) {
            console.log('Password too short');
            return res.status(400).json({ error: "Şifre en az 6 karakter olmalıdır" });
        }

        // Check for existing user
        console.log('Checking for existing user with email or phone:', { email, telefon });
        const kullaniciVarMi = await Kullanici.findOne({
            $or: [{ email }, { telefon }],
            isDeleted: false,
        });

        if (kullaniciVarMi) {
            console.log('User already exists:', { email, telefon });
            return res.status(400).json({
                error: "Bu email veya telefon numarası ile kayıtlı bir kullanıcı var",
            });
        }

        // Hash password
        console.log('Hashing password...');
        const salt = await bcrypt.genSalt(10);
        const sifreHash = await bcrypt.hash(sifre, salt);

        // Create new user
        console.log('Creating new user...');
        const yeniKullanici = new Kullanici({
            ad,
            soyad,
            email,
            sifre: sifreHash,
            telefon,
            kullaniciBeyanBilgileri: {
                kurumFirmaAdi: kurumFirmaAdi || null,
                kurumFirmaTuru: kurumFirmaTuru || 'kendi_adima',
            },
        });

        // Validate user object
        console.log('Validating user object...');
        const validationError = yeniKullanici.validateSync();
        if (validationError) {
            console.error('Validation error:', validationError);
            return res.status(400).json({
                error: "Kullanıcı bilgileri geçersiz",
                details: Object.values(validationError.errors).map(err => err.message)
            });
        }

        // Save user to database
        console.log('Saving user to database...');
        await yeniKullanici.save();
        console.log('User saved successfully:', yeniKullanici._id);

        // Create token and cookie
        console.log('Creating token and cookie...');
        const token = tokenVeCookieOlustur(yeniKullanici._id, res, isMobile);

        // Send response
        console.log('Sending success response...');
        const response = {
            yeniKullanici: {
                _id: yeniKullanici._id,
                ad: yeniKullanici.ad,
                soyad: yeniKullanici.soyad,
                email: yeniKullanici.email,
                telefon: yeniKullanici.telefon,
                rol: yeniKullanici.rol,
                kurumFirmaId: yeniKullanici.kurumFirmaId,
                kullaniciBeyanBilgileri: yeniKullanici.kullaniciBeyanBilgileri,
                rolAtamaTarihi: yeniKullanici.rolAtamaTarihi,
                rolAtayanKoordinatorId: yeniKullanici.rolAtayanKoordinatorId,
            }
        };

        // Mobil için token'ı response'a ekle
        if (isMobile) {
            response.token = token;
        }

        return res.status(201).json(response);
    } catch (error) {
        console.error('Registration error:', {
            name: error.name,
            message: error.message,
            stack: error.stack,
            code: error.code
        });

        // Handle specific errors
        if (error.code === 11000) {
            return res.status(400).json({
                error: "Bu email veya telefon numarası ile kayıtlı bir kullanıcı var",
            });
        }

        // Handle mongoose validation errors
        if (error.name === 'ValidationError') {
            return res.status(400).json({
                error: "Kullanıcı bilgileri geçersiz",
                details: Object.values(error.errors).map(err => err.message)
            });
        }

        // Handle other errors
        return res.status(500).json({
            error: "Sunucu hatası",
            details: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

export const girisYap = async(req, res) => {
    try {
        const { email, sifre, isMobile } = req.body;

        const kullanici = await Kullanici.findOne({ email, isDeleted: false });

        if (!kullanici) {
            return res.status(400).json({ error: "Bu email ile kayıtlı bir kullanıcı bulunamadı" });
        }
        const sifreKontrol = await bcrypt.compare(sifre, kullanici.sifre);

        if (!sifreKontrol) {
            return res.status(400).json({ error: "Şifre hatalı" });
        }

        const token = tokenVeCookieOlustur(kullanici._id, res, isMobile);

        const response = {
            kullanici: {
                _id: kullanici._id,
                ad: kullanici.ad,
                soyad: kullanici.soyad,
                email: kullanici.email,
                telefon: kullanici.telefon,
                rol: kullanici.rol,
                kurumFirmaId: kullanici.kurumFirmaId,
                kullaniciBeyanBilgileri: kullanici.kullaniciBeyanBilgileri,
                rolAtamaTarihi: kullanici.rolAtamaTarihi,
                rolAtayanKoordinatorId: kullanici.rolAtayanKoordinatorId,
            }
        };

        // Mobil için token'ı response'a ekle
        if (isMobile) {
            response.token = token;
        }

        res.status(200).json(response);
    } catch (error) {
        console.error(`Kullanıcı giriş yaparken hata oluştu: ${error.message}`);
        return res.status(500).json({ error: "Sunucu hatası" });
    }
}

export const cikisYap = async(req, res) => {
    try {
        // Web için cookie'yi temizle
        if (!req.body.isMobile) {
            res.clearCookie("jwt");
        }
        res.status(200).json({ message: "Çıkış başarılı" });
    } catch (error) {
        console.error(`Kullanıcı çıkış yaparken hata oluştu: ${error.message}`);
        return res.status(500).json({ error: "Sunucu hatası" });
    }
};

export const hesabim = async(req, res) => {
    try {
        const kullanici = req.kullanici;

        if (!kullanici) {
            return res.status(401).json({ error: "Kullanıcı bulunamadı" });
        }

        res.status(200).json({
            kullanici: {
                _id: kullanici._id,
                ad: kullanici.ad,
                soyad: kullanici.soyad,
                email: kullanici.email,
                telefon: kullanici.telefon,
                rol: kullanici.rol,
                kurumFirmaId: kullanici.kurumFirmaId,
                kullaniciBeyanBilgileri: kullanici.kullaniciBeyanBilgileri,
                rolAtamaTarihi: kullanici.rolAtamaTarihi,
                rolAtayanKoordinatorId: kullanici.rolAtayanKoordinatorId,
            }
        });
    } catch (error) {
        console.error(`Kullanıcı hesabına erişirken hata oluştu: ${error.message}`);
        return res.status(500).json({ error: "Sunucu hatası" });
    }
}