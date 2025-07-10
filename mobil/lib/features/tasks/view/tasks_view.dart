import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:google_maps_flutter/google_maps_flutter.dart';

import '../../../product/widgets/custom_button.dart';
import '../model/task_model.dart';
import '../viewmodel/tasks_viewmodel.dart';

/// Tasks view
class TasksView extends StatefulWidget {
  /// Creates a tasks view
  const TasksView({super.key});

  @override
  State<TasksView> createState() => _TasksViewState();
}

class _TasksViewState extends State<TasksView> {
  @override
  Widget build(BuildContext context) {
    return ChangeNotifierProvider(
      create: (_) => TasksViewModel()..getTasks(),
      child: Scaffold(
        appBar: AppBar(
          title: const Text('Görevlerim'),
        ),
        body: Consumer<TasksViewModel>(
          builder: (context, viewModel, _) {
            if (viewModel.isLoading) {
              return const Center(
                child: CupertinoActivityIndicator(),
              );
            }

            if (viewModel.tasks.isEmpty) {
              return Center(
                child: Text(
                  'Henüz görev atanmamış',
                  style: Theme.of(context).textTheme.titleMedium,
                ),
              );
            }

            return ListView.builder(
              padding: const EdgeInsets.all(16),
              itemCount: viewModel.tasks.length,
              itemBuilder: (context, index) {
                final task = viewModel.tasks[index];
                return Card(
                  margin: const EdgeInsets.only(bottom: 16),
                  child: Column(
                    children: [
                      ListTile(
                        title: Text(task.arac.plaka),
                        subtitle: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text('Tahmini Süre: ${task.tahminiSure} dakika'),
                            Text('Tahmini Mesafe: ${task.tahminiMesafe} km'),
                            Text('Durum: ${task.durum}'),
                          ],
                        ),
                        trailing: task.durum == 'beklemede'
                            ? CustomButton(
                                onPressed: () =>
                                    _showStartTaskDialog(context, task),
                                text: 'Başlat',
                                width: 100,
                              )
                            : task.durum == 'devam_ediyor'
                                ? CustomButton(
                                    onPressed: () =>
                                        _showCompleteTaskDialog(context, task),
                                    text: 'Tamamla',
                                    width: 100,
                                  )
                                : null,
                      ),
                      SizedBox(
                        height: 200,
                        child: GoogleMap(
                          initialCameraPosition: CameraPosition(
                            target: LatLng(
                              task.baslangicKonum.lat,
                              task.baslangicKonum.lng,
                            ),
                            zoom: 12,
                          ),
                          markers: {
                            Marker(
                              markerId: MarkerId('baslangic_${task.id}'),
                              position: LatLng(
                                task.baslangicKonum.lat,
                                task.baslangicKonum.lng,
                              ),
                              infoWindow: const InfoWindow(
                                title: 'Başlangıç Noktası',
                              ),
                            ),
                            Marker(
                              markerId: MarkerId('bitis_${task.id}'),
                              position: LatLng(
                                task.bitisKonum.lat,
                                task.bitisKonum.lng,
                              ),
                              infoWindow: const InfoWindow(
                                title: 'Bitiş Noktası',
                              ),
                            ),
                          },
                        ),
                      ),
                    ],
                  ),
                );
              },
            );
          },
        ),
      ),
    );
  }

  void _showStartTaskDialog(BuildContext context, Task task) {
    showCupertinoDialog(
      context: context,
      builder: (context) => CupertinoAlertDialog(
        title: const Text('Görevi Başlat'),
        content: Text(
            '${task.arac.plaka} plakalı aracın görevini başlatmak istediğinize emin misiniz?'),
        actions: [
          CupertinoDialogAction(
            onPressed: () => Navigator.pop(context),
            child: const Text('İptal'),
          ),
          CupertinoDialogAction(
            onPressed: () {
              context.read<TasksViewModel>().updateTaskStatus(
                    id: task.id,
                    status: 'devam_ediyor',
                  );
              Navigator.pop(context);
            },
            child: const Text('Başlat'),
          ),
        ],
      ),
    );
  }

  void _showCompleteTaskDialog(BuildContext context, Task task) {
    showCupertinoDialog(
      context: context,
      builder: (context) => CupertinoAlertDialog(
        title: const Text('Görevi Tamamla'),
        content: Text(
            '${task.arac.plaka} plakalı aracın görevini tamamlamak istediğinize emin misiniz?'),
        actions: [
          CupertinoDialogAction(
            onPressed: () => Navigator.pop(context),
            child: const Text('İptal'),
          ),
          CupertinoDialogAction(
            onPressed: () {
              context.read<TasksViewModel>().updateTaskStatus(
                    id: task.id,
                    status: 'tamamlandi',
                  );
              Navigator.pop(context);
            },
            child: const Text('Tamamla'),
          ),
        ],
      ),
    );
  }
}
