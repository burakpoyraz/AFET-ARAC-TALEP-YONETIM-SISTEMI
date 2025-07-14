import 'package:afet_arac_takip/features/tasks/model/task_model.dart';
import 'package:afet_arac_takip/features/vehicles/model/vehicle_model.dart';
import 'package:afet_arac_takip/product/network/network_manager.dart';
import 'package:dio/dio.dart';
import 'package:flutter/material.dart';

/// [KoordinatorTasksViewModel] manages all tasks for koordinator users
/// Provides task oversight, assignment management, and status updates
class KoordinatorTasksViewModel extends ChangeNotifier {
  final NetworkManager _networkManager = NetworkManager.instance;

  List<Task> _allTasks = [];
  List<Task> get allTasks => _allTasks;

  List<Vehicle> _availableVehicles = [];
  List<Vehicle> get availableVehicles => _availableVehicles;

  bool _isLoading = false;
  bool get isLoading => _isLoading;

  bool _isUpdatingTask = false;
  bool get isUpdatingTask => _isUpdatingTask;

  String? _error;
  String? get error => _error;

  /// Disposed state to prevent notifyListeners after dispose
  bool _disposed = false;

  /// Safe notify listeners that checks disposed state
  void _safeNotifyListeners() {
    if (!_disposed) {
      notifyListeners();
    }
  }

  /// [loadAllTasks] fetches all tasks in the system for koordinator oversight
  Future<void> loadAllTasks() async {
    try {
      _isLoading = true;
      _error = null;
      notifyListeners();

      print('[KoordinatorTasksViewModel] 🔄 Loading all tasks...');

      final response =
          await _networkManager.dio.get<List<dynamic>>('/gorevler');

      if (response.statusCode == 200) {
        final data = response.data!;
        _allTasks =
            data.map((e) => Task.fromJson(e as Map<String, dynamic>)).toList();

        print('[KoordinatorTasksViewModel] ✅ Loaded ${_allTasks.length} tasks');
        print('[KoordinatorTasksViewModel] 📊 Task status breakdown:');
        print(
            '  - Beklemede: ${_allTasks.where((t) => t.gorevDurumu == "beklemede").length}');
        print(
            '  - Başladı: ${_allTasks.where((t) => t.gorevDurumu == "başladı").length}');
        print(
            '  - Tamamlandı: ${_allTasks.where((t) => t.gorevDurumu == "tamamlandı").length}');
        print(
            '  - İptal Edildi: ${_allTasks.where((t) => t.gorevDurumu == "iptal edildi").length}');
      } else {
        throw Exception('API returned status code: ${response.statusCode}');
      }
    } on DioException catch (e) {
      _error = 'Görevler yüklenirken hata oluştu: $e';
      print('[KoordinatorTasksViewModel] ❌ Error loading tasks: $e');
    } finally {
      _isLoading = false;
      _safeNotifyListeners();
    }
  }

  /// [loadAvailableVehicles] fetches available vehicles for task assignment
  Future<void> loadAvailableVehicles() async {
    try {
      print('[KoordinatorTasksViewModel] 🔄 Loading available vehicles...');

      final response = await _networkManager.dio
          .get<Map<String, dynamic>>('/araclar/musaitaraclar');

      if (response.statusCode == 200) {
        final data = response.data!;
        final vehiclesList = data['musaitAraclar'] as List<dynamic>;
        _availableVehicles = vehiclesList
            .map((e) => Vehicle.fromJson(e as Map<String, dynamic>))
            .toList();

        print(
            '[KoordinatorTasksViewModel] ✅ Loaded ${_availableVehicles.length} available vehicles');
        notifyListeners();
      }
    } on DioException catch (e) {
      print(
          '[KoordinatorTasksViewModel] ❌ Error loading available vehicles: $e');
    }
  }

  /// [getFilteredTasks] returns tasks filtered by search query and status
  List<Task> getFilteredTasks(String searchQuery, String status) {
    var filtered = _allTasks;

    // Filter by status
    if (status != 'all') {
      filtered = filtered.where((task) => task.gorevDurumu == status).toList();
    }

    // Filter by search query
    if (searchQuery.isNotEmpty) {
      final query = searchQuery.toLowerCase();
      filtered = filtered.where((task) {
        return task.requestTitle.toLowerCase().contains(query) ||
            task.vehiclePlate.toLowerCase().contains(query) ||
            task.driverName.toLowerCase().contains(query) ||
            (task.gorevNotu?.toLowerCase().contains(query) ?? false) ||
            (task.talepBilgileri?.aciklama.toLowerCase().contains(query) ??
                false) ||
            (task.aracBilgileri?.aracTuru.toLowerCase().contains(query) ??
                false);
      }).toList();
    }

    // Sort by priority and creation date
    filtered.sort((a, b) {
      final statusPriority = {
        'beklemede': 0,
        'başladı': 1,
        'tamamlandı': 2,
        'iptal edildi': 3,
      };

      final aPriority = statusPriority[a.gorevDurumu] ?? 4;
      final bPriority = statusPriority[b.gorevDurumu] ?? 4;

      if (aPriority != bPriority) {
        return aPriority.compareTo(bPriority);
      }

      return b.olusturulmaZamani.compareTo(a.olusturulmaZamani);
    });

    return filtered;
  }

