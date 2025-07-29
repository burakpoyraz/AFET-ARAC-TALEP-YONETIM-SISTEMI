import 'package:afet_arac_takip/features/tasks/model/task_model.dart';
import 'package:flutter/material.dart';

/// Task status update modal widget (placeholder)
class TaskStatusUpdateModal extends StatelessWidget {
  const TaskStatusUpdateModal({
    required this.task,
    required this.onUpdate,
    super.key,
  });

  final Task task;
  final void Function(String) onUpdate;

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(20),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          // Handle bar
          Container(
            width: 40,
            height: 4,
            margin: const EdgeInsets.only(bottom: 16),
            decoration: BoxDecoration(
              color: Colors.grey.shade300,
              borderRadius: BorderRadius.circular(2),
            ),
          ),

          Text(
            'Durum Güncelle',
            style: Theme.of(context).textTheme.titleLarge?.copyWith(
                  fontWeight: FontWeight.bold,
                ),
          ),

          const SizedBox(height: 8),

          Text(
            task.requestTitle,
            style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                  color: Colors.grey.shade600,
                ),
            textAlign: TextAlign.center,
          ),

          const SizedBox(height: 20),

          // Current status
          Container(
            padding: const EdgeInsets.all(12),
            decoration: BoxDecoration(
              color: Colors.grey.shade100,
              borderRadius: BorderRadius.circular(8),
            ),
            child: Row(
              children: [
                const Icon(Icons.info_outline, size: 20),
                const SizedBox(width: 8),
                Text('Mevcut durum: ${task.statusDisplayText}'),
              ],
            ),
          ),

          const SizedBox(height: 20),

          // Status options
          if (task.gorevDurumu == 'beklemede') ...[
            _buildStatusButton(
              context,
              'Görevi Başlat',
              'başladı',
              Colors.blue,
              Icons.play_arrow,
            ),
          ] else if (task.gorevDurumu == 'başladı') ...[
            _buildStatusButton(
              context,
              'Görevi Tamamla',
              'tamamlandı',
              Colors.green,
              Icons.check_circle,
            ),
          ],

          const SizedBox(height: 12),

          // Cancel button
          SizedBox(
            width: double.infinity,
            child: OutlinedButton(
              onPressed: () => Navigator.of(context).pop(),
              child: const Text('İptal'),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildStatusButton(
    BuildContext context,
    String label,
    String status,
    Color color,
    IconData icon,
  ) {
    return SizedBox(
      width: double.infinity,
      child: ElevatedButton.icon(
        onPressed: () => onUpdate(status),
        icon: Icon(icon, size: 20),
        label: Text(label),
        style: ElevatedButton.styleFrom(
          backgroundColor: color,
          foregroundColor: Colors.white,
          padding: const EdgeInsets.symmetric(vertical: 16),
        ),
      ),
    );
  }
}
