import 'package:afet_arac_takip/features/tasks/model/task_model.dart';
import 'package:afet_arac_takip/product/network/network_manager.dart';
import 'package:dio/dio.dart';
import 'package:flutter/material.dart';

/// [TalepEdenTasksViewModel] manages tasks for talep_eden users
/// Provides tracking of tasks related to their organization's requests
class TalepEdenTasksViewModel extends ChangeNotifier {
  final NetworkManager _networkManager = NetworkManager.instance;

  List<Task> _organizationTasks = [];
  List<Task> get organizationTasks => _organizationTasks;

  bool _isLoading = false;
  bool get isLoading => _isLoading;

  String? _error;
  String? get error => _error;

  /// [loadOrganizationTasks] fetches tasks related to user's organization
  Future<void> loadOrganizationTasks() async {
    try {
      _isLoading = true;
      _error = null;
      notifyListeners();

      print('[TalepEdenTasksViewModel] 🔄 Loading organization tasks...');

      final response = await _networkManager.dio
          .get<List<dynamic>>('/gorevler/talep-eden-kurum');

      if (response.statusCode == 200) {
        final data = response.data!;
        _organizationTasks =
            data.map((e) => Task.fromJson(e as Map<String, dynamic>)).toList();

        print(
            '[TalepEdenTasksViewModel] ✅ Loaded ${_organizationTasks.length} organization tasks');
        print('[TalepEdenTasksViewModel] 📊 Task status breakdown:');
        print(
            '  - Beklemede: ${_organizationTasks.where((t) => t.gorevDurumu == "beklemede").length}');
        print(
            '  - Başladı: ${_organizationTasks.where((t) => t.gorevDurumu == "başladı").length}');
        print(
            '  - Tamamlandı: ${_organizationTasks.where((t) => t.gorevDurumu == "tamamlandı").length}');
        print(
            '  - İptal Edildi: ${_organizationTasks.where((t) => t.gorevDurumu == "iptal edildi").length}');
      } else {
        throw Exception('API returned status code: ${response.statusCode}');
      }
    } on DioException catch (e) {
      _error = 'Görevler yüklenirken hata oluştu: $e';
      print('[TalepEdenTasksViewModel] ❌ Error loading tasks: $e');
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  /// [getFilteredTasks] returns tasks filtered by search query and status
  List<Task> getFilteredTasks(String searchQuery, String status) {
    var filtered = _organizationTasks;

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

  /// [getTaskStatistics] returns statistics about organization's tasks
  Map<String, int> getTaskStatistics() {
    return {
      'toplam': _organizationTasks.length,
      'beklemede':
          _organizationTasks.where((t) => t.gorevDurumu == 'beklemede').length,
      'basladi':
          _organizationTasks.where((t) => t.gorevDurumu == 'başladı').length,
      'tamamlandi':
          _organizationTasks.where((t) => t.gorevDurumu == 'tamamlandı').length,
      'iptal': _organizationTasks
          .where((t) => t.gorevDurumu == 'iptal edildi')
          .length,
    };
  }

  /// [getTaskById] returns a specific task by ID
  Task? getTaskById(String taskId) {
    try {
      return _organizationTasks.firstWhere((task) => task.id == taskId);
    } on DioException {
      return null;
    }
  }

  /// [getActiveTasksCount] returns count of active tasks (beklemede + başladı)
  int getActiveTasksCount() {
    return _organizationTasks
        .where(
            (t) => t.gorevDurumu == 'beklemede' || t.gorevDurumu == 'başladı')
        .length;
  }

  /// [getCompletedTasksCount] returns count of completed tasks
  int getCompletedTasksCount() {
    return _organizationTasks
        .where((t) => t.gorevDurumu == 'tamamlandı')
        .length;
  }

  /// [getTasksInProgress] returns tasks that are currently in progress
  List<Task> getTasksInProgress() {
    return _organizationTasks.where((t) => t.gorevDurumu == 'başladı').toList();
  }

  /// [getPendingTasks] returns tasks that are waiting to be started
  List<Task> getPendingTasks() {
    return _organizationTasks
        .where((t) => t.gorevDurumu == 'beklemede')
        .toList();
  }

  /// [getRecentTasks] returns most recent tasks (limit to 5)
  List<Task> getRecentTasks({int limit = 5}) {
    final sortedTasks = List<Task>.from(_organizationTasks)
      ..sort((a, b) => b.olusturulmaZamani.compareTo(a.olusturulmaZamani));
    return sortedTasks.take(limit).toList();
  }

  /// [clearError] clears any error message
  void clearError() {
    _error = null;
    notifyListeners();
  }

  /// [refreshTasks] convenience method to refresh task data
  Future<void> refreshTasks() async {
    await loadOrganizationTasks();
  }
}
