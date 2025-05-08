import Arac from "../models/arac.model.js";
import Talep from "../models/talep.model.js";
import Gorev from "../models/gorev.model.js";
import axios from "axios";

export const gorevOlustur = async (req, res) => {
  try {
    const koordinatorId = req.kullanici._id;
    const { talepId, aracId, sofor, gorevNotu, gorevDurumu } = req.body;

    if (!talepId || !aracId || !sofor?.ad || !sofor?.soyad || !sofor?.telefon) {
      return res.status(400).json({ message: "Eksik bilgi gönderildi" });
    }

    const talep = await Talep.findById(talepId);
    if (!talep || talep.durum !== "beklemede") {
      return res
        .status(404)
        .json({ message: "Talep bulunamadı veya uygun değil" });
    }

    const arac = await Arac.findOne({
      _id: aracId,
      musaitlikDurumu: true,
      aracDurumu: "aktif",
    });

    if (!arac) {
      return res
        .status(404)
        .json({ message: "Araç uygun değil veya bulunamadı" });
    }

    const yeniGorev = new Gorev({
      talepId,
      aracId,
      sofor,
      koordinatorId,
      gorevDurumu: gorevDurumu || "beklemede",
      gorevNotu,
      hedefKonumu: {
        lat: talep.lokasyon.lat,
        lng: talep.lokasyon.lng,
      },
    });

    await yeniGorev.save();

    // Talep durumu "görevlendirildi" olarak güncelleniyor
    talep.durum = "gorevlendirildi";
    await talep.save();

    return res.status(201).json({
      message: "Görev başarıyla oluşturuldu",
      gorev: yeniGorev,
    });
  } catch (error) {
    console.error("Görev oluşturulurken hata:", error);
    return res
      .status(500)
      .json({ message: "Sunucu hatası", error: error.message });
  }
};

export const gorevDetayGetir = async (req, res) => {
  try {
    const { id } = req.params;
    const gorev = await Gorev.findById(id)
      .populate({
        path: "talepId",
        populate: {
          path: "talepEdenKurumFirmaId",
          select: "kurumAdi iletisim.telefon iletisim.adres",
        },
      })
      .populate("koordinatorId", "ad soyad telefon")
      .populate("gorevlendirilenAraclar.aracId", "plaka aracTuru marka model");

    if (!gorev) {
      return res.status(404).json({ message: "Görev bulunamadı" });
    }

    res.status(200).json(gorev);
  } catch (error) {
    console.log("Görev detayını getirirken hata:", error.message);
    return res.status(500).json({ error: error.message });
  }
};

export const tumGorevleriGetir = async (req, res) => {
  try {
    const gorevler = await Gorev.find()
      .populate({
        path: "talepId",
        select:
          "baslik aracTuru aracSayisi lokasyon durum talepEdenKurumFirmaId",
        populate: {
          path: "talepEdenKurumFirmaId",
          select: "kurumAdi iletisim.telefon iletisim.adres",
        },
      })
      .populate("koordinatorId", "ad soyad telefon")
      .populate("aracId"); // ✅ Doğru olan bu

    if (!gorevler || gorevler.length === 0) {
      return res.status(404).json({ message: "Görev bulunamadı" });
    }

    res.status(200).json(gorevler);
  } catch (error) {
    console.log("Görevleri getirirken hata:", error.message);
    return res.status(500).json({ error: error.message });
  }
};

export const gorevDurumGuncelle = async (req, res) => {
  try {
    const { id } = req.params;
    const { gorevDurumu } = req.body;

    const mevcutGorev = await Gorev.findById(id);
    if (!mevcutGorev) {
      return res.status(404).json({ message: "Görev bulunamadı" });
    }

    if (
      mevcutGorev.gorevDurumu === "tamamlandı" &&
      gorevDurumu !== "tamamlandı"
    ) {
      return res.status(400).json({
        message: "Tamamlanmış bir görev başka bir duruma geçirilemez.",
      });
    }

    const guncellenmisGorev = await Gorev.findByIdAndUpdate(
      id,
      {
        gorevDurumu,
        ...(gorevDurumu === "başladı" && { baslangicZamani: new Date() }),
        ...(gorevDurumu === "tamamlandı" && { bitisZamani: new Date() }),
      },
      { new: true }
    );

    res.status(200).json({
      message: "Görev durumu başarıyla güncellendi",
      gorev: guncellenmisGorev,
    });
  } catch (error) {
    console.log("Görev durumu güncellenirken hata:", error.message);
    return res.status(500).json({ error: error.message });
  }
};

