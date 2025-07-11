import 'package:afet_arac_takip/features/requests/model/request_model.dart';
import 'package:flutter/material.dart';
import 'package:intl/intl.dart';

/// Request detail modal widget
class RequestDetailModal extends StatelessWidget {
  /// Creates a request detail modal
  const RequestDetailModal({
    required this.request,
    this.onAssign,
    this.onCancel,
    super.key,
  });

  /// The request to display
  final Request request;

  /// Callback when assign button is tapped
  final VoidCallback? onAssign;

  /// Callback when cancel button is tapped
  final VoidCallback? onCancel;

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
                    'Talep Detayları',
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
          Flexible(
            child: SingleChildScrollView(
              padding: const EdgeInsets.all(20),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  // Title and Status
                  Row(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Expanded(
                        child: Text(
                          request.baslik,
                          style:
                              Theme.of(context).textTheme.titleLarge?.copyWith(
                                    fontWeight: FontWeight.bold,
                                  ),
                        ),
                      ),
                      const SizedBox(width: 12),
                      _buildStatusChip(context),
                    ],
                  ),

                  const SizedBox(height: 16),

                  // Description
                  _buildSection(
                    context,
                    'Açıklama',
                    Icons.description,
                    request.aciklama,
                  ),

                  const SizedBox(height: 20),

                  // Vehicles section
                  _buildVehiclesSection(context),

                  const SizedBox(height: 20),

                  // Location
                  _buildSection(
                    context,
                    'Konum',
                    Icons.location_on,
                    request.lokasyon.adres,
                  ),

                  const SizedBox(height: 20),

                  // Organization info
                  if (request.kurumAdi != null) ...[
                    _buildSection(
                      context,
                      'Kurum',
                      Icons.business,
                      request.kurumAdi!,
                    ),
                    const SizedBox(height: 20),
                  ],

                  // Requester info
                  if (request.talepEdenAdi != null) ...[
                    _buildSection(
                      context,
                      'Talep Eden',
                      Icons.person,
                      request.talepEdenAdi!,
                    ),
                    const SizedBox(height: 20),
                  ],

                  // Creation date
                  _buildSection(
                    context,
                    'Oluşturulma Tarihi',
                    Icons.access_time,
                    DateFormat('dd MMMM yyyy, HH:mm', 'tr_TR')
                        .format(request.olusturulmaZamani),
                  ),

                  const SizedBox(height: 30),

                  // Action buttons
                  if (onAssign != null || onCancel != null) ...[
                    Row(
                      children: [
                        if (onAssign != null) ...[
                          Expanded(
                            child: ElevatedButton(
                              onPressed: onAssign,
                              style: ElevatedButton.styleFrom(
                                backgroundColor: Colors.green,
                                foregroundColor: Colors.white,
                              ),
                              child: const Text('Görevlendir'),
                            ),
                          ),
                          if (onCancel != null) const SizedBox(width: 12),
                        ],
                        if (onCancel != null)
                          Expanded(
                            child: ElevatedButton(
                              onPressed: onCancel,
                              style: ElevatedButton.styleFrom(
                                backgroundColor: Colors.red,
                                foregroundColor: Colors.white,
                              ),
                              child: const Text('İptal Et'),
                            ),
                          ),
                      ],
                    ),
                    const SizedBox(height: 20),
                  ],
                ],
              ),
            ),
          ),
        ],
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
      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
      decoration: BoxDecoration(
        color: backgroundColor,
        borderRadius: BorderRadius.circular(16),
      ),
      child: Text(
        request.statusDisplayText,
        style: TextStyle(
          color: textColor,
          fontSize: 14,
          fontWeight: FontWeight.w600,
        ),
      ),
    );
  }

  Widget _buildSection(
      BuildContext context, String title, IconData icon, String content) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Row(
          children: [
            Icon(
              icon,
              size: 20,
              color: Theme.of(context).primaryColor,
            ),
            const SizedBox(width: 8),
            Text(
              title,
              style: Theme.of(context).textTheme.titleMedium?.copyWith(
                    fontWeight: FontWeight.w600,
                    color: Theme.of(context).primaryColor,
                  ),
            ),
          ],
        ),
        const SizedBox(height: 8),
        Container(
          width: double.infinity,
          padding: const EdgeInsets.all(12),
          decoration: BoxDecoration(
            color: Colors.grey.shade50,
            borderRadius: BorderRadius.circular(8),
            border: Border.all(color: Colors.grey.shade200),
          ),
          child: Text(
            content,
            style: Theme.of(context).textTheme.bodyMedium,
          ),
        ),
      ],
    );
  }

  Widget _buildVehiclesSection(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Row(
          children: [
            Icon(
              Icons.directions_car,
              size: 20,
              color: Theme.of(context).primaryColor,
            ),
            const SizedBox(width: 8),
            Text(
              'İstenilen Araçlar',
              style: Theme.of(context).textTheme.titleMedium?.copyWith(
                    fontWeight: FontWeight.w600,
                    color: Theme.of(context).primaryColor,
                  ),
            ),
          ],
        ),
        const SizedBox(height: 8),
        Container(
          width: double.infinity,
          padding: const EdgeInsets.all(12),
          decoration: BoxDecoration(
            color: Colors.grey.shade50,
            borderRadius: BorderRadius.circular(8),
            border: Border.all(color: Colors.grey.shade200),
          ),
          child: request.araclar.isEmpty
              ? Text(
                  'Araç bilgisi bulunmuyor',
                  style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                        fontStyle: FontStyle.italic,
                        color: Colors.grey.shade600,
                      ),
                )
              : Column(
                  children: request.araclar.map((arac) {
                    return Padding(
                      padding: const EdgeInsets.symmetric(vertical: 4),
                      child: Row(
                        children: [
                          Container(
                            width: 8,
                            height: 8,
                            decoration: BoxDecoration(
                              color: Theme.of(context).primaryColor,
                              shape: BoxShape.circle,
                            ),
                          ),
                          const SizedBox(width: 12),
                          Expanded(
                            child: Text(
                              '${arac.aracSayisi} adet ${arac.aracTuru}',
                              style: Theme.of(context).textTheme.bodyMedium,
                            ),
                          ),
                        ],
                      ),
                    );
                  }).toList(),
                ),
        ),
      ],
    );
  }
}
