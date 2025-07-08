import Talep from "../models/talep.model.js";
import Kullanici from "../models/kullanici.model.js";
import KurumFirma from "../models/kurumFirma.model.js";
import { bildirimOlustur } from "../lib/utils/bildirimOlustur.js";
import { mailGonder } from "../lib/utils/email.js";

export const talepEkle = async(req, res) => {
        try {
            const { baslik, aciklama, lokasyon, araclar, talepEdenKullaniciId, talepEdenKurumFirmaId } = req.body;

            // Yeni talebi oluştur
            const talep = new Talep({
                baslik,
                aciklama,
                lokasyon,
                araclar,
                talepEdenKullaniciId,
                talepEdenKurumFirmaId,
            });

            // Talebi kaydet
            await talep.save();

            // Talep eden kişi ve kurum bilgilerini çek
            const talepEden = await Kullanici.findOne({
                _id: talep.talepEdenKullaniciId,
                isDeleted: false
            });

            const talepEdenKurum = await KurumFirma.findOne({
                _id: talep.talepEdenKurumFirmaId,
                isDeleted: false
            });

            // Koordinatörlere bildirim gönder
            const tumKoordinatorler = await Kullanici.find({
                rol: "koordinator",
                isDeleted: false,
            }).select("ad soyad email");

            // Her koordinatöre bildirim gönder
            const kurumSet = new Set();
            const kurumaBagliOlmayanKoordinatorler = [];

            for (const koordinator of tumKoordinatorler) {
                if (koordinator.kurumFirmaId) {
                    kurumSet.add(koordinator.kurumFirmaId.toString());
                } else {
                    kurumaBagliOlmayanKoordinatorler.push(koordinator._id);
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

            // Koordinatörlere e-posta gönder
            for (const k of tumKoordinatorler) {
                if (k.email) {
                    await mailGonder({
                                to: k.email,
                                subject: `Yeni Talep: ${talep.baslik}`,
                                html: `
                    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                        <h2 style="color: #2c3e50;">Yeni Talep Oluşturuldu</h2>
                        <p>Sayın ${k.ad} ${k.soyad},</p>
                        
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
                            <h3 style="color: #2c3e50; margin-top: 0;">İstenen Araçlar</h3>
                            ${talep.araclar.map(arac => `
                                <div style="margin-bottom: 10px;">
                                    <p><strong>Araç Türü:</strong> ${arac.aracTuru}</p>
                                    <p><strong>İstenen Adet:</strong> ${arac.aracSayisi}</p>
                                </div>
                            `).join('')}
                        </div>

                        <div style="background-color: #f8f9fa; padding: 15px; border-radius: 5px; margin: 15px 0;">
                            <h3 style="color: #2c3e50; margin-top: 0;">Talep Eden Bilgileri</h3>
                            ${talepEden ? `
                                <p><strong>Ad Soyad:</strong> ${talepEden.ad} ${talepEden.soyad}</p>
                                <p><strong>Telefon:</strong> ${talepEden.telefon}</p>
                                <p><strong>E-posta:</strong> ${talepEden.email}</p>
                            ` : ''}
                            ${talepEdenKurum ? `
                                <p><strong>Kurum Adı:</strong> ${talepEdenKurum.kurumAdi}</p>
                                <p><strong>Kurum Telefon:</strong> ${talepEdenKurum.iletisim?.telefon || 'Belirtilmemiş'}</p>
                                <p><strong>Kurum E-posta:</strong> ${talepEdenKurum.iletisim?.email || 'Belirtilmemiş'}</p>
                                <p><strong>Kurum Adres:</strong> ${talepEdenKurum.iletisim?.adres || 'Belirtilmemiş'}</p>
                            ` : ''}
                        </div>
                    </div>`,
                });
            }
        }

        res.status(201).json({ talep });
    } catch (error) {
        console.error("Talep oluşturulurken hata:", error);
        res.status(500).json({ error: "Sunucu hatası" });
    }
};

export const tumTalepleriGetir = async(req, res) => {
    try {
        const talepler = await Talep.find({ isDeleted: false })
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

export const kurumaAitTalepleriGetir = async(req, res) => {
    const kurumFirmaId = req.kullanici.kurumFirmaId;

    try {
        const talepler = await Talep.find({
            talepEdenKurumFirmaId: kurumFirmaId,
            isDeleted: false,
        }).populate("talepEdenKullaniciId", "ad soyad");

        if (!talepler) {
            return res.status(404).json({ error: "Kayıtlı talep bulunamadı" });
        }

        res.status(200).json(talepler);
    } catch (error) {
        return res.status(500).json({ error: "Sunucu hatası" });
    }
};

export const talepGetir = async(req, res) => {
    const { id } = req.params;

    try {
        const talep = await Talep.findOne({ _id: id, isDeleted: false })
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

export const talepGuncelle = async(req, res) => {
    const { id } = req.params;
    const { baslik, aciklama, araclar, lokasyon, durum } = req.body;

    try {
        const talep = await Talep.findOne({ _id: id, isDeleted: false });

        if (!talep) {
            return res.status(404).json({ error: "Talep bulunamadı" });
        }

        if (baslik) {
            talep.baslik = baslik;
        }
        if (aciklama) {
            talep.aciklama = aciklama;
        }
        if (araclar && Array.isArray(araclar) && araclar.length > 0) {
            // Validate each vehicle entry
            for (const arac of araclar) {
                if (!arac.aracTuru) {
                    return res.status(400).json({ error: "Araç türü bilgisi zorunludur" });
                }
                if (!arac.aracSayisi || arac.aracSayisi < 1) {
                    return res.status(400).json({ error: "Araç sayısı en az 1 olmalıdır" });
                }
            }
            talep.araclar = araclar;
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
                    error: "Görev ataması yapılmış veya tamamlanmış talepler iptal edilemez",
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

export const talepSil = async(req, res) => {
    const { id } = req.params;

    try {
        const talep = await Talep.findById(id);

        if (!talep || talep.isDeleted) {
            return res.status(404).json({ error: "Talep bulunamadı" });
        }

        talep.isDeleted = true;
        await talep.save();

        res.status(200).json({ message: "Talep başarıyla silindi" });
    } catch (error) {
        return res.status(500).json({ error: "Sunucu hatası" });
    }
};