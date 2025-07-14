import 'package:afet_arac_takip/features/tasks/model/task_model.dart';
import 'package:afet_arac_takip/features/tasks/viewmodel/koordinator_tasks_viewmodel.dart';
import 'package:afet_arac_takip/features/tasks/widgets/task_card.dart';
import 'package:afet_arac_takip/features/tasks/widgets/task_detail_modal.dart';
import 'package:afet_arac_takip/features/tasks/widgets/task_status_update_modal.dart';
import 'package:afet_arac_takip/product/widgets/custom_button.dart';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

/// [KoordinatorTasksView] manages all tasks for koordinator users
class KoordinatorTasksView extends StatefulWidget {
  /// Creates a koordinator tasks view
  const KoordinatorTasksView({super.key});

  @override
  State<KoordinatorTasksView> createState() => _KoordinatorTasksViewState();
}

class _KoordinatorTasksViewState extends State<KoordinatorTasksView> {
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
      create: (_) => KoordinatorTasksViewModel()..loadAllTasks(),
      child: Scaffold(
        appBar: AppBar(
          title: const Text('Görev Yönetimi'),
          centerTitle: false,
          actions: [
            IconButton(
              icon: const Icon(Icons.refresh),
              onPressed: () {
                context.read<KoordinatorTasksViewModel>().loadAllTasks();
              },
            ),
          ],
        ),
        body: Consumer<KoordinatorTasksViewModel>(
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
                      onPressed: () => viewModel.loadAllTasks(),
                      text: 'Yeniden Dene',
                      width: 150,
                    ),
                  ],
                ),
              );
            }

            final stats = viewModel.getTaskStatistics();
            final filteredTasks = viewModel.getFilteredTasks(
              _searchController.text,
              _selectedStatus,
            );

            return Column(
              children: [
                // Statistics section
                Container(
                  padding: const EdgeInsets.all(16),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      const Text(
                        'Tüm Görevler - Yönetim Paneli',
                        style: TextStyle(
                          fontSize: 18,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                      const SizedBox(height: 12),
                      // Statistics cards
                      GridView.count(
                        shrinkWrap: true,
                        physics: const NeverScrollableScrollPhysics(),
                        crossAxisCount: 2,
                        mainAxisSpacing: 8,
                        crossAxisSpacing: 8,
                        childAspectRatio: 2.5,
                        children: [
                          _buildStatCard(
                              'Toplam', stats['toplam']!, Colors.blue),
                          _buildStatCard(
                              'Beklemede', stats['beklemede']!, Colors.orange),
                          _buildStatCard(
                              'Başladı', stats['basladi']!, Colors.purple),
                          _buildStatCard(
                              'Tamamlandı', stats['tamamlandi']!, Colors.green),
                        ],
                      ),
                    ],
                  ),
                ),
                // Search and filter section
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 16),
                  child: Column(
                    children: [
                      // Search bar
                      TextField(
                        controller: _searchController,
                        onChanged: (_) => setState(() {}),
                        decoration: InputDecoration(
                          hintText: 'Görevlerde ara...',
                          prefixIcon: const Icon(Icons.search),
                          border: OutlineInputBorder(
                            borderRadius: BorderRadius.circular(12),
                            borderSide: BorderSide.none,
                          ),
                          filled: true,
                          fillColor: Colors.grey.shade100,
                        ),
                      ),
                      const SizedBox(height: 12),
                      // Status filter
                      SingleChildScrollView(
                        scrollDirection: Axis.horizontal,
                        child: Row(
                          children: [
                            _buildFilterChip('all', 'Tümü', stats['toplam']!),
                            _buildFilterChip(
                                'beklemede', 'Beklemede', stats['beklemede']!),
                            _buildFilterChip(
                                'başladı', 'Başladı', stats['basladi']!),
                            _buildFilterChip('tamamlandı', 'Tamamlandı',
                                stats['tamamlandi']!),
                            _buildFilterChip(
                                'iptal edildi', 'İptal', stats['iptal']!),
                          ],
                        ),
                      ),
                    ],
                  ),
                ),
                const SizedBox(height: 16),
                // Tasks list
                Expanded(
                  child: filteredTasks.isEmpty
                      ? const Center(
                          child: Column(
                            mainAxisAlignment: MainAxisAlignment.center,
                            children: [
                              Icon(
                                Icons.assignment_outlined,
                                size: 64,
                                color: Colors.grey,
                              ),
                              SizedBox(height: 16),
                              Text(
                                'Görev bulunamadı',
                                style: TextStyle(
                                  fontSize: 18,
                                  fontWeight: FontWeight.w500,
                                ),
                              ),
                            ],
                          ),
                        )
                      : RefreshIndicator(
                          onRefresh: () => viewModel.loadAllTasks(),
                          child: ListView.builder(
                            padding: const EdgeInsets.symmetric(horizontal: 16),
                            itemCount: filteredTasks.length,
                            itemBuilder: (context, index) {
                              final task = filteredTasks[index];
                              return TaskCard(
                                task: task,
                                onTap: () => _showTaskDetail(context, task),
                                onUpdateStatus:
                                    (task.gorevDurumu == 'beklemede' ||
                                            task.gorevDurumu == 'başladı')
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

  Widget _buildStatCard(String title, int value, Color color) {
    return Container(
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(
        color: color.withValues(alpha: 0.1),
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: color.withValues(alpha: 0.3)),
      ),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Column(
            crossAxisAlignment: CrossAxisAlignment.start,
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
              Text(
                title,
                style: TextStyle(
                  fontSize: 11,
                  color: color.withValues(alpha: 0.8),
                  fontWeight: FontWeight.w500,
                ),
              ),
            ],
          ),
          Icon(
            _getIconForStatus(title),
            color: color.withValues(alpha: 0.7),
            size: 24,
          ),
        ],
      ),
    );
  }

  IconData _getIconForStatus(String title) {
    switch (title) {
      case 'Toplam':
        return Icons.assignment;
      case 'Beklemede':
        return Icons.pending;
      case 'Başladı':
        return Icons.play_arrow;
      case 'Tamamlandı':
        return Icons.check_circle;
      default:
        return Icons.assignment;
    }
  }

  Widget _buildFilterChip(String status, String label, int count) {
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

  void _showTaskDetail(BuildContext context, Task task) {
    showModalBottomSheet<void>(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (context) => TaskDetailModal(task: task),
    );
  }

  void _showStatusUpdateModal(
      BuildContext context, Task task, KoordinatorTasksViewModel viewModel) {
    showDialog<void>(
      context: context,
      builder: (context) => TaskStatusUpdateModal(
        task: task,
        onUpdate: (newStatus) async {
          final success = await viewModel.updateTaskStatus(task.id, newStatus);
          if (success && context.mounted) {
            Navigator.of(context).pop();
            ScaffoldMessenger.of(context).showSnackBar(
              const SnackBar(
                content: Text('Görev durumu güncellendi'),
                backgroundColor: Colors.green,
              ),
            );
          }
        },
      ),
    );
  }
}
