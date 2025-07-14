import 'package:afet_arac_takip/features/requests/model/request_model.dart';
import 'package:afet_arac_takip/features/vehicles/model/vehicle_model.dart';
import 'package:afet_arac_takip/product/network/network_manager.dart';
import 'package:dio/dio.dart';
import 'package:flutter/material.dart';

/// Koordinator requests viewmodel
class KoordinatorRequestsViewModel extends ChangeNotifier {
  final NetworkManager _networkManager = NetworkManager.instance;

  List<Request> _requests = [];
  List<Request> get requests => _requests;

  List<Vehicle> _availableVehicles = [];
  List<Vehicle> get availableVehicles => _availableVehicles;

  bool _isLoading = false;
  bool get isLoading => _isLoading;

  String? _error;
  String? get error => _error;

  /// Disposed state to prevent notifyListeners after dispose
  bool _disposed = false;

  /// Cache management
  DateTime? _lastFetchTime;
  static const Duration _cacheValidDuration = Duration(minutes: 1);
  bool get _isCacheValid =>
      _lastFetchTime != null &&
      DateTime.now().difference(_lastFetchTime!) < _cacheValidDuration;
  bool get hasData => _requests.isNotEmpty;

  @override
  void dispose() {
    _disposed = true;
    super.dispose();
  }

  /// Load all requests with smart caching
  /// [forceRefresh] - Force API call even if cache is valid
  Future<void> loadRequests({bool forceRefresh = false}) async {
    // **[KoordinatorRequestsViewModel]** Use cache if valid and not forcing refresh
    if (!forceRefresh && _isCacheValid && hasData) {
      debugPrint(
          '[KoordinatorRequestsViewModel] 🔄 Using cached data (${_requests.length} requests)');
      return;
    }

    try {
      _isLoading = true;
      _error = null;
      if (!_disposed) notifyListeners();

      debugPrint(
          '[KoordinatorRequestsViewModel] 🌐 Fetching fresh data from API...');
      final response =
          await _networkManager.dio.get<List<dynamic>>('/talepler');
      if (response.statusCode == 200) {
        final data = response.data!;
        _requests = data
            .map((e) => Request.fromJson(e as Map<String, dynamic>))
            .toList();
        _lastFetchTime = DateTime
            .now(); // **[KoordinatorRequestsViewModel]** Update cache timestamp
        debugPrint(
            '[KoordinatorRequestsViewModel] ✅ Loaded ${_requests.length} requests');
      }
    } on DioException catch (e) {
      _error = 'Talepler yüklenirken hata oluştu: $e';
      debugPrint('[KoordinatorRequestsViewModel] Error loading requests: $e');
    } finally {
      _isLoading = false;
      if (!_disposed) notifyListeners();
    }
  }

  /// Force refresh data from API
  Future<void> refreshRequests() async {
    await loadRequests(forceRefresh: true);
  }

  /// Load available vehicles for assignment
  Future<void> loadAvailableVehicles() async {
    try {
      final response = await _networkManager.dio
          .get<Map<String, dynamic>>('/araclar/musaitaraclar');
      if (response.statusCode == 200) {
        final data = response.data!;
        final vehiclesList = data['musaitAraclar'] as List<dynamic>;
        _availableVehicles = vehiclesList
            .map((e) => Vehicle.fromJson(e as Map<String, dynamic>))
            .toList();
        if (!_disposed) notifyListeners();
      }
    } on DioException catch (e) {
      debugPrint(
          '[KoordinatorRequestsViewModel] Error loading available vehicles: $e');
    }
  }

  /// Get filtered requests based on search and status
  List<Request> getFilteredRequests(String searchQuery, String status) {
    var filtered = _requests;

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
            (request.kurumAdi?.toLowerCase().contains(query) ?? false) ||
            (request.talepEdenAdi?.toLowerCase().contains(query) ?? false);
      }).toList();
    }

    // Sort by priority (beklemede first, then by creation date)
    filtered.sort((a, b) {
      final statusPriority = {
        'beklemede': 0,
        'gorevlendirildi': 1,
        'tamamlandı': 2,
        'iptal edildi': 3,
      };

      final aPriority = statusPriority[a.durum] ?? 4;
      final bPriority = statusPriority[b.durum] ?? 4;

      if (aPriority != bPriority) {
        return aPriority.compareTo(bPriority);
      }

      return b.olusturulmaZamani.compareTo(a.olusturulmaZamani);
    });

    return filtered;
  }

  /// Assign vehicles to a request
  Future<bool> assignVehiclesToRequest(
    String requestId,
    List<Vehicle> selectedVehicles,
    Map<String, DriverInfo> driverInfos,
    String note,
  ) async {
    try {
      _isLoading = true;
      if (!_disposed) notifyListeners();

      // Create tasks for each selected vehicle
      for (final vehicle in selectedVehicles) {
        final driverInfo = driverInfos[vehicle.plaka];
        if (driverInfo == null) continue;

        final taskData = {
          'talepId': requestId,
          'aracId': vehicle.plaka,
          'sofor': {
            'ad': driverInfo.ad,
            'soyad': driverInfo.soyad,
            'telefon': driverInfo.telefon,
          },
          'gorevNotu': note,
        };

        await _networkManager.dio
            .post<Map<String, dynamic>>('/gorevler', data: taskData);
      }

      // Reload requests to get updated status
      await loadRequests();
      return true;
    } on DioException catch (e) {
      _error = 'Görevlendirme sırasında hata oluştu: $e';
      debugPrint('[KoordinatorRequestsViewModel] Error assigning vehicles: $e');
      return false;
    } finally {
      _isLoading = false;
      if (!_disposed) notifyListeners();
    }
  }

  /// Cancel a request
  Future<bool> cancelRequest(String requestId) async {
    try {
      _isLoading = true;
      if (!_disposed) notifyListeners();

      final response = await _networkManager.dio.put<Map<String, dynamic>>(
        '/talepler/$requestId',
        data: {'durum': 'iptal edildi'},
      );

      if (response.statusCode == 200) {
        // Update local state
        final index = _requests.indexWhere((r) => r.id == requestId);
        if (index != -1) {
          _requests[index] = Request.fromJson(response.data!);
        }
        if (!_disposed) notifyListeners();
        return true;
      }
      return false;
    } on DioException catch (e) {
      _error = 'Talep iptal edilirken hata oluştu: $e';
      debugPrint('[KoordinatorRequestsViewModel] Error canceling request: $e');
      return false;
    } finally {
      _isLoading = false;
      if (!_disposed) notifyListeners();
    }
  }

  /// Clear error message
  void clearError() {
    _error = null;
    if (!_disposed) notifyListeners();
  }
}

/// Driver information for vehicle assignment
class DriverInfo {
  DriverInfo({
    required this.ad,
    required this.soyad,
    required this.telefon,
  });
  final String ad;
  final String soyad;
  final String telefon;
}
