import Arac from "../models/arac.model.js";
import Talep from "../models/talep.model.js";
import Gorev from "../models/gorev.model.js";



export const gorevOlustur = async (req, res) => {
    try
    {
        const koordinatorId=req.kullanici._id;
        const { talepId,
            aracId,
            gorevDurumu,
            gorevNotu,
            baslangicZamani,
            bitisZamani } = req.body;

            const arac=await Arac.findById(aracId);
            if(!arac)
            {
                return res.status(400).send({message:"Araç bulunamadı"});
            }

            if(!arac.musaitlikDurumu)
            {
                return res.status(400).send({message:"Araç müsait değil"});
            }

            if(arac.aracDurumu==="pasif")
            {
                return res.status(400).send({message:"Araç pasif durumda"});
            }


            // arac.musaitlikDurumu=false;
            // await arac.save();

            const talep= await Talep.findById(talepId);
            if(!talep)
            {
                return res.status(400).send({message:"Talep bulunamadı"});
            }

            if(talep.durum!=="beklemede")
            {
                return res.status(400).send({message:"Talep beklemede durumunda değil"});
            }

            talep.durum="onaylandi";
            await talep.save();

            const yeniGorev=new Gorev({
                talepId,
                aracId,
                koordinatorId,
                gorevDurumu,
                gorevNotu,
                baslangicZamani : baslangicZamani || new Date(),
                bitisZamani,
                baslangicKonumu:{
                    lat:arac.konum.lat,
                    lng:arac.konum.lng
                },
                hedefKonumu:{
                    lat:talep.lokasyon.lat,
                    lng:talep.lokasyon.lng
                }



            });

            if(!yeniGorev)
            {
                return res.status(400).send({message:"Görev oluşturulamadı"});
            }

            await yeniGorev.save();
            return res.status(201).send({yeniGorev});

        
    }
    catch(error)
    {
        console.log("Görev oluşturulurken hata oluştu: "+error.message);
        return res.status(500).send({error:error.message});
    }
}

