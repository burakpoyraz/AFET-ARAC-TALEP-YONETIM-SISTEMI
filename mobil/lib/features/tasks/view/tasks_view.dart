import 'package:afet_arac_takip/features/tasks/view/koordinator_tasks_view.dart';
import 'package:afet_arac_takip/features/tasks/view/my_tasks_view.dart';
import 'package:afet_arac_takip/features/tasks/view/talep_eden_tasks_view.dart';
import 'package:afet_arac_takip/product/cache/local_storage.dart';
import 'package:flutter/material.dart';

/// Tasks view that shows different content based on user role
class TasksView extends StatelessWidget {
  /// Creates a tasks view
  const TasksView({super.key});

  @override
  Widget build(BuildContext context) {
    final user = LocalStorage.instance.getUser();

    if (user == null) {
      return const Scaffold(
        body: Center(
          child: Text('Kullanıcı bilgisi bulunamadı'),
        ),
      );
    }

    // Show different views based on user role
    if (user.isKoordinator) {
      return const KoordinatorTasksView();
    } else if (user.isAracSahibi) {
      return const MyTasksView();
    } else if (user.isTalepEden) {
      return const TalepEdenTasksView();
    } else {
      // For other roles, show a message
      return Scaffold(
        appBar: AppBar(
          title: const Text('Görevler'),
        ),
        body: const Center(
          child: Text('Bu rol için görev görünümü mevcut değil'),
        ),
      );
    }
  }
}
