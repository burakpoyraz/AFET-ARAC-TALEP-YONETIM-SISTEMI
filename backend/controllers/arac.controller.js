import Arac from "../models/arac.model.js";

export const aracEkle = async (req, res) => {
  const {
    plaka,
    aracTuru,
    kullanimAmaci,
    kapasite,
    musaitlikDurumu,
    aracDurumu,
    konum,
  } = req.body;

  try {
    const kurumFirmaId = req.kullanici.kurumFirmaId;

    console.log(kurumFirmaId);

    if (!plaka) {
      return res.status(400).json({ error: "Plaka bilgisi zorunludur" });
    }
    if (!aracTuru) {
      return res.status(400).json({ error: "Araç türü bilgisi zorunludur" });
    }
    if (!kapasite) {
      return res.status(400).json({ error: "Kapasite bilgisi zorunludur" });
    }

    let yeniKonum = null;

    if (konum) {
      const { lat, lng, adres } = konum;
      if (lat === undefined || lng === undefined || !adres) {
        return res.status(400).json({ error: "Konum bilgisi eksik" });
      }
      yeniKonum = { lat, lng, adres };
    }

    const aracVarMi = await Arac.findOne({ plaka });

    if (aracVarMi) {
      return res
        .status(400)
        .json({ error: "Bu plakaya sahip bir araç zaten var" });
    }

    let yeniArac;

    if (!kurumFirmaId) {
      yeniArac = new Arac({
        plaka,
        aracTuru,
        kullanimAmaci,
        kapasite,
        musaitlikDurumu,
        aracDurumu,
        konum: yeniKonum,
        kurumFirmaId: null,
        kullaniciId: req.kullanici._id,
      });
    } else {
      yeniArac = new Arac({
        plaka,
        aracTuru,
        kullanimAmaci,
        kapasite,
        musaitlikDurumu,
        aracDurumu,
        konum: yeniKonum,
        kurumFirmaId: kurumFirmaId,
        kullaniciId: null,
      });
    }

    await yeniArac.save();
    res.status(201).json({ yeniArac });
  } catch (error) {
    console.log(`Araç ekleme sırasında hata oluştu: ${error.message}`);
    res.status(500).json({ error: error.message });
  }
};

export const tumAraclariGetir = async (req, res) => {
  try {
    const araclar = await Arac.find({})
      .populate("kurumFirmaId", "kurumAdi")
      .populate("kullaniciId", "ad soyad");
    if (!araclar) {
      return res.status(404).json({ error: "Araç bulunamadı" });
    }
    res.status(200).json({ araclar });
  } catch (error) {
    console.log(`Araçları getirirken hata oluştu: ${error.message}`);
    res.status(500).json({ error: error.message });
  }
};

export const musaitAraclariGetir = async (req, res) => {
  try {
    const musaitAraclar = await Arac.find({
      musaitlikDurumu: true,
      aracDurumu: "aktif",
    })
      .populate("kurumFirmaId", "kurumAdi")
      .populate("kullaniciId", "ad soyad");
    if (!musaitAraclar) {
      return res.status(404).json({ error: "Araç bulunamadı" });
    }
    res.status(200).json({ musaitAraclar });
  } catch (error) {
    console.log(`Müsait araçları getirirken hata oluştu: ${error.message}`);
    res.status(500).json({ error: error.message });
  }
};

export const kullaniciyaKurumaAitAraclariGetir = async (req, res) => {
  const kullaniciId = req.kullanici._id;
  const kurumFirmaId = req.kullanici.kurumFirmaId;

  try {
    let araclar;
    if (kurumFirmaId) {
      araclar = await Arac.find({ kurumFirmaId })
        .populate("kurumFirmaId", "kurumAdi")
        .populate("kullaniciId", "ad soyad");
    } else {
      araclar = await Arac.find({ kullaniciId })
        .populate("kurumFirmaId", "kurumAdi")
        .populate("kullaniciId", "ad soyad");
    }

    if (!araclar) {
      return res.status(404).json({ error: "Araç bulunamadı" });
    }
    res.status(200).json({ araclar });
  } catch (error) {
    console.log(
      `Kullanıcıya / Kuruluşa ait araçları getirirken hata oluştu: ${error.message}`
    );
    res.status(500).json({ error: error.message });
  }
};

export const aracGetir = async (req, res) => {
  const { plaka } = req.params;
  try {
    const arac = await Arac.findOne({ plaka });
    if (!arac) {
      return res.status(404).json({ error: "Araç bulunamadı" });
    }
    res.status(200).json({ arac });
  } catch (error) {
    console.log(`Araç getirirken hata oluştu: ${error.message}`);
    res.status(500).json({ error: error.message });
  }
};

export const aracGuncelle = async (req, res) => {
  const { plaka } = req.params;
  const {
    yeniPlaka,
    aracTuru,
    kullanimAmaci,
    kapasite,
    musaitlikDurumu,
    aracDurumu,
    konum,
  } = req.body;
  try {
    const mevcutArac = await Arac.findOne({ plaka });
    if (!mevcutArac) {
      return res.status(404).json({ error: "Araç bulunamadı" });
    }

    if (yeniPlaka !== plaka) {
      const plakaVarMi = await Arac.findOne({
        plaka: yeniPlaka,
        _id: { $ne: mevcutArac._id },
      });
      if (plakaVarMi) {
        return res
          .status(400)
          .json({ error: "Bu plakaya sahip bir araç zaten var" });
      }
    }

    const guncellenecekArac = {
      plaka: yeniPlaka,
      aracTuru,
      kullanimAmaci,
      kapasite,
      musaitlikDurumu,
      aracDurumu,
    };

    if (konum) {
      const { lat, lng, adres } = konum;
      if (lat === undefined || lng === undefined || !adres) {
        return res.status(400).json({ error: "Konum bilgisi eksik" });
      }
      guncellenecekArac.konum = { lat, lng, adres };
    }

    const arac = await Arac.findOneAndUpdate({ plaka }, guncellenecekArac, {
      new: true,
      runValidators: true,
    });
    if (!arac) {
      return res.status(404).json({ error: "Araç bulunamadı" });
    }
    res.status(200).json({ arac });
  } catch (error) {
    console.log(`Araç güncellenirken hata oluştu: ${error.message}`);
    res.status(500).json({ error: error.message });
  }
};

export const aracSil = async (req, res) => {
  const { plaka } = req.params;
  try {
    const arac = await Arac.findOneAndDelete({ plaka });
    if (!arac) {
      return res.status(404).json({ error: "Araç bulunamadı" });
    }
    res.status(200).json({ arac });
  } catch (error) {
    console.log(`Araç silinirken hata oluştu: ${error.message}`);
    res.status(500).json({ error: error.message });
  }
};
