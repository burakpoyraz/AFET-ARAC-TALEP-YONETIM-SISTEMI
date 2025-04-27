import Arac from "../models/arac.model.js";
import Talep from "../models/talep.model.js";
import Gorev from "../models/gorev.model.js";
import { populate } from "dotenv";

export const gorevOlustur = async (req, res) => {
  try {
    const koordinatorId = req.kullanici._id;
    const {
      talepId,
      gorevlendirilenAraclar,
      gorevDurumu,
      gorevNotu,
      baslangicZamani,
      bitisZamani,
    } = req.body;


    for (let arac of gorevlendirilenAraclar) {

      if (!arac.sofor|| !arac.sofor.ad || !arac.sofor.soyad || !arac.sofor.telefon) {
        return res.status(400).json({ message: "Sofor bilgileri eksik" });
      }
    
      if (!arac.aracId) {
        return res.status(400).json({ message: "Araç ID eksik" });
      }
    }

    const talep = await Talep.findById(talepId);
    if (!talep || talep.durum !== "beklemede") {
      return res
        .status(404)
        .json({ message: "Talep bulunamadı veya talep durumu uygun değil" });
    }

 
    const secilenAracIdler= gorevlendirilenAraclar.map((arac) => arac.aracId);
    const bulunanAraclar = await Arac.find({
      _id: { $in: secilenAracIdler },
      musaitlikDurumu:true,
      aracDurumu: "aktif",
    });

    if (bulunanAraclar.length !== secilenAracIdler.length) {
      return res.status(404).json({ message: "Bazı araçlar uygun değil veya bulunamadı" });
    }

    const yeniGorev = new Gorev({
      talepId,
      gorevlendirilenAraclar,
      koordinatorId,
      gorevDurumu: gorevDurumu || "beklemede",
      gorevNotu,
      baslangicZamani,
      bitisZamani,
      hedefKonumu: {
        lat: talep.lokasyon.lat,
        lng: talep.lokasyon.lng,
      },
    });

    if (!yeniGorev) {
      return res.status(400).json({ message: "Görev oluşturulamadı" });
    }
    await yeniGorev.save();

    // talep durumunu güncelle
    talep.durum = "gorevlendirildi";
    await talep.save();


    return res.status(201).json({
      message: "Görev başarıyla oluşturuldu",
      gorev: yeniGorev,
    });

  } catch (error) {
    console.log("Gorev oluşturulurken hata:", error.message);
    return res.status(500).json({ error: error.message });
  }
};


export const tumGorevleriGetir = async (req, res) => {
  try {
    const gorevler = await Gorev.find()
      .populate({
        path: "talepId",
        select: "baslik aracTuru aracSayisi lokasyon durum talepEdenKurumFirmaId",
        populate:{
          path: "talepEdenKurumFirmaId",
          select: "kurumAdi iletisim.telefon iletisim.adres",
        }
      })
      .populate("koordinatorId", "ad soyad telefon")
      .populate("gorevlendirilenAraclar.aracId", "plaka aracTuru marka model");

    if (!gorevler) {
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

    const guncellenenGorev = await Gorev.findById(id);
    if (!guncellenenGorev) {
      return res.status(404).json({ message: "Görev bulunamadı" });
    }
    guncellenenGorev.gorevDurumu = gorevDurumu;
    await guncellenenGorev.save();

    res.status(200).json({
      message: "Görev durumu başarıyla güncellendi",
      gorev: guncellenenGorev,
    });
  }
  catch (error) {
    console.log("Görev durumu güncellenirken hata:", error.message);
    return res.status(500).json({ error: error.message });
  }
};
