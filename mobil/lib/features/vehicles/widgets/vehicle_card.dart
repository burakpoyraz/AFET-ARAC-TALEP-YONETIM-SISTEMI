import 'package:afet_arac_takip/features/vehicles/model/vehicle_model.dart';
import 'package:flutter/cupertino.dart';

/// A card widget to display vehicle information
class VehicleCard extends StatelessWidget {
  /// Creates a vehicle card
  const VehicleCard({
    required this.vehicle,
    this.onTap,
    this.onEdit,
    this.onDelete,
    super.key,
  });

  /// Vehicle to display
  final Vehicle vehicle;

  /// Called when the card is tapped
  final VoidCallback? onTap;

  /// Called when the edit button is tapped
  final VoidCallback? onEdit;

  /// Called when the delete button is tapped
  final VoidCallback? onDelete;

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        margin: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
        decoration: BoxDecoration(
          color: CupertinoColors.systemBackground,
          borderRadius: BorderRadius.circular(12),
          boxShadow: [
            BoxShadow(
              color: CupertinoColors.systemGrey.withOpacity(0.1),
              blurRadius: 10,
              offset: const Offset(0, 2),
            ),
          ],
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Header with plate number and status
            Container(
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: _getStatusColor(vehicle.durum).withValues(alpha: 0.1),
                borderRadius:
                    const BorderRadius.vertical(top: Radius.circular(12)),
              ),
              child: Row(
                children: [
                  Text(
                    vehicle.plaka,
                    style: const TextStyle(
                      fontSize: 18,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                  const Spacer(),
                  Container(
                    padding: const EdgeInsets.symmetric(
                      horizontal: 8,
                      vertical: 4,
                    ),
                    decoration: BoxDecoration(
                      color: _getStatusColor(vehicle.durum),
                      borderRadius: BorderRadius.circular(8),
                    ),
                    child: Text(
                      _getStatusText(vehicle.durum),
                      style: const TextStyle(
                        color: CupertinoColors.white,
                        fontSize: 12,
                        fontWeight: FontWeight.w500,
                      ),
                    ),
                  ),
                ],
              ),
            ),
            // Vehicle details
            Padding(
              padding: const EdgeInsets.all(16),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    children: [
                      Text(
                        '${vehicle.marka} ${vehicle.model}',
                        style: const TextStyle(
                          fontSize: 16,
                          fontWeight: FontWeight.w500,
                        ),
                      ),
                      const Spacer(),
                      Text(
                        'Kapasite: ${vehicle.kapasite}',
                        style: TextStyle(
                          fontSize: 14,
                          color: CupertinoColors.systemGrey.withOpacity(0.8),
                        ),
                      ),
                    ],
                  ),
                  if (vehicle.konum != null) ...[
                    const SizedBox(height: 8),
                    Row(
                      children: [
                        const Icon(
                          CupertinoIcons.location_solid,
                          size: 14,
                          color: CupertinoColors.systemGrey,
                        ),
                        const SizedBox(width: 4),
                        Text(
                          'Konum: ${vehicle.konum!.lat.toStringAsFixed(6)}, '
                          '${vehicle.konum!.lng.toStringAsFixed(6)}',
                          style: const TextStyle(
                            fontSize: 14,
                            color: CupertinoColors.systemGrey,
                          ),
                        ),
                      ],
                    ),
                  ],
                ],
              ),
            ),
            // Action buttons
            if (onEdit != null || onDelete != null)
              Container(
                decoration: const BoxDecoration(
                  border: Border(
                    top: BorderSide(
                      color: CupertinoColors.separator,
                      width: 0.5,
                    ),
                  ),
                ),
                child: Row(
                  children: [
                    if (onEdit != null)
                      Expanded(
                        child: CupertinoButton(
                          padding: const EdgeInsets.symmetric(vertical: 12),
                          onPressed: onEdit,
                          child: const Row(
                            mainAxisAlignment: MainAxisAlignment.center,
                            children: [
                              Icon(
                                CupertinoIcons.pencil,
                                size: 16,
                              ),
                              SizedBox(width: 4),
                              Text('Düzenle'),
                            ],
                          ),
                        ),
                      ),
                    if (onEdit != null && onDelete != null)
                      Container(
                        width: 0.5,
                        height: 44,
                        color: CupertinoColors.separator,
                      ),
                    if (onDelete != null)
                      Expanded(
                        child: CupertinoButton(
                          padding: const EdgeInsets.symmetric(vertical: 12),
                          onPressed: onDelete,
                          child: const Row(
                            mainAxisAlignment: MainAxisAlignment.center,
                            children: [
                              Icon(
                                CupertinoIcons.delete,
                                size: 16,
                                color: CupertinoColors.destructiveRed,
                              ),
                              SizedBox(width: 4),
                              Text(
                                'Sil',
                                style: TextStyle(
                                  color: CupertinoColors.destructiveRed,
                                ),
                              ),
                            ],
                          ),
                        ),
                      ),
                  ],
                ),
              ),
          ],
        ),
      ),
    );
  }

  Color _getStatusColor(String status) {
    switch (status.toLowerCase()) {
      case 'available':
        return CupertinoColors.systemGreen;
      case 'busy':
        return CupertinoColors.systemOrange;
      case 'maintenance':
        return CupertinoColors.systemRed;
      default:
        return CupertinoColors.systemGrey;
    }
  }

  String _getStatusText(String status) {
    switch (status.toLowerCase()) {
      case 'available':
        return 'Müsait';
      case 'busy':
        return 'Görevde';
      case 'maintenance':
        return 'Bakımda';
      default:
        return 'Bilinmiyor';
    }
  }
}
