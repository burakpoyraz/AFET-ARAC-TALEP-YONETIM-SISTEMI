import '../../../features/vehicles/model/vehicle_model.dart';

/// Request model
class Request {
  /// Creates a request model
  Request({
    required this.id,
    required this.talepEdenKullaniciId,
    required this.talepEdenKurumFirmaId,
    required this.adres,
    required this.lokasyon,
    required this.durum,
    required this.olusturulmaTarihi,
    this.tamamlanmaTarihi,
  });

  /// Creates a request model from json
  factory Request.fromJson(Map<String, dynamic> json) {
    return Request(
      id: json['_id'] as String,
      talepEdenKullaniciId: json['talepEdenKullaniciId'] as String,
      talepEdenKurumFirmaId: json['talepEdenKurumFirmaId'] as String,
      adres: json['adres'] as String,
      lokasyon: Location.fromJson(json['lokasyon'] as Map<String, dynamic>),
      durum: json['durum'] as String,
      olusturulmaTarihi: DateTime.parse(json['olusturulmaTarihi'] as String),
      tamamlanmaTarihi: json['tamamlanmaTarihi'] != null
          ? DateTime.parse(json['tamamlanmaTarihi'] as String)
          : null,
    );
  }

  /// Request id
  final String id;

  /// Request user id
  final String talepEdenKullaniciId;

  /// Request organization id
  final String talepEdenKurumFirmaId;

  /// Request address
  final String adres;

  /// Request location
  final Location lokasyon;

  /// Request status
  final String durum;

  /// Request creation date
  final DateTime olusturulmaTarihi;

  /// Request completion date
  final DateTime? tamamlanmaTarihi;

  /// Converts request model to json
  Map<String, dynamic> toJson() {
    return {
      '_id': id,
      'talepEdenKullaniciId': talepEdenKullaniciId,
      'talepEdenKurumFirmaId': talepEdenKurumFirmaId,
      'adres': adres,
      'lokasyon': lokasyon.toJson(),
      'durum': durum,
      'olusturulmaTarihi': olusturulmaTarihi.toIso8601String(),
      'tamamlanmaTarihi': tamamlanmaTarihi?.toIso8601String(),
    };
  }
}
