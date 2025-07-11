import 'dart:io' show Platform;

import 'package:afet_arac_takip/product/cache/local_storage.dart';
import 'package:dio/dio.dart';
import 'package:flutter/foundation.dart';

/// Network manager for handling API requests
class NetworkManager {
  NetworkManager._init() {
    _initializeDio();
  }
  static final NetworkManager instance = NetworkManager._init();

  late final Dio dio;

  /// Base URL for API requests
  String get _baseUrl {
    if (kDebugMode) {
      // Platform'a göre otomatik host seçimi
      final host = Platform.isIOS ? 'localhost' : '10.0.2.2';
      final url = 'http://$host:5001/api';
      debugPrint('[NetworkManager] Platform: ${Platform.operatingSystem}');
      debugPrint('[NetworkManager] Using host: $host');
      debugPrint('[NetworkManager] Base URL: $url');
      return url;
    }
    const url = 'https://your-production-url.com/api';
    debugPrint('[NetworkManager] Production Base URL: $url');
    return url;
  }

  /// Initialize Dio instance with proper configuration
  void _initializeDio() {
    final baseOptions = BaseOptions(
      baseUrl: _baseUrl,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      validateStatus: (status) {
        return status != null && status < 500;
      },
      // Increase timeout settings
      connectTimeout: const Duration(seconds: 30),
      receiveTimeout: const Duration(seconds: 30),
      sendTimeout: const Duration(seconds: 30),
    );

    dio = Dio(baseOptions);

    // Add auth interceptor
    dio.interceptors.add(
      InterceptorsWrapper(
        onRequest: (options, handler) {
          final token = LocalStorage.instance.getToken();
          if (token != null) {
            options.headers['Authorization'] = 'Bearer $token';
            debugPrint('🔐 Added token to request');
          }
          return handler.next(options);
        },
      ),
    );

    // Add retry interceptor
    dio.interceptors.add(
      InterceptorsWrapper(
        onError: (error, handler) async {
          if (error.type == DioExceptionType.connectionTimeout ||
              error.type == DioExceptionType.sendTimeout ||
              error.type == DioExceptionType.receiveTimeout) {
            debugPrint('⚠️ Request timeout, retrying...');
            // Retry the request
            try {
              final response = await dio.request<Map<String, dynamic>>(
                error.requestOptions.path,
                data: error.requestOptions.data,
                options: Options(
                  method: error.requestOptions.method,
                  headers: error.requestOptions.headers,
                ),
              );
              return handler.resolve(response);
            } on DioException catch (e, stackTrace) {
              debugPrint('⚠️ Request timeout, retrying...');
              debugPrint('⚠️ Error: $e');
              debugPrint('⚠️ Stack trace: $stackTrace');
              return handler.next(error);
            }
          }
          return handler.next(error);
        },
      ),
    );

    // Add logging interceptor in debug mode
    if (kDebugMode) {
      dio.interceptors.add(LogInterceptor(
        requestBody: true,
        responseBody: true,
        logPrint: (object) {
          debugPrint('[Dio] $object', wrapWidth: 1024);
        },
      ));

      // Add detailed request logging
      dio.interceptors.add(
        InterceptorsWrapper(
          onRequest: (options, handler) {
            debugPrint('\n🌐 -------- REQUEST DETAILS --------');
            debugPrint('🌐 URL: ${options.baseUrl}${options.path}');
            debugPrint('🌐 Method: ${options.method}');
            debugPrint('🌐 Headers: ${options.headers}');
            debugPrint('🌐 Data: ${options.data}');
            debugPrint('🌐 --------------------------------\n');
            return handler.next(options);
          },
          onResponse: (response, handler) {
            debugPrint('\n✅ -------- RESPONSE DETAILS --------');
            debugPrint('✅ Status: ${response.statusCode}');
            debugPrint('✅ Headers: ${response.headers}');
            debugPrint('✅ Data: ${response.data}');
            debugPrint('✅ ---------------------------------\n');
            return handler.next(response);
          },
          onError: (error, handler) {
            debugPrint('\n❌ -------- ERROR DETAILS --------');
            debugPrint('❌ Status: ${error.response?.statusCode}');
            debugPrint('❌ Type: ${error.type}');
            debugPrint('❌ Message: ${error.message}');
            debugPrint('❌ Error Data: ${error.response?.data}');
            debugPrint('❌ Request Path: ${error.requestOptions.path}');
            debugPrint('❌ Request Method: ${error.requestOptions.method}');
            debugPrint('❌ Request Headers: ${error.requestOptions.headers}');
            debugPrint('❌ Request Data: ${error.requestOptions.data}');
            debugPrint('❌ --------------------------------\n');
            return handler.next(error);
          },
        ),
      );
    }
  }

  /// Test the connection to the server
  Future<bool> testConnection() async {
    try {
      debugPrint('[NetworkManager] Testing connection to $_baseUrl');

      // Just check if the server is reachable
      final response = await dio.get<Map<String, dynamic>>('/').timeout(
        const Duration(seconds: 5),
        onTimeout: () {
          debugPrint('[NetworkManager] Connection timeout after 5 seconds');
          throw DioException(
            requestOptions: RequestOptions(path: '/'),
            type: DioExceptionType.connectionTimeout,
            error: 'Connection timed out',
          );
        },
      );

      debugPrint(
          '[NetworkManager] Connection test response: ${response.statusCode}');

      // Any response means server is reachable
      return true;
    } on DioException catch (e) {
      debugPrint('[NetworkManager] Connection test failed with DioError');
      debugPrint('[NetworkManager] Error type: ${e.type}');
      debugPrint('[NetworkManager] Error message: ${e.message}');

      // 404 is OK - it means server is running but endpoint doesn't exist
      if (e.response?.statusCode == 404) {
        return true;
      }
      return false;
    } on Exception catch (e) {
      debugPrint('[NetworkManager] Connection test failed with error: $e');
      return false;
    }
  }
}
