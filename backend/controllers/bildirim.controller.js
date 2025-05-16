import Bildirim from "../models/bildirim.model.js";


export const bildirimleriGetir = async (req, res) => {
  try {
    const filtre = req.kullanici.kurumFirmaId
      ? {
          $or: [
            { kullaniciId: req.kullanici._id },
            { kurumFirmaId: req.kullanici.kurumFirmaId }
          ]
        }
      : {
          kullaniciId: req.kullanici._id
        };

    const bildirimler = await Bildirim.find(filtre).sort({ createdAt: -1 });

    if (!bildirimler || bildirimler.length === 0) {
      return res.status(404).json({ message: "Bildirim bulunamadı" });
    }

    res.status(200).json(bildirimler);
  } catch (error) {
    res.status(500).json({ message: "Bildirimler alınamadı", error: error.message });
  }
};

export const bildirimOkunduYap = async (req, res) => {
  try {
    const bildirimId = req.params.id;


   

    const bildirim = await Bildirim.findByIdAndUpdate(
      bildirimId,
      { okundu: true },
      { new: true }
    );
    if (!bildirim) {
      return res.status(404).json({ message: "Bildirim bulunamadı" });
    }
    res.status(200).json({ message: "Bildirim okundu olarak işaretlendi" });
   
  }
  catch (error) {
    res.status(500).json({ message: "Bildirim güncellenemedi", error: error.message });
  }
}
