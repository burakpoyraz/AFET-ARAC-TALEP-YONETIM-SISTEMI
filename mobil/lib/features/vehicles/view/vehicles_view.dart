import 'package:afet_arac_takip/features/vehicles/model/vehicle_model.dart';
import 'package:afet_arac_takip/features/vehicles/view/add_vehicle_modal.dart';
import 'package:afet_arac_takip/features/vehicles/view/edit_vehicle_modal.dart';
import 'package:afet_arac_takip/features/vehicles/viewmodel/vehicles_viewmodel.dart';
import 'package:afet_arac_takip/features/vehicles/widgets/vehicle_card.dart';
import 'package:afet_arac_takip/features/vehicles/widgets/vehicle_detail_modal.dart';
import 'package:afet_arac_takip/product/cache/local_storage.dart';
import 'package:afet_arac_takip/product/widgets/custom_button.dart';
import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

/// Vehicles view
class VehiclesView extends StatefulWidget {
  /// Creates a vehicles view
  const VehiclesView({super.key});

  @override
  State<VehiclesView> createState() => _VehiclesViewState();
}

class _VehiclesViewState extends State<VehiclesView> {
  final _searchController = TextEditingController();

  @override
  void dispose() {
    _searchController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    // **[VehiclesView]** Get current user role for permission check
    final currentUser = LocalStorage.instance.getUser();
    final isKoordinator = currentUser?.isKoordinator ?? false;

    return ChangeNotifierProvider(
      create: (_) => VehiclesViewModel()..getVehicles(),
      child: CupertinoPageScaffold(
        navigationBar: CupertinoNavigationBar(
          middle: const Text('Araçlarım'),
          trailing: !isKoordinator
              ? CupertinoButton(
                  padding: EdgeInsets.zero,
                  onPressed: () => _showAddVehicleModal(context),
                  child: const Icon(CupertinoIcons.add),
                )
              : null,
        ),
        child: SafeArea(
          child: Consumer<VehiclesViewModel>(
            builder: (context, viewModel, _) {
              if (viewModel.isLoading) {
                return const Center(child: CupertinoActivityIndicator());
              }

              if (viewModel.vehicles.isEmpty) {
                return Center(
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Text(
                        'Henüz araç eklenmemiş',
                        style: CupertinoTheme.of(context)
                            .textTheme
                            .navTitleTextStyle,
                      ),
                      const SizedBox(height: 16),
                      // **[VehiclesView]** Hide add button for coordinators in empty state
                      if (!isKoordinator)
                        CustomButton(
                          onPressed: () => _showAddVehicleModal(context),
                          text: 'Araç Ekle',
                          width: 200,
                        ),
                    ],
                  ),
                );
              }

              return Column(
                children: [
                  Padding(
                    padding: const EdgeInsets.all(16),
                    child: CupertinoSearchTextField(
                      controller: _searchController,
                      placeholder: 'Araç Ara',
                      onChanged: (value) => viewModel.searchQuery = value,
                    ),
                  ),
                  // Status filters
                  SizedBox(
                    height: 44,
                    child: ListView(
                      padding: const EdgeInsets.symmetric(horizontal: 16),
                      scrollDirection: Axis.horizontal,
                      children: [
                        _buildFilterChip(
                          context,
                          'Tümü (${viewModel.vehicles.length})',
                          viewModel.vehicles.length,
                        ),
                        const SizedBox(width: 8),
                        _buildFilterChip(
                          context,
                          'Müsait (${viewModel.availableVehicles.length})',
                          viewModel.availableVehicles.length,
                          color: CupertinoColors.systemGreen,
                        ),
                        const SizedBox(width: 8),
                        _buildFilterChip(
                          context,
                          'Aktif (${viewModel.activeVehicles.length})',
                          viewModel.activeVehicles.length,
                          color: CupertinoColors.systemGreen,
                        ),
                        const SizedBox(width: 8),
                        _buildFilterChip(
                          context,
                          'Pasif (${viewModel.inactiveVehicles.length})',
                          viewModel.inactiveVehicles.length,
                          color: CupertinoColors.systemRed,
                        ),
                      ],
                    ),
                  ),
                  const SizedBox(height: 8),
                  // Vehicle list
                  Expanded(
                    child: CustomScrollView(
                      slivers: [
                        CupertinoSliverRefreshControl(
                          onRefresh: () => viewModel.refreshVehicles(),
                        ),
                        SliverList(
                          delegate: SliverChildBuilderDelegate(
                            (context, index) {
                              final vehicle = viewModel.vehicles[index];
                              return VehicleCard(
                                vehicle: vehicle,
                                onTap: () =>
                                    _showVehicleDetails(context, vehicle),
                                onEdit: () =>
                                    _showEditVehicleModal(context, vehicle),
                                onDelete: () =>
                                    _showDeleteVehicleDialog(context, vehicle),
                              );
                            },
                            childCount: viewModel.vehicles.length,
                          ),
                        ),
                      ],
                    ),
                  ),
                ],
              );
            },
          ),
        ),
      ),
    );
  }

  Widget _buildFilterChip(BuildContext context, String label, int count,
      {Color? color}) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
      decoration: BoxDecoration(
        color: (color ?? CupertinoColors.systemGrey).withValues(alpha: 0.1),
        borderRadius: BorderRadius.circular(8),
      ),
      child: Text(
        label,
        style: TextStyle(
          color: color ?? CupertinoColors.label,
          fontWeight: FontWeight.w500,
        ),
      ),
    );
  }

  void _showAddVehicleModal(BuildContext context) {
    showCupertinoModalPopup<void>(
      context: context,
      builder: (context) => const AddVehicleModal(),
    );
  }

  void _showEditVehicleModal(BuildContext context, Vehicle vehicle) {
    showCupertinoModalPopup<void>(
      context: context,
      builder: (context) => EditVehicleModal(vehicle: vehicle),
    );
  }

  void _showDeleteVehicleDialog(BuildContext context, Vehicle vehicle) {
    showCupertinoDialog<void>(
      context: context,
      builder: (context) => CupertinoAlertDialog(
        title: const Text('Aracı Sil'),
        content: Text(
          '${vehicle.plaka} plakalı aracı silmek istediğinize emin misiniz?',
        ),
        actions: [
          CupertinoDialogAction(
            onPressed: () => Navigator.pop(context),
            child: const Text('İptal'),
          ),
          CupertinoDialogAction(
            onPressed: () {
              context.read<VehiclesViewModel>().deleteVehicle(vehicle.plaka);
              Navigator.pop(context);
            },
            isDestructiveAction: true,
            child: const Text('Sil'),
          ),
        ],
      ),
    );
  }

  void _showVehicleDetails(BuildContext context, Vehicle vehicle) {
    // Show vehicle details modal
    showModalBottomSheet<void>(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (context) => VehicleDetailModal(vehicle: vehicle),
    );
  }
}
