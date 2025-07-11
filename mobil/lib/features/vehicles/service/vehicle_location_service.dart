import 'dart:async';

import 'package:afet_arac_takip/features/vehicles/model/vehicle_model.dart';
import 'package:afet_arac_takip/product/network/network_manager.dart';
import 'package:flutter/foundation.dart';

/// Service to handle real-time vehicle location updates
class VehicleLocationService {
  /// Private constructor
  VehicleLocationService._();

  /// Singleton instance
  static final VehicleLocationService instance = VehicleLocationService._();

  final NetworkManager _networkManager = NetworkManager.instance;

  /// Stream controller for location updates
  final _locationController =
      StreamController<Map<String, Location>>.broadcast();

  /// Stream of location updates
  Stream<Map<String, Location>> get locationStream =>
      _locationController.stream;

  Timer? _updateTimer;
  bool _isUpdating = false;

  /// Start location updates
  void startLocationUpdates({int intervalSeconds = 30}) {
    if (_isUpdating) return;
    _isUpdating = true;

    // Initial update
    _updateLocations();

    // Schedule periodic updates
    _updateTimer = Timer.periodic(
      Duration(seconds: intervalSeconds),
      (_) => _updateLocations(),
    );
  }

  /// Stop location updates
  void stopLocationUpdates() {
    _updateTimer?.cancel();
    _updateTimer = null;
    _isUpdating = false;
  }

  /// Update vehicle locations
  Future<void> _updateLocations() async {
    try {
      final response = await _networkManager.dio
          .get<Map<String, dynamic>>('/arac/locations');

      if (response.statusCode == 200) {
        final data = response.data!;
        final locations = <String, Location>{};

        data.forEach((plaka, locationData) {
          if (locationData != null) {
            locations[plaka] =
                Location.fromJson(locationData as Map<String, dynamic>);
          }
        });

        _locationController.add(locations);
      }
    } on Exception catch (e) {
      debugPrint('[VehicleLocationService] Update locations error: $e');
    }
  }

  /// Update single vehicle location
  Future<void> updateVehicleLocation(String plaka, Location location) async {
    try {
      await _networkManager.dio.post<Map<String, dynamic>>(
        '/arac/$plaka/location',
        data: location.toJson(),
      );
    } on Exception catch (e) {
      debugPrint('[VehicleLocationService] Update vehicle location error: $e');
    }
  }

  /// Dispose service
  void dispose() {
    stopLocationUpdates();
    _locationController.close();
  }
}
