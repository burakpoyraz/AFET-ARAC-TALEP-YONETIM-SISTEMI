import Talep from "../models/talep.model.js";
import Kullanici from "../models/kullanici.model.js";
import { bildirimOlustur } from "../lib/utils/bildirimOlustur.js";
import { mailGonder } from "../lib/utils/email.js";

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

    // 1. Talep eden kullanıcıya bireysel bildirim gönder
    await bildirimOlustur({
      kullaniciId: talepEdenKullaniciId,
      kurumFirmaId: null,
      baslik: "Talebiniz Oluşturuldu",
      icerik: `“${talep.baslik}” başlıklı talebiniz başarıyla oluşturuldu.`,
      hedefUrl: `/talepler/${talep._id}`,
      tur: "talep",
      gizlilik: "bireysel",
    });
    // 2. Tüm koordinatörleri al ve kurum bazlı grupla
    const koordinatorler = await Kullanici.find({ rol: "koordinator" }).select(
      "_id kurumFirmaId"
    );

    const kurumSet = new Set();
    const kurumaBagliOlmayanKoordinatorler = [];

    for (const k of koordinatorler) {
      if (k.kurumFirmaId) {
        kurumSet.add(k.kurumFirmaId.toString());
      } else {
        kurumaBagliOlmayanKoordinatorler.push(k._id); // Kuruma bağlı olmayan koordinatör
      }
    }
    // 3. Her kuruma sadece bir bildirim gönder (kurumsal)
    for (const kurumId of kurumSet) {
      await bildirimOlustur({
        kullaniciId: null,
        kurumFirmaId: kurumId,
        baslik: `Yeni Talep : ${talep.baslik} Talebi`,
        icerik: `Açıklama: ${talep.aciklama}`,
        hedefUrl: `/talepler/${talep._id}`,
        tur: "talep",
        gizlilik: "kurumsal",
      });
    }
    // 4. Kuruma bağlı olmayan koordinatörlere bireysel bildirim gönder
    for (const kId of kurumaBagliOlmayanKoordinatorler) {
      await bildirimOlustur({
        kullaniciId: kId,
        kurumFirmaId: null,
        baslik: `Yeni Talep : ${talep.baslik} Talebi`,
        icerik: `Açıklama: ${talep.aciklama}`,
        hedefUrl: `/talepler/${talep._id}`,
        tur: "talep",
        gizlilik: "bireysel",
      });
    }

    const tumKoordinatorler = await Kullanici.find({
      rol: "koordinator",
    }).select("ad soyad email");

    for (const k of tumKoordinatorler) {
      if (k.email) {
        await mailGonder({
          to: k.email,
          subject: `Yeni Talep: ${talep.baslik}`,
          html: `<p>Sayın ${k.ad} ${k.soyad},</p>
             <p>Yeni bir talep oluşturuldu:</p>
             <p><strong>${talep.baslik}</strong></p>
             <p>Açıklama: ${talep.aciklama}</p>`,
        });
      }
    }

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
      // Görevlendirilen veya tamamlanan talepler iptal edilemez
      if (
        ["gorevlendirildi", "tamamlandı"].includes(talep.durum) &&
        durum === "iptal edildi"
      ) {
        return res.status(400).json({
          error:
            "Görev ataması yapılmış veya tamamlanmış talepler iptal edilemez",
        });
      }

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
