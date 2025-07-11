import 'package:afet_arac_takip/features/tasks/model/task_model.dart';
import 'package:afet_arac_takip/product/network/network_manager.dart';
import 'package:dio/dio.dart';
import 'package:flutter/material.dart';

/// My tasks viewmodel for arac_sahibi users
class MyTasksViewModel extends ChangeNotifier {
  final NetworkManager _networkManager = NetworkManager.instance;

  List<Task> _tasks = [];
  List<Task> get tasks => _tasks;

  bool _isLoading = false;
  bool get isLoading => _isLoading;

  String? _error;
  String? get error => _error;

  /// Load my tasks
  Future<void> loadMyTasks() async {
    try {
      _isLoading = true;
      _error = null;
      notifyListeners();

      final response =
          await _networkManager.dio.get<List<dynamic>>('/gorevler/arac-sahibi');
      if (response.statusCode == 200) {
        final data = response.data!;
        _tasks =
            data.map((e) => Task.fromJson(e as Map<String, dynamic>)).toList();
      }
    } on DioException catch (e) {
      _error = 'Görevler yüklenirken hata oluştu: $e';
      debugPrint('[MyTasksViewModel] Error loading tasks: $e');
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  /// Get filtered tasks based on search and status
  List<Task> getFilteredTasks(String searchQuery, String status) {
    var filtered = _tasks;

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
            (task.gorevNotu?.toLowerCase().contains(query) ?? false);
      }).toList();
    }

    // Sort by priority (beklemede and başladı first, then by creation date)
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

  /// Update task status
  Future<bool> updateTaskStatus(String taskId, String newStatus) async {
    try {
      _isLoading = true;
      notifyListeners();

      final response = await _networkManager.dio.put<Map<String, dynamic>>(
        '/gorevler/$taskId',
        data: {'gorevDurumu': newStatus},
      );

      if (response.statusCode == 200) {
        // Update local state
        final index = _tasks.indexWhere((t) => t.id == taskId);
        if (index != -1) {
          _tasks[index] = Task.fromJson(response.data!);
        }
        notifyListeners();
        return true;
      }
      return false;
    } on DioException catch (e) {
      _error = 'Görev durumu güncellenirken hata oluştu: $e';
      debugPrint('[MyTasksViewModel] Error updating task status: $e');
      return false;
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  /// Clear error message
  void clearError() {
    _error = null;
    notifyListeners();
  }
}
