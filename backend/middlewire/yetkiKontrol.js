import Talep from "../models/talep.model.js";

export const yetkiKontrol = (izinVerilenYetkiRolleri) => (req, res, next) => {
    try {
        const rol = req.kullanici.rol;

        if (!izinVerilenYetkiRolleri.includes(rol)) {
            return res.status(403).json({ error: "Rolünüz bu işlemi yapmaya yetkili değil" });
        }


    } catch (error) {
        console.error(`Yetki kontrolünde hata oluştu: ${error.message}`);
        return res.status(500).json({ error: "Sunucu hatası" });
    }

    next();
}

export const talepSahibiKontrol = async(req, res, next) => {
    try {
        const { id } = req.params;
        const kullanici = req.kullanici;

        // Koordinatörler tüm talepleri düzenleyebilir
        if (kullanici.rol === "koordinator") {
            return next();
        }

        // Talep sahibi kontrolü
        const talep = await Talep.findOne({ _id: id, isDeleted: false });
        if (!talep) {
            return res.status(404).json({ error: "Talep bulunamadı" });
        }

        // Kullanıcı talep sahibi mi?
        if (talep.talepEdenKullaniciId.toString() !== kullanici._id.toString()) {
            return res.status(403).json({ error: "Bu talebi düzenleme yetkiniz yok" });
        }

        next();
    } catch (error) {
        console.error("Talep sahibi kontrolü sırasında hata:", error);
        res.status(500).json({ error: "Sunucu hatası" });
    }
};