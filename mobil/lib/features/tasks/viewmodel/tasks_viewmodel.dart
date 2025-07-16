import 'package:afet_arac_takip/features/tasks/model/task_model.dart';
import 'package:afet_arac_takip/product/network/network_manager.dart';
import 'package:flutter/material.dart';

/// Tasks view model
class TasksViewModel extends ChangeNotifier {
  final NetworkManager _networkManager = NetworkManager.instance;

  List<Task> _tasks = [];
  List<Task> get tasks => _tasks;

  bool _isLoading = false;
  bool get isLoading => _isLoading;

  set isLoading(bool value) {
    _isLoading = value;
    notifyListeners();
  }

  /// Get tasks
  Future<void> getTasks() async {
    try {
      isLoading = true;

      final response = await _networkManager.dio
          .get<Map<String, dynamic>>('/gorev/arac-sahibi');

      if (response.statusCode == 200) {
        final data = response.data! as List<dynamic>;
        _tasks =
            data.map((e) => Task.fromJson(e as Map<String, dynamic>)).toList();
        notifyListeners();
      }
    } on Exception catch (e) {
      debugPrint('Get tasks error: $e');
    } finally {
      isLoading = false;
    }
  }

  /// Update task status
  Future<void> updateTaskStatus({
    required String id,
    required String status,
  }) async {
    try {
      isLoading = true;

      final response = await _networkManager.dio.put<Map<String, dynamic>>(
        '/gorev/durum-guncelle/$id',
        data: {
          'durum': status,
        },
      );

      if (response.statusCode == 200) {
        await getTasks();
      }
    } on Exception catch (e) {
      debugPrint('Update task status error: $e');
    } finally {
      isLoading = false;
    }
  }
}
