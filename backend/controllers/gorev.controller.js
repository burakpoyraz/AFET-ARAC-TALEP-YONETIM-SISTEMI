import Arac from "../models/arac.model.js";
import Talep from "../models/talep.model.js";
import Gorev from "../models/gorev.model.js";
import axios from "axios";
import { bildirimOlustur } from "../lib/utils/bildirimOlustur.js";
import { bildirimGonder } from "../lib/utils/bildirimGonder.js";
import Kullanici from "../models/kullanici.model.js";
import KurumFirma from "../models/kurumFirma.model.js";
import { gorevPdfOlustur } from "../lib/utils/pdfOlustur.js";
import { excelOlustur } from "../lib/utils/excelOlustur.js";

const koordinatorMailHtmlOlustur = (koordinator, talep, arac, sofor) => `
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
    <h2 style="color: #2c3e50;">Görev Oluşturuldu</h2>
    <p>Sayın ${koordinator.ad} ${koordinator.soyad},</p>
    
    <div style="background-color: #f8f9fa; padding: 15px; border-radius: 5px; margin: 15px 0;">
        <h3 style="color: #2c3e50; margin-top: 0;">Talep Bilgileri</h3>
        <p><strong>Başlık:</strong> ${talep.baslik}</p>
        <p><strong>Açıklama:</strong> ${talep.aciklama}</p>
        <p><strong>Konum:</strong> ${talep.lokasyon.adres}</p>
        <p><a href="https://www.google.com/maps?q=${talep.lokasyon.lat},${talep.lokasyon.lng}"
              style="background-color: #4CAF50; color: white; padding: 10px 15px; text-decoration: none; border-radius: 5px; display: inline-block;">
            Google Haritada Görüntüle
        </a></p>
    </div>

    <div style="background-color: #f8f9fa; padding: 15px; border-radius: 5px; margin: 15px 0;">
        <h3 style="color: #2c3e50; margin-top: 0;">Araç Bilgileri</h3>
        <p><strong>Araç Türü:</strong> ${arac.aracTuru}</p>
        <p><strong>Plaka:</strong> ${arac.plaka}</p>
        <p><strong>Şoför:</strong> ${sofor.ad} ${sofor.soyad}</p>
        <p><strong>Şoför Telefon:</strong> ${sofor.telefon}</p>
    </div>
</div>`;

const talepEdenMailHtmlOlustur = (talepEden, talep, arac, sofor, koordinator) => `
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
    <h2 style="color: #2c3e50;">Talebinize Araç Atandı</h2>
    <p>Sayın ${talepEden.ad} ${talepEden.soyad},</p>
    
    <div style="background-color: #f8f9fa; padding: 15px; border-radius: 5px; margin: 15px 0;">
        <h3 style="color: #2c3e50; margin-top: 0;">Talep Bilgileri</h3>
        <p><strong>Başlık:</strong> ${talep.baslik}</p>
        <p><strong>Açıklama:</strong> ${talep.aciklama}</p>
        <p><strong>Konum:</strong> ${talep.lokasyon.adres}</p>
        <p><a href="https://www.google.com/maps?q=${talep.lokasyon.lat},${talep.lokasyon.lng}" 
              style="background-color: #4CAF50; color: white; padding: 10px 15px; text-decoration: none; border-radius: 5px; display: inline-block;">
            Google Haritada Görüntüle
        </a></p>
    </div>

    <div style="background-color: #f8f9fa; padding: 15px; border-radius: 5px; margin: 15px 0;">
        <h3 style="color: #2c3e50; margin-top: 0;">Görevlendirilen Araç Bilgileri</h3>
        <p><strong>Araç Türü:</strong> ${arac.aracTuru}</p>
        <p><strong>Plaka:</strong> ${arac.plaka}</p>
        <p><strong>Şoför:</strong> ${sofor.ad} ${sofor.soyad}</p>
        <p><strong>Şoför Telefon:</strong> ${sofor.telefon}</p>
    </div>

    <div style="background-color: #f8f9fa; padding: 15px; border-radius: 5px; margin: 15px 0;">
        <h3 style="color: #2c3e50; margin-top: 0;">Koordinatör Bilgileri</h3>
        <p><strong>Ad Soyad:</strong> ${koordinator.ad} ${koordinator.soyad}</p>
        <p><strong>Telefon:</strong> ${koordinator.telefon}</p>
        <p><strong>E-posta:</strong> ${koordinator.email}</p>
    </div>
</div>`;