  /// [getTaskStatistics] returns statistics about all tasks
  Map<String, int> getTaskStatistics() {
    return {
      'toplam': _allTasks.length,
      'beklemede': _allTasks.where((t) => t.gorevDurumu == 'beklemede').length,
      'basladi': _allTasks.where((t) => t.gorevDurumu == 'başladı').length,
      'tamamlandi':
          _allTasks.where((t) => t.gorevDurumu == 'tamamlandı').length,
      'iptal': _allTasks.where((t) => t.gorevDurumu == 'iptal edildi').length,
    };
  }

  /// [updateTaskStatus] updates the status of a specific task
  Future<bool> updateTaskStatus(String taskId, String newStatus) async {
    try {
      _isUpdatingTask = true;
      _error = null;
      notifyListeners();

      print(
          '[KoordinatorTasksViewModel] 🔄 Updating task $taskId to $newStatus...');

      final response = await _networkManager.dio.put<Map<String, dynamic>>(
        '/gorevler/$taskId',
        data: {'gorevDurumu': newStatus},
      );

      if (response.statusCode == 200) {
        print('[KoordinatorTasksViewModel] ✅ Task status updated successfully');

        // Update local state
        final index = _allTasks.indexWhere((t) => t.id == taskId);
        if (index != -1) {
          _allTasks[index] = Task.fromJson(response.data!);
        }
        notifyListeners();
        return true;
      } else {
        throw Exception('API returned status code: ${response.statusCode}');
      }
    } on DioException catch (e) {
      _error = 'Görev durumu güncellenirken hata oluştu: $e';
      print('[KoordinatorTasksViewModel] ❌ Error updating task status: $e');
      notifyListeners();
      return false;
    } finally {
      _isUpdatingTask = false;
      notifyListeners();
    }
  }

  /// [assignVehicleToTask] assigns a vehicle to a task
  Future<bool> assignVehicleToTask(String taskId, String vehicleId) async {
    try {
      _isUpdatingTask = true;
      _error = null;
      notifyListeners();

      print(
          '[KoordinatorTasksViewModel] 🔄 Assigning vehicle $vehicleId to task $taskId...');

      final response = await _networkManager.dio.put<Map<String, dynamic>>(
        '/gorevler/$taskId/arac-ata',
        data: {'aracId': vehicleId},
      );

      if (response.statusCode == 200) {
        print('[KoordinatorTasksViewModel] ✅ Vehicle assigned successfully');

        // Reload tasks to get updated data
        await loadAllTasks();
        return true;
      } else {
        throw Exception('API returned status code: ${response.statusCode}');
      }
    } on DioException catch (e) {
      _error = 'Araç atama sırasında hata oluştu: $e';
      print('[KoordinatorTasksViewModel] ❌ Error assigning vehicle: $e');
      notifyListeners();
      return false;
    } finally {
      _isUpdatingTask = false;
      notifyListeners();
    }
  }

  /// [cancelTask] cancels a task
  Future<bool> cancelTask(String taskId, String reason) async {
    try {
      _isUpdatingTask = true;
      _error = null;
      notifyListeners();

      print('[KoordinatorTasksViewModel] 🔄 Cancelling task $taskId...');

      final response = await _networkManager.dio.put<Map<String, dynamic>>(
        '/gorevler/$taskId',
        data: {
          'gorevDurumu': 'iptal edildi',
          'gorevNotu': reason,
        },
      );

      if (response.statusCode == 200) {
        print('[KoordinatorTasksViewModel] ✅ Task cancelled successfully');

        // Update local state
        final index = _allTasks.indexWhere((t) => t.id == taskId);
        if (index != -1) {
          _allTasks[index] = Task.fromJson(response.data!);
        }
        notifyListeners();
        return true;
      } else {
        throw Exception('API returned status code: ${response.statusCode}');
      }
    } on DioException catch (e) {
      _error = 'Görev iptal edilirken hata oluştu: $e';
      print('[KoordinatorTasksViewModel] ❌ Error cancelling task: $e');
      notifyListeners();
      return false;
    } finally {
      _isUpdatingTask = false;
      notifyListeners();
    }
  }

  /// [clearError] clears any error message
  void clearError() {
    _error = null;
    notifyListeners();
  }

  /// [getTaskById] returns a specific task by ID
  Task? getTaskById(String taskId) {
    try {
      return _allTasks.firstWhere((task) => task.id == taskId);
    } on DioException {
      return null;
    }
  }

  /// [getTasksByVehicle] returns tasks for a specific vehicle
  List<Task> getTasksByVehicle(String vehicleId) {
    return _allTasks.where((task) => task.aracId == vehicleId).toList();
  }

  /// [getActiveTasksCount] returns count of active tasks (beklemede + başladı)
  int getActiveTasksCount() {
    return _allTasks
        .where(
            (t) => t.gorevDurumu == 'beklemede' || t.gorevDurumu == 'başladı')
        .length;
  }

  @override
  void dispose() {
    _disposed = true;
    super.dispose();
  }
}
