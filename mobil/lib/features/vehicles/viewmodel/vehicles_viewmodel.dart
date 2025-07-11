import 'dart:async';

import 'package:afet_arac_takip/features/vehicles/model/vehicle_model.dart';
import 'package:afet_arac_takip/features/vehicles/service/vehicle_location_service.dart';
import 'package:afet_arac_takip/product/network/network_manager.dart';
import 'package:flutter/material.dart';

/// Vehicles view model
class VehiclesViewModel extends ChangeNotifier {
  VehiclesViewModel() {
    _initLocationUpdates();
  }
  final NetworkManager _networkManager = NetworkManager.instance;
  final VehicleLocationService _locationService =
      VehicleLocationService.instance;

  StreamSubscription<Map<String, Location>>? _locationSubscription;

  void _initLocationUpdates() {
    _locationSubscription = _locationService.locationStream.listen((locations) {
      var updated = false;
      for (final vehicle in _vehicles) {
        if (locations.containsKey(vehicle.plaka)) {
          final index = _vehicles.indexOf(vehicle);
          _vehicles[index] = Vehicle(
            plaka: vehicle.plaka,
            aracTuru: vehicle.aracTuru,
            kullanimAmaci: vehicle.kullanimAmaci,
            kapasite: vehicle.kapasite,
            aracDurumu: vehicle.aracDurumu,
            musaitlikDurumu: vehicle.musaitlikDurumu,
            konum: locations[vehicle.plaka],
            marka: vehicle.marka,
            model: vehicle.model,
          );
          updated = true;
        }
      }
      if (updated) notifyListeners();
    });

    _locationService.startLocationUpdates();
  }

  List<Vehicle> _vehicles = [];
  List<Vehicle> get vehicles => _filteredVehicles;

  List<Vehicle> get _filteredVehicles {
    if (_searchQuery.isEmpty) return _vehicles;

    return _vehicles.where((vehicle) {
      return vehicle.plaka.toLowerCase().contains(_searchQuery.toLowerCase()) ||
          vehicle.aracTuru.toLowerCase().contains(_searchQuery.toLowerCase()) ||
          vehicle.kullanimAmaci
              .toLowerCase()
              .contains(_searchQuery.toLowerCase()) ||
          (vehicle.marka?.toLowerCase().contains(_searchQuery.toLowerCase()) ??
              false) ||
          (vehicle.model?.toLowerCase().contains(_searchQuery.toLowerCase()) ??
              false);
    }).toList();
  }

  String _searchQuery = '';
  String get searchQuery => _searchQuery;

  set searchQuery(String value) {
    _searchQuery = value;
    notifyListeners();
  }

  /// Loading states for different operations
  bool _isLoading = false;
  bool get isLoading => _isLoading;

  bool _isAdding = false;
  bool get isAdding => _isAdding;

  bool _isUpdating = false;
  bool get isUpdating => _isUpdating;

  bool _isDeleting = false;
  bool get isDeleting => _isDeleting;

  /// Error states
  String? _error;
  String? get error => _error;

  /// Clear error
  void clearError() {
    _error = null;
    notifyListeners();
  }

  /// Set error
  void _setError(String message) {
    _error = message;
    notifyListeners();
  }

  /// Get vehicles
  Future<void> getVehicles() async {
    if (_isLoading) return;

    try {
      _isLoading = true;
      notifyListeners();

      final response = await _networkManager.dio
          .get<Map<String, dynamic>>('/arac/araclarim');

      if (response.statusCode == 200) {
        final data = response.data! as List<dynamic>;
        _vehicles = data
            .map((e) => Vehicle.fromJson(e as Map<String, dynamic>))
            .toList();
        notifyListeners();
      } else {
        _setError('Araçlar yüklenirken bir hata oluştu');
      }
    } on Exception catch (e) {
      debugPrint('[VehiclesViewModel] Get vehicles error: $e');
      _setError('Araçlar yüklenirken bir hata oluştu');
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  /// Add vehicle
  Future<bool> addVehicle(Vehicle vehicle) async {
    if (_isAdding) return false;

    try {
      _isAdding = true;
      notifyListeners();

      final response = await _networkManager.dio.post<Map<String, dynamic>>(
        '/arac',
        data: vehicle.toJson(),
      );

      if (response.statusCode == 200) {
        await getVehicles();
        return true;
      } else {
        _setError('Araç eklenirken bir hata oluştu');
        return false;
      }
    } on Exception catch (e) {
      debugPrint('[VehiclesViewModel] Add vehicle error: $e');
      _setError('Araç eklenirken bir hata oluştu');
      return false;
    } finally {
      _isAdding = false;
      notifyListeners();
    }
  }

  /// Update vehicle
  Future<bool> updateVehicle(Vehicle vehicle) async {
    if (_isUpdating) return false;

    try {
      _isUpdating = true;
      notifyListeners();

      final response = await _networkManager.dio.put<Map<String, dynamic>>(
        '/arac/${vehicle.plaka}',
        data: vehicle.toJson(),
      );

      if (response.statusCode == 200) {
        await getVehicles();
        return true;
      } else {
        _setError('Araç güncellenirken bir hata oluştu');
        return false;
      }
    } on Exception catch (e) {
      debugPrint('[VehiclesViewModel] Update vehicle error: $e');
      _setError('Araç güncellenirken bir hata oluştu');
      return false;
    } finally {
      _isUpdating = false;
      notifyListeners();
    }
  }

  /// Delete vehicle
  Future<bool> deleteVehicle(String plaka) async {
    if (_isDeleting) return false;

    try {
      _isDeleting = true;
      notifyListeners();

      final response = await _networkManager.dio
          .delete<Map<String, dynamic>>('/arac/$plaka');

      if (response.statusCode == 200) {
        await getVehicles();
        return true;
      } else {
        _setError('Araç silinirken bir hata oluştu');
        return false;
      }
    } on Exception catch (e) {
      debugPrint('[VehiclesViewModel] Delete vehicle error: $e');
      _setError('Araç silinirken bir hata oluştu');
      return false;
    } finally {
      _isDeleting = false;
      notifyListeners();
    }
  }

  /// Filter vehicles by status
  List<Vehicle> getVehiclesByStatus(String status) {
    return _filteredVehicles
        .where((vehicle) => vehicle.aracDurumu == status)
        .toList();
  }

  /// Get active vehicles
  List<Vehicle> get activeVehicles => getVehiclesByStatus('aktif');

  /// Get inactive vehicles
  List<Vehicle> get inactiveVehicles => getVehiclesByStatus('pasif');

  /// Get available vehicles
  List<Vehicle> get availableVehicles => _filteredVehicles
      .where((vehicle) => vehicle.musaitlikDurumu == true)
      .toList();

  @override
  void dispose() {
    _locationSubscription?.cancel();
    _locationService.stopLocationUpdates();
    super.dispose();
  }
}
