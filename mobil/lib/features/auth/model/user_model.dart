/// User model class for handling user data
class User {
  User({
    required this.id,
    required this.ad,
    required this.soyad,
    required this.email,
    required this.rol,
    this.telefon,
    this.kurumFirmaId,
    this.kullaniciBeyanBilgileri,
  });

  factory User.fromJson(Map<String, dynamic> json) {
    return User(
      id: json['_id'] as String? ?? '',
      ad: json['ad'] as String? ?? '',
      soyad: json['soyad'] as String? ?? '',
      email: json['email'] as String? ?? '',
      telefon: json['telefon'] as String?,
      rol: json['rol'] as String? ?? 'beklemede',
      kurumFirmaId: json['kurumFirmaId'] != null
          ? KurumFirma.fromJson(json['kurumFirmaId'] as Map<String, dynamic>)
          : null,
      kullaniciBeyanBilgileri: json['kullaniciBeyanBilgileri'] != null
          ? KullaniciBeyanBilgileri.fromJson(
              json['kullaniciBeyanBilgileri'] as Map<String, dynamic>)
          : null,
    );
  }
  final String id;
  final String ad;
  final String soyad;
  final String email;
  final String? telefon;
  final String rol;
  final KurumFirma? kurumFirmaId;
  final KullaniciBeyanBilgileri? kullaniciBeyanBilgileri;

  Map<String, dynamic> toJson() {
    return {
      '_id': id,
      'ad': ad,
      'soyad': soyad,
      'email': email,
      'telefon': telefon,
      'rol': rol,
      'kurumFirmaId': kurumFirmaId?.toJson(),
      'kullaniciBeyanBilgileri': kullaniciBeyanBilgileri?.toJson(),
    };
  }

  String get fullName => '$ad $soyad';

  String get displayRole {
    switch (rol) {
      case 'arac_sahibi':
        return 'Araç Sahibi';
      case 'talep_eden':
        return 'Talep Eden';
      case 'koordinator':
        return 'Koordinatör';
      case 'beklemede':
        return 'Beklemede';
      default:
        return rol;
    }
  }

  bool get isKoordinator => rol == 'koordinator';
  bool get isAracSahibi => rol == 'arac_sahibi';
  bool get isTalepEden => rol == 'talep_eden';
  bool get isBeklemede => rol == 'beklemede';
}

class KurumFirma {
  KurumFirma({
    required this.id,
    required this.kurumAdi,
  });

  factory KurumFirma.fromJson(Map<String, dynamic> json) {
    return KurumFirma(
      id: json['_id'] as String? ?? '',
      kurumAdi: json['kurumAdi'] as String? ?? '',
    );
  }
  final String id;
  final String kurumAdi;

  Map<String, dynamic> toJson() {
    return {
      '_id': id,
      'kurumAdi': kurumAdi,
    };
  }
}

class KullaniciBeyanBilgileri {
  KullaniciBeyanBilgileri({
    this.kurumFirmaAdi,
    this.kurumFirmaTuru,
  });

  factory KullaniciBeyanBilgileri.fromJson(Map<String, dynamic> json) {
    return KullaniciBeyanBilgileri(
      kurumFirmaAdi: json['kurumFirmaAdi'] as String?,
      kurumFirmaTuru: json['kurumFirmaTuru'] as String?,
    );
  }
  final String? kurumFirmaAdi;
  final String? kurumFirmaTuru;

  Map<String, dynamic> toJson() {
    return {
      'kurumFirmaAdi': kurumFirmaAdi,
      'kurumFirmaTuru': kurumFirmaTuru,
    };
  }

  String get displayType {
    switch (kurumFirmaTuru) {
      case 'kurulus_adina':
        return 'Kuruluş Adına';
      case 'kendi_adima':
        return 'Kendi Adına';
      default:
        return kurumFirmaTuru ?? '';
    }
  }
}
