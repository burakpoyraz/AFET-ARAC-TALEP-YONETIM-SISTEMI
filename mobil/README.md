# 📱 Afet Araç Takip - Mobil Uygulama

**Flutter ile geliştirilmiş afet durumlarında araç koordinasyonu mobil uygulaması**  
_iOS ve Android platformları için optimize edilmiş modern kullanıcı deneyimi_

![Flutter](https://img.shields.io/badge/Flutter-3.x-blue)
![Dart](https://img.shields.io/badge/Dart-3.2.3-blue)
![Platform](https://img.shields.io/badge/Platform-iOS%20%7C%20Android-lightgrey)
![Architecture](https://img.shields.io/badge/Architecture-MVVM-green)

---

## 🎯 Genel Bakış

Bu mobil uygulama, afet durumlarında araç taleplerini ve görevleri yönetmek için geliştirilmiş Flutter tabanlı bir çözümdür. Web platformu ile tamamen entegre çalışarak, kullanıcıların mobil cihazlarından sistem işlevlerine erişmelerini sağlar.

### 🔑 Ana Özellikler

- 🔐 **Güvenli Kimlik Doğrulama**: JWT token tabanlı güvenli giriş sistemi
- 👥 **Rol Bazlı Erişim**: Koordinatör, Talep Eden ve Araç Sahibi rolleri
- 🗺️ **Harita Entegrasyonu**: Google Maps ile konum tabanlı işlemler
- 📱 **Çevrimdışı Destek**: Local cache ile veri senkronizasyonu
- 🔔 **Gerçek Zamanlı Bildirimler**: Anlık görev ve talep bildirimleri
- 🎨 **Modern UI/UX**: Apple Human Interface Guidelines uyumlu tasarım

---

## 🏗️ Mimari Yapı

Uygulama **MVVM (Model-View-ViewModel)** pattern kullanarak geliştirilmiştir:

```
lib/
├── core/                    # Temel uygulama altyapısı
│   ├── base/               # Base sınıflar
│   ├── constants/          # Sabitler
│   └── init/              # Başlangıç yapılandırmaları
│       └── navigation/    # Navigasyon yönetimi
├── features/              # Özellik bazlı modüller
│   ├── auth/             # Kimlik doğrulama
│   ├── vehicles/         # Araç yönetimi
│   ├── requests/         # Talep yönetimi
│   ├── tasks/            # Görev yönetimi
│   ├── notifications/    # Bildirimler
│   ├── users/            # Kullanıcı yönetimi
│   └── profile/          # Profil yönetimi
└── product/              # Paylaşılan ürün bileşenleri
    ├── cache/            # Önbellekleme
    ├── network/          # Ağ işlemleri
    ├── theme/            # Tema ve stil
    └── widgets/          # Ortak bileşenler
```

---

## 🚀 Başlangıç

### Önkoşullar

- **Flutter SDK**: 3.2.3 veya üzeri
- **Dart SDK**: 3.2.3 veya üzeri
- **iOS**: Xcode 14+ (iOS geliştirme için)
- **Android**: Android Studio (Android geliştirme için)

### Kurulum

1. **Bağımlılıkları yükleyin:**
   ```bash
   flutter pub get
   ```

2. **iOS için pod kurulumu:**
   ```bash
   cd ios && pod install
   ```

3. **Uygulamayı çalıştırın:**
   ```bash
   # Debug modda
   flutter run
   
   # Release modda
   flutter run --release
   ```

### Geliştirme Ortamı Ayarları

Backend sunucusu için platform bazlı URL yapılandırması:
- **iOS Simulator**: `http://localhost:5001/api`
- **Android Emulator**: `http://10.0.2.2:5001/api`

---

## 👥 Kullanıcı Rolleri ve Özellikler

### 🎛️ Koordinatör
- Tüm talepleri görüntüleme ve yönetme
- Araç filosunu yönetme
- Görev atama ve takip
- Kullanıcı ve kurum yönetimi
- Detaylı raporlama

### 📋 Talep Eden
- Yeni araç talepleri oluşturma
- Kendi taleplerini takip etme
- Görev durumlarını izleme
- Konum bazlı talep yönetimi

### 🚗 Araç Sahibi
- Atanan görevleri görüntüleme
- Görev durumlarını güncelleme
- Araç bilgilerini yönetme
- Konum paylaşımı

---

## 🔧 Teknik Detaylar

### Kullanılan Paketler

```yaml
dependencies:
  flutter: sdk
  provider: ^6.1.1              # State management
  dio: ^5.4.0                   # HTTP client
  google_maps_flutter: ^2.5.3   # Harita entegrasyonu
  geolocator: ^10.1.0           # Konum servisleri
  geocoding: ^2.1.1             # Adres dönüşümü
  shared_preferences: ^2.2.2     # Local storage
  cached_network_image: ^3.3.1   # Önbellekli resim yükleme
  shimmer: ^3.0.0               # Loading animasyonları
  intl: ^0.19.0                 # Tarih/saat formatları
```

### State Management

Uygulama **Provider** pattern kullanarak state yönetimi gerçekleştirir:

- **Reactive UI**: Veri değişikliklerinde otomatik UI güncellemesi
- **Smart Caching**: API çağrılarını optimize eden önbellekleme
- **Error Handling**: Merkezi hata yönetimi
- **Loading States**: Kullanıcı dostu yükleme durumları

### API Entegrasyonu

- **Base URL**: Otomatik platform detection
- **Authentication**: JWT token yönetimi
- **Error Handling**: Kapsamlı hata işleme
- **Retry Logic**: Başarısız istekler için yeniden deneme

---

## 📐 Tasarım Sistemi

### Tema Yapısı

Uygulama **Apple Human Interface Guidelines** prensiplerine uygun olarak tasarlanmıştır:

- **Typography**: San Francisco Pro Display font kullanımı
- **Color Scheme**: Sistem renklerine uyumlu Material 3 color scheme
- **Spacing**: Tutarlı margin ve padding değerleri
- **Components**: Özelleştirilmiş widget kütüphanesi

### Özel Bileşenler

- `CustomButton`: Standart buton tasarımı
- `CustomTextField`: Tutarlı form alanları
- `VehicleCard`: Araç bilgi kartları
- `TaskCard`: Görev bilgi kartları
- `RequestCard`: Talep bilgi kartları

---

## 🔄 Veri Akışı

### Request Lifecycle
```
Talep Eden → Talep Oluştur → Koordinatör Onayı → Araç Atama → Görev Başlatma → Görev Tamamlama
```

### Caching Strategy
- **API Responses**: 2 dakika cache süresi
- **User Data**: Persistent storage
- **Offline Support**: Kritik veriler için local backup

---

## 🧪 Test Stratejisi

### Unit Tests
```bash
flutter test
```

### Widget Tests
```bash
flutter test test/widget_test.dart
```

### Integration Tests
```bash
flutter drive --target=test_driver/app.dart
```

---

## 📦 Build ve Deploy

### Android APK Build
```bash
flutter build apk --release
```

### iOS Archive Build
```bash
flutter build ios --release
```

### App Bundle (Android)
```bash
flutter build appbundle --release
```

---

## 🔧 Yapılandırma

### Environment Variables

Uygulama otomatik olarak debug/release modlarını destekler:

```dart
// Debug mode
const baseUrl = 'http://localhost:5001/api';  // iOS
const baseUrl = 'http://10.0.2.2:5001/api';  // Android

// Release mode
const baseUrl = 'https://production-url.com/api';
```

### Platform Specific Settings

**iOS**: `ios/Runner/Info.plist`
- Location permissions
- Camera permissions
- Network security settings

**Android**: `android/app/src/main/AndroidManifest.xml`
- Internet permission
- Location permissions
- Network security config

---

## 🐛 Hata Ayıklama

### Debug Console
```bash
flutter logs
```

### Common Issues

1. **Simulator Bağlantı Sorunları**
   - iOS: Terminal'de `sudo xcode-select -s /Applications/Xcode.app`
   - Android: AVD Manager'da device restart

2. **Build Errors**
   ```bash
   flutter clean
   flutter pub get
   cd ios && pod install  # iOS için
   ```

---

## 📋 API Endpoints

Detaylı API dokümantasyonu için `API_ENDPOINTS.md` dosyasına bakınız.

**Base Endpoints:**
- `POST /auth/girisyap` - Kullanıcı girişi
- `GET /araclar` - Araç listesi
- `GET /talepler` - Talep listesi
- `GET /gorevler` - Görev listesi

---

## 🤝 Katkıda Bulunma

1. **Development Workflow:**
   ```bash
   git checkout -b feature/new-feature
   # Değişikliklerinizi yapın
   git commit -m "feat: add new feature"
   git push origin feature/new-feature
   ```

2. **Code Style:**
   - Dart formatting: `dart format .`
   - Linting: `dart analyze`
   - Import sorting: `flutter packages pub run import_sorter:main`

3. **Commit Conventions:**
   - `feat:` Yeni özellik
   - `fix:` Bug düzeltmesi
   - `docs:` Dokümantasyon
   - `style:` Kod formatı
   - `refactor:` Kod iyileştirmesi

---

## 📄 Lisans

Bu proje MIT lisansı altında lisanslanmıştır. Detaylar için [LICENSE](../LICENSE) dosyasına bakınız.

---

## 📞 İletişim ve Destek

Herhangi bir sorun veya öneriniz için:
- Issues: GitHub Issues kısmını kullanın
- Dokümantasyon: Bu README ve `API_ENDPOINTS.md`
- Email: Proje maintainer'larına ulaşın

---

**🚀 Geliştirici Notları:**
- Provider pattern ile reactive state management
- Smart caching ile optimized API calls
- Apple HIG uyumlu modern UI/UX
- Platform specific configurations
- Comprehensive error handling 