import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import '../../../product/widgets/custom_button.dart';
import '../../../product/widgets/custom_text_field.dart';
import '../model/vehicle_model.dart';
import '../viewmodel/vehicles_viewmodel.dart';

/// Add vehicle modal
class AddVehicleModal extends StatefulWidget {
  /// Creates an add vehicle modal
  const AddVehicleModal({super.key});

  @override
  State<AddVehicleModal> createState() => _AddVehicleModalState();
}

class _AddVehicleModalState extends State<AddVehicleModal> {
  late final TextEditingController _plakaController;
  late final TextEditingController _markaController;
  late final TextEditingController _modelController;
  late final TextEditingController _kapasiteController;

  @override
  void initState() {
    super.initState();
    _plakaController = TextEditingController();
    _markaController = TextEditingController();
    _modelController = TextEditingController();
    _kapasiteController = TextEditingController();
  }

  @override
  void dispose() {
    _plakaController.dispose();
    _markaController.dispose();
    _modelController.dispose();
    _kapasiteController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return CupertinoPageScaffold(
      navigationBar: const CupertinoNavigationBar(middle: Text('Araç Ekle')),
      child: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(24),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              CustomTextField(
                controller: _plakaController,
                labelText: 'Plaka',
                hintText: 'Araç plakasını girin',
              ),
              const SizedBox(height: 16),
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
                        plaka: _plakaController.text,
                        marka: _markaController.text,
                        model: _modelController.text,
                        kapasite: int.parse(_kapasiteController.text),
                        durum: 'musait',
                      );

                      viewModel.addVehicle(vehicle);
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
