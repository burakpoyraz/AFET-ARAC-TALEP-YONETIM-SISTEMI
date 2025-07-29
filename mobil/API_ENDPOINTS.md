# API Endpoints

Bu dokümantasyon, frontend'de kullanılan tüm API endpointlerini içermektedir. Mobil uygulamada aynı endpointler kullanılacaktır.

## Base URL

API'nin base URL'i: `/api`

## Mobil Kimlik Doğrulama

Mobil uygulamada token yönetimi web uygulamasından farklı çalışır:

1. İstek yaparken `isMobile: true` parametresi gönderilmelidir
2. Sunucu token'ı response body'de döner
3. Token'ı local storage'da saklayıp, sonraki isteklerde `Authorization` header'ında göndermelisiniz:
   ```
   Authorization: Bearer <token>
   ```

## Kimlik Doğrulama (Auth) Endpointleri

### POST /auth/girisyap
- **Açıklama**: Kullanıcı girişi
- **Body**:
  ```json
  {
    "email": "string",
    "sifre": "string",
    "isMobile": true
  }
  ```
- **Response** (mobil için):
  ```json
  {
    "kullanici": {
      "_id": "string",
      "ad": "string",
      "soyad": "string",
      "email": "string",
      "telefon": "string",
      "rol": "string",
      "kurumFirmaId": "string",
      "kullaniciBeyanBilgileri": {
        "kurumFirmaAdi": "string",
        "kurumFirmaTuru": "string"
      }
    },
    "token": "string"
  }
  ```

### POST /auth/kayitol
- **Açıklama**: Yeni kullanıcı kaydı
- **Body**:
  ```json
  {
    "ad": "string",
    "soyad": "string",
    "email": "string",
    "sifre": "string",
    "telefon": "string",
    "isMobile": true
  }
  ```
- **Response** (mobil için):
  ```json
  {
    "yeniKullanici": {
      "_id": "string",
      "ad": "string",
      "soyad": "string",
      "email": "string",
      "telefon": "string",
      "rol": "string",
      "kurumFirmaId": "string",
      "kullaniciBeyanBilgileri": {
        "kurumFirmaAdi": "string",
        "kurumFirmaTuru": "string"
      }
    },
    "token": "string"
  }
  ```

### POST /auth/cikisyap
- **Açıklama**: Kullanıcı çıkışı
- **Body**:
  ```json
  {
    "isMobile": true
  }
  ```

### GET /auth/hesabim
- **Açıklama**: Giriş yapmış kullanıcının bilgilerini getirir
- **Headers**: 
  ```
  Authorization: Bearer <token>
  ```

## Talepler

### GET /talepler
- **Açıklama**: Tüm talepleri listeler (Koordinatör için)
- **Headers**: 
  ```
  Authorization: Bearer <token>
  ```

### GET /talepler/taleplerim
- **Açıklama**: Kullanıcının kendi taleplerini listeler
- **Headers**: 
  ```
  Authorization: Bearer <token>
  ```

### GET /talepler/:id
- **Açıklama**: Belirli bir talebin detaylarını getirir
- **Headers**: 
  ```
  Authorization: Bearer <token>
  ```

### POST /talepler
- **Açıklama**: Yeni talep oluşturur
- **Headers**: 
  ```
  Authorization: Bearer <token>
  ```
- **Body**:
  ```json
  {
    "baslik": "string",
    "aciklama": "string",
    "araclar": [
      {
        "aracTuru": "string",
        "aracSayisi": "number"
      }
    ],
    "lokasyon": {
      "adres": "string",
      "lat": "number",
      "lng": "number"
    },
    "talepEdenKullaniciId": "string",
    "talepEdenKurumFirmaId": "string"
  }
  ```

### PUT /talepler/:id
- **Açıklama**: Mevcut talebi günceller
- **Headers**: 
  ```
  Authorization: Bearer <token>
  ```
- **Body**: POST /talepler ile aynı

## Görevler

### GET /gorevler
- **Açıklama**: Tüm görevleri listeler (Koordinatör için)
- **Headers**: 
  ```
  Authorization: Bearer <token>
  ```

### GET /gorevler/arac-sahibi
- **Açıklama**: Araç sahibinin görevlerini listeler
- **Headers**: 
  ```
  Authorization: Bearer <token>
  ```

### GET /gorevler/talep-eden-kurum
- **Açıklama**: Talep eden kurumun görevlerini listeler
- **Headers**: 
  ```
  Authorization: Bearer <token>
  ```

### GET /gorevler/:id
- **Açıklama**: Belirli bir görevin detaylarını getirir
- **Headers**: 
  ```
  Authorization: Bearer <token>
  ```

### GET /gorevler/:id/pdf
- **Açıklama**: Görev formunu PDF olarak indirir
- **Headers**: 
  ```
  Authorization: Bearer <token>
  ```

### POST /gorevler/mesafe-ve-sure
- **Açıklama**: Hedef konum ile araç konumları arasındaki mesafe ve süreyi hesaplar
- **Headers**: 
  ```
  Authorization: Bearer <token>
  ```
- **Body**:
  ```json
  {
    "hedefKonum": {
      "lat": "number",
      "lng": "number"
    },
    "aracKonumlari": [
      {
        "lat": "number",
        "lng": "number"
      }
    ]
  }
  ```

## Araçlar

### GET /araclar
- **Açıklama**: Tüm araçları listeler (Koordinatör için)
- **Headers**: 
  ```
  Authorization: Bearer <token>
  ```

### GET /araclar/araclarim
- **Açıklama**: Araç sahibinin araçlarını listeler
- **Headers**: 
  ```
  Authorization: Bearer <token>
  ```

### GET /araclar/musaitaraclar
- **Açıklama**: Müsait araçları listeler
- **Headers**: 
  ```
  Authorization: Bearer <token>
  ```

### POST /araclar
- **Açıklama**: Yeni araç ekler
- **Headers**: 
  ```
  Authorization: Bearer <token>
  ```
- **Body**:
  ```json
  {
    "plaka": "string",
    "aracTuru": "string",
    "kullanimAmaci": "string",
    "kapasite": "number",
    "aracDurumu": "string",
    "musaitlikDurumu": "boolean",
    "konum": {
      "adres": "string",
      "lat": "number",
      "lng": "number"
    }
  }
  ```

### PUT /araclar/:plaka
- **Açıklama**: Mevcut aracı günceller
- **Headers**: 
  ```
  Authorization: Bearer <token>
  ```
- **Body**: POST /araclar ile aynı

## Bildirimler

### GET /bildirimler
- **Açıklama**: Kullanıcının bildirimlerini listeler
- **Headers**: 
  ```
  Authorization: Bearer <token>
  ```

### PUT /bildirimler/:id
- **Açıklama**: Bildirimi okundu olarak işaretler
- **Headers**: 
  ```
  Authorization: Bearer <token>
  ```

## Kullanıcılar

### GET /kullanicilar
- **Açıklama**: Tüm kullanıcıları listeler (Koordinatör için)
- **Headers**: 
  ```
  Authorization: Bearer <token>
  ```

## Kurumlar

### GET /kurumlar
- **Açıklama**: Tüm kurumları listeler (Koordinatör için)
- **Headers**: 
  ```
  Authorization: Bearer <token>
  ``` 