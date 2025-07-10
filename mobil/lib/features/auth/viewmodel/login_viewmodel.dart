import 'package:flutter/material.dart';

import '../../../product/cache/local_storage.dart';
import '../../../product/network/network_manager.dart';
import '../../../core/init/navigation/navigation_service.dart';

/// Login view model
class LoginViewModel extends ChangeNotifier {
  final _networkManager = NetworkManager.instance;
  final _localStorage = LocalStorage.instance;
  final _navigationService = NavigationService.instance;

  bool _isLoading = false;
  bool get isLoading => _isLoading;

  set isLoading(bool value) {
    _isLoading = value;
    notifyListeners();
  }

  /// Login with email and password
  Future<void> login({required String email, required String password}) async {
    try {
      isLoading = true;

      final response = await _networkManager.dio.post(
        '/auth/girisyap',
        data: {'email': email, 'sifre': password},
      );

      if (response.statusCode == 200) {
        final token = response.data['token'];
        final user = response.data['user'];

        await _localStorage.setToken(token);
        await _localStorage.setUser(user.toString());

        await _navigationService.navigateToPageClear(path: '/vehicles');
      }
    } catch (e) {
      debugPrint('Login error: $e');
    } finally {
      isLoading = false;
    }
  }
}
