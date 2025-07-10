import 'package:flutter/material.dart';

import '../../../product/network/network_manager.dart';
import '../model/task_model.dart';

/// Tasks view model
class TasksViewModel extends ChangeNotifier {
  final _networkManager = NetworkManager.instance;

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

      final response = await _networkManager.dio.get('/gorev/arac-sahibi');

      if (response.statusCode == 200) {
        final List<dynamic> data = response.data;
        _tasks = data.map((e) => Task.fromJson(e)).toList();
        notifyListeners();
      }
    } catch (e) {
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

      final response = await _networkManager.dio.put(
        '/gorev/durum-guncelle/$id',
        data: {
          'durum': status,
        },
      );

      if (response.statusCode == 200) {
        await getTasks();
      }
    } catch (e) {
      debugPrint('Update task status error: $e');
    } finally {
      isLoading = false;
    }
  }
}
