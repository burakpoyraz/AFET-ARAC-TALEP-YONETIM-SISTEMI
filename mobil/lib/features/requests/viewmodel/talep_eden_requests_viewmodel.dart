import 'package:afet_arac_takip/features/requests/model/request_model.dart';
import 'package:afet_arac_takip/product/network/network_manager.dart';
import 'package:dio/dio.dart';
import 'package:flutter/material.dart';

/// [TalepEdenRequestsViewModel] manages requests for talep_eden users
/// Handles listing user's own requests, creating new ones, and updating existing requests
class TalepEdenRequestsViewModel extends ChangeNotifier {
  final NetworkManager _networkManager = NetworkManager.instance;

  List<Request> _myRequests = [];
  List<Request> get myRequests => _myRequests;

  bool _isLoading = false;
  bool get isLoading => _isLoading;

  bool _isCreatingRequest = false;
  bool get isCreatingRequest => _isCreatingRequest;

  String? _error;
  String? get error => _error;

  /// Cache management
  DateTime? _lastFetchTime;
  static const Duration _cacheValidDuration = Duration(minutes: 2);
  bool get _isCacheValid =>
      _lastFetchTime != null &&
      DateTime.now().difference(_lastFetchTime!) < _cacheValidDuration;
  bool get hasData => _myRequests.isNotEmpty;

