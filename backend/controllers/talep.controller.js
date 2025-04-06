import Talep from "../models/talep.model.js";

export const talepEkle = async (req, res) => {
  const { baslik, aciklama, aracTuru, aracSayisi, lokasyon, durum } = req.body;

  try {
    const talepEdenKullaniciId = req.kullanici._id;
    const talepEdenKurumFirmaId = req.kullanici.kurumFirmaId;

    if (!baslik) {
      return res.status(400).json({ error: "Başlık bilgisi zorunludur" });
    }
    if (!aciklama) {
      return res.status(400).json({ error: "Açıklama bilgisi zorunludur" });
    }
    if (!aracTuru) {
      return res.status(400).json({ error: "Araç türü bilgisi zorunludur" });
    }
    if (!aracSayisi) {
      return res.status(400).json({ error: "Araç sayısı bilgisi zorunludur" });
    }
    if (!lokasyon) {
      return res.status(400).json({ error: "Lokasyon bilgisi zorunludur" });
    }

    const { adres, lat, lng } = lokasyon;
    if (!adres) {
      return res.status(400).json({ error: "Adres bilgisi zorunludur" });
    }
    if (!lat) {
      return res.status(400).json({ error: "Enlem bilgisi zorunludur" });
    }
    if (!lng) {
      return res.status(400).json({ error: "Boylam bilgisi zorunludur" });
    }
    const talep = new Talep({
      baslik,
      aciklama,
      talepEdenKullaniciId,
      talepEdenKurumFirmaId,
      aracTuru,
      aracSayisi,
      lokasyon: {
        adres,
        lat,
        lng,
      },
      durum: durum || "beklemede",
    });

    if (!talep) {
      return res.status(400).json({ error: "Talep oluşturulamadı" });
    }
    await talep.save();
    res.status(201).json({ talep });
  } catch (error) {
    res.status(500).json({ error: "Sunucu hatası" });
  }
};

export const tumTalepleriGetir = async (req, res) => {
  try {
    const talepler = await Talep.find()
      .populate("talepEdenKullaniciId", "ad soyad telefon")
      .populate("talepEdenKurumFirmaId", "kurumAdi iletisim.telefon");

    if (!talepler) {
      return res.status(404).json({ error: "Kayıtlı talep bulunamadı" });
    }

    res.status(200).json(talepler);
  } catch (error) {
    return res.status(500).json({ error: "Sunucu hatası" });
  }
};

export const kurumaAitTalepleriGetir = async (req, res) => {
  const kurumFirmaId = req.kullanici.kurumFirmaId;

  try {
    const talepler = await Talep.find({
      talepEdenKurumFirmaId: kurumFirmaId,
    }).populate("talepEdenKullaniciId", "ad soyad");

    if (!talepler) {
      return res.status(404).json({ error: "Kayıtlı talep bulunamadı" });
    }

    res.status(200).json(talepler);
  } catch (error) {
    return res.status(500).json({ error: "Sunucu hatası" });
  }
};

export const talepGetir = async (req, res) => {
  const { id } = req.params;

  try {
    const talep = await Talep.findById(id)
      .populate("talepEdenKullaniciId", "ad soyad")
      .populate(
        "talepEdenKurumFirmaId",
        "kurumAdi iletisim.telefon iletisim.email"
      );

    if (!talep) {
      return res.status(404).json({ error: "Talep bulunamadı" });
    }

    res.status(200).json(talep);
  } catch (error) {
    return res.status(500).json({ error: "Sunucu hatası" });
  }
};

export const talepGuncelle = async (req, res) => {
  const { id } = req.params;
  const { baslik, aciklama, aracTuru, aracSayisi, lokasyon, durum } = req.body;

  try {
    const talep = await Talep.findById(id);

    if (!talep) {
      return res.status(404).json({ error: "Talep bulunamadı" });
    }

    if (baslik) {
      talep.baslik = baslik;
    }
    if (aciklama) {
      talep.aciklama = aciklama;
    }
    if (aracTuru) {
      talep.aracTuru = aracTuru;
    }
    if (aracSayisi) {
      talep.aracSayisi = aracSayisi;
    }
    if (lokasyon) {
      const { adres, lat, lng } = lokasyon;

      if (!adres || lng === undefined || lat === undefined) {
        return res.status(400).json({ error: "Lokasyon bilgileri eksik" });
      }
      talep.lokasyon = {
        adres,
        lat,
        lng,
      };
    }

    if (durum) {
      talep.durum = durum;
    }

    await talep.save();

    res.status(200).json({ talep });
  } catch (error) {
    return res.status(500).json({ error: "Sunucu hatası" });
  }
};

export const talepSil = async (req, res) => {
  const { id } = req.params;

  try {
    const talep = await Talep.findByIdAndDelete(id);

    if (!talep) {
      return res.status(404).json({ error: "Talep bulunamadı" });
    }

    res.status(200).json({ talep });
  } catch (error) {
    return res.status(500).json({ error: "Sunucu hatası" });
  }
};
