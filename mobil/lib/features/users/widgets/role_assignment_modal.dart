import 'package:afet_arac_takip/features/auth/model/user_model.dart';
import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';

/// [RoleInfo] represents role information for the role assignment modal
class RoleInfo {
  const RoleInfo({
    required this.value,
    required this.title,
    required this.description,
    required this.icon,
    required this.color,
  });

  final String value;
  final String title;
  final String description;
  final IconData icon;
  final Color color;
}

/// [RoleAssignmentModal] provides a beautiful interface for assigning roles to users
/// Following Apple's Human Interface Guidelines for consistent, elegant design
class RoleAssignmentModal extends StatefulWidget {
  /// Creates a role assignment modal with Apple-style design
  const RoleAssignmentModal({
    required this.user,
    required this.onAssign,
    super.key,
  });

  final User user;
  final void Function(String) onAssign;

  @override
  State<RoleAssignmentModal> createState() => _RoleAssignmentModalState();
}

class _RoleAssignmentModalState extends State<RoleAssignmentModal> {
  String? _selectedRole;
  bool _isAssigning = false;

  final List<RoleInfo> _availableRoles = [
    const RoleInfo(
      value: 'koordinator',
      title: 'Koordinatör',
      description: 'Tüm sistemde yönetim yetkisi',
      icon: CupertinoIcons.person_badge_plus,
      color: CupertinoColors.systemBlue,
    ),
    const RoleInfo(
      value: 'arac_sahibi',
      title: 'Araç Sahibi',
      description: 'Araç yönetimi ve görev takibi',
      icon: CupertinoIcons.car,
      color: CupertinoColors.systemGreen,
    ),
    const RoleInfo(
      value: 'talep_eden',
      title: 'Talep Eden',
      description: 'Talep oluşturma ve takip',
      icon: CupertinoIcons.doc_text,
      color: CupertinoColors.systemOrange,
    ),
  ];

  @override
  void initState() {
    super.initState();
    _selectedRole = widget.user.rol != 'beklemede' ? widget.user.rol : null;
  }

