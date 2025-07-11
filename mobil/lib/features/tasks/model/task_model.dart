/// Task model for handling task data
class Task {
  Task({
    required this.id,
    required this.talepId,
    required this.aracId,
    required this.gorevDurumu,
    required this.olusturulmaZamani,
    this.gorevNotu,
    this.baslangicZamani,
    this.bitisZamani,
    this.sofor,
    this.talepBilgileri,
    this.aracBilgileri,
  });

  factory Task.fromJson(Map<String, dynamic> json) {
    return Task(
      id: json['_id'] as String,
      talepId: json['talepId'] is String
          ? json['talepId'] as String
          : (json['talepId'] as Map<String, dynamic>)['_id'] as String,
      aracId: json['aracId'] is String
          ? json['aracId'] as String
          : (json['aracId'] as Map<String, dynamic>)['plaka'] as String,
      gorevDurumu: json['gorevDurumu'] as String,
      gorevNotu: json['gorevNotu'] as String?,
      baslangicZamani: json['baslangicZamani'] != null
          ? DateTime.parse(json['baslangicZamani'] as String)
          : null,
      bitisZamani: json['bitisZamani'] != null
          ? DateTime.parse(json['bitisZamani'] as String)
          : null,
      olusturulmaZamani: DateTime.parse(json['olusturulmaZamani'] as String),
      sofor: json['sofor'] != null
          ? DriverInfo.fromJson(json['sofor'] as Map<String, dynamic>)
          : null,
      talepBilgileri: json['talepId'] is Map<String, dynamic>
          ? TaskRequest.fromJson(json['talepId'] as Map<String, dynamic>)
          : null,
      aracBilgileri: json['aracId'] is Map<String, dynamic>
          ? TaskVehicle.fromJson(json['aracId'] as Map<String, dynamic>)
          : null,
    );
  }
  final String id;
  final String talepId;
  final String aracId;
  final String gorevDurumu;
  final String? gorevNotu;
  final DateTime? baslangicZamani;
  final DateTime? bitisZamani;
  final DateTime olusturulmaZamani;
  final DriverInfo? sofor;
  final TaskRequest? talepBilgileri;
  final TaskVehicle? aracBilgileri;

  String get statusDisplayText {
    switch (gorevDurumu) {
      case 'beklemede':
        return 'Beklemede';
      case 'başladı':
        return 'Başladı';
      case 'tamamlandı':
        return 'Tamamlandı';
      case 'iptal edildi':
        return 'İptal Edildi';
      default:
        return gorevDurumu;
    }
  }

  String get requestTitle =>
      talepBilgileri?.baslik ?? 'Talep #${talepId.substring(0, 8)}';
  String get vehiclePlate => aracBilgileri?.plaka ?? aracId;
  String get driverName => sofor?.fullName ?? 'Belirtilmemiş';
}

class DriverInfo {
  DriverInfo({
    required this.ad,
    required this.soyad,
    required this.telefon,
  });

  factory DriverInfo.fromJson(Map<String, dynamic> json) {
    return DriverInfo(
      ad: json['ad'] as String,
      soyad: json['soyad'] as String,
      telefon: json['telefon'] as String,
    );
  }
  final String ad;
  final String soyad;
  final String telefon;

  String get fullName => '$ad $soyad';
}

class TaskRequest {
  TaskRequest({
    required this.id,
    required this.baslik,
    required this.aciklama,
    this.lokasyon,
  });

  factory TaskRequest.fromJson(Map<String, dynamic> json) {
    return TaskRequest(
      id: json['_id'] as String,
      baslik: json['baslik'] as String,
      aciklama: json['aciklama'] as String,
      lokasyon: json['lokasyon'] != null
          ? TaskLocation.fromJson(json['lokasyon'] as Map<String, dynamic>)
          : null,
    );
  }
  final String id;
  final String baslik;
  final String aciklama;
  final TaskLocation? lokasyon;
}

class TaskVehicle {
  TaskVehicle({
    required this.plaka,
    required this.aracTuru,
    required this.kapasite,
  });

  factory TaskVehicle.fromJson(Map<String, dynamic> json) {
    return TaskVehicle(
      plaka: json['plaka'] as String,
      aracTuru: json['aracTuru'] as String,
      kapasite: json['kapasite'] as int,
    );
  }
  final String plaka;
  final String aracTuru;
  final int kapasite;
}

class TaskLocation {
  TaskLocation({
    required this.adres,
    required this.lat,
    required this.lng,
  });

  factory TaskLocation.fromJson(Map<String, dynamic> json) {
    return TaskLocation(
      adres: json['adres'] as String,
      lat: (json['lat'] as num).toDouble(),
      lng: (json['lng'] as num).toDouble(),
    );
  }
  final String adres;
  final double lat;
  final double lng;
}
