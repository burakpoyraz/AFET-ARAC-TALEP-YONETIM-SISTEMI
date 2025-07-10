# AFET ARAÇ TAKİP - Mobile App

Bu proje, AFET ARAÇ TAKİP web uygulamasının Flutter ile geliştirilmiş mobil versiyonudur. Uygulama, afet durumlarında araç ve görev yönetimini kolaylaştırmak için tasarlanmıştır.

## Tamamlanan Özellikler

### 1. Temel Kurulum
- [x] Flutter projesi oluşturuldu
- [x] Gerekli bağımlılıklar eklendi (provider, dio, google_maps_flutter, vb.)
- [x] Apple Human Interface Guidelines uyumlu tema ve stil tanımlamaları yapıldı
- [x] API iletişimi için network manager kuruldu
- [x] Kullanıcı verisi için local storage yönetimi eklendi

### 2. Kimlik Doğrulama
- [x] Giriş ve kayıt ekranları oluşturuldu
- [x] Email/şifre ile kimlik doğrulama implementasyonu yapıldı
- [x] Kimlik doğrulama ile ilgili model ve view modeller oluşturuldu
- [x] API istekleri için token yönetimi eklendi

### 3. Araç Yönetimi
- [x] Araç modeli oluşturuldu (plaka, marka, model, kapasite, vb.)
- [x] Araç listeleme, ekleme, düzenleme ve silme fonksiyonları eklendi
- [x] Araç konum takibi desteği eklendi

### 4. Görev Yönetimi
- [x] Araç görevlendirmeleri için görev modeli oluşturuldu
- [x] Görev listeleme ve durum güncelleme özellikleri eklendi
- [x] Görev lokasyonlarını göstermek için Google Maps entegrasyonu yapıldı
- [x] Görev başlatma/tamamlama fonksiyonları eklendi

### 5. Talep Yönetimi
- [x] Araç talepleri için talep modeli oluşturuldu
- [x] Talep adresleri için konum desteği eklendi

## Devam Eden Çalışmalar

### 1. View Model Geliştirmeleri
- [ ] Her model için Provider kullanarak view model implementasyonları
- [ ] API çağrıları için CRUD operasyonları
- [ ] Araçlar için gerçek zamanlı konum güncellemeleri
- [ ] Hata yönetimi ve loading durumları

### 2. UI Bileşenleri
- [ ] Araç ve görev kartları için yeniden kullanılabilir widget'lar
- [ ] Pull-to-refresh özellikli liste görünümleri
- [ ] Araç takibi ve görev lokasyonları için harita görünümleri
- [ ] Görev detay görünümleri ve durum güncellemeleri
- [ ] iOS native görünüm ve animasyonlar

### 3. Tamamlanacak Özellikler

#### Araç Yönetimi
- [ ] Araç durumu göstergeleri
- [ ] Detaylı araç bilgi sayfası
- [ ] Araç müsaitlik durumu değiştirme
- [ ] Araç filtreleme ve arama

#### Görev Yönetimi
- [ ] Duruma göre gruplandırılmış görev listesi
- [ ] Harita görünümlü görev detay sayfası
- [ ] Sürücü bilgisi yönetimi
- [ ] Görev geçmişi görüntüleme

#### Talep Yönetimi
- [ ] Çoklu araç tipi seçimiyle yeni talep oluşturma
- [ ] Talep durumu takibi
- [ ] Haritadan konum seçimi
- [ ] Talep geçmişi görüntüleme

### 4. Teknik İyileştirmeler
- [ ] Unit ve widget testleri
- [ ] Performans optimizasyonları
- [ ] Offline çalışma desteği
- [ ] Push notification entegrasyonu
- [ ] Hata raporlama sistemi

## Proje Yapısı

Uygulama MVVM (Model-View-ViewModel) mimarisi kullanılarak geliştirilmektedir:

```
lib/
├── models/          # Veri modelleri
├── views/           # UI bileşenleri
├── viewmodels/      # İş mantığı ve state yönetimi
├── services/        # API ve veritabanı servisleri
├── utils/           # Yardımcı fonksiyonlar
└── widgets/         # Paylaşılan UI bileşenleri
```

## Kullanılan Teknolojiler

- Flutter
- Provider (State Management)
- Dio (HTTP Client)
- Google Maps Flutter
- Shared Preferences
- Flutter Secure Storage

## Kurulum

1. Flutter SDK'yı yükleyin
2. Projeyi klonlayın
3. Bağımlılıkları yükleyin:
```bash
flutter pub get
```
4. Uygulamayı çalıştırın:
```bash
flutter run
```

## API Entegrasyonu

Uygulama, mevcut backend API endpoint'lerini kullanmaktadır:
- /auth: Kimlik doğrulama işlemleri
- /arac: Araç yönetimi
- /gorev: Görev yönetimi
- /talep: Talep yönetimi

## Katkıda Bulunma

1. Bu repository'yi fork edin
2. Feature branch'i oluşturun (`git checkout -b feature/amazing-feature`)
3. Değişikliklerinizi commit edin (`git commit -m 'feat: Add some amazing feature'`)
4. Branch'inizi push edin (`git push origin feature/amazing-feature`)
5. Pull Request oluşturun 