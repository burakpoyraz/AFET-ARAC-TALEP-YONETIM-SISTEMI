import 'package:afet_arac_takip/core/init/navigation/navigation_service.dart';
import 'package:afet_arac_takip/product/cache/local_storage.dart';
import 'package:afet_arac_takip/product/network/network_manager.dart';
import 'package:flutter/material.dart';

/// Register view model
class RegisterViewModel extends ChangeNotifier {
  final NetworkManager _networkManager = NetworkManager.instance;
  final LocalStorage _localStorage = LocalStorage.instance;
  final NavigationService _navigationService = NavigationService.instance;

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

      final response = await _networkManager.dio.post<Map<String, dynamic>>(
        '/auth/kayitol',
        data: {
          'adSoyad': name,
          'email': email,
          'telefon': phone,
          'sifre': password,
        },
      );

      if (response.statusCode == 200) {
        final data = response.data;
        if (data != null) {
          final token = data['token'] as String;
          final user = data['user'] as Map<String, dynamic>;

          await _localStorage.setToken(token);
          await _localStorage.setUser(user.toString());

          await _navigationService.navigateToPageClear(path: '/vehicles');
        }
      }
    } on Exception catch (e) {
      debugPrint('Register error: $e');
    } finally {
      isLoading = false;
    }
  }
}
