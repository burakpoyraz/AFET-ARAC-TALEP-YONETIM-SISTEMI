import 'package:flutter/material.dart';

import '../../../product/network/network_manager.dart';
import '../model/vehicle_model.dart';

/// Vehicles view model
class VehiclesViewModel extends ChangeNotifier {
  final _networkManager = NetworkManager.instance;

  List<Vehicle> _vehicles = [];
  List<Vehicle> get vehicles => _vehicles;

  bool _isLoading = false;
  bool get isLoading => _isLoading;

  set isLoading(bool value) {
    _isLoading = value;
    notifyListeners();
  }

  /// Get vehicles
  Future<void> getVehicles() async {
    try {
      isLoading = true;

      final response = await _networkManager.dio.get('/arac/araclarim');

      if (response.statusCode == 200) {
        final List<dynamic> data = response.data;
        _vehicles = data.map((e) => Vehicle.fromJson(e)).toList();
        notifyListeners();
      }
    } catch (e) {
      debugPrint('Get vehicles error: $e');
    } finally {
      isLoading = false;
    }
  }

  /// Add vehicle
  Future<void> addVehicle(Vehicle vehicle) async {
    try {
      isLoading = true;

      final response = await _networkManager.dio.post(
        '/arac',
        data: vehicle.toJson(),
      );

      if (response.statusCode == 200) {
        await getVehicles();
      }
    } catch (e) {
      debugPrint('Add vehicle error: $e');
    } finally {
      isLoading = false;
    }
  }

  /// Update vehicle
  Future<void> updateVehicle(Vehicle vehicle) async {
    try {
      isLoading = true;

      final response = await _networkManager.dio.put(
        '/arac/${vehicle.plaka}',
        data: vehicle.toJson(),
      );

      if (response.statusCode == 200) {
        await getVehicles();
      }
    } catch (e) {
      debugPrint('Update vehicle error: $e');
    } finally {
      isLoading = false;
    }
  }

  /// Delete vehicle
  Future<void> deleteVehicle(String plaka) async {
    try {
      isLoading = true;

      final response = await _networkManager.dio.delete('/arac/$plaka');

      if (response.statusCode == 200) {
        await getVehicles();
      }
    } catch (e) {
      debugPrint('Delete vehicle error: $e');
    } finally {
      isLoading = false;
    }
  }
}
