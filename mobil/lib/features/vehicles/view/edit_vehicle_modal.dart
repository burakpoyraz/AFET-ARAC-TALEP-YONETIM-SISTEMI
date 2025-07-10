import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import '../../../product/widgets/custom_button.dart';
import '../../../product/widgets/custom_text_field.dart';
import '../model/vehicle_model.dart';
import '../viewmodel/vehicles_viewmodel.dart';

/// Edit vehicle modal
class EditVehicleModal extends StatefulWidget {
  /// Creates an edit vehicle modal
  const EditVehicleModal({required this.vehicle, super.key});

  /// Vehicle to edit
  final Vehicle vehicle;

  @override
  State<EditVehicleModal> createState() => _EditVehicleModalState();
}

class _EditVehicleModalState extends State<EditVehicleModal> {
  late final TextEditingController _markaController;
  late final TextEditingController _modelController;
  late final TextEditingController _kapasiteController;

  @override
  void initState() {
    super.initState();
    _markaController = TextEditingController(text: widget.vehicle.marka);
    _modelController = TextEditingController(text: widget.vehicle.model);
    _kapasiteController = TextEditingController(
      text: widget.vehicle.kapasite.toString(),
    );
  }

  @override
  void dispose() {
    _markaController.dispose();
    _modelController.dispose();
    _kapasiteController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return CupertinoPageScaffold(
      navigationBar: const CupertinoNavigationBar(middle: Text('Araç Düzenle')),
      child: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(24),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                'Plaka: ${widget.vehicle.plaka}',
                style: Theme.of(
                  context,
                ).textTheme.titleMedium?.copyWith(fontWeight: FontWeight.bold),
              ),
              const SizedBox(height: 24),
              CustomTextField(
                controller: _markaController,
                labelText: 'Marka',
                hintText: 'Araç markasını girin',
              ),
              const SizedBox(height: 16),
              CustomTextField(
                controller: _modelController,
                labelText: 'Model',
                hintText: 'Araç modelini girin',
              ),
              const SizedBox(height: 16),
              CustomTextField(
                controller: _kapasiteController,
                labelText: 'Kapasite',
                hintText: 'Araç kapasitesini girin',
                keyboardType: TextInputType.number,
              ),
              const SizedBox(height: 32),
              Consumer<VehiclesViewModel>(
                builder: (context, viewModel, _) {
                  return CustomButton(
                    onPressed: () {
                      final vehicle = Vehicle(
                        plaka: widget.vehicle.plaka,
                        marka: _markaController.text,
                        model: _modelController.text,
                        kapasite: int.parse(_kapasiteController.text),
                        durum: widget.vehicle.durum,
                        konum: widget.vehicle.konum,
                      );

                      viewModel.updateVehicle(vehicle);
                      Navigator.pop(context);
                    },
                    text: 'Kaydet',
                    isLoading: viewModel.isLoading,
                  );
                },
              ),
            ],
          ),
        ),
      ),
    );
  }
}
