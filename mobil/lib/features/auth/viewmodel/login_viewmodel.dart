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

      // Test connection before attempting login with explicit timeout
      try {
        final isConnected = await _networkManager.testConnection().timeout(
          const Duration(seconds: 8),
          onTimeout: () {
            debugPrint(
                '[LoginViewModel] Connection test timed out after 8 seconds');
            return false;
          },
        );

        debugPrint('[LoginViewModel] Connection test result: $isConnected');

        if (!isConnected) {
          throw DioException(
            requestOptions: RequestOptions(),
            type: DioExceptionType.connectionError,
            error: 'Sunucuya bağlanılamadı',
          );
        }
      } on DioException catch (e) {
        debugPrint('[LoginViewModel] Connection test failed with error: $e');
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

        // Kullanıcının kurum bilgisini zenginleştir
        final enhancedUserModel =
            await _enhanceUserWithInstitutionData(userModel);

        await _localStorage.setUser(enhancedUserModel);
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

  /// [_enhanceUserWithInstitutionData] fetches institution data and enhances user model
  Future<User> _enhanceUserWithInstitutionData(User user) async {
    // Eğer kullanıcının kurum ID'si yoksa, orijinal user'ı döndür
    if (user.kurumFirmaId == null || user.kurumFirmaId!.id.isEmpty) {
      debugPrint('[LoginViewModel] No kurum ID found, returning original user');
      return user;
    }

    try {
      debugPrint(
          '[LoginViewModel] Fetching institution data for ID: ${user.kurumFirmaId!.id}');

      // Kurum bilgilerini API'den çek
      final response =
          await _networkManager.dio.get<List<dynamic>>('/kurumlar');

      if (response.statusCode == 200 && response.data != null) {
        final kurumlar = response.data!;

        // Kullanıcının kurumunu bul
        final userKurumList = kurumlar
            .where(
              (kurum) => kurum['_id'] == user.kurumFirmaId!.id,
            )
            .toList();

        if (userKurumList.isNotEmpty) {
          final userKurum = userKurumList.first;
          final kurumAdi = userKurum['kurumAdi'] as String?;

          if (kurumAdi != null && kurumAdi.isNotEmpty) {
            debugPrint('[LoginViewModel] Found institution name: $kurumAdi');

            // Yeni KurumFirma objesi oluştur
            final enhancedKurumFirma = KurumFirma(
              id: user.kurumFirmaId!.id,
              kurumAdi: kurumAdi,
            );

            // Yeni User objesi oluştur
            return User(
              id: user.id,
              ad: user.ad,
              soyad: user.soyad,
              email: user.email,
              telefon: user.telefon,
              rol: user.rol,
              kurumFirmaId: enhancedKurumFirma,
              kullaniciBeyanBilgileri: user.kullaniciBeyanBilgileri,
            );
          }
        }
      }
    } on DioException catch (e) {
      debugPrint(
          '[LoginViewModel] Failed to fetch institution data: ${e.message}');
    } on Exception catch (e) {
      debugPrint(
          '[LoginViewModel] Unexpected error fetching institution data: $e');
    }

    // Hata durumunda orijinal user'ı döndür
    debugPrint('[LoginViewModel] Returning original user due to fetch failure');
    return user;
  }
}
