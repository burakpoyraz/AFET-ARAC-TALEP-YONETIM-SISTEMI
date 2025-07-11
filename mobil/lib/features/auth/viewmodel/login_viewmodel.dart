import 'package:afet_arac_takip/core/init/navigation/navigation_service.dart';
import 'package:afet_arac_takip/features/auth/model/user_model.dart';
import 'package:afet_arac_takip/product/cache/local_storage.dart';
import 'package:afet_arac_takip/product/network/network_manager.dart';
import 'package:dio/dio.dart';
import 'package:flutter/material.dart';

/// Login view model
class LoginViewModel extends ChangeNotifier {
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

  /// Login with email and password
  Future<void> login({required String email, required String password}) async {
    if (email.isEmpty || password.isEmpty) {
      _setError('E-posta ve şifre alanları boş bırakılamaz');
      return;
    }

    try {
      _setError(null);
      isLoading = true;
      debugPrint('[LoginViewModel] Testing connection...');

      // Test connection before attempting login
      final isConnected = await _networkManager.testConnection();
      if (!isConnected) {
        throw DioException(
          requestOptions: RequestOptions(),
          type: DioExceptionType.connectionError,
          error: 'Sunucuya bağlanılamadı',
        );
      }

      debugPrint('[LoginViewModel] Connection test successful');
      debugPrint('[LoginViewModel] Attempting login with email: $email');

      final response = await _networkManager.dio
          .post<Map<String, dynamic>>(
        '/auth/girisyap',
        data: {'email': email, 'sifre': password, 'isMobile': true},
        options: Options(
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
          validateStatus: (status) {
            return status != null && status < 500;
          },
        ),
      )
          .timeout(
        const Duration(seconds: 10),
        onTimeout: () {
          throw DioException(
            requestOptions: RequestOptions(path: '/auth/girisyap'),
            type: DioExceptionType.connectionTimeout,
            error: 'İstek zaman aşımına uğradı',
          );
        },
      );

      debugPrint(
          '[LoginViewModel] Login response status: ${response.statusCode}');
      debugPrint('[LoginViewModel] Login response data: ${response.data}');

      if (response.statusCode == 200 && response.data != null) {
        final data = response.data!;

        final token = data['token'] as String?;
        final user = data['kullanici'] as Map<String, dynamic>?;

        if (token == null || user == null) {
          throw Exception('Sunucudan geçersiz yanıt alındı');
        }

        await _localStorage.setToken(token);
        final userModel = User.fromJson(user);
        await _localStorage.setUser(userModel);
        debugPrint('[LoginViewModel] Token and user data saved');

        // Navigate based on user role
        var initialRoute = '/main';
        if (userModel.isBeklemede) {
          initialRoute = '/pending-approval';
        }

        await _navigationService.navigateToPageClear(path: initialRoute);
        debugPrint('[LoginViewModel] Navigation to $initialRoute completed');
      } else {
        final errorMessage =
            response.data?['error'] as String? ?? 'Giriş başarısız';
        throw Exception(errorMessage);
      }
    } on DioException catch (e) {
      debugPrint('[LoginViewModel] DioError: ${e.message}');
      debugPrint('[LoginViewModel] DioError type: ${e.type}');
      debugPrint('[LoginViewModel] DioError response: ${e.response?.data}');

      switch (e.type) {
        case DioExceptionType.connectionTimeout:
        case DioExceptionType.sendTimeout:
        case DioExceptionType.receiveTimeout:
          _setError('Bağlantı zaman aşımına uğradı. Lütfen tekrar deneyin.');
        case DioExceptionType.connectionError:
          _setError(
              'Sunucuya bağlanılamadı. İnternet bağlantınızı kontrol edin.');
        case DioExceptionType.badResponse:
          if (e.response?.statusCode == 401) {
            _setError('E-posta veya şifre hatalı');
          } else if (e.response?.statusCode == 404) {
            _setError('Sunucu bulunamadı. Lütfen daha sonra tekrar deneyin.');
          } else {
            final errorMessage = e.response?.data?['error'] as String? ??
                'Sunucu hatası: ${e.response?.statusCode}';
            _setError(errorMessage);
          }
        default:
          _setError('Beklenmeyen bir hata oluştu: ${e.message}');
      }
    } on Exception catch (e) {
      debugPrint('[LoginViewModel] Error during login: $e');
      _setError(e.toString().replaceAll('Exception: ', ''));
    } finally {
      isLoading = false;
    }
  }
}
