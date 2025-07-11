import 'package:afet_arac_takip/features/requests/model/request_model.dart';
import 'package:flutter/material.dart';
import 'package:intl/intl.dart';

/// Request card widget for displaying request information
class RequestCard extends StatelessWidget {
  /// Creates a request card
  const RequestCard({
    required this.request,
    this.onTap,
    this.onAssign,
    this.onCancel,
    super.key,
  });

  /// The request to display
  final Request request;

  /// Callback when card is tapped
  final VoidCallback? onTap;

  /// Callback when assign button is tapped
  final VoidCallback? onAssign;

  /// Callback when cancel button is tapped
  final VoidCallback? onCancel;

  @override
  Widget build(BuildContext context) {
    return Card(
      margin: const EdgeInsets.only(bottom: 12),
      elevation: 2,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(12),
      ),
      child: InkWell(
        onTap: onTap,
        borderRadius: BorderRadius.circular(12),
        child: Padding(
          padding: const EdgeInsets.all(16),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Header row with status
              Row(
                children: [
                  Expanded(
                    child: Text(
                      request.baslik,
                      style: Theme.of(context).textTheme.titleMedium?.copyWith(
                            fontWeight: FontWeight.bold,
                          ),
                      maxLines: 2,
                      overflow: TextOverflow.ellipsis,
                    ),
                  ),
                  const SizedBox(width: 8),
                  _buildStatusChip(context),
                ],
              ),

              const SizedBox(height: 8),

              // Description
              Text(
                request.aciklama,
                style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                      color: Colors.grey.shade700,
                    ),
                maxLines: 2,
                overflow: TextOverflow.ellipsis,
              ),

              const SizedBox(height: 12),

              // Info rows
              _buildInfoRow(
                context,
                Icons.directions_car,
                'Araçlar',
                request.vehicleSummary,
              ),

              const SizedBox(height: 4),

              _buildInfoRow(
                context,
                Icons.location_on,
                'Konum',
                request.lokasyon.adres,
              ),

              if (request.kurumAdi != null) ...[
                const SizedBox(height: 4),
                _buildInfoRow(
                  context,
                  Icons.business,
                  'Kurum',
                  request.kurumAdi!,
                ),
              ],

              const SizedBox(height: 4),

              _buildInfoRow(
                context,
                Icons.access_time,
                'Oluşturulma',
                DateFormat('dd.MM.yyyy HH:mm')
                    .format(request.olusturulmaZamani),
              ),

              // Action buttons
              if (onAssign != null || onCancel != null) ...[
                const SizedBox(height: 16),
                Row(
                  children: [
                    if (onAssign != null) ...[
                      Expanded(
                        child: ElevatedButton.icon(
                          onPressed: onAssign,
                          icon:
                              const Icon(Icons.assignment_turned_in, size: 18),
                          label: const Text('Görevlendir'),
                          style: ElevatedButton.styleFrom(
                            backgroundColor: Colors.green,
                            foregroundColor: Colors.white,
                            shape: RoundedRectangleBorder(
                              borderRadius: BorderRadius.circular(8),
                            ),
                          ),
                        ),
                      ),
                      if (onCancel != null) const SizedBox(width: 8),
                    ],
                    if (onCancel != null)
                      Expanded(
                        child: OutlinedButton.icon(
                          onPressed: onCancel,
                          icon: const Icon(Icons.cancel, size: 18),
                          label: const Text('İptal Et'),
                          style: OutlinedButton.styleFrom(
                            foregroundColor: Colors.red,
                            side: const BorderSide(color: Colors.red),
                            shape: RoundedRectangleBorder(
                              borderRadius: BorderRadius.circular(8),
                            ),
                          ),
                        ),
                      ),
                  ],
                ),
              ],
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildStatusChip(BuildContext context) {
    Color backgroundColor;
    Color textColor;

    switch (request.durum) {
      case 'beklemede':
        backgroundColor = Colors.orange.shade100;
        textColor = Colors.orange.shade700;
      case 'gorevlendirildi':
        backgroundColor = Colors.blue.shade100;
        textColor = Colors.blue.shade700;
      case 'tamamlandı':
        backgroundColor = Colors.green.shade100;
        textColor = Colors.green.shade700;
      case 'iptal edildi':
        backgroundColor = Colors.red.shade100;
        textColor = Colors.red.shade700;
      default:
        backgroundColor = Colors.grey.shade100;
        textColor = Colors.grey.shade700;
    }

    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
      decoration: BoxDecoration(
        color: backgroundColor,
        borderRadius: BorderRadius.circular(12),
      ),
      child: Text(
        request.statusDisplayText,
        style: TextStyle(
          color: textColor,
          fontSize: 12,
          fontWeight: FontWeight.w500,
        ),
      ),
    );
  }

  Widget _buildInfoRow(
      BuildContext context, IconData icon, String label, String value) {
    return Row(
      children: [
        Icon(
          icon,
          size: 16,
          color: Colors.grey.shade600,
        ),
        const SizedBox(width: 8),
        Text(
          '$label: ',
          style: Theme.of(context).textTheme.bodySmall?.copyWith(
                color: Colors.grey.shade600,
                fontWeight: FontWeight.w500,
              ),
        ),
        Expanded(
          child: Text(
            value,
            style: Theme.of(context).textTheme.bodySmall?.copyWith(
                  color: Colors.grey.shade800,
                ),
            maxLines: 1,
            overflow: TextOverflow.ellipsis,
          ),
        ),
      ],
    );
  }
}
