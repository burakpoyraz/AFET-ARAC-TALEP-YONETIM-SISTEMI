import 'package:afet_arac_takip/features/requests/model/request_model.dart';
import 'package:afet_arac_takip/features/requests/viewmodel/koordinator_requests_viewmodel.dart';
import 'package:afet_arac_takip/features/requests/widgets/request_assignment_modal.dart';
import 'package:afet_arac_takip/features/requests/widgets/request_card.dart';
import 'package:afet_arac_takip/features/requests/widgets/request_detail_modal.dart';
import 'package:afet_arac_takip/product/widgets/custom_button.dart';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

/// Koordinator requests management view
class KoordinatorRequestsView extends StatefulWidget {
  /// Creates a koordinator requests view
  const KoordinatorRequestsView({super.key});

  @override
  State<KoordinatorRequestsView> createState() =>
      _KoordinatorRequestsViewState();
}

class _KoordinatorRequestsViewState extends State<KoordinatorRequestsView> {
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
      create: (_) => KoordinatorRequestsViewModel()..loadRequests(),
      child: Scaffold(
        appBar: AppBar(
          title: const Text('Talep Yönetimi'),
          centerTitle: false,
        ),
        body: Consumer<KoordinatorRequestsViewModel>(
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
                      onPressed: () => viewModel.loadRequests(),
                      text: 'Yeniden Dene',
                      width: 150,
                    ),
                  ],
                ),
              );
            }

            final filteredRequests = viewModel.getFilteredRequests(
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
                          hintText: 'Talep ara...',
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
                                'all', 'Tümü', viewModel.requests.length),
                            _buildStatusFilter(
                                'beklemede',
                                'Bekleyen',
                                viewModel.requests
                                    .where((r) => r.durum == 'beklemede')
                                    .length),
                            _buildStatusFilter(
                                'gorevlendirildi',
                                'Görevlendirildi',
                                viewModel.requests
                                    .where((r) => r.durum == 'gorevlendirildi')
                                    .length),
                            _buildStatusFilter(
                                'tamamlandı',
                                'Tamamlandı',
                                viewModel.requests
                                    .where((r) => r.durum == 'tamamlandı')
                                    .length),
                            _buildStatusFilter(
                                'iptal edildi',
                                'İptal',
                                viewModel.requests
                                    .where((r) => r.durum == 'iptal edildi')
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
                          'Toplam', viewModel.requests.length, Colors.blue),
                      _buildStatItem(
                          'Bekleyen',
                          viewModel.requests
                              .where((r) => r.durum == 'beklemede')
                              .length,
                          Colors.orange),
                      _buildStatItem(
                          'Aktif',
                          viewModel.requests
                              .where((r) => r.durum == 'gorevlendirildi')
                              .length,
                          Colors.green),
                    ],
                  ),
                ),

                const SizedBox(height: 16),

                // Requests List
                Expanded(
                  child: filteredRequests.isEmpty
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
                                'Talep bulunamadı',
                                style: TextStyle(
                                  fontSize: 18,
                                  color: Colors.grey.shade600,
                                ),
                              ),
                            ],
                          ),
                        )
                      : RefreshIndicator(
                          onRefresh: () => viewModel.loadRequests(),
                          child: ListView.builder(
                            padding: const EdgeInsets.symmetric(horizontal: 16),
                            itemCount: filteredRequests.length,
                            itemBuilder: (context, index) {
                              final request = filteredRequests[index];
                              return RequestCard(
                                request: request,
                                onTap: () => _showRequestDetail(
                                    context, request, viewModel),
                                onAssign: request.durum == 'beklemede'
                                    ? () => _showAssignmentModal(
                                        context, request, viewModel)
                                    : null,
                                onCancel: request.durum == 'beklemede'
                                    ? () => _showCancelDialog(
                                        context, request, viewModel)
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
      children: [
        Text(
          value.toString(),
          style: TextStyle(
            fontSize: 24,
            fontWeight: FontWeight.bold,
            color: color,
          ),
        ),
        Text(
          label,
          style: TextStyle(
            fontSize: 12,
            color: Colors.grey.shade700,
          ),
        ),
      ],
    );
  }

  void _showRequestDetail(BuildContext context, Request request,
      KoordinatorRequestsViewModel viewModel) {
    showModalBottomSheet<void>(
      context: context,
      isScrollControlled: true,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(20)),
      ),
      builder: (context) => RequestDetailModal(
        request: request,
        onAssign: request.durum == 'beklemede'
            ? () => _showAssignmentModal(context, request, viewModel)
            : null,
        onCancel: request.durum == 'beklemede'
            ? () => _showCancelDialog(context, request, viewModel)
            : null,
      ),
    );
  }

  void _showAssignmentModal(BuildContext context, Request request,
      KoordinatorRequestsViewModel viewModel) {
    Navigator.of(context).pop(); // Close detail modal if open
    showModalBottomSheet<void>(
      context: context,
      isScrollControlled: true,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(20)),
      ),
      builder: (context) => RequestAssignmentModal(
        request: request,
        onAssign: (selectedVehicles, driverInfos, note) async {
          final success = await viewModel.assignVehiclesToRequest(
            request.id,
            selectedVehicles,
            driverInfos,
            note,
          );
          if (success && context.mounted) {
            Navigator.of(context).pop();
            ScaffoldMessenger.of(context).showSnackBar(
              const SnackBar(
                content: Text('Araçlar başarıyla görevlendirildi'),
                backgroundColor: Colors.green,
              ),
            );
          }
        },
      ),
    );
  }

  void _showCancelDialog(BuildContext context, Request request,
      KoordinatorRequestsViewModel viewModel) {
    showDialog<void>(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Talebi İptal Et'),
        content: Text(
            '${request.baslik} talebini iptal etmek istediğinize emin misiniz?'),
        actions: [
          TextButton(
            onPressed: () => Navigator.of(context).pop(),
            child: const Text('Vazgeç'),
          ),
          TextButton(
            onPressed: () async {
              Navigator.of(context).pop();
              final success = await viewModel.cancelRequest(request.id);
              if (success && context.mounted) {
                ScaffoldMessenger.of(context).showSnackBar(
                  const SnackBar(
                    content: Text('Talep iptal edildi'),
                    backgroundColor: Colors.orange,
                  ),
                );
              }
            },
            style: TextButton.styleFrom(foregroundColor: Colors.red),
            child: const Text('İptal Et'),
          ),
        ],
      ),
    );
  }
}