const aracSahibiMailHtmlOlustur = (aracSahibi, talep, arac, sofor, koordinator) => `
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
    <h2 style="color: #2c3e50;">Aracınız Görevlendirildi</h2>
    <p>Sayın ${aracSahibi.ad} ${aracSahibi.soyad},</p>
    
    <div style="background-color: #f8f9fa; padding: 15px; border-radius: 5px; margin: 15px 0;">
        <h3 style="color: #2c3e50; margin-top: 0;">Talep Bilgileri</h3>
        <p><strong>Başlık:</strong> ${talep.baslik}</p>
        <p><strong>Açıklama:</strong> ${talep.aciklama}</p>
        <p><strong>Konum:</strong> ${talep.lokasyon.adres}</p>
        <p><a href="https://www.google.com/maps?q=${talep.lokasyon.lat},${talep.lokasyon.lng}" 
              style="background-color: #4CAF50; color: white; padding: 10px 15px; text-decoration: none; border-radius: 5px; display: inline-block;">
            Google Haritada Görüntüle
        </a></p>
    </div>

    <div style="background-color: #f8f9fa; padding: 15px; border-radius: 5px; margin: 15px 0;">
        <h3 style="color: #2c3e50; margin-top: 0;">Görev Bilgileri</h3>
        <p><strong>Araç Plakası:</strong> ${arac.plaka}</p>
        <p><strong>Şoför:</strong> ${sofor.ad} ${sofor.soyad}</p>
        <p><strong>Şoför Telefon:</strong> ${sofor.telefon}</p>
    </div>

    <div style="background-color: #f8f9fa; padding: 15px; border-radius: 5px; margin: 15px 0;">
        <h3 style="color: #2c3e50; margin-top: 0;">Koordinatör Bilgileri</h3>
        <p><strong>Ad Soyad:</strong> ${koordinator.ad} ${koordinator.soyad}</p>
        <p><strong>Telefon:</strong> ${koordinator.telefon}</p>
        <p><strong>E-posta:</strong> ${koordinator.email}</p>
    </div>
</div>`;

const kurumMailHtmlOlustur = (kurum, talep, arac, sofor, koordinator) => `
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
    <h2 style="color: #2c3e50;">Kuruluşunuza Ait Araç Görevlendirildi</h2>
    <p>Sayın ${kurum.kurumAdi} Yetkilisi,</p>
    
    <div style="background-color: #f8f9fa; padding: 15px; border-radius: 5px; margin: 15px 0;">
        <h3 style="color: #2c3e50; margin-top: 0;">Talep Bilgileri</h3>
        <p><strong>Başlık:</strong> ${talep.baslik}</p>
        <p><strong>Açıklama:</strong> ${talep.aciklama}</p>
        <p><strong>Konum:</strong> ${talep.lokasyon.adres}</p>
        <p><a href="https://www.google.com/maps?q=${talep.lokasyon.lat},${talep.lokasyon.lng}" 
              style="background-color: #4CAF50; color: white; padding: 10px 15px; text-decoration: none; border-radius: 5px; display: inline-block;">
            Google Haritada Görüntüle
        </a></p>
    </div>

    <div style="background-color: #f8f9fa; padding: 15px; border-radius: 5px; margin: 15px 0;">
        <h3 style="color: #2c3e50; margin-top: 0;">Görev Bilgileri</h3>
        <p><strong>Araç Plakası:</strong> ${arac.plaka}</p>
        <p><strong>Araç Türü:</strong> ${arac.aracTuru}</p>
        <p><strong>Şoför:</strong> ${sofor.ad} ${sofor.soyad}</p>
        <p><strong>Şoför Telefon:</strong> ${sofor.telefon}</p>
    </div>

    <div style="background-color: #f8f9fa; padding: 15px; border-radius: 5px; margin: 15px 0;">
        <h3 style="color: #2c3e50; margin-top: 0;">Koordinatör Bilgileri</h3>
        <p><strong>Ad Soyad:</strong> ${koordinator.ad} ${koordinator.soyad}</p>
        <p><strong>Telefon:</strong> ${koordinator.telefon}</p>
        <p><strong>E-posta:</strong> ${koordinator.email}</p>
    </div>
</div>`;