  /// [loadMyRequests] fetches all requests created by the current user with smart caching
  /// [forceRefresh] - Force API call even if cache is valid
  Future<void> loadMyRequests({bool forceRefresh = false}) async {
    // **[TalepEdenRequestsViewModel]** Use cache if valid and not forcing refresh
    if (!forceRefresh && _isCacheValid && hasData) {
      print(
          '[TalepEdenRequestsViewModel] 🔄 Using cached data (${_myRequests.length} requests)');
      return;
    }

    try {
      _isLoading = true;
      _error = null;
      notifyListeners();

      print('[TalepEdenRequestsViewModel] 🌐 Fetching fresh data from API...');

      final response =
          await _networkManager.dio.get<List<dynamic>>('/talepler/taleplerim');

      if (response.statusCode == 200) {
        final data = response.data!;
        _myRequests = data
            .map((e) => Request.fromJson(e as Map<String, dynamic>))
            .toList();
        _lastFetchTime = DateTime
            .now(); // **[TalepEdenRequestsViewModel]** Update cache timestamp

        print(
            '[TalepEdenRequestsViewModel] ✅ Loaded ${_myRequests.length} requests (cached until ${_lastFetchTime!.add(_cacheValidDuration)})');
        print('[TalepEdenRequestsViewModel] 📊 Request status breakdown:');
        print(
            '  - Beklemede: ${_myRequests.where((r) => r.durum == "beklemede").length}');
        print(
            '  - Görevlendirildi: ${_myRequests.where((r) => r.durum == "gorevlendirildi").length}');
        print(
            '  - Tamamlandı: ${_myRequests.where((r) => r.durum == "tamamlandı").length}');
        print(
            '  - İptal Edildi: ${_myRequests.where((r) => r.durum == "iptal edildi").length}');
      } else {
        throw Exception('API returned status code: ${response.statusCode}');
      }
    } on DioException catch (e) {
      _error = 'Talepler yüklenirken hata oluştu: $e';
      print('[TalepEdenRequestsViewModel] ❌ Error loading requests: $e');
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  /// Force refresh data from API
  Future<void> refreshMyRequests() async {
    await loadMyRequests(forceRefresh: true);
  }

  /// [createRequest] creates a new request with the provided data
  Future<bool> createRequest({
    required String baslik,
    required String aciklama,
    required List<VehicleRequest> araclar,
    required Location lokasyon,
  }) async {
    try {
      _isCreatingRequest = true;
      _error = null;
      notifyListeners();

      print('[TalepEdenRequestsViewModel] 🔄 Creating new request...');

      final requestData = {
        'baslik': baslik,
        'aciklama': aciklama,
        'araclar': araclar.map((a) => a.toJson()).toList(),
        'lokasyon': lokasyon.toJson(),
      };

      final response = await _networkManager.dio.post<Map<String, dynamic>>(
        '/talepler',
        data: requestData,
      );

      if (response.statusCode == 200 || response.statusCode == 201) {
        print('[TalepEdenRequestsViewModel] ✅ Request created successfully');
        // Reload requests to get the updated list
        await loadMyRequests();
        return true;
      } else {
        throw Exception('API returned status code: ${response.statusCode}');
      }
    } on DioException catch (e) {
      _error = 'Talep oluşturulurken hata oluştu: $e';
      print('[TalepEdenRequestsViewModel] ❌ Error creating request: $e');
      notifyListeners();
      return false;
    } finally {
      _isCreatingRequest = false;
      notifyListeners();
    }
  }

  /// [updateRequest] updates an existing request
  Future<bool> updateRequest({
    required String requestId,
    required String baslik,
    required String aciklama,
    required List<VehicleRequest> araclar,
    required Location lokasyon,
  }) async {
    try {
      _isCreatingRequest = true;
      _error = null;
      notifyListeners();

      print('[TalepEdenRequestsViewModel] 🔄 Updating request $requestId...');

      final requestData = {
        'baslik': baslik,
        'aciklama': aciklama,
        'araclar': araclar.map((a) => a.toJson()).toList(),
        'lokasyon': lokasyon.toJson(),
      };

      final response = await _networkManager.dio.put<Map<String, dynamic>>(
        '/talepler/$requestId',
        data: requestData,
      );

      if (response.statusCode == 200) {
        print('[TalepEdenRequestsViewModel] ✅ Request updated successfully');
        // Reload requests to get the updated list
        await loadMyRequests();
        return true;
      } else {
        throw Exception('API returned status code: ${response.statusCode}');
      }
    } on DioException catch (e) {
      _error = 'Talep güncellenirken hata oluştu: $e';
      print('[TalepEdenRequestsViewModel] ❌ Error updating request: $e');
      notifyListeners();
      return false;
    } finally {
      _isCreatingRequest = false;
      notifyListeners();
    }
  }

  /// [getFilteredRequests] returns requests filtered by search query and status
  List<Request> getFilteredRequests(String searchQuery, String status) {
    var filtered = _myRequests;

    // Filter by status
    if (status != 'all') {
      filtered = filtered.where((request) => request.durum == status).toList();
    }

    // Filter by search query
    if (searchQuery.isNotEmpty) {
      final query = searchQuery.toLowerCase();
      filtered = filtered.where((request) {
        return request.baslik.toLowerCase().contains(query) ||
            request.aciklama.toLowerCase().contains(query) ||
            request.lokasyon.adres.toLowerCase().contains(query) ||
            request.vehicleSummary.toLowerCase().contains(query);
      }).toList();
    }

    // Sort by creation date (newest first)
    filtered.sort((a, b) => b.olusturulmaZamani.compareTo(a.olusturulmaZamani));

    return filtered;
  }

  /// [getRequestStatistics] returns statistics about user's requests
  Map<String, int> getRequestStatistics() {
    return {
      'toplam': _myRequests.length,
      'beklemede': _myRequests.where((r) => r.durum == 'beklemede').length,
      'gorevlendirildi':
          _myRequests.where((r) => r.durum == 'gorevlendirildi').length,
      'tamamlandi': _myRequests.where((r) => r.durum == 'tamamlandı').length,
      'iptal': _myRequests.where((r) => r.durum == 'iptal edildi').length,
    };
  }

  /// [clearError] clears any error message
  void clearError() {
    _error = null;
    notifyListeners();
  }

  /// [getRequestById] returns a specific request by ID
  Request? getRequestById(String requestId) {
    try {
      return _myRequests.firstWhere((request) => request.id == requestId);
    } on DioException {
      return null;
    }
  }
}
