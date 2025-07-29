import 'package:afet_arac_takip/features/auth/model/user_model.dart';
import 'package:afet_arac_takip/features/users/viewmodel/users_management_viewmodel.dart';
import 'package:afet_arac_takip/features/users/widgets/role_assignment_modal.dart';
import 'package:afet_arac_takip/features/users/widgets/user_card.dart';
import 'package:afet_arac_takip/product/widgets/custom_button.dart';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

/// Users management view for koordinators
class UsersManagementView extends StatefulWidget {
  /// Creates a users management view
  const UsersManagementView({super.key});

  @override
  State<UsersManagementView> createState() => _UsersManagementViewState();
}

class _UsersManagementViewState extends State<UsersManagementView> {
  final _searchController = TextEditingController();
  String _selectedRole = 'all';

  @override
  void dispose() {
    _searchController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return ChangeNotifierProvider(
      create: (_) => UsersManagementViewModel()..loadUsers(),
      child: Scaffold(
        appBar: AppBar(
          title: const Text('Kullanıcı Yönetimi'),
          centerTitle: false,
        ),
        body: Consumer<UsersManagementViewModel>(
          builder: (context, viewModel, _) {
            if (viewModel.isLoading) {
              return const Center(child: CircularProgressIndicator());
            }

            if (viewModel.error != null) {
              return Center(
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    Icon(
                      Icons.error_outline,
                      size: 64,
                      color: Colors.red.shade400,
                    ),
                    const SizedBox(height: 16),
                    Text(
                      'Hata: ${viewModel.error}',
                      style: TextStyle(color: Colors.red.shade700),
                      textAlign: TextAlign.center,
                    ),
                    const SizedBox(height: 16),
                    CustomButton(
                      onPressed: () => viewModel.loadUsers(),
                      text: 'Yeniden Dene',
                      width: 150,
                    ),
                  ],
                ),
              );
            }

            final filteredUsers = viewModel.getFilteredUsers(
              _searchController.text,
              _selectedRole,
            );

            return Column(
              children: [
                // Search and Filter Section
                Padding(
                  padding: const EdgeInsets.all(16),
                  child: Column(
                    children: [
                      // Search Field
                      TextField(
                        controller: _searchController,
                        decoration: InputDecoration(
                          hintText: 'Kullanıcı ara...',
                          prefixIcon: const Icon(Icons.search),
                          border: OutlineInputBorder(
                            borderRadius: BorderRadius.circular(12),
                          ),
                          filled: true,
                          fillColor: Colors.grey.shade100,
                        ),
                        onChanged: (value) => setState(() {}),
                      ),
                      const SizedBox(height: 12),

                      // Role Filter
                      SingleChildScrollView(
                        scrollDirection: Axis.horizontal,
                        child: Row(
                          children: [
                            _buildRoleFilter(
                                'all', 'Tümü', viewModel.users.length),
                            _buildRoleFilter(
                                'beklemede',
                                'Beklemede',
                                viewModel.users
                                    .where((u) => u.rol == 'beklemede')
                                    .length),
                            _buildRoleFilter(
                                'koordinator',
                                'Koordinatör',
                                viewModel.users
                                    .where((u) => u.rol == 'koordinator')
                                    .length),
                            _buildRoleFilter(
                                'arac_sahibi',
                                'Araç Sahibi',
                                viewModel.users
                                    .where((u) => u.rol == 'arac_sahibi')
                                    .length),
                            _buildRoleFilter(
                                'talep_eden',
                                'Talep Eden',
                                viewModel.users
                                    .where((u) => u.rol == 'talep_eden')
                                    .length),
                          ],
                        ),
                      ),
                    ],
                  ),
                ),

                // Statistics Row
                Container(
                  margin: const EdgeInsets.symmetric(horizontal: 16),
                  padding: const EdgeInsets.all(16),
                  decoration: BoxDecoration(
                    color: Colors.blue.shade50,
                    borderRadius: BorderRadius.circular(12),
                  ),
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.spaceAround,
                    children: [
                      _buildStatItem(
                          'Toplam', viewModel.users.length, Colors.blue),
                      _buildStatItem(
                          'Beklemede',
                          viewModel.users
                              .where((u) => u.rol == 'beklemede')
                              .length,
                          Colors.orange),
                      _buildStatItem(
                          'Aktif',
                          viewModel.users
                              .where((u) => u.rol != 'beklemede')
                              .length,
                          Colors.green),
                    ],
                  ),
                ),

                const SizedBox(height: 16),

                // Users List
                Expanded(
                  child: filteredUsers.isEmpty
                      ? Center(
                          child: Column(
                            mainAxisAlignment: MainAxisAlignment.center,
                            children: [
                              Icon(
                                Icons.people_outline,
                                size: 64,
                                color: Colors.grey.shade400,
                              ),
                              const SizedBox(height: 16),
                              Text(
                                'Kullanıcı bulunamadı',
                                style: TextStyle(
                                  fontSize: 18,
                                  color: Colors.grey.shade600,
                                ),
                              ),
                            ],
                          ),
                        )
                      : RefreshIndicator(
                          onRefresh: () => viewModel.loadUsers(),
                          child: ListView.builder(
                            padding: const EdgeInsets.symmetric(horizontal: 16),
                            itemCount: filteredUsers.length,
                            itemBuilder: (context, index) {
                              final user = filteredUsers[index];
                              return UserCard(
                                user: user,
                                onTap: () => _showUserDetail(context, user),
                                onAssignRole: () => _showRoleAssignmentModal(
                                    context, user, viewModel),
                                onDelete: () =>
                                    _showDeleteDialog(context, user, viewModel),
                              );
                            },
                          ),
                        ),
                ),
              ],
            );
          },
        ),
      ),
    );
  }

  Widget _buildRoleFilter(String role, String label, int count) {
    final isSelected = _selectedRole == role;
    return Container(
      margin: const EdgeInsets.only(right: 8),
      child: FilterChip(
        label: Text('$label ($count)'),
        selected: isSelected,
        onSelected: (selected) {
          setState(() {
            _selectedRole = role;
          });
        },
        backgroundColor: Colors.grey.shade100,
        selectedColor: Theme.of(context).primaryColor.withAlpha(50),
        checkmarkColor: Theme.of(context).primaryColor,
      ),
    );
  }

  Widget _buildStatItem(String label, int value, Color color) {
    return Column(
      children: [
        Text(
          value.toString(),
          style: TextStyle(
            fontSize: 24,
            fontWeight: FontWeight.bold,
            color: color,
          ),
        ),
        Text(
          label,
          style: TextStyle(
            fontSize: 12,
            color: Colors.grey.shade700,
          ),
        ),
      ],
    );
  }

  void _showUserDetail(BuildContext context, User user) {
    showDialog<void>(
      context: context,
      builder: (context) => AlertDialog(
        title: Text(user.fullName),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            _buildDetailRow('Email', user.email),
            _buildDetailRow('Telefon', user.telefon ?? 'Belirtilmemiş'),
            _buildDetailRow('Rol', user.displayRole),
            if (user.kurumFirmaId != null)
              _buildDetailRow('Kurum', user.kurumFirmaId!.kurumAdi),
            if (user.kullaniciBeyanBilgileri != null)
              _buildDetailRow(
                  'Kayıt Türü', user.kullaniciBeyanBilgileri!.displayType),
          ],
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.of(context).pop(),
            child: const Text('Kapat'),
          ),
        ],
      ),
    );
  }

  Widget _buildDetailRow(String label, String value) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 4),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          SizedBox(
            width: 80,
            child: Text(
              '$label:',
              style: const TextStyle(fontWeight: FontWeight.w500),
            ),
          ),
          Expanded(
            child: Text(value),
          ),
        ],
      ),
    );
  }

  void _showRoleAssignmentModal(
      BuildContext context, User user, UsersManagementViewModel viewModel) {
    showModalBottomSheet<void>(
      context: context,
      isScrollControlled: true,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(20)),
      ),
      builder: (context) => RoleAssignmentModal(
        user: user,
        onAssign: (newRole) async {
          final success = await viewModel.assignRole(user.id, newRole);
          if (success && context.mounted) {
            Navigator.of(context).pop();
            ScaffoldMessenger.of(context).showSnackBar(
              const SnackBar(
                content: Text('Rol başarıyla güncellendi'),
                backgroundColor: Colors.green,
              ),
            );
          }
        },
      ),
    );
  }

  void _showDeleteDialog(
      BuildContext context, User user, UsersManagementViewModel viewModel) {
    showDialog<void>(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Kullanıcıyı Sil'),
        content: Text(
            '${user.fullName} kullanıcısını silmek istediğinize emin misiniz?'),
        actions: [
          TextButton(
            onPressed: () => Navigator.of(context).pop(),
            child: const Text('Vazgeç'),
          ),
          TextButton(
            onPressed: () async {
              Navigator.of(context).pop();
              final success = await viewModel.deleteUser(user.id);
              if (success && context.mounted) {
                ScaffoldMessenger.of(context).showSnackBar(
                  const SnackBar(
                    content: Text('Kullanıcı silindi'),
                    backgroundColor: Colors.orange,
                  ),
                );
              }
            },
            style: TextButton.styleFrom(foregroundColor: Colors.red),
            child: const Text('Sil'),
          ),
        ],
      ),
    );
  }
}
