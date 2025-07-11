import 'package:afet_arac_takip/features/vehicles/model/vehicle_model.dart';
import 'package:afet_arac_takip/product/network/network_manager.dart';
import 'package:dio/dio.dart';
import 'package:flutter/material.dart';

/// My vehicles viewmodel for arac_sahibi users
class MyVehiclesViewModel extends ChangeNotifier {
  final NetworkManager _networkManager = NetworkManager.instance;

  List<Vehicle> _vehicles = [];
  List<Vehicle> get vehicles => _vehicles;

  bool _isLoading = false;
  bool get isLoading => _isLoading;

  String? _error;
  String? get error => _error;

  /// Load my vehicles
  Future<void> loadMyVehicles() async {
    try {
      _isLoading = true;
      _error = null;
      notifyListeners();

      final response = await _networkManager.dio
          .get<Map<String, dynamic>>('/araclar/araclarim');
      if (response.statusCode == 200) {
        final data = response.data!;
        final vehiclesList = data['araclar'] as List<dynamic>;
        _vehicles = vehiclesList
            .map((e) => Vehicle.fromJson(e as Map<String, dynamic>))
            .toList();
      }
    } on DioException catch (e) {
      _error = 'Araçlar yüklenirken hata oluştu: $e';
      debugPrint('[MyVehiclesViewModel] Error loading vehicles: $e');
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  /// Get filtered vehicles based on search and status
  List<Vehicle> getFilteredVehicles(String searchQuery, String status) {
    var filtered = _vehicles;

    // Filter by status
    switch (status) {
      case 'aktif':
        filtered =
            filtered.where((vehicle) => vehicle.aracDurumu == 'aktif').toList();
      case 'pasif':
        filtered =
            filtered.where((vehicle) => vehicle.aracDurumu == 'pasif').toList();
      case 'musait':
        filtered = filtered
            .where((vehicle) => vehicle.musaitlikDurumu == true)
            .toList();
      case 'mesgul':
        filtered = filtered
            .where((vehicle) => vehicle.musaitlikDurumu == false)
            .toList();
    }

    // Filter by search query
    if (searchQuery.isNotEmpty) {
      final query = searchQuery.toLowerCase();
      filtered = filtered.where((vehicle) {
        return vehicle.plaka.toLowerCase().contains(query) ||
            vehicle.aracTuru.toLowerCase().contains(query) ||
            vehicle.kullanimAmaci.toLowerCase().contains(query);
      }).toList();
    }

    // Sort by status (aktif and müsait first)
    filtered.sort((a, b) {
      final aScore =
          (a.aracDurumu == 'aktif' ? 2 : 0) + (a.musaitlikDurumu ? 1 : 0);
      final bScore =
          (b.aracDurumu == 'aktif' ? 2 : 0) + (b.musaitlikDurumu ? 1 : 0);
      return bScore.compareTo(aScore);
    });

    return filtered;
  }

  /// Add a new vehicle
  Future<bool> addVehicle(Map<String, dynamic> vehicleData) async {
    try {
      _isLoading = true;
      notifyListeners();

      final response = await _networkManager.dio
          .post<Map<String, dynamic>>('/araclar', data: vehicleData);
      if (response.statusCode == 201) {
        await loadMyVehicles(); // Reload vehicles
        return true;
      }
      return false;
    } on DioException catch (e) {
      _error = 'Araç eklenirken hata oluştu: $e';
      debugPrint('[MyVehiclesViewModel] Error adding vehicle: $e');
      return false;
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  /// Update a vehicle
  Future<bool> updateVehicle(
      String plaka, Map<String, dynamic> vehicleData) async {
    try {
      _isLoading = true;
      notifyListeners();

      final response = await _networkManager.dio.put<Map<String, dynamic>>(
        '/araclar/$plaka',
        data: vehicleData,
      );
      if (response.statusCode == 200) {
        await loadMyVehicles(); // Reload vehicles
        return true;
      }
      return false;
    } on DioException catch (e) {
      _error = 'Araç güncellenirken hata oluştu: $e';
      debugPrint('[MyVehiclesViewModel] Error updating vehicle: $e');
      return false;
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  /// Delete a vehicle
  Future<bool> deleteVehicle(String plaka) async {
    try {
      _isLoading = true;
      notifyListeners();

      final response = await _networkManager.dio
          .delete<Map<String, dynamic>>('/araclar/$plaka');
      if (response.statusCode == 200) {
        _vehicles.removeWhere((vehicle) => vehicle.plaka == plaka);
        notifyListeners();
        return true;
      }
      return false;
    } on DioException catch (e) {
      _error = 'Araç silinirken hata oluştu: $e';
      debugPrint('[MyVehiclesViewModel] Error deleting vehicle: $e');
      return false;
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  /// Toggle vehicle availability
  Future<bool> toggleVehicleAvailability(String plaka,
      {required bool isAvailable}) async {
    _isLoading = true;
    notifyListeners();

    try {
      final response = await _networkManager.dio.put<Map<String, dynamic>>(
        '/araclar/$plaka',
        data: {'musaitlikDurumu': isAvailable},
      );

      if (response.statusCode == 200) {
        // Update local state
        final index = _vehicles.indexWhere((v) => v.plaka == plaka);
        if (index != -1) {
          _vehicles[index] = Vehicle.fromJson(response.data!);
          notifyListeners();
        }
        return true;
      }
      return false;
    } on DioException catch (e) {
      _error = 'Araç durumu güncellenirken hata oluştu: $e';
      debugPrint('[MyVehiclesViewModel] Error toggling availability: $e');
      return false;
    }
  }

  /// Clear error message
  void clearError() {
    _error = null;
    notifyListeners();
  }
}
