import PDFDocument from "pdfkit";
import { PassThrough } from "stream";
import path from "path";
import { fileURLToPath } from "url";
import QRCode from "qrcode";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const fontRegular = path.join(__dirname, "../../assets/font/DejaVuSans.ttf");
const fontBold = path.join(__dirname, "../../assets/font/DejaVuSans-Bold.ttf");
const logoPath = path.join(__dirname, "../../assets/logo.png");

export async function gorevPdfOlustur(gorev) {
  return new Promise(async (resolve, reject) => {
    const doc = new PDFDocument({ size: "A4", layout: "landscape", margin: 20 });
    const stream = new PassThrough();
    const chunks = [];

    doc.pipe(stream);
    doc.registerFont("Turkce", fontRegular);
    doc.registerFont("Turkce-Bold", fontBold);

    const margin = 20;
    const pageWidth = doc.page.width;
    const contentWidth = pageWidth - margin * 2;

    // Logo ve Başlık
    doc.image(logoPath, margin, margin, { width: 100 });
    doc.font("Turkce-Bold").fontSize(18).fillColor("#003366")
      .text("AFET NAKLİYE GRUBU", margin, margin, { align: "center" });
    doc.font("Turkce-Bold").fontSize(16).fillColor("black")
      .text("ARAÇ GÖREV FORMU", { align: "center" });
    doc.moveTo(margin, doc.y + 10).lineTo(pageWidth - margin, doc.y + 10).strokeColor("#aaaaaa").stroke();
    doc.moveDown(2);

    // Plaka kutusu
    doc.rect(margin, doc.y, contentWidth, 100).fillAndStroke("#f0f4f8", "#ccc");
    doc.font("Turkce-Bold").fontSize(80).fillColor("#000")
      .text(gorev?.aracId?.plaka || "-", margin, doc.y + 5, {
        width: contentWidth,
        align: "center"
      });
    doc.moveDown(2);

    // Araç ve Sürücü Bilgileri
    const tableTopY = 215;
    const tableColWidth = contentWidth / 2 - 10;

    const drawTable = (title, items, x, y) => {
      doc.rect(x, y, tableColWidth, 20).fillAndStroke("#ddeeff", "#aaa");
      doc.font("Turkce-Bold").fontSize(12).fillColor("#000")
        .text(title, x, y + 5, { width: tableColWidth, align: "center" });

      let currentY = y + 25;
      items.forEach(([label, value]) => {
        doc.font("Turkce-Bold").fontSize(10).fillColor("black")
          .text(label, x + 5, currentY, { width: 80, align: "right" });
        doc.font("Turkce-Bold").text(":", x + 90, currentY);
        doc.font("Turkce").text(value, x + 100, currentY);
        currentY += 20;
      });
    };

    drawTable("ARAÇ BİLGİLERİ", [
      ["SINIFI", gorev?.aracId?.aracSinifi || "-"],
      ["TİPİ", gorev?.aracId?.aracTuru || "-"],
      ["MARKASI", gorev?.aracId?.marka || "-"],
      ["KURUMU", gorev?.aracId?.kurumAdi || "-"]
    ], margin, tableTopY);

    drawTable("SÜRÜCÜ BİLGİLERİ", [
      ["ADI", gorev?.sofor?.ad || "-"],
      ["SOYADI", gorev?.sofor?.soyad || "-"],
      ["TELEFON", gorev?.sofor?.telefon || "-"]
    ], margin + tableColWidth + 20, tableTopY);

    // Görev Detayları
    const detayTopY = 330;
    const detayWidth = contentWidth - 130;
    const detayX = margin;

    doc.rect(detayX, detayTopY, detayWidth, 20).fillAndStroke("#ddeeff", "#aaa");
    doc.font("Turkce-Bold").fontSize(12).fillColor("#000")
      .text("GÖREV DETAYLARI", detayX, detayTopY + 5, { width: detayWidth, align: "center" });

    const detaylar = [
      ["Tarih", gorev?.baslangicZamani ? new Date(gorev.baslangicZamani).toLocaleDateString("tr-TR") : "-"],
      ["Saat", gorev?.baslangicZamani ? new Date(gorev.baslangicZamani).toLocaleTimeString("tr-TR") : "-"],
      ["Durum", gorev?.gorevDurumu || "-"],
      ["Not", gorev?.gorevNotu || "-"],
      ["Talep", gorev?.talepId?.baslik || "-"],
      ["Gideceği Adres", gorev?.talepId?.lokasyon?.adres || "-"]
    ];

    let detayY = detayTopY + 25;
    detaylar.forEach(([etiket, deger]) => {
      doc.font("Turkce-Bold").fontSize(10).text(etiket, detayX + 5, detayY, { width: 80, align: "right" });
      doc.font("Turkce-Bold").text(":", detayX + 90, detayY);
      doc.font("Turkce").text(deger, detayX + 100, detayY);
      detayY += 20;
    });

    // QR Kod
    const googleMapsUrl = gorev?.hedefKonumu
      ? `https://www.google.com/maps?q=${gorev.hedefKonumu.lat},${gorev.hedefKonumu.lng}`
      : null;

    if (googleMapsUrl) {
      try {
        const qrCodeData = await QRCode.toDataURL(googleMapsUrl);
        doc.image(qrCodeData, pageWidth - 110, detayTopY + 5, { width: 90 });
        doc.font("Turkce").fontSize(8).fillColor("black")
          .text("Haritada Göster", pageWidth - 110, detayTopY + 100, {
            link: googleMapsUrl,
            underline: true
          });
      } catch (error) {
        console.error("QR Kod oluşturulamadı:", error);
      }
    }

    // İmza
    const mudurAdi = "Adı  SOYADI";
    const signY = doc.page.height - 60;
    const signX = pageWidth / 2 - 100;

    doc.font("Turkce-Bold").fontSize(10).fillColor("black")
      .text(mudurAdi, signX, signY, { width: 200, align: "center" });
    doc.font("Turkce").fontSize(10)
      .text("BÖLGE MÜDÜRÜ", signX, signY + 15, { width: 200, align: "center" });

    doc.end();
    stream.on("data", (chunk) => chunks.push(chunk));
    stream.on("end", () => resolve(Buffer.concat(chunks)));
    stream.on("error", reject);
  });
}