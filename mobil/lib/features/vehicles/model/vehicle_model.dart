/// Vehicle model
class Vehicle {
  /// Creates a vehicle model
  Vehicle({
    required this.plaka,
    required this.marka,
    required this.model,
    required this.kapasite,
    required this.durum,
    this.konum,
  });

  /// Creates a vehicle model from json
  factory Vehicle.fromJson(Map<String, dynamic> json) {
    return Vehicle(
      plaka: json['plaka'] as String,
      marka: json['marka'] as String,
      model: json['model'] as String,
      kapasite: json['kapasite'] as int,
      durum: json['durum'] as String,
      konum: json['konum'] != null
          ? Location.fromJson(json['konum'] as Map<String, dynamic>)
          : null,
    );
  }

  /// Vehicle plate number
  final String plaka;

  /// Vehicle brand
  final String marka;

  /// Vehicle model
  final String model;

  /// Vehicle capacity
  final int kapasite;

  /// Vehicle status
  final String durum;

  /// Vehicle location
  final Location? konum;

  /// Converts vehicle model to json
  Map<String, dynamic> toJson() {
    return {
      'plaka': plaka,
      'marka': marka,
      'model': model,
      'kapasite': kapasite,
      'durum': durum,
      'konum': konum?.toJson(),
    };
  }
}

/// Location model
class Location {
  /// Creates a location model
  Location({required this.lat, required this.lng});

  /// Creates a location model from json
  factory Location.fromJson(Map<String, dynamic> json) {
    return Location(lat: json['lat'] as double, lng: json['lng'] as double);
  }

  /// Latitude
  final double lat;

  /// Longitude
  final double lng;

  /// Converts location model to json
  Map<String, dynamic> toJson() {
    return {'lat': lat, 'lng': lng};
  }
}
