import 'package:afet_arac_takip/features/tasks/view/my_tasks_view.dart';
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
      // TODO: Implement KoordinatorTasksView
      return Scaffold(
        appBar: AppBar(
          title: const Text('Görev Yönetimi'),
        ),
        body: const Center(
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Icon(
                Icons.construction,
                size: 64,
                color: Colors.grey,
              ),
              SizedBox(height: 16),
              Text(
                'Koordinatör Görev Yönetimi',
                style: TextStyle(fontSize: 18),
              ),
              Text('Geliştirme aşamasında...'),
            ],
          ),
        ),
      );
    } else if (user.isAracSahibi) {
      return const MyTasksView();
    } else if (user.isTalepEden) {
      // TODO: Implement TalepEdenTasksView
      return Scaffold(
        appBar: AppBar(
          title: const Text('Görev Takibi'),
        ),
        body: const Center(
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Icon(
                Icons.construction,
                size: 64,
                color: Colors.grey,
              ),
              SizedBox(height: 16),
              Text(
                'Talep Eden Görev Takibi',
                style: TextStyle(fontSize: 18),
              ),
              Text('Geliştirme aşamasında...'),
            ],
          ),
        ),
      );
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
