/// Request model for handling request data
class Request {
  Request({
    required this.id,
    required this.baslik,
    required this.aciklama,
    required this.araclar,
    required this.lokasyon,
    required this.durum,
    required this.olusturulmaZamani,
    required this.talepEdenKullaniciId,
    this.talepEdenKurumFirmaId,
    this.kurumAdi,
    this.talepEdenAdi,
  });

  factory Request.fromJson(Map<String, dynamic> json) {
    return Request(
      id: json['_id'] as String? ?? '',
      baslik: json['baslik'] as String? ?? 'Başlık Yok',
      aciklama: json['aciklama'] as String? ?? 'Açıklama Yok',
      araclar: (json['araclar'] as List<dynamic>?)
              ?.map((e) => VehicleRequest.fromJson(e as Map<String, dynamic>))
              .toList() ??
          [],
      lokasyon: Location.fromJson(json['lokasyon'] as Map<String, dynamic>),
      durum: json['durum'] as String? ?? 'beklemede',
      olusturulmaZamani:
          DateTime.tryParse(json['olusturulmaZamani'] as String? ?? '') ??
              DateTime.now(),
      talepEdenKullaniciId: json['talepEdenKullaniciId'] is String
          ? json['talepEdenKullaniciId'] as String
          : (json['talepEdenKullaniciId'] as Map<String, dynamic>?)
                      ?.containsKey('_id') ??
                  false
              ? (json['talepEdenKullaniciId'] as Map<String, dynamic>)['_id']
                      as String? ??
                  ''
              : '',
      talepEdenKurumFirmaId: json['talepEdenKurumFirmaId'] is String
          ? json['talepEdenKurumFirmaId'] as String
          : (json['talepEdenKurumFirmaId'] as Map<String, dynamic>?)
                      ?.containsKey('_id') ??
                  false
              ? (json['talepEdenKurumFirmaId'] as Map<String, dynamic>)['_id']
                  as String?
              : null,
      kurumAdi: json['talepEdenKurumFirmaId'] is Map<String, dynamic>
          ? (json['talepEdenKurumFirmaId'] as Map<String, dynamic>)['kurumAdi']
              as String?
          : null,
      talepEdenAdi: json['talepEdenKullaniciId'] is Map<String, dynamic>
          ? '${(json['talepEdenKullaniciId'] as Map<String, dynamic>)['ad'] as String? ?? ''} ${(json['talepEdenKullaniciId'] as Map<String, dynamic>)['soyad'] as String? ?? ''}'
              .trim()
          : null,
    );
  }
  final String id;
  final String baslik;
  final String aciklama;
  final List<VehicleRequest> araclar;
  final Location lokasyon;
  final String durum;
  final DateTime olusturulmaZamani;
  final String talepEdenKullaniciId;
  final String? talepEdenKurumFirmaId;
  final String? kurumAdi;
  final String? talepEdenAdi;

  String get statusDisplayText {
    switch (durum) {
      case 'beklemede':
        return 'Beklemede';
      case 'gorevlendirildi':
        return 'Görevlendirildi';
      case 'tamamlandı':
        return 'Tamamlandı';
      case 'iptal edildi':
        return 'İptal Edildi';
      default:
        return durum;
    }
  }

  String get vehicleSummary {
    if (araclar.isEmpty) return 'Araç bilgisi yok';
    if (araclar.length == 1) {
      final arac = araclar.first;
      return '${arac.aracSayisi} ${arac.aracTuru}';
    }
    return '${araclar.length} farklı türde araç';
  }
}

class VehicleRequest {
  VehicleRequest({
    required this.aracTuru,
    required this.aracSayisi,
  });

  factory VehicleRequest.fromJson(Map<String, dynamic> json) {
    return VehicleRequest(
      aracTuru: json['aracTuru'] as String? ?? 'Belirtilmemiş',
      aracSayisi: json['aracSayisi'] as int? ?? 1,
    );
  }
  final String aracTuru;
  final int aracSayisi;

  Map<String, dynamic> toJson() {
    return {
      'aracTuru': aracTuru,
      'aracSayisi': aracSayisi,
    };
  }
}

class Location {
  Location({
    required this.adres,
    required this.lat,
    required this.lng,
  });

  factory Location.fromJson(Map<String, dynamic> json) {
    return Location(
      adres: json['adres'] as String? ?? 'Adres Yok',
      lat: (json['lat'] as num?)?.toDouble() ?? 0.0,
      lng: (json['lng'] as num?)?.toDouble() ?? 0.0,
    );
  }
  final String adres;
  final double lat;
  final double lng;

  Map<String, dynamic> toJson() {
    return {
      'adres': adres,
      'lat': lat,
      'lng': lng,
    };
  }
}
