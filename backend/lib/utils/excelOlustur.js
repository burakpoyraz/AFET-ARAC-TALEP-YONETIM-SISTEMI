import * as XLSX from "xlsx";

export function excelOlustur(gorevler) {
  const data = gorevler.map((gorev, index) => {
    const baslangic = gorev.baslangicZamani
      ? new Date(gorev.baslangicZamani)
      : "";
    const bitis = gorev.bitisZamani
      ? new Date(gorev.bitisZamani)
      : "";

    return {
      "#": index + 1,
      "Talep Başlığı": gorev.talepId?.baslik || "",
      "Talep Eden Kurum": gorev.talepId?.talepEdenKurumFirmaId?.kurumAdi || "",
      "Araç": gorev.aracId
        ? `${gorev.aracId.plaka.toUpperCase()} (${gorev.aracId.aracTuru})`
        : "",
      "Durum": gorev.gorevDurumu,
      "Başlangıç Tarihi": baslangic,
      "Bitiş Tarihi": bitis,
    };
  });

  const worksheet = XLSX.utils.json_to_sheet(data, {
    cellDates: true, // Tarih nesneleri Excel'e doğrudan yazılabilsin
  });

  // Hücre formatlarını ayarla (isteğe bağlı, sadece görünüm için)
  const dateCols = ["F", "G"]; // Excel'de 'Başlangıç' ve 'Bitiş' sütunları

  dateCols.forEach((col) => {
    for (let i = 2; i <= data.length + 1; i++) {
      const cell = worksheet[`${col}${i}`];
      if (cell && cell.v instanceof Date) {
        cell.t = "d"; // tarih tipi
        cell.z = "dd.mm.yyyy hh:mm"; // görünüm formatı
      }
    }
  });

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Görevler");

  return XLSX.write(workbook, { bookType: "xlsx", type: "buffer" });
}
