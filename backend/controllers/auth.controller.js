import { tokenVeCookieOlustur } from "../lib/utils/generateToken.js";
import Kullanici from "../models/kullanici.model.js";
import bcrypt from "bcryptjs";

export const kayitOl = async (req, res) => {
  try {
    const { ad,soyad, email, sifre, telefon, kurumFirmaAdi,kurumFirmaTuru } =
      req.body;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const telefonRegex = /^\d{10}$/;

    if (!emailRegex.test(email)) {
      return res
        .status(400)
        .json({ error: "Geçerli bir email adresi giriniz" });
    }
    if (!telefonRegex.test(telefon)) {
      return res
        .status(400)
        .json({ error: "Geçerli bir telefon numarası giriniz" });
    }
    if (sifre.length < 6) {
      return res
        .status(400)
        .json({ error: "Şifre en az 6 karakter olmalıdır" });
    }

    const kullaniciVarMi = await Kullanici.findOne({
      $or: [{ email }, { telefon }],
    });

    if (kullaniciVarMi) {
      return res.status(400).json({
        error: "Bu email veya telefon numarası ile kayıtlı bir kullanıcı var",
      });
    }

    const salt = await bcrypt.genSalt(10);
    const sifreHash = await bcrypt.hash(sifre, salt);


    const yeniKullanici = new Kullanici({
      ad,
      soyad,
      email,
      sifre: sifreHash,
      telefon,
      kullaniciBeyanBilgileri: {
        kurumFirmaAdi,
        kurumFirmaTuru,
      },
      
    });

    if (yeniKullanici){
        tokenVeCookieOlustur(yeniKullanici._id, res);
        await yeniKullanici.save();

        res.status(201).json({ yeniKullanici: {
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
         });
    }
    else {
        return res.status(400).json({error: "Kullanıcı oluşturulamadı"});
       
    }



  } catch (error) {
    console.error(`Kullanıcı kayıt olurken hata oluştu: ${error.message}`);
    return res.status(500).json({ error: "Sunucu hatası" });
  }
};

export const girisYap = async (req, res) => {
    try {
        const { email, sifre } = req.body;
    
        const kullanici = await Kullanici.findOne({ email });

        if (!kullanici) {
            return res.status(400).json({ error: "Bu email ile kayıtlı bir kullanıcı bulunamadı" });
        }
        const sifreKontrol = await bcrypt.compare(sifre, kullanici.sifre);

        if (!sifreKontrol) {
            return res.status(400).json({ error: "Şifre hatalı" });
        }
        tokenVeCookieOlustur(kullanici._id, res);

        res.status(200).json({ kullanici: {
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

    

    }
    catch (error) {
        console.error(`Kullanıcı giriş yaparken hata oluştu: ${error.message}`);
        return res.status(500).json({ error: "Sunucu hatası" });
    }
}
 

export const cikisYap = async (req, res) => {
    try{
        res.clearCookie("jwt");
        res.status(200).json({ message: "Çıkış başarılı" });
    }
    catch (error) {
        console.error(`Kullanıcı çıkış yaparken hata oluştu: ${error.message}`);
        return res.status(500).json({ error: "Sunucu hatası" });
    }

};


export const hesabim = async (req, res) => {
    try{
    
        const kullanici = req.kullanici;
       

        if (!kullanici) {
            return res.status(401).json({ error: "Kullanıcı bulunamadı" });
        }


        
        res.status(200).json({ kullanici: {
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
        } }
        );
    }
    catch (error) {
        console.error(`Kullanıcı hesabına erişirken hata oluştu: ${error.message}`);
        return res.status(500).json({ error: "Sunucu hatası" });
    }
}