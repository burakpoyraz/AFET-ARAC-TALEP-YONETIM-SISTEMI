import 'package:afet_arac_takip/features/auth/model/user_model.dart';
import 'package:flutter/material.dart';

/// User card widget (placeholder)
class UserCard extends StatelessWidget {
  const UserCard({
    required this.user,
    this.onTap,
    this.onAssignRole,
    this.onDelete,
    super.key,
  });

  final User user;
  final VoidCallback? onTap;
  final VoidCallback? onAssignRole;
  final VoidCallback? onDelete;

  @override
  Widget build(BuildContext context) {
    return Card(
      margin: const EdgeInsets.only(bottom: 8),
      child: ListTile(
        title: Text(user.fullName),
        subtitle: Text('${user.email} • ${user.displayRole}'),
        trailing: PopupMenuButton(
          itemBuilder: (context) => [
            if (onAssignRole != null)
              const PopupMenuItem(
                value: 'role',
                child: Text('Rol Ata'),
              ),
            if (onDelete != null)
              const PopupMenuItem(
                value: 'delete',
                child: Text('Sil'),
              ),
          ],
          onSelected: (value) {
            switch (value) {
              case 'role':
                onAssignRole?.call();
              case 'delete':
                onDelete?.call();
            }
          },
        ),
        onTap: onTap,
      ),
    );
  }
}
