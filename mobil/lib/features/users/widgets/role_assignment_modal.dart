import 'package:afet_arac_takip/features/auth/model/user_model.dart';
import 'package:flutter/material.dart';

/// Role assignment modal (placeholder)
class RoleAssignmentModal extends StatelessWidget {
  const RoleAssignmentModal({
    required this.user,
    required this.onAssign,
    super.key,
  });

  final User user;
  final void Function(String) onAssign;

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(20),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          Text(
            'Rol Atama - ${user.fullName}',
            style: Theme.of(context).textTheme.titleLarge,
          ),
          const SizedBox(height: 20),
          const Text('Bu özellik geliştirme aşamasındadır.'),
          const SizedBox(height: 20),
          ElevatedButton(
            onPressed: () => onAssign('koordinator'),
            child: const Text('Demo Rol Ata'),
          ),
        ],
      ),
    );
  }
}