export const tahminiSureleriGetir = async (req, res) => {
  try {
    const { aracKonumlari, hedefKonum } = req.body;

    if (!Array.isArray(aracKonumlari) || !hedefKonum) {
      return res.status(400).json({ message: "Geçersiz giriş verisi" });
    }

    const originsParam = aracKonumlari
      .map((k) => `${k.lat},${k.lng}`)
      .join("|");
    const destination = `${hedefKonum.lat},${hedefKonum.lng}`;
    const apiKey = process.env.GOOGLE_MAPS_API_KEY;


    const url = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${originsParam}&destinations=${destination}&key=${apiKey}&language=tr`;

    const response = await axios.get(url);

    const bilgiler = response.data.rows.map((row, i) => ({
      aracIndex: i,
      sureText: row.elements[0].duration?.text || "-",
      sureValue: row.elements[0].duration?.value || null, // saniye cinsinden
      mesafeText: row.elements[0].distance?.text || "-",
    }));

    console.log("API Responsed:", response.data);

    return res.status(200).json(bilgiler);
  } catch (error) {
    console.error("Tahmini süre hatası:", error.message);
    res.status(500).json({ error: "Süre bilgisi alınamadı" });
  }
};

export const aracSahibiGorevleriGetir = async (req, res) => {
  try {
    const araclar = await Arac.find({
      $or: [
        { kullaniciId: req.kullanici._id },
        { kurumFirmaId: req.kullanici.kurumFirmaId },
      ],
    }).select("_id");

    const aracIdListesi = araclar.map((a) => a._id);

    const gorevler = await Gorev.find({
      aracId: { $in: aracIdListesi },
    })
      .populate({
        path: "talepId",
        select:
          "baslik aracTuru aracSayisi lokasyon durum talepEdenKurumFirmaId",
        populate: {
          path: "talepEdenKurumFirmaId",
          select: "kurumAdi iletisim.telefon iletisim.adres",
        },
      })
      .populate("koordinatorId", "ad soyad telefon")
      .populate("aracId");

    if (!gorevler || gorevler.length === 0) {
      return res.status(404).json({ message: "Görev bulunamadı" });
    }

    res.status(200).json(gorevler);
  } catch (error) {
    console.error("Görevleri getirirken hata:", error.message);
    return res.status(500).json({ error: error.message });
  }
};

export const talepEdenGorevleriGetir = async (req, res) => {
  try {
    const talepEdenKurumId = req.kullanici.kurumFirmaId;

    console.log(talepEdenKurumId, "talep eden kurum idsi");

    if (!talepEdenKurumId) {
      return res.status(400).json({ message: "Kullanıcının kurumu tanımsız." });
    }

    // kuruma ait talepleri al
    const talepler = await Talep.find({
      talepEdenKurumFirmaId: talepEdenKurumId,
    }).select("_id");
    const talepIdListesi = talepler.map((t) => t._id);

    if (talepIdListesi.length === 0) {
      return res.status(404).json({ message: "Kuruma ait talep bulunamadı." });
    }

    // talepId'ye göre görevleri al
    const gorevler = await Gorev.find({ talepId: { $in: talepIdListesi } })
      .populate({
        path: "talepId",
        select:
          "baslik aracTuru aracSayisi lokasyon durum talepEdenKurumFirmaId",
        populate: {
          path: "talepEdenKurumFirmaId",
          select: "kurumAdi iletisim.telefon iletisim.adres",
        },
      })
      .populate("koordinatorId", "ad soyad telefon")
      .populate("aracId");

    if (!gorevler || gorevler.length === 0) {
      return res.status(404).json({ message: "Görev bulunamadı." });
    }

    res.status(200).json(gorevler);
  } catch (error) {
    console.error("Talep eden görevlerini getirirken hata:", error.message);
    return res.status(500).json({ error: error.message });
  }
};
