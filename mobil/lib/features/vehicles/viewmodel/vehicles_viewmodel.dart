import 'package:afet_arac_takip/features/vehicles/model/vehicle_model.dart';
import 'package:afet_arac_takip/product/network/network_manager.dart';
import 'package:flutter/material.dart';

/// Vehicles view model
class VehiclesViewModel extends ChangeNotifier {
  final NetworkManager _networkManager = NetworkManager.instance;

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

  /// Disposed state to prevent notifyListeners after dispose
  bool _disposed = false;

  /// Cache management
  DateTime? _lastFetchTime;
  static const Duration _cacheValidDuration = Duration(minutes: 2);
  bool get _isCacheValid =>
      _lastFetchTime != null &&
      DateTime.now().difference(_lastFetchTime!) < _cacheValidDuration;
  bool get hasData => _vehicles.isNotEmpty;

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

  /// Get vehicles with smart caching
  /// [forceRefresh] - Force API call even if cache is valid
  Future<void> getVehicles({bool forceRefresh = false}) async {
    // **[VehiclesViewModel]** Use cache if valid and not forcing refresh
    if (!forceRefresh && _isCacheValid && hasData) {
      debugPrint(
          '[VehiclesViewModel] 🔄 Using cached data (${_vehicles.length} vehicles)');
      return;
    }

    if (_isLoading) return;

    try {
      _isLoading = true;
      if (!_disposed) notifyListeners();

      debugPrint('[VehiclesViewModel] 🌐 Fetching vehicles from API...');
      // **[VehiclesViewModel]** Use coordinator endpoint for all vehicles
      final response =
          await _networkManager.dio.get<Map<String, dynamic>>('/araclar');

      if (response.statusCode == 200) {
        final data = response.data!;
        final vehiclesList = data['araclar'] as List<dynamic>;
        _vehicles = vehiclesList
            .map((e) => Vehicle.fromJson(e as Map<String, dynamic>))
            .toList();
        _lastFetchTime =
            DateTime.now(); // **[VehiclesViewModel]** Update cache timestamp
        debugPrint('[VehiclesViewModel] ✅ Loaded ${_vehicles.length} vehicles');
        if (!_disposed) notifyListeners();
      } else {
        debugPrint('[VehiclesViewModel] Bad response: ${response.statusCode}');
        _setError(
            'Araçlar yüklenirken bir hata oluştu (${response.statusCode})');
      }
    } on Exception catch (e) {
      debugPrint('[VehiclesViewModel] Get vehicles error: $e');
      _setError('Araçlar yüklenirken bir hata oluştu: $e');
    } finally {
      _isLoading = false;
      // **[VehiclesViewModel]** Check if disposed before notifying listeners
      if (!_disposed) {
        notifyListeners();
      }
    }
  }

  /// Force refresh data from API
  Future<void> refreshVehicles() async {
    await getVehicles(forceRefresh: true);
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
        await getVehicles(
            forceRefresh: true); // **[VehiclesViewModel]** Invalidate cache
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
        await getVehicles(
            forceRefresh: true); // **[VehiclesViewModel]** Invalidate cache
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
        await getVehicles(
            forceRefresh: true); // **[VehiclesViewModel]** Invalidate cache
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
    _disposed = true;
    super.dispose();
  }
}
