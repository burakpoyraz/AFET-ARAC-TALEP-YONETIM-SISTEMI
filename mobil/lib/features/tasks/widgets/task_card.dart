import 'package:afet_arac_takip/features/tasks/model/task_model.dart';
import 'package:flutter/material.dart';
import 'package:intl/intl.dart';

/// Task card widget for displaying task information
class TaskCard extends StatelessWidget {
  const TaskCard({
    required this.task,
    this.onTap,
    this.onUpdateStatus,
    super.key,
  });

  final Task task;
  final VoidCallback? onTap;
  final VoidCallback? onUpdateStatus;

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
                      task.requestTitle,
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

              const SizedBox(height: 12),

              // Info rows
              _buildInfoRow(
                context,
                Icons.directions_car,
                'Araç',
                task.vehiclePlate,
              ),

              const SizedBox(height: 4),

              _buildInfoRow(
                context,
                Icons.person,
                'Şoför',
                task.driverName,
              ),

              const SizedBox(height: 4),

              _buildInfoRow(
                context,
                Icons.access_time,
                'Oluşturulma',
                DateFormat('dd.MM.yyyy HH:mm').format(task.olusturulmaZamani),
              ),

              if (task.baslangicZamani != null) ...[
                const SizedBox(height: 4),
                _buildInfoRow(
                  context,
                  Icons.play_arrow,
                  'Başlangıç',
                  DateFormat('dd.MM.yyyy HH:mm').format(task.baslangicZamani!),
                ),
              ],

              if (task.gorevNotu != null) ...[
                const SizedBox(height: 8),
                Container(
                  width: double.infinity,
                  padding: const EdgeInsets.all(8),
                  decoration: BoxDecoration(
                    color: Colors.grey.shade100,
                    borderRadius: BorderRadius.circular(8),
                  ),
                  child: Text(
                    task.gorevNotu!,
                    style: Theme.of(context).textTheme.bodySmall?.copyWith(
                          fontStyle: FontStyle.italic,
                        ),
                  ),
                ),
              ],

              // Action button
              if (onUpdateStatus != null) ...[
                const SizedBox(height: 16),
                SizedBox(
                  width: double.infinity,
                  child: ElevatedButton.icon(
                    onPressed: onUpdateStatus,
                    icon: const Icon(Icons.update, size: 18),
                    label: const Text('Durum Güncelle'),
                    style: ElevatedButton.styleFrom(
                      backgroundColor: Colors.blue,
                      foregroundColor: Colors.white,
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(8),
                      ),
                    ),
                  ),
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

    switch (task.gorevDurumu) {
      case 'beklemede':
        backgroundColor = Colors.orange.shade100;
        textColor = Colors.orange.shade700;
      case 'başladı':
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
        task.statusDisplayText,
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
