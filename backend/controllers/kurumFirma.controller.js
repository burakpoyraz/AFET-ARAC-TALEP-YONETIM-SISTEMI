import KurumFirma from "../models/kurumFirma.model.js";

export const kurumFirmaOlustur = async (req, res) => {
  const { kurumAdi, kurumTuru, telefon, email, adres } = req.body;

  try {
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

    const firmaVarMi = await KurumFirma.findOne({ kurumAdi });
    if (firmaVarMi) {
      return res
        .status(400)
        .json({ error: "Bu isimde bir kurum/firma zaten var" });
    }

    if (telefon) {
      const firmaVarMi = await KurumFirma.findOne({
        "iletisim.telefon": telefon,
      });
      if (firmaVarMi) {
        return res.status(400).json({
          error: "Bu telefon numarasına ait bir kurum/firma zaten var",
        });
      }
    }
    if (email) {
      const firmaVarMi = await KurumFirma.findOne({ "iletisim.email": email });
      if (firmaVarMi) {
        return res
          .status(400)
          .json({ error: "Bu email adresine ait bir kurum/firma zaten var" });
      }
    }

    const yeniFirma = new KurumFirma({
      kurumAdi,
      kurumTuru,
      iletisim: {
        telefon,
        email,
        adres,
      },
    });

    if(!yeniFirma) {
      return res.status(400).json({ error: "Kurum/Firma oluşturulamadı" });
    }
    await yeniFirma.save();
    res.status(201).json({ yeniFirma });
  } catch (error) {
    console.error(`Kurum/Firma kaydı yapılırken hata oluştu: ${error.message}`);
    return res.status(500).json({ error: "Sunucu hatası" });
  }
};

export const tumKurumFirmalariGetir = async (req, res) => {
  try {
    const tumFirmalar = await KurumFirma.find();

    if (!tumFirmalar) {
      return res.status(404).json({ error: "Kayıtlı kurum/firma bulunamadı" });
    }

    res.status(200).json(tumFirmalar);
  } catch (error) {
    console.error(
      `Tüm kurum/firmalar getirilirken hata oluştu: ${error.message}`
    );
    return res.status(500).json({ error: "Sunucu hatası" });
  }
};

export const kurumFirmaGetir = async (req, res) => {
  const { id } = req.params;

  try {
    const firma = await KurumFirma.findById(id);

    if (!firma) {
      return res.status(404).json({ error: "Kurum/firma bulunamadı" });
    }

    res.status(200).json(firma);
  } catch (error) {
    console.error(`Kurum/firma getirilirken hata oluştu: ${error.message}`);
    return res.status(500).json({ error: "Sunucu hatası" });
  }
};

export const kurumFirmaGuncelle = async (req, res) => {
  const { id } = req.params;
  const { kurumAdi, kurumTuru, telefon, email, adres } = req.body;

  try {
    const kurumFirmaVarMi = await KurumFirma.findOne({
      $and: [
        { _id: { $ne: id } }, // kendisi hariç
        {
          $or: [
            { kurumAdi },
            { "iletisim.telefon": telefon },
            { "iletisim.email": email },
          ],
        },
      ],
    });

    if (kurumFirmaVarMi) {
      if (kurumFirmaVarMi.kurumAdi === kurumAdi) {
        return res
          .status(400)
          .json({ error: "Bu isimde bir kurum/firma zaten var" });
      }
      if (kurumFirmaVarMi.iletisim.telefon === telefon) {
        return res
          .status(400)
          .json({
            error: "Bu telefon numarasına ait bir kurum/firma zaten var",
          });
      }
      if (kurumFirmaVarMi.iletisim.email === email) {
        return res
          .status(400)
          .json({ error: "Bu email adresine ait bir kurum/firma zaten var" });
      }
    }

    const kurumFirma = await KurumFirma.findByIdAndUpdate(
      id,
      { kurumAdi, kurumTuru, iletisim: { telefon, email, adres } },
      { new: true }
    );

    if (!kurumFirma) {
      return res.status(404).json({ error: "Kurum/firma bulunamadı" });
    }

    res.status(200).json(kurumFirma);
  } catch (error) {
    console.error(`Kurum/firma güncellenirken hata oluştu: ${error.message}`);
    return res.status(500).json({ error: "Sunucu hatası" });
  }
};

export const kurumFirmaSil = async (req, res) => {
  const { id } = req.params;

  try {
    const kurumFirma = await KurumFirma.findByIdAndDelete(id);

    if (!kurumFirma) {
      return res.status(404).json({ error: "Kurum/firma bulunamadı" });
    }

    res.status(200).json(kurumFirma);
  } catch (error) {
    console.error(`Kurum/firma silinirken hata oluştu: ${error.message}`);
    return res.status(500).json({ error: "Sunucu hatası" });
  }
};

export const kurumFirmaAra = async (req, res) => {
  const { arama } = req.query;

  try {
    const firmalar = await KurumFirma.find({
      kurumAdi: { $regex: `.*${arama}.*`, $options: "i" }, // Büyük-küçük harf duyarsız arama
    });

    if (firmalar.length === 0) {
      return res.status(404).json({ error: "Kurum/firma bulunamadı" });
    }

    res.status(200).json(firmalar);
  } catch (error) {
    res.status(500).json({ error: "Sunucu hatası" });
  }
};
