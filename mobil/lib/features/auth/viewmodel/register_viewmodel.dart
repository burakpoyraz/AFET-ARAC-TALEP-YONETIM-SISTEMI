import 'package:afet_arac_takip/core/init/navigation/navigation_service.dart';
import 'package:afet_arac_takip/features/auth/model/user_model.dart';
import 'package:afet_arac_takip/product/cache/local_storage.dart';
import 'package:afet_arac_takip/product/network/network_manager.dart';
import 'package:dio/dio.dart';
import 'package:flutter/material.dart';

/// Register view model
class RegisterViewModel extends ChangeNotifier {
  final NetworkManager _networkManager = NetworkManager.instance;
  final LocalStorage _localStorage = LocalStorage.instance;
  final NavigationService _navigationService = NavigationService.instance;

  bool _isLoading = false;
  bool get isLoading => _isLoading;

  String? _errorMessage;
  String? get errorMessage => _errorMessage;

  set isLoading(bool value) {
    _isLoading = value;
    notifyListeners();
  }

  void _setError(String? message) {
    _errorMessage = message;
    notifyListeners();
  }

  /// Register with user information
  Future<void> register({
    required String ad,
    required String soyad,
    required String email,
    required String phone,
    required String password,
    required String passwordConfirm,
  }) async {
    if (password != passwordConfirm) {
      _setError('Şifreler eşleşmiyor');
      return;
    }

    if (ad.isEmpty || soyad.isEmpty || email.isEmpty || password.isEmpty) {
      _setError('Lütfen tüm alanları doldurun');
      return;
    }

    if (password.length < 6) {
      _setError('Şifre en az 6 karakter olmalıdır');
      return;
    }

    try {
      _setError(null);
      isLoading = true;

      final response = await _networkManager.dio.post<Map<String, dynamic>>(
        '/auth/kayitol',
        data: {
          'ad': ad,
          'soyad': soyad,
          'email': email,
          'telefon': phone,
          'sifre': password,
          'isMobile': true,
        },
        options: Options(
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
          validateStatus: (status) {
            return status != null && status < 500;
          },
        ),
      );

      if (response.statusCode == 200 && response.data != null) {
        final data = response.data!;

        final token = data['token'] as String?;
        final userJson = data['yeniKullanici'] as Map<String, dynamic>?;

        if (token == null || userJson == null) {
          throw Exception('Sunucudan geçersiz yanıt alındı');
        }

        await _localStorage.setToken(token);
        final user = User.fromJson(userJson);
        await _localStorage.setUser(user);

        // Navigate to main layout (new users with 'beklemede' status will be redirected)
        await _navigationService.navigateToPageClear(path: '/main');
      } else {
        final errorMessage =
            response.data?['error'] as String? ?? 'Kayıt başarısız';
        throw Exception(errorMessage);
      }
    } on DioException catch (e) {
      debugPrint('[RegisterViewModel] DioError: ${e.message}');
      if (e.response?.statusCode == 400) {
        final errorMessage =
            e.response?.data?['error'] as String? ?? 'Geçersiz bilgiler';
        _setError(errorMessage);
      } else {
        _setError('Kayıt sırasında bir hata oluştu');
      }
    } on Exception catch (e) {
      debugPrint('[RegisterViewModel] Error during register: $e');
      _setError(e.toString().replaceAll('Exception: ', ''));
    } finally {
      isLoading = false;
    }
  }
}