export const gorevOlustur = async(req, res) => {
    try {
        const koordinatorId = req.kullanici._id;
        const { talepId, aracId, sofor, gorevNotu, gorevDurumu } = req.body;

        if (!talepId || !aracId || !sofor || !sofor.ad || !sofor.soyad || !sofor.telefon) {
            return res.status(400).json({ message: "Eksik bilgi gönderildi" });
        }

        const talep = await Talep.findOne({ _id: talepId, isDeleted: false });

        if (!talep) {
            return res.status(404).json({ message: "Talep bulunamadı" });
        }

        const arac = await Arac.findOne({
            _id: aracId,
            musaitlikDurumu: true,
            aracDurumu: "aktif",
            isDeleted: false,
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

        // Aracın müsaitlik durumu güncellenir
        arac.musaitlikDurumu = false;
        await arac.save();

        const koordinator = await Kullanici.findOne({ _id: koordinatorId, isDeleted: false });

        //  1. Koordinatöre bildirim
        await bildirimOlustur({
            kullaniciId: koordinatorId,
            baslik: "Görev Oluşturuldu",
            icerik: `"${talep.baslik}" talebine ait görev başarıyla oluşturuldu.`,
            hedefUrl: `/gorevler/${yeniGorev._id}`,
            tur: "gorev",
            gizlilik: "bireysel",
        });

        // Koordinatöre bildirim
        if (koordinator && koordinator.email) {
            const bildirimSonuc = await bildirimGonder({
                email: koordinator.email,
                telefon: koordinator.telefon,
                subject: "Görev Oluşturuldu",
                html: koordinatorMailHtmlOlustur(koordinator, talep, arac, sofor),
                baslik: "Görev Oluşturuldu",
                mesaj: `${talep.baslik} talebine ait görev oluşturuldu.\nAraç: ${arac.plaka}\nŞoför: ${sofor.ad} ${sofor.soyad}`,
                konum: talep.lokasyon
            });

            if (!bildirimSonuc.success && bildirimSonuc.error) {
                console.warn(`Koordinatör bildirimi kısmen başarısız: ${bildirimSonuc.error}`);
            }
        }

        const talepEden = await Kullanici.findOne({ _id: talep.talepEdenKullaniciId, isDeleted: false });
        if (talepEden && talepEden.email) {
            const bildirimSonuc = await bildirimGonder({
                email: talepEden.email,
                telefon: talepEden.telefon,
                subject: "Talebinize Araç Atandı",
                html: talepEdenMailHtmlOlustur(talepEden, talep, arac, sofor, koordinator),
                baslik: "Talebinize Araç Atandı",
                mesaj: `${talep.baslik} talebinize araç atandı.\nAraç: ${arac.plaka}\nŞoför: ${sofor.ad} ${sofor.soyad}\nKoordinatör: ${koordinator.ad} ${koordinator.soyad} (${koordinator.telefon})`,
                konum: talep.lokasyon
            });

            if (!bildirimSonuc.success && bildirimSonuc.error) {
                console.warn(`Talep eden bildirimi kısmen başarısız: ${bildirimSonuc.error}`);
            }
        }

        //  2. Talep eden kişi veya kurum
        if (talep.talepEdenKullaniciId) {
            await bildirimOlustur({
                kullaniciId: talep.talepEdenKullaniciId,
                kurumFirmaId: null,
                baslik: "Talebinize Araç Atandı",
                icerik: `"${talep.baslik}" başlıklı talebinize araç görevlendirildi.`,
                hedefUrl: `/gorevler/${yeniGorev._id}`,
                tur: "gorev",
                gizlilik: "bireysel",
            });
        }

        if (talep.talepEdenKurumFirmaId) {
            await bildirimOlustur({
                kullaniciId: null,
                kurumFirmaId: talep.talepEdenKurumFirmaId,
                baslik: "Kurum Talebine Araç Atandı",
                icerik: `"${talep.baslik}" başlıklı kurum talebinize araç görevlendirildi.`,
                hedefUrl: `/gorevler/${yeniGorev._id}`,
                tur: "gorev",
                gizlilik: "kurumsal",
            });
        }

        //  3. Araç sahibine (birey)
        if (arac.kullaniciId) {
            await bildirimOlustur({
                kullaniciId: arac.kullaniciId,
                baslik: "Aracınız Görevlendirildi",
                icerik: `"${talep.baslik}" talebi için aracınız görevlendirildi.`,
                hedefUrl: `/gorevler/${yeniGorev._id}`,
                tur: "gorev",
                gizlilik: "bireysel",
            });
        }

        //  4. Araç sahibi kuruma
        if (arac.kurumFirmaId) {
            await bildirimOlustur({
                kullaniciId: null,
                kurumFirmaId: arac.kurumFirmaId,
                baslik: "Kuruma Ait Araç Görevlendirildi",
                icerik: `"${talep.baslik}" talebi için kuruma ait araç görevlendirildi.`,
                hedefUrl: `/gorevler/${yeniGorev._id}`,
                tur: "gorev",
                gizlilik: "kurumsal",
            });
        }

        const aracSahibi = await Kullanici.findOne({ _id: arac.kullaniciId, isDeleted: false });
        if (aracSahibi && aracSahibi.email) {
            const bildirimSonuc = await bildirimGonder({
                email: aracSahibi.email,
                telefon: aracSahibi.telefon,
                subject: "Aracınız Görevlendirildi",
                html: aracSahibiMailHtmlOlustur(aracSahibi, talep, arac, sofor, koordinator),
                baslik: "Aracınız Görevlendirildi",
                mesaj: `${talep.baslik} talebi için aracınız (${arac.plaka}) görevlendirildi.\nŞoför: ${sofor.ad} ${sofor.soyad}\nKoordinatör: ${koordinator.ad} ${koordinator.soyad} (${koordinator.telefon})`,
                konum: talep.lokasyon
            });

            if (!bildirimSonuc.success && bildirimSonuc.error) {
                console.warn(`Araç sahibi bildirimi kısmen başarısız: ${bildirimSonuc.error}`);
            }
        }

        const kurum = await KurumFirma.findOne({ _id: arac.kurumFirmaId, isDeleted: false });
        let kurumEmail = null;
        if (kurum && kurum.iletisim && kurum.iletisim.email) {
            kurumEmail = kurum.iletisim.email;
        }

        if (kurumEmail) {
            const bildirimSonuc = await bildirimGonder({
                email: kurumEmail,
                telefon: kurum.iletisim && kurum.iletisim.telefon ? kurum.iletisim.telefon : null,
                subject: "Kuruluşunuza Ait Araç Görevlendirildi",
                html: kurumMailHtmlOlustur(kurum, talep, arac, sofor, koordinator),
                baslik: "Araç Görevlendirildi",
                mesaj: `${talep.baslik} talebi için kurumunuza ait araç (${arac.plaka}) görevlendirildi.\nŞoför: ${sofor.ad} ${sofor.soyad}\nKoordinatör: ${koordinator.ad} ${koordinator.soyad} (${koordinator.telefon})`,
                konum: talep.lokasyon
            });

            if (!bildirimSonuc.success && bildirimSonuc.error) {
                console.warn(`Kurum bildirimi kısmen başarısız: ${bildirimSonuc.error}`);
            }
        }

        return res.status(201).json({
            message: "Görev başarıyla oluşturuldu. Bazı bildirimler SMS olarak iletilememiş olabilir.",
            gorev: yeniGorev,
        });
    } catch (error) {
        console.error("Görev oluşturulurken hata:", error);
        return res
            .status(500)
            .json({ message: "Sunucu hatası", error: error.message });
    }
};

export const gorevDetayGetir = async(req, res) => {
    try {
        const { id } = req.params;
        const gorev = await Gorev.findOne({ _id: id, isDeleted: false })
            .populate({
                path: "talepId",
                populate: {
                    path: "talepEdenKurumFirmaId",
                    select: "kurumAdi iletisim.telefon iletisim.adres",
                },
            })
            .populate("koordinatorId", "ad soyad telefon")
            .populate("aracId");

        if (!gorev) {
            return res.status(404).json({ message: "Görev bulunamadı" });
        }

        res.status(200).json(gorev);
    } catch (error) {
        console.log("Görev detayını getirirken hata:", error.message);
        return res.status(500).json({ error: error.message });
    }
};

export const tumGorevleriGetir = async(req, res) => {
    try {
        const gorevler = await Gorev.find({ isDeleted: false })
            .populate({
                path: "talepId",
                select: "baslik aracTuru aracSayisi lokasyon durum talepEdenKurumFirmaId",
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

export const gorevDurumGuncelle = async(req, res) => {
    try {
        const { id } = req.params;
        const { gorevDurumu } = req.body;

        const mevcutGorev = await Gorev.findOne({ _id: id, isDeleted: false });
        if (!mevcutGorev) {
            return res.status(404).json({ message: "Görev bulunamadı" });
        }
        if (
            ["tamamlandı", "iptal edildi"].includes(mevcutGorev.gorevDurumu) &&
            gorevDurumu !== mevcutGorev.gorevDurumu
        ) {
            return res.status(400).json({
                message: `"${mevcutGorev.gorevDurumu}" durumundaki bir görev başka bir duruma geçirilemez.`,
            });
        }

        const guncellenmisGorev = await Gorev.findOneAndUpdate({ _id: id, isDeleted: false }, {
            gorevDurumu,
            ...(gorevDurumu === "başladı" && { baslangicZamani: new Date() }),
            ...(gorevDurumu === "tamamlandı" && { bitisZamani: new Date() }),
        }, { new: true });

        // Görevlendirilen aracı güncelle
        const arac = await Arac.findOne({ _id: mevcutGorev.aracId, isDeleted: false });
        if (arac) {
            // 1. Müsaitlik durumu güncelle
            if ((gorevDurumu === "başladı", "beklemede")) {
                arac.musaitlikDurumu = false;
            }

            if (["tamamlandı", "iptal edildi"].includes(gorevDurumu)) {
                arac.musaitlikDurumu = true;
            }

            await arac.save();
        }

        if (["tamamlandı", "iptal edildi"].includes(gorevDurumu)) {
            const ilgiliGorev = await Gorev.findOne({ _id: id, isDeleted: false });

            const ilgiliTalepId = ilgiliGorev.talepId;

            const tumGorevler = await Gorev.find({ talepId: ilgiliTalepId, isDeleted: false });

            const tumDurumlar = tumGorevler.map((g) => g.gorevDurumu);

            const hepsiTamamlandi = tumDurumlar.every((d) => d === "tamamlandı");
            const hepsiIptal = tumDurumlar.every((d) => d === "iptal edildi");

            if (hepsiTamamlandi) {
                await Talep.findOneAndUpdate({ _id: ilgiliTalepId, isDeleted: false }, { durum: "tamamlandı" });
            } else if (hepsiIptal) {
                await Talep.findOneAndUpdate({ _id: ilgiliTalepId, isDeleted: false }, { durum: "beklemede" });
            }
        }

        res.status(200).json({
            message: "Görev durumu başarıyla güncellendi",
            gorev: guncellenmisGorev,
        });
    } catch (error) {
        console.log("Görev durumu güncellenirken hata:", error.message);
        return res.status(500).json({ error: error.message });
    }
};

export const tahminiSureleriGetir = async(req, res) => {
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
            sureText: row.elements[0].duration ? row.elements[0].duration.text || "-" : "-",
            sureValue: row.elements[0].duration ? row.elements[0].duration.value || null : 0, // saniye cinsinden
            mesafeText: row.elements[0].distance ? row.elements[0].distance.text || "-" : "-",
        }));

        return res.status(200).json(bilgiler);
    } catch (error) {
        console.error("Tahmini süre hatası:", error.message);
        res.status(500).json({ error: "Süre bilgisi alınamadı" });
    }
};

export const aracSahibiGorevleriGetir = async(req, res) => {
    try {
        const araclar = await Arac.find({
            $or: [
                { kullaniciId: req.kullanici._id },
                { kurumFirmaId: req.kullanici.kurumFirmaId },
            ],
            isDeleted: false,
        }).select("_id");

        const aracIdListesi = araclar.map((a) => a._id);

        const gorevler = await Gorev.find({
                aracId: { $in: aracIdListesi },
                isDeleted: false,
            })
            .populate({
                path: "talepId",
                select: "baslik aracTuru aracSayisi lokasyon durum talepEdenKurumFirmaId",
                populate: {
                    path: "talepEdenKurumFirmaId",
                    select: "kurumAdi iletisim.telefon iletisim.adres",
                },
            })
            .populate("koordinatorId", "ad soyad telefon")
            .populate("aracId");

        if (!gorevler) {
            return res.status(404).json({ message: "Görev bulunamadı" });
        }
        if (gorevler.length === 0) {
            return res.status(200).json([]);
        }

        res.status(200).json(gorevler);
    } catch (error) {
        console.error("Görevleri getirirken hata:", error.message);
        return res.status(500).json({ error: error.message });
    }
};

export const talepEdenGorevleriGetir = async(req, res) => {
    try {
        const talepEdenKurumId = req.kullanici.kurumFirmaId;

        console.log(talepEdenKurumId, "talep eden kurum idsi");

        if (!talepEdenKurumId) {
            return res.status(400).json({ message: "Kullanıcının kurumu tanımsız." });
        }

        // kuruma ait talepleri al
        const talepler = await Talep.find({
            talepEdenKurumFirmaId: talepEdenKurumId,
            isDeleted: false,
        }).select("_id");
        const talepIdListesi = talepler.map((t) => t._id);

        if (talepIdListesi.length === 0) {
            return res.status(404).json({ message: "Kuruma ait talep bulunamadı." });
        }

        // talepId'ye göre görevleri al
        const gorevler = await Gorev.find({ talepId: { $in: talepIdListesi }, isDeleted: false })
            .populate({
                path: "talepId",
                select: "baslik aracTuru aracSayisi lokasyon durum talepEdenKurumFirmaId",
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

export const gorevPdfIndir = async(req, res) => {
    try {
        const { id } = req.params;

        const gorev = await Gorev.findOne({ _id: id, isDeleted: false })
            .populate({
                path: "talepId",
                populate: {
                    path: "talepEdenKurumFirmaId",
                    select: "kurumAdi iletisim.telefon iletisim.adres",
                },
            })
            .populate("koordinatorId", "ad soyad telefon")
            .populate("aracId");

        if (!gorev) return res.status(404).json({ message: "Görev bulunamadı." });

        const pdfBuffer = await gorevPdfOlustur(gorev);

        res.set({
            "Content-Type": "application/pdf",
            "Content-Disposition": `inline; filename="gorev-${id}.pdf"`,
            "Content-Length": pdfBuffer.length,
        });

        res.send(pdfBuffer);
    } catch (err) {
        console.error("PDF oluşturulurken hata:", err);
        res.status(500).json({ message: "PDF oluşturulamadı", error: err.message });
    }
};

export const excelIndir = async(req, res) => {
    try {
        const gorevler = await Gorev.find({ isDeleted: false })
            .populate({
                path: "talepId",
                populate: {
                    path: "talepEdenKurumFirmaId",
                    model: "KurumFirma"
                }
            })
            .populate("aracId");

        const excelBuffer = excelOlustur(gorevler);

        res.setHeader("Content-Disposition", "attachment; filename=gorev-raporu.xlsx");
        res.setHeader(
            "Content-Type",
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        );

        res.send(excelBuffer);
    } catch (err) {
        console.error("Excel oluşturulamadı:", err);
        res.status(500).json({ message: "Excel oluşturulamadı" });
    }
};