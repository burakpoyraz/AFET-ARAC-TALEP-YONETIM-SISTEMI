import 'package:afet_arac_takip/features/tasks/model/task_model.dart';
import 'package:afet_arac_takip/features/tasks/viewmodel/my_tasks_viewmodel.dart';
import 'package:afet_arac_takip/features/tasks/widgets/task_card.dart';
import 'package:afet_arac_takip/features/tasks/widgets/task_detail_modal.dart';
import 'package:afet_arac_takip/features/tasks/widgets/task_status_update_modal.dart';
import 'package:afet_arac_takip/product/widgets/custom_button.dart';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

/// My tasks view for arac_sahibi users
class MyTasksView extends StatefulWidget {
  /// Creates a my tasks view
  const MyTasksView({super.key});

  @override
  State<MyTasksView> createState() => _MyTasksViewState();
}

class _MyTasksViewState extends State<MyTasksView> {
  final _searchController = TextEditingController();
  String _selectedStatus = 'all';

  @override
  void dispose() {
    _searchController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return ChangeNotifierProvider(
      create: (_) => MyTasksViewModel()..loadMyTasks(),
      child: Scaffold(
        appBar: AppBar(
          title: const Text('Görevlerim'),
          centerTitle: false,
        ),
        body: Consumer<MyTasksViewModel>(
          builder: (context, viewModel, _) {
            if (viewModel.isLoading) {
              return const Center(child: CircularProgressIndicator());
            }

            if (viewModel.error != null) {
              return Center(
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    Icon(
                      Icons.error_outline,
                      size: 64,
                      color: Colors.red.shade400,
                    ),
                    const SizedBox(height: 16),
                    Text(
                      'Hata: ${viewModel.error}',
                      style: TextStyle(color: Colors.red.shade700),
                      textAlign: TextAlign.center,
                    ),
                    const SizedBox(height: 16),
                    CustomButton(
                      onPressed: () => viewModel.loadMyTasks(),
                      text: 'Yeniden Dene',
                      width: 150,
                    ),
                  ],
                ),
              );
            }

            final filteredTasks = viewModel.getFilteredTasks(
              _searchController.text,
              _selectedStatus,
            );

            return Column(
              children: [
                // Search and Filter Section
                Padding(
                  padding: const EdgeInsets.all(16),
                  child: Column(
                    children: [
                      // Search Field
                      TextField(
                        controller: _searchController,
                        decoration: InputDecoration(
                          hintText: 'Görev ara...',
                          prefixIcon: const Icon(Icons.search),
                          border: OutlineInputBorder(
                            borderRadius: BorderRadius.circular(12),
                          ),
                          filled: true,
                          fillColor: Colors.grey.shade100,
                        ),
                        onChanged: (value) => setState(() {}),
                      ),
                      const SizedBox(height: 12),

                      // Status Filter
                      SingleChildScrollView(
                        scrollDirection: Axis.horizontal,
                        child: Row(
                          children: [
                            _buildStatusFilter(
                                'all', 'Tümü', viewModel.tasks.length),
                            _buildStatusFilter(
                                'beklemede',
                                'Bekleyen',
                                viewModel.tasks
                                    .where((t) => t.gorevDurumu == 'beklemede')
                                    .length),
                            _buildStatusFilter(
                                'başladı',
                                'Başladı',
                                viewModel.tasks
                                    .where((t) => t.gorevDurumu == 'başladı')
                                    .length),
                            _buildStatusFilter(
                                'tamamlandı',
                                'Tamamlandı',
                                viewModel.tasks
                                    .where((t) => t.gorevDurumu == 'tamamlandı')
                                    .length),
                            _buildStatusFilter(
                                'iptal edildi',
                                'İptal',
                                viewModel.tasks
                                    .where(
                                        (t) => t.gorevDurumu == 'iptal edildi')
                                    .length),
                          ],
                        ),
                      ),
                    ],
                  ),
                ),

                // Statistics Row
                Container(
                  margin: const EdgeInsets.symmetric(horizontal: 16),
                  padding: const EdgeInsets.all(16),
                  decoration: BoxDecoration(
                    color: Colors.blue.shade50,
                    borderRadius: BorderRadius.circular(12),
                  ),
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.spaceAround,
                    children: [
                      _buildStatItem(
                          'Toplam', viewModel.tasks.length, Colors.blue),
                      _buildStatItem(
                          'Bekleyen',
                          viewModel.tasks
                              .where((t) => t.gorevDurumu == 'beklemede')
                              .length,
                          Colors.orange),
                      _buildStatItem(
                          'Aktif',
                          viewModel.tasks
                              .where((t) => t.gorevDurumu == 'başladı')
                              .length,
                          Colors.green),
                    ],
                  ),
                ),

                const SizedBox(height: 16),

                // Tasks List
                Expanded(
                  child: filteredTasks.isEmpty
                      ? Center(
                          child: Column(
                            mainAxisAlignment: MainAxisAlignment.center,
                            children: [
                              Icon(
                                Icons.assignment_outlined,
                                size: 64,
                                color: Colors.grey.shade400,
                              ),
                              const SizedBox(height: 16),
                              Text(
                                'Görev bulunamadı',
                                style: TextStyle(
                                  fontSize: 18,
                                  color: Colors.grey.shade600,
                                ),
                              ),
                              const SizedBox(height: 8),
                              Text(
                                'Henüz size atanmış görev bulunmuyor',
                                style: TextStyle(
                                  color: Colors.grey.shade500,
                                ),
                              ),
                            ],
                          ),
                        )
                      : RefreshIndicator(
                          onRefresh: () => viewModel.loadMyTasks(),
                          child: ListView.builder(
                            padding: const EdgeInsets.symmetric(horizontal: 16),
                            itemCount: filteredTasks.length,
                            itemBuilder: (context, index) {
                              final task = filteredTasks[index];
                              return TaskCard(
                                task: task,
                                onTap: () => _showTaskDetail(context, task),
                                onUpdateStatus:
                                    task.gorevDurumu == 'beklemede' ||
                                            task.gorevDurumu == 'başladı'
                                        ? () => _showStatusUpdateModal(
                                            context, task, viewModel)
                                        : null,
                              );
                            },
                          ),
                        ),
                ),
              ],
            );
          },
        ),
      ),
    );
  }

  Widget _buildStatusFilter(String status, String label, int count) {
    final isSelected = _selectedStatus == status;
    return Container(
      margin: const EdgeInsets.only(right: 8),
      child: FilterChip(
        label: Text('$label ($count)'),
        selected: isSelected,
        onSelected: (selected) {
          setState(() {
            _selectedStatus = status;
          });
        },
        backgroundColor: Colors.grey.shade100,
        selectedColor: Theme.of(context).primaryColor.withAlpha(50),
        checkmarkColor: Theme.of(context).primaryColor,
      ),
    );
  }

  Widget _buildStatItem(String label, int value, Color color) {
    return Column(
      mainAxisAlignment: MainAxisAlignment.center,
      children: [
        Text(
          value.toString(),
          style: TextStyle(
            fontSize: 20,
            fontWeight: FontWeight.bold,
            color: color,
          ),
        ),
        const SizedBox(height: 2),
        Flexible(
          child: Text(
            label,
            style: TextStyle(
              fontSize: 11,
              color: Colors.grey.shade700,
              fontWeight: FontWeight.w500,
            ),
            textAlign: TextAlign.center,
            maxLines: 1,
            overflow: TextOverflow.ellipsis,
          ),
        ),
      ],
    );
  }

  void _showTaskDetail(BuildContext context, Task task) {
    showModalBottomSheet<void>(
      context: context,
      isScrollControlled: true,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(20)),
      ),
      builder: (context) => TaskDetailModal(
        task: task,
        onUpdateStatus:
            task.gorevDurumu == 'beklemede' || task.gorevDurumu == 'başladı'
                ? () => _showStatusUpdateModal(context, task,
                    Provider.of<MyTasksViewModel>(context, listen: false))
                : null,
      ),
    );
  }

  void _showStatusUpdateModal(
      BuildContext context, Task task, MyTasksViewModel viewModel) {
    Navigator.of(context).pop(); // Close detail modal if open
    showModalBottomSheet<void>(
      context: context,
      isScrollControlled: true,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(20)),
      ),
      builder: (context) => TaskStatusUpdateModal(
        task: task,
        onUpdate: (newStatus) async {
          final success = await viewModel.updateTaskStatus(task.id, newStatus);
          if (success && context.mounted) {
            Navigator.of(context).pop();
            ScaffoldMessenger.of(context).showSnackBar(
              SnackBar(
                content: Text('Görev durumu güncellendi: $newStatus'),
                backgroundColor: Colors.green,
              ),
            );
          }
        },
      ),
    );
  }
}
