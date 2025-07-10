import 'package:flutter/material.dart';

import '../../../product/cache/local_storage.dart';
import '../../../product/network/network_manager.dart';
import '../../../core/init/navigation/navigation_service.dart';

/// Register view model
class RegisterViewModel extends ChangeNotifier {
  final _networkManager = NetworkManager.instance;
  final _localStorage = LocalStorage.instance;
  final _navigationService = NavigationService.instance;

  bool _isLoading = false;
  bool get isLoading => _isLoading;

  set isLoading(bool value) {
    _isLoading = value;
    notifyListeners();
  }

  /// Register with user information
  Future<void> register({
    required String name,
    required String email,
    required String phone,
    required String password,
    required String passwordConfirm,
  }) async {
    if (password != passwordConfirm) {
      debugPrint('Şifreler eşleşmiyor');
      return;
    }

    try {
      isLoading = true;

      final response = await _networkManager.dio.post(
        '/auth/kayitol',
        data: {
          'adSoyad': name,
          'email': email,
          'telefon': phone,
          'sifre': password,
        },
      );

      if (response.statusCode == 200) {
        final token = response.data['token'];
        final user = response.data['user'];

        await _localStorage.setToken(token);
        await _localStorage.setUser(user.toString());

        await _navigationService.navigateToPageClear(path: '/vehicles');
      }
    } catch (e) {
      debugPrint('Register error: $e');
    } finally {
      isLoading = false;
    }
  }
}
