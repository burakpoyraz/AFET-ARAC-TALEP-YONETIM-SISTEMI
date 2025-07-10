import '../../../features/vehicles/model/vehicle_model.dart';

/// Task model
class Task {
  /// Creates a task model
  Task({
    required this.id,
    required this.arac,
    required this.baslangicKonum,
    required this.bitisKonum,
    required this.durum,
    required this.tahminiSure,
    required this.tahminiMesafe,
    required this.olusturulmaTarihi,
    this.tamamlanmaTarihi,
  });

  /// Creates a task model from json
  factory Task.fromJson(Map<String, dynamic> json) {
    return Task(
      id: json['_id'] as String,
      arac: Vehicle.fromJson(json['arac'] as Map<String, dynamic>),
      baslangicKonum:
          Location.fromJson(json['baslangicKonum'] as Map<String, dynamic>),
      bitisKonum: Location.fromJson(json['bitisKonum'] as Map<String, dynamic>),
      durum: json['durum'] as String,
      tahminiSure: json['tahminiSure'] as int,
      tahminiMesafe: json['tahminiMesafe'] as int,
      olusturulmaTarihi: DateTime.parse(json['olusturulmaTarihi'] as String),
      tamamlanmaTarihi: json['tamamlanmaTarihi'] != null
          ? DateTime.parse(json['tamamlanmaTarihi'] as String)
          : null,
    );
  }

  /// Task id
  final String id;

  /// Task vehicle
  final Vehicle arac;

  /// Task start location
  final Location baslangicKonum;

  /// Task end location
  final Location bitisKonum;

  /// Task status
  final String durum;

  /// Task estimated duration
  final int tahminiSure;

  /// Task estimated distance
  final int tahminiMesafe;

  /// Task creation date
  final DateTime olusturulmaTarihi;

  /// Task completion date
  final DateTime? tamamlanmaTarihi;

  /// Converts task model to json
  Map<String, dynamic> toJson() {
    return {
      '_id': id,
      'arac': arac.toJson(),
      'baslangicKonum': baslangicKonum.toJson(),
      'bitisKonum': bitisKonum.toJson(),
      'durum': durum,
      'tahminiSure': tahminiSure,
      'tahminiMesafe': tahminiMesafe,
      'olusturulmaTarihi': olusturulmaTarihi.toIso8601String(),
      'tamamlanmaTarihi': tamamlanmaTarihi?.toIso8601String(),
    };
  }
}
