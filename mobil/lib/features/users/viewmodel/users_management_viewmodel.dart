import 'package:afet_arac_takip/features/auth/model/user_model.dart';
import 'package:afet_arac_takip/product/network/network_manager.dart';
import 'package:dio/dio.dart';
import 'package:flutter/material.dart';

/// Users management viewmodel for koordinator
class UsersManagementViewModel extends ChangeNotifier {
  final NetworkManager _networkManager = NetworkManager.instance;

  List<User> _users = [];
  List<User> get users => _users;

  bool _isLoading = false;
  bool get isLoading => _isLoading;

  String? _error;
  String? get error => _error;

  /// Load all users from API
  Future<void> loadUsers() async {
    try {
      _isLoading = true;
      _error = null;
      notifyListeners();

      print('🔄 Loading users from API...');

      final response =
          await _networkManager.dio.get<List<dynamic>>('/kullanicilar');

      if (response.statusCode == 200) {
        final data = response.data!;
        _users =
            data.map((e) => User.fromJson(e as Map<String, dynamic>)).toList();

        print('✅ Users loaded successfully: ${_users.length} users');
        print('📊 User roles breakdown:');
        print(
            '  - Beklemede: ${_users.where((u) => u.rol == 'beklemede').length}');
        print(
            '  - Koordinator: ${_users.where((u) => u.rol == 'koordinator').length}');
        print(
            '  - Araç Sahibi: ${_users.where((u) => u.rol == 'arac_sahibi').length}');
        print(
            '  - Talep Eden: ${_users.where((u) => u.rol == 'talep_eden').length}');
      } else {
        throw Exception('API returned status code: ${response.statusCode}');
      }
    } on DioException catch (e) {
      _error = 'Kullanıcılar yüklenirken hata oluştu: $e';
      print('❌ Error loading users: $e');
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  /// Get filtered users based on search query and role
  List<User> getFilteredUsers(String searchQuery, String role) {
    var filtered = _users;

    // Filter by role
    if (role != 'all') {
      filtered = filtered.where((user) => user.rol == role).toList();
    }

    // Filter by search query
    if (searchQuery.isNotEmpty) {
      final query = searchQuery.toLowerCase();
      filtered = filtered.where((user) {
        return user.fullName.toLowerCase().contains(query) ||
            user.email.toLowerCase().contains(query) ||
            (user.telefon?.toLowerCase().contains(query) ?? false) ||
            user.displayRole.toLowerCase().contains(query);
      }).toList();
    }

    // Sort by role priority (beklemede first, then alphabetically)
    filtered.sort((a, b) {
      final rolePriority = {
        'beklemede': 0,
        'koordinator': 1,
        'arac_sahibi': 2,
        'talep_eden': 3,
      };

      final aPriority = rolePriority[a.rol] ?? 4;
      final bPriority = rolePriority[b.rol] ?? 4;

      if (aPriority != bPriority) {
        return aPriority.compareTo(bPriority);
      }

      return a.fullName.compareTo(b.fullName);
    });

    return filtered;
  }

  /// Assign a new role to a user
  Future<bool> assignRole(String userId, String newRole) async {
    try {
      print('🔄 Assigning role $newRole to user $userId...');

      final response = await _networkManager.dio.put<Map<String, dynamic>>(
        '/kullanicilar/$userId/rol',
        data: {'rol': newRole},
      );

      if (response.statusCode == 200) {
        // Update local user data
        final index = _users.indexWhere((u) => u.id == userId);
        if (index != -1) {
          final updatedUser = User.fromJson(response.data!);
          _users[index] = updatedUser;
          notifyListeners();
        }

        print('✅ Role assigned successfully');
        return true;
      } else {
        throw Exception('API returned status code: ${response.statusCode}');
      }
    } on DioException catch (e) {
      _error = 'Rol atama sırasında hata oluştu: $e';
      print('❌ Error assigning role: $e');
      notifyListeners();
      return false;
    }
  }

  /// Delete a user
  Future<bool> deleteUser(String userId) async {
    try {
      print('🔄 Deleting user $userId...');

      final response = await _networkManager.dio
          .delete<Map<String, dynamic>>('/kullanicilar/$userId');

      if (response.statusCode == 200) {
        // Remove user from local list
        _users.removeWhere((u) => u.id == userId);
        notifyListeners();

        print('✅ User deleted successfully');
        return true;
      } else {
        throw Exception('API returned status code: ${response.statusCode}');
      }
    } on DioException catch (e) {
      _error = 'Kullanıcı silme sırasında hata oluştu: $e';
      print('❌ Error deleting user: $e');
      notifyListeners();
      return false;
    }
  }

  /// Clear error message
  void clearError() {
    _error = null;
    notifyListeners();
  }
}
