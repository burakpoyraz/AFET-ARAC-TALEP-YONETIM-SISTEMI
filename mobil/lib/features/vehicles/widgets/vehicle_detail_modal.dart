import 'package:afet_arac_takip/features/vehicles/model/vehicle_model.dart';
import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';

/// [VehicleDetailModal] shows comprehensive vehicle information in a beautiful modal
/// Following Apple's Human Interface Guidelines for modern, elegant design
class VehicleDetailModal extends StatelessWidget {
  /// Creates a vehicle detail modal with Apple-style design
  const VehicleDetailModal({
    required this.vehicle,
    super.key,
  });

  final Vehicle vehicle;

  @override
  Widget build(BuildContext context) {
    return Container(
      height: MediaQuery.of(context).size.height * 0.85,
      decoration: const BoxDecoration(
        color: CupertinoColors.systemGroupedBackground,
        borderRadius: BorderRadius.vertical(top: Radius.circular(20)),
      ),
      child: Column(
        children: [
          // Handle bar and header
          _buildHeader(context),
          // Content
          Expanded(
            child: SingleChildScrollView(
              padding: const EdgeInsets.all(16),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  // Vehicle image placeholder
                  _buildVehicleImage(context),
                  const SizedBox(height: 24),
                  // Basic info section
                  _buildBasicInfoSection(context),
                  const SizedBox(height: 24),
                  // Status section
                  _buildStatusSection(context),
                  const SizedBox(height: 24),
                  // Location section
                  _buildLocationSection(context),
                  const SizedBox(height: 24),
                  // Additional details section
                  _buildAdditionalDetailsSection(context),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }

  /// [_buildHeader] creates the modal header with title and close button
  Widget _buildHeader(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: const BoxDecoration(
        color: CupertinoColors.systemBackground,
        borderRadius: BorderRadius.vertical(top: Radius.circular(20)),
        border: Border(
          bottom: BorderSide(
            color: CupertinoColors.separator,
            width: 0.5,
          ),
        ),
      ),
      child: Column(
        children: [
          // Handle bar
          Container(
            width: 36,
            height: 4,
            margin: const EdgeInsets.only(bottom: 16),
            decoration: BoxDecoration(
              color: CupertinoColors.systemGrey3,
              borderRadius: BorderRadius.circular(2),
            ),
          ),
          // Header row
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              const Text(
                'Araç Detayları',
                style: TextStyle(
                  fontSize: 20,
                  fontWeight: FontWeight.w600,
                ),
              ),
              CupertinoButton(
                padding: EdgeInsets.zero,
                onPressed: () => Navigator.of(context).pop(),
                child: const Icon(
                  CupertinoIcons.xmark_circle_fill,
                  color: CupertinoColors.systemGrey,
                  size: 24,
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }

  /// [_buildVehicleImage] creates a placeholder for vehicle image
  Widget _buildVehicleImage(BuildContext context) {
    return Container(
      width: double.infinity,
      height: 200,
      decoration: BoxDecoration(
        gradient: LinearGradient(
          colors: [
            Theme.of(context).primaryColor.withValues(alpha: 0.1),
            Theme.of(context).primaryColor.withValues(alpha: 0.05),
          ],
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
        ),
        borderRadius: BorderRadius.circular(16),
        border: Border.all(
          color: Theme.of(context).primaryColor.withValues(alpha: 0.2),
        ),
      ),
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Icon(
            _getVehicleIcon(vehicle.aracTuru),
            size: 80,
            color: Theme.of(context).primaryColor.withValues(alpha: 0.7),
          ),
          const SizedBox(height: 16),
          Text(
            vehicle.plaka,
            style: TextStyle(
              fontSize: 24,
              fontWeight: FontWeight.bold,
              color: Theme.of(context).primaryColor,
            ),
          ),
          const SizedBox(height: 4),
          Text(
            vehicle.aracTuru,
            style: TextStyle(
              fontSize: 16,
              color: Theme.of(context).primaryColor.withValues(alpha: 0.8),
              fontWeight: FontWeight.w500,
            ),
          ),
        ],
      ),
    );
  }

  /// [_buildBasicInfoSection] creates the basic vehicle information section
  Widget _buildBasicInfoSection(BuildContext context) {
    return _buildSection(
      context,
      'Temel Bilgiler',
      CupertinoIcons.car_detailed,
      [
        _buildInfoRow('Plaka', vehicle.plaka, CupertinoIcons.number),
        _buildInfoRow('Araç Türü', vehicle.aracTuru, CupertinoIcons.car),
        _buildInfoRow(
            'Kullanım Amacı', vehicle.kullanimAmaci, CupertinoIcons.flag),
        _buildInfoRow(
            'Kapasite', '${vehicle.kapasite} kişi', CupertinoIcons.person_2),
      ],
    );
  }

  /// [_buildStatusSection] creates the vehicle status section
  Widget _buildStatusSection(BuildContext context) {
    final statusColor = vehicle.musaitlikDurumu == true
        ? CupertinoColors.systemGreen
        : CupertinoColors.systemRed;
    final statusText = vehicle.musaitlikDurumu == true ? 'Müsait' : 'Meşgul';

    return _buildSection(
      context,
      'Durum Bilgileri',
      CupertinoIcons.checkmark_shield,
      [
        _buildInfoRow('Araç Durumu', vehicle.aracDurumu, CupertinoIcons.wrench),
        _buildStatusRow('Müsaitlik', statusText, statusColor),
      ],
    );
  }

  /// [_buildLocationSection] creates the location information section
  Widget _buildLocationSection(BuildContext context) {
    return _buildSection(
      context,
      'Konum Bilgileri',
      CupertinoIcons.location,
      [
        _buildInfoRow('Adres', vehicle.konum?.adres ?? 'Belirtilmemiş',
            CupertinoIcons.location_solid),
        _buildInfoRow(
            'Koordinatlar',
            vehicle.konum != null
                ? '${vehicle.konum!.lat.toStringAsFixed(6)}, ${vehicle.konum!.lng.toStringAsFixed(6)}'
                : 'Belirtilmemiş',
            CupertinoIcons.map),
      ],
    );
  }

  /// [_buildAdditionalDetailsSection] creates additional details section
  Widget _buildAdditionalDetailsSection(BuildContext context) {
    return _buildSection(
      context,
      'Ek Bilgiler',
      CupertinoIcons.info_circle,
      [
        if (vehicle.marka != null)
          _buildInfoRow('Marka', vehicle.marka!, CupertinoIcons.car),
        if (vehicle.model != null)
          _buildInfoRow('Model', vehicle.model!, CupertinoIcons.gear),
        _buildInfoRow('Kimlik', vehicle.plaka, CupertinoIcons.doc_text),
      ],
    );
  }

  /// [_buildSection] creates a section with title and content
  Widget _buildSection(BuildContext context, String title, IconData icon,
      List<Widget> children) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: CupertinoColors.systemBackground,
        borderRadius: BorderRadius.circular(12),
        boxShadow: [
          BoxShadow(
            color: CupertinoColors.systemGrey.withOpacity(0.1),
            blurRadius: 8,
            offset: const Offset(0, 2),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Section header
          Row(
            children: [
              Icon(
                icon,
                color: Theme.of(context).primaryColor,
                size: 20,
              ),
              const SizedBox(width: 8),
              Text(
                title,
                style: const TextStyle(
                  fontSize: 16,
                  fontWeight: FontWeight.w600,
                ),
              ),
            ],
          ),
          const SizedBox(height: 16),
          // Section content
          ...children,
        ],
      ),
    );
  }

  /// [_buildInfoRow] creates an information row with icon, label and value
  Widget _buildInfoRow(String label, String value, IconData icon) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 12),
      child: Row(
        children: [
          Icon(
            icon,
            color: CupertinoColors.systemGrey,
            size: 16,
          ),
          const SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  label,
                  style: const TextStyle(
                    fontSize: 13,
                    color: CupertinoColors.systemGrey,
                    fontWeight: FontWeight.w500,
                  ),
                ),
                const SizedBox(height: 2),
                Text(
                  value,
                  style: const TextStyle(
                    fontSize: 15,
                    fontWeight: FontWeight.w400,
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  /// [_buildStatusRow] creates a status row with colored indicator
  Widget _buildStatusRow(String label, String value, Color color) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 12),
      child: Row(
        children: [
          Container(
            width: 16,
            height: 16,
            decoration: BoxDecoration(
              color: color,
              shape: BoxShape.circle,
            ),
          ),
          const SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  label,
                  style: const TextStyle(
                    fontSize: 13,
                    color: CupertinoColors.systemGrey,
                    fontWeight: FontWeight.w500,
                  ),
                ),
                const SizedBox(height: 2),
                Text(
                  value,
                  style: TextStyle(
                    fontSize: 15,
                    fontWeight: FontWeight.w600,
                    color: color,
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  /// [_getVehicleIcon] returns appropriate icon for vehicle type
  IconData _getVehicleIcon(String vehicleType) {
    switch (vehicleType.toLowerCase()) {
      case 'ambulans':
        return CupertinoIcons.plus_square;
      case 'itfaiye':
        return CupertinoIcons.flame;
      case 'polis':
        return CupertinoIcons.shield;
      case 'kamyon':
        return CupertinoIcons.car_detailed;
      case 'otobüs':
        return CupertinoIcons.bus;
      default:
        return CupertinoIcons.car;
    }
  }
}
