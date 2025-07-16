import 'package:afet_arac_takip/features/vehicles/model/vehicle_model.dart';
import 'package:flutter/material.dart';

/// Add/Edit vehicle modal (placeholder)
class AddEditVehicleModal extends StatefulWidget {
  const AddEditVehicleModal({
    required this.onSave,
    this.vehicle,
    super.key,
  });

  final Vehicle? vehicle;
  final void Function(Map<String, dynamic>) onSave;

  @override
  State<AddEditVehicleModal> createState() => _AddEditVehicleModalState();
}

class _AddEditVehicleModalState extends State<AddEditVehicleModal> {
  final _formKey = GlobalKey<FormState>();
  late TextEditingController _plakaController;
  late TextEditingController _kapasiteController;
  String _aracTuru = 'otomobil';
  String _kullanimAmaci = 'yolcu';
  String _aracDurumu = 'aktif';
  bool _musaitlikDurumu = true;

  @override
  void initState() {
    super.initState();
    _plakaController = TextEditingController(text: widget.vehicle?.plaka ?? '');
    _kapasiteController =
        TextEditingController(text: widget.vehicle?.kapasite.toString() ?? '1');

    if (widget.vehicle != null) {
      _aracTuru = widget.vehicle!.aracTuru;
      _kullanimAmaci = widget.vehicle!.kullanimAmaci;
      _aracDurumu = widget.vehicle!.aracDurumu;
      _musaitlikDurumu = widget.vehicle!.musaitlikDurumu;
    }
  }

  @override
  void dispose() {
    _plakaController.dispose();
    _kapasiteController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Container(
      constraints: BoxConstraints(
        maxHeight: MediaQuery.of(context).size.height * 0.9,
      ),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          // Handle bar
          Container(
            width: 40,
            height: 4,
            margin: const EdgeInsets.symmetric(vertical: 12),
            decoration: BoxDecoration(
              color: Colors.grey.shade300,
              borderRadius: BorderRadius.circular(2),
            ),
          ),

          // Header
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 20),
            child: Row(
              children: [
                Expanded(
                  child: Text(
                    widget.vehicle == null ? 'Araç Ekle' : 'Araç Düzenle',
                    style: Theme.of(context).textTheme.titleLarge?.copyWith(
                          fontWeight: FontWeight.bold,
                        ),
                  ),
                ),
                IconButton(
                  onPressed: () => Navigator.of(context).pop(),
                  icon: const Icon(Icons.close),
                ),
              ],
            ),
          ),

          const Divider(),

          // Content
          Expanded(
            child: SingleChildScrollView(
              padding: const EdgeInsets.all(20),
              child: Form(
                key: _formKey,
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    // Plaka
                    TextFormField(
                      controller: _plakaController,
                      decoration: const InputDecoration(
                        labelText: 'Plaka',
                        border: OutlineInputBorder(),
                      ),
                      validator: (value) {
                        if (value == null || value.isEmpty) {
                          return 'Plaka gereklidir';
                        }
                        return null;
                      },
                    ),

                    const SizedBox(height: 16),

                    // Araç Türü
                    DropdownButtonFormField<String>(
                      value: _aracTuru,
                      decoration: const InputDecoration(
                        labelText: 'Araç Türü',
                        border: OutlineInputBorder(),
                      ),
                      items: const [
                        DropdownMenuItem(
                            value: 'otomobil', child: Text('Otomobil')),
                        DropdownMenuItem(
                            value: 'kamyon', child: Text('Kamyon')),
                        DropdownMenuItem(
                            value: 'minibus', child: Text('Minibüs')),
                        DropdownMenuItem(
                            value: 'ambulans', child: Text('Ambulans')),
                      ],
                      onChanged: (value) {
                        setState(() {
                          _aracTuru = value!;
                        });
                      },
                    ),

                    const SizedBox(height: 16),

                    // Kullanım Amacı
                    DropdownButtonFormField<String>(
                      value: _kullanimAmaci,
                      decoration: const InputDecoration(
                        labelText: 'Kullanım Amacı',
                        border: OutlineInputBorder(),
                      ),
                      items: const [
                        DropdownMenuItem(value: 'yolcu', child: Text('Yolcu')),
                        DropdownMenuItem(value: 'yuk', child: Text('Yük')),
                        DropdownMenuItem(
                            value: 'saglik', child: Text('Sağlık')),
                      ],
                      onChanged: (value) {
                        setState(() {
                          _kullanimAmaci = value!;
                        });
                      },
                    ),

                    const SizedBox(height: 16),

                    // Kapasite
                    TextFormField(
                      controller: _kapasiteController,
                      decoration: const InputDecoration(
                        labelText: 'Kapasite',
                        border: OutlineInputBorder(),
                      ),
                      keyboardType: TextInputType.number,
                      validator: (value) {
                        if (value == null || value.isEmpty) {
                          return 'Kapasite gereklidir';
                        }
                        if (int.tryParse(value) == null) {
                          return 'Geçerli bir sayı girin';
                        }
                        return null;
                      },
                    ),

                    const SizedBox(height: 16),

                    // Araç Durumu
                    DropdownButtonFormField<String>(
                      value: _aracDurumu,
                      decoration: const InputDecoration(
                        labelText: 'Araç Durumu',
                        border: OutlineInputBorder(),
                      ),
                      items: const [
                        DropdownMenuItem(value: 'aktif', child: Text('Aktif')),
                        DropdownMenuItem(value: 'pasif', child: Text('Pasif')),
                      ],
                      onChanged: (value) {
                        setState(() {
                          _aracDurumu = value!;
                        });
                      },
                    ),

                    const SizedBox(height: 16),

                    // Müsaitlik Durumu
                    SwitchListTile(
                      title: const Text('Müsait'),
                      value: _musaitlikDurumu,
                      onChanged: (value) {
                        setState(() {
                          _musaitlikDurumu = value;
                        });
                      },
                    ),

                    const SizedBox(height: 20),

                    // Note
                    Container(
                      padding: const EdgeInsets.all(12),
                      decoration: BoxDecoration(
                        color: Colors.blue.shade50,
                        borderRadius: BorderRadius.circular(8),
                      ),
                      child: const Text(
                        'Not: Konum seçimi ve diğer detaylar henüz geliştirilme aşamasındadır.',
                        style: TextStyle(fontSize: 12),
                      ),
                    ),

                    const SizedBox(height: 30),

                    // Save button
                    SizedBox(
                      width: double.infinity,
                      child: ElevatedButton(
                        onPressed: _saveVehicle,
                        style: ElevatedButton.styleFrom(
                          backgroundColor: Colors.blue,
                          foregroundColor: Colors.white,
                          padding: const EdgeInsets.symmetric(vertical: 16),
                        ),
                        child: Text(
                            widget.vehicle == null ? 'Araç Ekle' : 'Güncelle'),
                      ),
                    ),
                  ],
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }

  void _saveVehicle() {
    if (_formKey.currentState!.validate()) {
      final vehicleData = {
        'plaka': _plakaController.text,
        'aracTuru': _aracTuru,
        'kullanimAmaci': _kullanimAmaci,
        'kapasite': int.parse(_kapasiteController.text),
        'aracDurumu': _aracDurumu,
        'musaitlikDurumu': _musaitlikDurumu,
        // Mock location data
        'konum': {
          'lat': 39.9334,
          'lng': 32.8597,
          'adres': 'Ankara, Türkiye',
        },
      };

      widget.onSave(vehicleData);
    }
  }
}
