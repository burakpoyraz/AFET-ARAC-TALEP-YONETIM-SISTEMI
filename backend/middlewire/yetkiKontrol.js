

export const yetkiKontrol = (izinVerilenYetkiRolleri) => (req, res, next) => {
    try{
        const rol = req.kullanici.rol;

        if(!izinVerilenYetkiRolleri.includes(rol)){
            return res.status(403).json({error:"Rolünüz bu işlemi yapmaya yetkili değil"});
        }

       
    }
    catch(error){
        console.error(`Yetki kontrolünde hata oluştu: ${error.message}`);
        return res.status(500).json({error:"Sunucu hatası"});
    }

    next();
}

