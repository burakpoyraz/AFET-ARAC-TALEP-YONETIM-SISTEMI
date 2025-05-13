import Bildirim from "../../models/bildirim.model.js";


export const bildirimOlustur = async ({
    kullaniciId,
    kurumFirmaId=null,
    baslik,
    icerik,
    hedefUrl="",
    okundu=false,
    tur="sistem",
}) => {
    try {
        const bildirim = new Bildirim({
            kullaniciId,
            kurumFirmaId,
            baslik,
            icerik,
            hedefUrl,
            tur,
            okundu,
        });


        await bildirim.save();
     
        return bildirim;
    } catch (error) {
        console.error("Bildirim oluşturulurken hata:", error.message);
        throw new Error("Bildirim oluşturulamadı");
    }
}

    

