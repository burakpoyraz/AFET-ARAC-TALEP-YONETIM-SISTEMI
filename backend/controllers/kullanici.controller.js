import Kullanici from "../models/kullanici.model.js";


export const kullanicilariGetir = async (req, res) => {
    try {
        const kullanicilar = await Kullanici.find().select("-sifre");
       

        if (!kullanicilar) {
            return res.status(404).json({ error: "Kullanıcı bulunamadı" });
        }

        res.status(200).json(kullanicilar);
    }
    catch (error) {
        console.error(`Kullanıcılar getirilirken hata oluştu: ${error.message}`);
        return res.status(500).json({ error: "Sunucu hatası" });
    }
}

export const kullaniciGetir = async (req, res) => {
    const { id } = req.params;
    try {
        const kullanici = await Kullanici.findById(id).select("-sifre");

        if (!kullanici) {
            return res.status(404).json({ error: "Kullanıcı bulunamadı" });
        }

        res.status(200).json(kullanici);
    }
    catch (error) {
        console.error(`Kullanıcı getirilirken hata oluştu: ${error.message}`);
        return res.status(500).json({ error: "Sunucu hatası" });
    }
}

export const kullaniciGuncelle = async (req, res) => {
    const { id } = req.params;
    const { ad,soyad, email,telefon,kurumFirmaId } = req.body;

    try {

        const kullaniciVarMi = await Kullanici.findOne({
            $and: [
              { _id: { $ne: id } }, // kendisi hariç
              { $or: [{ email }, { telefon }] } // email veya telefon eşleşiyor mu
            ]
          });

            if (kullaniciVarMi) {
                return res.status(400).json({ error: "Bu email veya telefon numarası başka bir kullanıcıya ait" });
            }


        const kullanici = await Kullanici.findByIdAndUpdate(id, { ad,soyad, email,telefon,kurumFirmaId}, { new: true }).select("-sifre");

        if (!kullanici) {
            return res.status(404).json({ error: "Kullanıcı bulunamadı" });
        }

        res.status(200).json(kullanici);
    }
    catch (error) {
        console.error(`Kullanıcı güncellenirken hata oluştu: ${error.message}`);
        return res.status(500).json({ error: "Sunucu hatası" });
    }
}

export const kullaniciSil = async (req, res) => {
    const { id } = req.params;

    try {
        const kullanici = await Kullanici.findByIdAndDelete(id);

        if (!kullanici) {
            return res.status(404).json({ error: "Kullanıcı bulunamadı" });
        }

        res.status(200).json(kullanici);
    }
    catch (error) {
        console.error(`Kullanıcı silinirken hata oluştu: ${error.message}`);
        return res.status(500).json({ error: "Sunucu hatası" });
    }
}

export const kullaniciRolveKurumFirmaAta = async (req, res) => {
    const { id } = req.params;
    const { rol,kurumFirmaId } = req.body;  // rol ve kurumFirmaId alınır
    const rolAtamaTarihi = new Date();
    const rolAtayanKoordinatorId = req.kullanici._id;

    try {
        const kullanici = await Kullanici.findByIdAndUpdate(id, { rol,kurumFirmaId,rolAtamaTarihi,rolAtayanKoordinatorId }, { new: true ,runValidators:true}).populate("kurumFirmaId","kurumAdi");

        if (!kullanici) {
            return res.status(404).json({ error: "Kullanıcı bulunamadı" });
        }

        res.status(200).json(kullanici);
    }
    catch (error) {
        console.error(`Kullanıcı rolü atanırken hata oluştu: ${error.message}`);
        return res.status(500).json({ error: "Sunucu hatası" });
    }
}
