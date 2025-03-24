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
    sofor,
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
      const { lat, lng } = konum;
      if (lat === undefined || lng === undefined) {
        return res.status(400).json({ error: "Konum bilgisi eksik" });
      }
      yeniKonum = { lat, lng };
    }

    let yeniSofor = null;

    if (sofor) {
      const { ad, soyad, telefon } = sofor;
      if (!ad) {
        return res.status(400).json({ error: "Şoför adı zorunludur" });
      }
      if (!soyad) {
        return res.status(400).json({ error: "Şoför soyadı zorunludur" });
      }
      if (!telefon) {
        return res
          .status(400)
          .json({ error: "Şoför telefon numarası zorunludur" });
      }
      yeniSofor = { ad, soyad, telefon };
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
        sofor: yeniSofor,
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
        sofor: yeniSofor,
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

export const araclariGetir = async (req, res) => {
  try {
    const araclar = await Arac.find({});
    if (!araclar) {
      return res.status(404).json({ error: "Araç bulunamadı" });
    }
    res.status(200).json({ araclar });
  } catch (error) {
    console.log(`Araçları getirirken hata oluştu: ${error.message}`);
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
    sofor,
  } = req.body;
  try {
    const guncellenecekArac = {
      plaka: yeniPlaka,
      aracTuru,
      kullanimAmaci,
      kapasite,
      musaitlikDurumu,
      aracDurumu,
    };



    const aracVarMi =await Arac.findOne
    ({ plaka: yeniPlaka });
    if (aracVarMi) {
      return res.status(400).json({ error: "Bu plakaya sahip bir araç zaten var" });
    }

    if (konum) {
      const { lat, lng } = konum;
      if (lat === undefined || lng === undefined) {
        return res.status(400).json({ error: "Konum bilgisi eksik" });
      }
      guncellenecekArac.konum = { lat, lng };
    }

    if (sofor) {
      const { ad, soyad, telefon } = sofor;
      if (!ad) {
        return res.status(400).json({ error: "Şoför adı zorunludur" });
      }
      if (!soyad) {
        return res.status(400).json({ error: "Şoför soyadı zorunludur" });
      }
      if (!telefon) {
        return res
          .status(400)
          .json({ error: "Şoför telefon numarası zorunludur" });
      }
      guncellenecekArac.sofor = { ad, soyad, telefon };
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
  }
  catch (error) {
    console.log(`Araç silinirken hata oluştu: ${error.message}`);
    res.status(500).json({ error: error.message });
  }
}