  @override
  Widget build(BuildContext context) {
    return Container(
      height: MediaQuery.of(context).size.height * 0.75,
      decoration: const BoxDecoration(
        color: CupertinoColors.systemGroupedBackground,
        borderRadius: BorderRadius.vertical(top: Radius.circular(20)),
      ),
      child: Column(
        children: [
          // Header
          _buildHeader(context),
          // Content
          Expanded(
            child: SingleChildScrollView(
              padding: const EdgeInsets.all(16),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  // User info card
                  _buildUserInfoCard(context),
                  const SizedBox(height: 24),
                  // Current role indicator
                  _buildCurrentRoleSection(context),
                  const SizedBox(height: 24),
                  // Role selection section
                  _buildRoleSelectionSection(context),
                  const SizedBox(height: 32),
                  // Action buttons
                  _buildActionButtons(context),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }

  /// [_buildHeader] creates the modal header
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
          // Header content
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              const Text(
                'Rol Atama',
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

  /// [_buildUserInfoCard] creates user information card
  Widget _buildUserInfoCard(BuildContext context) {
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
      child: Row(
        children: [
          // User avatar
          Container(
            width: 60,
            height: 60,
            decoration: BoxDecoration(
              color: Theme.of(context).primaryColor.withValues(alpha: 0.1),
              shape: BoxShape.circle,
            ),
            child: Icon(
              CupertinoIcons.person_fill,
              color: Theme.of(context).primaryColor,
              size: 30,
            ),
          ),
          const SizedBox(width: 16),
          // User details
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  widget.user.fullName,
                  style: const TextStyle(
                    fontSize: 18,
                    fontWeight: FontWeight.w600,
                  ),
                ),
                const SizedBox(height: 4),
                Text(
                  widget.user.email,
                  style: const TextStyle(
                    fontSize: 14,
                    color: CupertinoColors.systemGrey,
                  ),
                ),
                if (widget.user.telefon != null) ...[
                  const SizedBox(height: 2),
                  Text(
                    widget.user.telefon!,
                    style: const TextStyle(
                      fontSize: 14,
                      color: CupertinoColors.systemGrey,
                    ),
                  ),
                ],
              ],
            ),
          ),
        ],
      ),
    );
  }

  /// [_buildCurrentRoleSection] shows current role status
  Widget _buildCurrentRoleSection(BuildContext context) {
    final isWaiting = widget.user.rol == 'beklemede';

    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: isWaiting
            ? CupertinoColors.systemYellow.withOpacity(0.1)
            : CupertinoColors.systemGreen.withOpacity(0.1),
        borderRadius: BorderRadius.circular(12),
        border: Border.all(
          color: isWaiting
              ? CupertinoColors.systemYellow.withOpacity(0.3)
              : CupertinoColors.systemGreen.withOpacity(0.3),
        ),
      ),
      child: Row(
        children: [
          Icon(
            isWaiting ? CupertinoIcons.clock : CupertinoIcons.checkmark_circle,
            color: isWaiting
                ? CupertinoColors.systemYellow
                : CupertinoColors.systemGreen,
            size: 24,
          ),
          const SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Text(
                  'Mevcut Durum',
                  style: TextStyle(
                    fontSize: 13,
                    color: CupertinoColors.systemGrey,
                    fontWeight: FontWeight.w500,
                  ),
                ),
                const SizedBox(height: 2),
                Text(
                  widget.user.displayRole,
                  style: TextStyle(
                    fontSize: 16,
                    fontWeight: FontWeight.w600,
                    color: isWaiting
                        ? CupertinoColors.systemYellow
                        : CupertinoColors.systemGreen,
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  /// [_buildRoleSelectionSection] creates role selection interface
  Widget _buildRoleSelectionSection(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const Text(
          'Yeni Rol Seçin',
          style: TextStyle(
            fontSize: 18,
            fontWeight: FontWeight.w600,
          ),
        ),
        const SizedBox(height: 16),
        ..._availableRoles.map((role) => _buildRoleOption(context, role)),
      ],
    );
  }

  /// [_buildRoleOption] creates individual role selection option
  Widget _buildRoleOption(BuildContext context, RoleInfo role) {
    final isSelected = _selectedRole == role.value;
    final isCurrentRole = widget.user.rol == role.value;

    return Container(
      margin: const EdgeInsets.only(bottom: 12),
      child: Material(
        color: Colors.transparent,
        child: InkWell(
          borderRadius: BorderRadius.circular(12),
          onTap: isCurrentRole
              ? null
              : () {
                  setState(() {
                    _selectedRole = role.value;
                  });
                },
          child: Container(
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              color: isSelected
                  ? role.color.withValues(alpha: 0.1)
                  : CupertinoColors.systemBackground,
              borderRadius: BorderRadius.circular(12),
              border: Border.all(
                color: isSelected
                    ? role.color.withValues(alpha: 0.5)
                    : isCurrentRole
                        ? CupertinoColors.systemGrey.withOpacity(0.3)
                        : CupertinoColors.systemGrey6,
                width: isSelected ? 2 : 1,
              ),
            ),
            child: Row(
              children: [
                // Role icon
                Container(
                  width: 48,
                  height: 48,
                  decoration: BoxDecoration(
                    color: role.color.withValues(alpha: 0.1),
                    shape: BoxShape.circle,
                  ),
                  child: Icon(
                    role.icon,
                    color: role.color,
                    size: 24,
                  ),
                ),
                const SizedBox(width: 16),
                // Role details
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Row(
                        children: [
                          Text(
                            role.title,
                            style: TextStyle(
                              fontSize: 16,
                              fontWeight: FontWeight.w600,
                              color: isCurrentRole
                                  ? CupertinoColors.systemGrey
                                  : null,
                            ),
                          ),
                          if (isCurrentRole) ...[
                            const SizedBox(width: 8),
                            Container(
                              padding: const EdgeInsets.symmetric(
                                  horizontal: 8, vertical: 2),
                              decoration: BoxDecoration(
                                color: CupertinoColors.systemGrey6,
                                borderRadius: BorderRadius.circular(8),
                              ),
                              child: const Text(
                                'Mevcut',
                                style: TextStyle(
                                  fontSize: 11,
                                  color: CupertinoColors.systemGrey,
                                  fontWeight: FontWeight.w500,
                                ),
                              ),
                            ),
                          ],
                        ],
                      ),
                      const SizedBox(height: 4),
                      Text(
                        role.description,
                        style: const TextStyle(
                          fontSize: 14,
                          color: CupertinoColors.systemGrey,
                        ),
                      ),
                    ],
                  ),
                ),
                // Selection indicator
                if (isSelected)
                  Icon(
                    CupertinoIcons.checkmark_circle_fill,
                    color: role.color,
                    size: 24,
                  )
                else if (!isCurrentRole)
                  const Icon(
                    CupertinoIcons.circle,
                    color: CupertinoColors.systemGrey4,
                    size: 24,
                  ),
              ],
            ),
          ),
        ),
      ),
    );
  }

  /// [_buildActionButtons] creates action buttons
  Widget _buildActionButtons(BuildContext context) {
    final canAssign = _selectedRole != null && _selectedRole != widget.user.rol;

    return Column(
      children: [
        // Assign button
        SizedBox(
          width: double.infinity,
          child: CupertinoButton.filled(
            onPressed: canAssign && !_isAssigning ? _assignRole : null,
            child: _isAssigning
                ? const CupertinoActivityIndicator(color: Colors.white)
                : const Text(
                    'Rol Ata',
                    style: TextStyle(
                      fontSize: 16,
                      fontWeight: FontWeight.w600,
                    ),
                  ),
          ),
        ),
        const SizedBox(height: 12),
        // Cancel button
        SizedBox(
          width: double.infinity,
          child: CupertinoButton(
            onPressed: _isAssigning ? null : () => Navigator.of(context).pop(),
            child: const Text(
              'İptal',
              style: TextStyle(
                fontSize: 16,
                color: CupertinoColors.systemGrey,
              ),
            ),
          ),
        ),
      ],
    );
  }

  /// [_assignRole] handles role assignment
  Future<void> _assignRole() async {
    if (_selectedRole == null) return;

    setState(() {
      _isAssigning = true;
    });

    try {
      await Future<void>.delayed(
          const Duration(milliseconds: 500)); // Simulate API call
      widget.onAssign(_selectedRole!);

      if (mounted) {
        Navigator.of(context).pop();
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text(
                '${widget.user.fullName} kullanıcısına $_selectedRole rolü atandı'),
            backgroundColor: CupertinoColors.systemGreen,
          ),
        );
      }
    } on Exception {
      if (mounted) {
        setState(() {
          _isAssigning = false;
        });
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
            content: Text('Rol atama sırasında hata oluştu'),
            backgroundColor: CupertinoColors.systemRed,
          ),
        );
      }
    }
  }
}
