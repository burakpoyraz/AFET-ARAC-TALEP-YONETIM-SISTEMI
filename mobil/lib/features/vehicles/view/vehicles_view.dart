import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import '../../../product/widgets/custom_button.dart';
import '../viewmodel/vehicles_viewmodel.dart';

/// Vehicles view
class VehiclesView extends StatefulWidget {
  /// Creates a vehicles view
  const VehiclesView({super.key});

  @override
  State<VehiclesView> createState() => _VehiclesViewState();
}

class _VehiclesViewState extends State<VehiclesView> {
  @override
  Widget build(BuildContext context) {
    return ChangeNotifierProvider(
      create: (_) => VehiclesViewModel()..getVehicles(),
      child: Scaffold(
        appBar: AppBar(
          title: const Text('Araçlarım'),
          actions: [
            IconButton(
              onPressed: () => _showAddVehicleModal(context),
              icon: const Icon(CupertinoIcons.add),
            ),
          ],
        ),
        body: Consumer<VehiclesViewModel>(
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
                      style: Theme.of(context).textTheme.titleMedium,
                    ),
                    const SizedBox(height: 16),
                    CustomButton(
                      onPressed: () => _showAddVehicleModal(context),
                      text: 'Araç Ekle',
                      width: 200,
                    ),
                  ],
                ),
              );
            }

            return ListView.builder(
              padding: const EdgeInsets.all(16),
              itemCount: viewModel.vehicles.length,
              itemBuilder: (context, index) {
                final vehicle = viewModel.vehicles[index];
                return Card(
                  margin: const EdgeInsets.only(bottom: 16),
                  child: ListTile(
                    title: Text(vehicle.plaka),
                    subtitle: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(vehicle.marka),
                        Text(vehicle.model),
                        Text(vehicle.kapasite.toString()),
                      ],
                    ),
                    trailing: Row(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        IconButton(
                          onPressed: () =>
                              _showEditVehicleModal(context, vehicle),
                          icon: const Icon(CupertinoIcons.pencil),
                        ),
                        IconButton(
                          onPressed: () =>
                              _showDeleteVehicleDialog(context, vehicle),
                          icon: const Icon(
                            CupertinoIcons.delete,
                            color: CupertinoColors.destructiveRed,
                          ),
                        ),
                      ],
                    ),
                  ),
                );
              },
            );
          },
        ),
      ),
    );
  }

  void _showAddVehicleModal(BuildContext context) {
    showCupertinoModalPopup(
      context: context,
      builder: (context) => const AddVehicleModal(),
    );
  }

  void _showEditVehicleModal(BuildContext context, Vehicle vehicle) {
    showCupertinoModalPopup(
      context: context,
      builder: (context) => EditVehicleModal(vehicle: vehicle),
    );
  }

  void _showDeleteVehicleDialog(BuildContext context, Vehicle vehicle) {
    showCupertinoDialog(
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
}
