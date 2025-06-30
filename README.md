# 🚨 Afet Araç Talep ve Görev Yönetim Sistemi

**Afet anlarında yolcu/yük taşımacılığını dijital olarak yönetin**  
_Web tabanlı, konum destekli, çok kullanıcılı yönetim çözümü_

![status](https://img.shields.io/badge/platform-Web--Based-lightgrey)
![stack](https://img.shields.io/badge/stack-MERN-blue)
![license](https://img.shields.io/badge/license-MIT-green)

---

## 🔎 Hakkında

Afet dönemlerinde ihtiyaç duyulan araç temini ve koordinasyonu çoğu zaman manuel yöntemlerle yapılır — bu da ciddi zaman kaybına ve iletişim sorunlarına yol açar. Bu sistem, araç taleplerinin, görevlendirmelerin ve görev takibinin dijital ortamda yürütülmesini sağlar.

Sistem, kullanıcıların rollerine göre özelleştirilmiş deneyimler sunarak; afet sırasında kaynakların en etkin biçimde kullanılmasına yardımcı olur.

---

## 🚀 Özellikler

- 🔐 JWT ile güvenli kullanıcı girişi
- 👥 Rol bazlı işlem: Koordinatör, Talep Eden, Araç Sahibi
- 🗺️ Google Maps ile konum bazlı talep oluşturma
- 📊 Uygun araçlara göre görev atama
- 🔔 E-posta ve sistem içi bildirim
- 📌 Görevlerin durum bazlı takibi ve haritada gösterimi

---

## 🧱 Teknolojiler

| Katman     | Teknoloji                                   |
| ---------- | ------------------------------------------- |
| Frontend   | React.js, Tailwind CSS, DaisyUI             |
| Backend    | Node.js, Express.js, JWT                    |
| Veritabanı | MongoDB Atlas, Mongoose                     |
| Harita     | Google Maps API (@vis.gl/react-google-maps) |
| Araçlar    | Axios, React Query, Postman                 |

---

## 🧭 Kullanıcı Rolleri

- **Koordinatör:** Talep, araç, görev ve kullanıcı yönetimi
- **Talep Eden:** Konum bazlı yeni araç talepleri oluşturur
- **Araç Sahibi:** Görev kabul eder, görev sürecini günceller

---

## 🛠️ Kurulum

### Backend

```bash
cd backend
npm install
npm start
```

### Frontend

```bash
cd frontend
npm install
npm start
```

> `.env` dosyası oluşturarak ortam değişkenlerini tanımlayın:

```env
PORT=5000
CLIENT_URL=http://localhost:3000
MONGO_URI=<mongodb-uri>
JWT_SECRET=<jwt-secret>
GMAIL_ADRESI=<gmail-account>
GMAIL_SIFRESI=<gmail-password>
GOOGLE_MAPS_API_KEY=<google-maps-key>
```

---

## ▶️ Çalıştırma

- API’yi başlatmak için:

```bash
npm run dev
```

- Arayüzü başlatmak için `frontend` içinde:

```bash
npm run dev
```

Arayüz [http://localhost:3000](http://localhost:3000), API ise [http://localhost:5000](http://localhost:5000) portunda çalışır.

---

## 📂 Proje Yapısı

```
.
├── backend/
│   ├── controllers/
│   ├── routes/
│   ├── models/
│   ├── middleware/
│   └── server.js
├── frontend/
│   ├── components/
│   ├── pages/
│   ├── lib/
│   └── App.jsx, main.jsx
```

---

## 📡 API Örnekleri

| İstek              | Metot | Endpoint             |
| ------------------ | ----- | -------------------- |
| Giriş Yap          | POST  | `/api/auth/girisyap` |
| Yeni Talep Oluştur | POST  | `/api/talepler/`     |
| Araç Ekle          | POST  | `/api/araclar/`      |
| Görev Atama        | POST  | `/api/gorevler/`     |
| Bildirimleri Al    | GET   | `/api/bildirimler/`  |

---

## 📌 Yol Haritası

- [x] Rol bazlı kullanıcı sistemi
- [x] Harita ile konum seçimi
- [x] Görev atama & takip
- [ ] 📱 Mobil sürüm
- [ ] 📡 Gerçek zamanlı araç konum takibi
- [ ] 📈 Gelişmiş raporlama ve analiz
- [ ] 📩 SMS bildirim entegrasyonu

---

## 📄 Lisans

Bu proje MIT lisansı ile sunulmaktadır. Daha fazla bilgi için `LICENSE` dosyasına göz atabilirsiniz.

---

## ✉️ İletişim

Her türlü geri bildirim ve katkı için iletişime geçebilirsiniz:

- GitHub: [github.com/burakpoyraz](https://github.com/burakpoyraz)
