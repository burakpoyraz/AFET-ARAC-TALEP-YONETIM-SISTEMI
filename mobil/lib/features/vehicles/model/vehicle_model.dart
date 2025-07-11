/// Vehicle model
class Vehicle {
  /// Creates a vehicle model
  Vehicle({
    required this.plaka,
    required this.aracTuru,
    required this.kullanimAmaci,
    required this.kapasite,
    required this.aracDurumu,
    required this.musaitlikDurumu,
    this.konum,
    this.marka,
    this.model,
  });

  /// Creates a vehicle model from json
  factory Vehicle.fromJson(Map<String, dynamic> json) {
    return Vehicle(
      plaka: json['plaka'] as String,
      aracTuru: json['aracTuru'] as String,
      kullanimAmaci: json['kullanimAmaci'] as String,
      kapasite: json['kapasite'] as int,
      aracDurumu: json['aracDurumu'] as String,
      musaitlikDurumu: json['musaitlikDurumu'] as bool,
      konum: json['konum'] != null
          ? Location.fromJson(json['konum'] as Map<String, dynamic>)
          : null,
      marka: json['marka'] as String?,
      model: json['model'] as String?,
    );
  }

  /// Vehicle plate number
  final String plaka;

  /// Vehicle type (otomobil, kamyon, etc.)
  final String aracTuru;

  /// Vehicle usage purpose (yolcu, yuk, etc.)
  final String kullanimAmaci;

  /// Vehicle capacity
  final int kapasite;

  /// Vehicle status (aktif, pasif)
  final String aracDurumu;

  /// Vehicle availability status
  final bool musaitlikDurumu;

  /// Vehicle location
  final Location? konum;

  /// Vehicle brand (optional)
  final String? marka;

  /// Vehicle model (optional)
  final String? model;

  /// Converts vehicle model to json
  Map<String, dynamic> toJson() {
    return {
      'plaka': plaka,
      'aracTuru': aracTuru,
      'kullanimAmaci': kullanimAmaci,
      'kapasite': kapasite,
      'aracDurumu': aracDurumu,
      'musaitlikDurumu': musaitlikDurumu,
      'konum': konum?.toJson(),
      'marka': marka,
      'model': model,
    };
  }
}

/// Location model
class Location {
  /// Creates a location model
  Location({
    required this.lat,
    required this.lng,
    required this.adres,
  });

  /// Creates a location model from json
  factory Location.fromJson(Map<String, dynamic> json) {
    return Location(
      lat: (json['lat'] as num).toDouble(),
      lng: (json['lng'] as num).toDouble(),
      adres: json['adres'] as String,
    );
  }

  /// Latitude
  final double lat;

  /// Longitude
  final double lng;

  /// Address
  final String adres;

  /// Converts location model to json
  Map<String, dynamic> toJson() {
    return {
      'lat': lat,
      'lng': lng,
      'adres': adres,
    };
  }
}
