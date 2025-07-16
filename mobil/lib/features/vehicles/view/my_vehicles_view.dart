import 'package:afet_arac_takip/features/vehicles/model/vehicle_model.dart';
import 'package:afet_arac_takip/features/vehicles/viewmodel/my_vehicles_viewmodel.dart';
import 'package:afet_arac_takip/features/vehicles/widgets/add_edit_vehicle_modal.dart';
import 'package:afet_arac_takip/features/vehicles/widgets/vehicle_card.dart';
import 'package:afet_arac_takip/product/cache/local_storage.dart';
import 'package:afet_arac_takip/product/widgets/custom_button.dart';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

/// My vehicles view for arac_sahibi users
class MyVehiclesView extends StatefulWidget {
  /// Creates a my vehicles view
  const MyVehiclesView({super.key});

  @override
  State<MyVehiclesView> createState() => _MyVehiclesViewState();
}

class _MyVehiclesViewState extends State<MyVehiclesView> {
  final _searchController = TextEditingController();
  String _selectedStatus = 'all';

  @override
  void dispose() {
    _searchController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    // **[MyVehiclesView]** Get current user role for permission check
    final currentUser = LocalStorage.instance.getUser();
    final isKoordinator = currentUser?.isKoordinator ?? false;

    return ChangeNotifierProvider(
      create: (_) => MyVehiclesViewModel()..loadMyVehicles(),
      child: Scaffold(
        appBar: AppBar(
          title: const Text('Araçlarım'),
          centerTitle: false,
          actions: [
            // **[MyVehiclesView]** Hide add button for coordinators
            if (!isKoordinator)
              IconButton(
                icon: const Icon(Icons.add),
                onPressed: () => _showAddVehicleModal(context),
              ),
          ],
        ),
        body: Consumer<MyVehiclesViewModel>(
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
                      onPressed: () => viewModel.refreshMyVehicles(),
                      text: 'Yeniden Dene',
                      width: 150,
                    ),
                  ],
                ),
              );
            }

            final filteredVehicles = viewModel.getFilteredVehicles(
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
                          hintText: 'Araç ara (plaka, tür)...',
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
                                'all', 'Tümü', viewModel.vehicles.length),
                            _buildStatusFilter(
                                'aktif',
                                'Aktif',
                                viewModel.vehicles
                                    .where((v) => v.aracDurumu == 'aktif')
                                    .length),
                            _buildStatusFilter(
                                'pasif',
                                'Pasif',
                                viewModel.vehicles
                                    .where((v) => v.aracDurumu == 'pasif')
                                    .length),
                            _buildStatusFilter(
                                'musait',
                                'Müsait',
                                viewModel.vehicles
                                    .where((v) => v.musaitlikDurumu == true)
                                    .length),
                            _buildStatusFilter(
                                'mesgul',
                                'Meşgul',
                                viewModel.vehicles
                                    .where((v) => v.musaitlikDurumu == false)
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
                          'Toplam', viewModel.vehicles.length, Colors.blue),
                      _buildStatItem(
                          'Aktif',
                          viewModel.vehicles
                              .where((v) => v.aracDurumu == 'aktif')
                              .length,
                          Colors.green),
                      _buildStatItem(
                          'Müsait',
                          viewModel.vehicles
                              .where((v) => v.musaitlikDurumu == true)
                              .length,
                          Colors.orange),
                    ],
                  ),
                ),

                const SizedBox(height: 16),

                // Vehicles List
                Expanded(
                  child: filteredVehicles.isEmpty
                      ? Center(
                          child: Column(
                            mainAxisAlignment: MainAxisAlignment.center,
                            children: [
                              Icon(
                                Icons.directions_car_outlined,
                                size: 64,
                                color: Colors.grey.shade400,
                              ),
                              const SizedBox(height: 16),
                              Text(
                                'Araç bulunamadı',
                                style: TextStyle(
                                  fontSize: 18,
                                  color: Colors.grey.shade600,
                                ),
                              ),
                              const SizedBox(height: 8),
                              Text(
                                'İlk aracınızı ekleyin',
                                style: TextStyle(
                                  color: Colors.grey.shade500,
                                ),
                              ),
                              const SizedBox(height: 16),
                              CustomButton(
                                onPressed: () => _showAddVehicleModal(context),
                                text: 'Araç Ekle',
                                width: 120,
                              ),
                            ],
                          ),
                        )
                      : RefreshIndicator(
                          onRefresh: () => viewModel.refreshMyVehicles(),
                          child: ListView.builder(
                            padding: const EdgeInsets.symmetric(horizontal: 16),
                            itemCount: filteredVehicles.length,
                            itemBuilder: (context, index) {
                              final vehicle = filteredVehicles[index];
                              return VehicleCard(
                                vehicle: vehicle,
                                onTap: () =>
                                    _showVehicleDetail(context, vehicle),
                                onEdit: () => _showEditVehicleModal(
                                    context, vehicle, viewModel),
                                onDelete: () => _showDeleteDialog(
                                    context, vehicle, viewModel),
                                onToggleAvailability: () => _toggleAvailability(
                                    context, vehicle, viewModel),
                              );
                            },
                          ),
                        ),
                ),
              ],
            );
          },
        ),
        // **[MyVehiclesView]** Hide floating add button for coordinators
        floatingActionButton: !isKoordinator
            ? FloatingActionButton(
                onPressed: () => _showAddVehicleModal(context),
                child: const Icon(Icons.add),
              )
            : null,
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

  void _showVehicleDetail(BuildContext context, Vehicle vehicle) {
    showDialog<void>(
      context: context,
      builder: (context) => AlertDialog(
        title: Text('Araç Detayları - ${vehicle.plaka}'),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            _buildDetailRow('Plaka', vehicle.plaka),
            _buildDetailRow('Tür', vehicle.aracTuru),
            _buildDetailRow('Kapasite', vehicle.kapasite.toString()),
            _buildDetailRow('Kullanım Amacı', vehicle.kullanimAmaci),
            _buildDetailRow(
                'Durum', vehicle.aracDurumu == 'aktif' ? 'Aktif' : 'Pasif'),
            _buildDetailRow(
                'Müsaitlik', vehicle.musaitlikDurumu ? 'Müsait' : 'Meşgul'),
            if (vehicle.konum != null)
              _buildDetailRow('Konum', vehicle.konum!.adres),
          ],
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.of(context).pop(),
            child: const Text('Kapat'),
          ),
        ],
      ),
    );
  }

  Widget _buildDetailRow(String label, String value) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 4),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          SizedBox(
            width: 100,
            child: Text(
              '$label:',
              style: const TextStyle(fontWeight: FontWeight.w500),
            ),
          ),
          Expanded(
            child: Text(value),
          ),
        ],
      ),
    );
  }

  void _showAddVehicleModal(BuildContext context) {
    showModalBottomSheet<void>(
      context: context,
      isScrollControlled: true,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(20)),
      ),
      builder: (context) => AddEditVehicleModal(
        onSave: (vehicleData) async {
          final viewModel =
              Provider.of<MyVehiclesViewModel>(context, listen: false);
          final success = await viewModel.addVehicle(vehicleData);
          if (success && context.mounted) {
            Navigator.of(context).pop();
            ScaffoldMessenger.of(context).showSnackBar(
              const SnackBar(
                content: Text('Araç başarıyla eklendi'),
                backgroundColor: Colors.green,
              ),
            );
          }
        },
      ),
    );
  }

  void _showEditVehicleModal(
      BuildContext context, Vehicle vehicle, MyVehiclesViewModel viewModel) {
    showModalBottomSheet<void>(
      context: context,
      isScrollControlled: true,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(20)),
      ),
      builder: (context) => AddEditVehicleModal(
        vehicle: vehicle,
        onSave: (vehicleData) async {
          final success =
              await viewModel.updateVehicle(vehicle.plaka, vehicleData);
          if (success && context.mounted) {
            Navigator.of(context).pop();
            ScaffoldMessenger.of(context).showSnackBar(
              const SnackBar(
                content: Text('Araç başarıyla güncellendi'),
                backgroundColor: Colors.green,
              ),
            );
          }
        },
      ),
    );
  }

  void _showDeleteDialog(
      BuildContext context, Vehicle vehicle, MyVehiclesViewModel viewModel) {
    showDialog<void>(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Aracı Sil'),
        content: Text(
            '${vehicle.plaka} plakalı aracı silmek istediğinize emin misiniz?'),
        actions: [
          TextButton(
            onPressed: () => Navigator.of(context).pop(),
            child: const Text('Vazgeç'),
          ),
          TextButton(
            onPressed: () async {
              Navigator.of(context).pop();
              final success = await viewModel.deleteVehicle(vehicle.plaka);
              if (success && context.mounted) {
                ScaffoldMessenger.of(context).showSnackBar(
                  const SnackBar(
                    content: Text('Araç silindi'),
                    backgroundColor: Colors.orange,
                  ),
                );
              }
            },
            style: TextButton.styleFrom(foregroundColor: Colors.red),
            child: const Text('Sil'),
          ),
        ],
      ),
    );
  }

  Future<void> _toggleAvailability(BuildContext context, Vehicle vehicle,
      MyVehiclesViewModel viewModel) async {
    final newStatus = !vehicle.musaitlikDurumu;
    final success = await viewModel.toggleVehicleAvailability(vehicle.plaka,
        isAvailable: newStatus);
    if (success && context.mounted) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text(newStatus
              ? 'Araç müsait olarak işaretlendi'
              : 'Araç meşgul olarak işaretlendi'),
          backgroundColor: Colors.blue,
        ),
      );
    }
  }
}
