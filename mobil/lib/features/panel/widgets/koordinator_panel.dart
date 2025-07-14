import 'package:afet_arac_takip/core/init/navigation/navigation_service.dart';
import 'package:afet_arac_takip/features/requests/viewmodel/koordinator_requests_viewmodel.dart';
import 'package:afet_arac_takip/features/tasks/viewmodel/koordinator_tasks_viewmodel.dart';
import 'package:afet_arac_takip/features/vehicles/viewmodel/vehicles_viewmodel.dart';
import 'package:afet_arac_takip/product/cache/local_storage.dart';
import 'package:afet_arac_takip/product/network/network_manager.dart';
import 'package:dio/dio.dart';
import 'package:flutter/foundation.dart' show kDebugMode;
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

/// Koordinator panel widget
class KoordinatorPanel extends StatefulWidget {
  /// Creates a koordinator panel widget
  const KoordinatorPanel({super.key});

  @override
  State<KoordinatorPanel> createState() => _KoordinatorPanelState();
}

class _KoordinatorPanelState extends State<KoordinatorPanel> {
  final NetworkManager _networkManager = NetworkManager.instance;

  Map<String, dynamic>? _stats;
  bool _isLoading = true;
  var kullanicilar = <dynamic>[];

  @override
  void initState() {
    super.initState();
    _loadData();
  }

  Future<void> _loadData() async {
    try {
      setState(() {
        _isLoading = true;
      });

      if (kDebugMode) {
        print('[KoordinatorPanel] Loading data...');
      }

      // Check if token exists
      final token = LocalStorage.instance.getToken();
      if (token == null) {
        if (kDebugMode) {
          print('❌ No token found, user not authenticated');
        }
        setState(() {
          _isLoading = false;
        });
        return;
      }

      // Load user data separately (only endpoint not covered by ViewModels)
      try {
        if (kDebugMode) {
          print('[KoordinatorPanel] Loading users...');
        }
        final kullanicilarResponse =
            await _networkManager.dio.get<List<dynamic>>('/kullanicilar');
        if (kullanicilarResponse.statusCode == 200) {
          kullanicilar = kullanicilarResponse.data!;
          if (kDebugMode) {
            print('[KoordinatorPanel] ✅ Loaded ${kullanicilar.length} users');
          }
        }
      } on DioException catch (e) {
        if (kDebugMode) {
          print('[KoordinatorPanel] ❌ Error loading users: $e');
        }
      }

      // Load ViewModels data if not already loaded (use cache when possible)
      if (mounted) {
        final requestsViewModel = context.read<KoordinatorRequestsViewModel>();
        final tasksViewModel = context.read<KoordinatorTasksViewModel>();
        final vehiclesViewModel = context.read<VehiclesViewModel>();

        // Only load data if ViewModels don't have cached data
        final futures = <Future<void>>[];

        if (!requestsViewModel.hasData) {
          futures.add(requestsViewModel.loadRequests());
        }
        if (!vehiclesViewModel.hasData) {
          futures.add(vehiclesViewModel.getVehicles());
        }
        // Always load tasks as it might have new data
        futures.add(tasksViewModel.loadAllTasks());

        if (futures.isNotEmpty) {
          await Future.wait(futures);
        }

        // Update statistics once data is loaded
        if (mounted) {
          _updateStatisticsFromViewModels(
              requestsViewModel, tasksViewModel, vehiclesViewModel);
        }
      }
    } catch (e) {
      if (kDebugMode) {
        print('[KoordinatorPanel] ❌ Error loading data: $e');
      }
      _setDefaultStats();
    } finally {
      // Ensure loading state is always set to false
      if (mounted) {
        setState(() {
          _isLoading = false;
        });
      }
    }
  }

  void _setDefaultStats() {
    setState(() {
      _isLoading = false;
      _stats = {
        'kullanici': {
          'toplam': 0,
          'beklemede': 0,
          'koordinator': 0,
          'arac_sahibi': 0,
          'talep_eden': 0,
        },
        'talep': {
          'toplam': 0,
          'bekleyen': 0,
          'gorevlendirildi': 0,
          'iptal': 0,
          'tamamlanan': 0,
        },
        'gorev': {
          'toplam': 0,
          'bekleyen': 0,
          'basladi': 0,
          'tamamlanan': 0,
          'iptal': 0,
        },
        'arac': {
          'toplam': 0,
          'musait': 0,
          'mesgul': 0,
        },
      };
    });
  }

  @override
  Widget build(BuildContext context) {
    return Consumer3<KoordinatorRequestsViewModel, KoordinatorTasksViewModel,
        VehiclesViewModel>(
      builder: (context, requestsViewModel, tasksViewModel, vehiclesViewModel,
          child) {
        // Only update statistics when loading is complete and we have data
        if (!_isLoading &&
            requestsViewModel.hasData &&
            !tasksViewModel.isLoading &&
            vehiclesViewModel.hasData) {
          WidgetsBinding.instance.addPostFrameCallback((_) {
            if (mounted) {
              _updateStatisticsFromViewModels(
                  requestsViewModel, tasksViewModel, vehiclesViewModel);
            }
          });
        }

        if (_isLoading) {
          return const Center(
            child: CircularProgressIndicator(),
          );
        }

        return Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              'Sistem Özeti',
              style: Theme.of(context).textTheme.titleLarge?.copyWith(
                    fontWeight: FontWeight.bold,
                  ),
            ),
            const SizedBox(height: 16),

            // Statistics Cards
            _buildStatCard(
              context,
              title: 'Kullanıcı Bilgileri',
              icon: Icons.people,
              color: Colors.blue,
              stats: [
                StatItem('Beklemede',
                    (_stats?['kullanici']['beklemede'] ?? 0) as int),
                StatItem(
                    'Toplam', (_stats?['kullanici']['toplam'] ?? 0) as int),
                StatItem('Koordinatör',
                    (_stats?['kullanici']['koordinator'] ?? 0) as int),
                StatItem('Araç Sahibi',
                    (_stats?['kullanici']['arac_sahibi'] ?? 0) as int),
                StatItem('Talep Eden',
                    (_stats?['kullanici']['talep_eden'] ?? 0) as int),
              ],
              onTap: () =>
                  NavigationService.instance.navigateToPage(path: '/users'),
            ),

            const SizedBox(height: 12),

            _buildStatCard(
              context,
              title: 'Talep Durumları',
              icon: Icons.assignment,
              color: Colors.orange,
              stats: [
                StatItem('Toplam', (_stats?['talep']['toplam'] ?? 0) as int),
                StatItem(
                    'Bekleyen', (_stats?['talep']['bekleyen'] ?? 0) as int),
                StatItem('Görevlendirilen',
                    (_stats?['talep']['gorevlendirildi'] ?? 0) as int),
                StatItem(
                    'Tamamlanan', (_stats?['talep']['tamamlanan'] ?? 0) as int),
                StatItem(
                    'İptal Edilen', (_stats?['talep']['iptal'] ?? 0) as int),
              ],
              onTap: () =>
                  NavigationService.instance.navigateToPage(path: '/requests'),
            ),

            const SizedBox(height: 12),

            _buildStatCard(
              context,
              title: 'Görev Durumları',
              icon: Icons.task_alt,
              color: Colors.green,
              stats: [
                StatItem('Toplam', (_stats?['gorev']['toplam'] ?? 0) as int),
                StatItem(
                    'Bekleyen', (_stats?['gorev']['bekleyen'] ?? 0) as int),
                StatItem('Başladı', (_stats?['gorev']['basladi'] ?? 0) as int),
                StatItem(
                    'Tamamlandı', (_stats?['gorev']['tamamlanan'] ?? 0) as int),
                StatItem(
                    'İptal Edilen', (_stats?['gorev']['iptal'] ?? 0) as int),
              ],
              onTap: () =>
                  NavigationService.instance.navigateToPage(path: '/tasks'),
            ),

            const SizedBox(height: 12),

            _buildStatCard(
              context,
              title: 'Araç Durumları',
              icon: Icons.local_shipping,
              color: Colors.purple,
              stats: [
                StatItem('Toplam', (_stats?['arac']['toplam'] ?? 0) as int),
                StatItem('Müsait', (_stats?['arac']['musait'] ?? 0) as int),
                StatItem('Meşgul', (_stats?['arac']['mesgul'] ?? 0) as int),
              ],
              onTap: () =>
                  NavigationService.instance.navigateToPage(path: '/vehicles'),
            ),
          ],
        );
      },
    );
  }

  void _updateStatisticsFromViewModels(
    KoordinatorRequestsViewModel requestsViewModel,
    KoordinatorTasksViewModel tasksViewModel,
    VehiclesViewModel vehiclesViewModel,
  ) {
    final requests = requestsViewModel.requests;
    final tasks = tasksViewModel.allTasks;
    final vehicles = vehiclesViewModel.vehicles;

    // Only update if data has actually changed to prevent infinite loops
    final newStats = {
      'kullanici': {
        'toplam': kullanicilar.length,
        'beklemede': kullanicilar.where((k) => k['rol'] == 'beklemede').length,
        'koordinator':
            kullanicilar.where((k) => k['rol'] == 'koordinator').length,
        'arac_sahibi':
            kullanicilar.where((k) => k['rol'] == 'arac_sahibi').length,
        'talep_eden':
            kullanicilar.where((k) => k['rol'] == 'talep_eden').length,
      },
      'talep': {
        'toplam': requests.length,
        'bekleyen': requests.where((t) => t.durum == 'beklemede').length,
        'gorevlendirildi':
            requests.where((t) => t.durum == 'gorevlendirildi').length,
        'iptal': requests.where((t) => t.durum == 'iptal edildi').length,
        'tamamlanan': requests.where((t) => t.durum == 'tamamlandı').length,
      },
      'gorev': {
        'toplam': tasks.length,
        'bekleyen': tasks.where((g) => g.gorevDurumu == 'beklemede').length,
        'basladi': tasks.where((g) => g.gorevDurumu == 'başladı').length,
        'tamamlanan': tasks.where((g) => g.gorevDurumu == 'tamamlandı').length,
        'iptal': tasks.where((g) => g.gorevDurumu == 'iptal edildi').length,
      },
      'arac': {
        'toplam': vehicles.length,
        'musait': vehicles.where((a) => a.musaitlikDurumu == true).length,
        'mesgul': vehicles.where((a) => a.musaitlikDurumu == false).length,
      },
    };

    // Compare with current stats to avoid unnecessary updates
    if (_stats == null ||
        (_stats!['talep'] as Map?)?['toplam'] != newStats['talep']!['toplam'] ||
        (_stats!['gorev'] as Map?)?['toplam'] != newStats['gorev']!['toplam'] ||
        (_stats!['arac'] as Map?)?['toplam'] != newStats['arac']!['toplam']) {
      setState(() {
        _stats = newStats;
      });

      if (kDebugMode) {
        print(
            '[KoordinatorPanel] 📊 Statistics updated: ${_stats?['kullanici']['toplam']} users, ${_stats?['talep']['toplam']} requests, ${_stats?['gorev']['toplam']} tasks, ${_stats?['arac']['toplam']} vehicles');
      }
    }
  }

  Widget _buildStatCard(
    BuildContext context, {
    required String title,
    required IconData icon,
    required Color color,
    required List<StatItem> stats,
    required VoidCallback onTap,
  }) {
    return Card(
      elevation: 2,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(12),
      ),
      child: InkWell(
        onTap: onTap,
        borderRadius: BorderRadius.circular(12),
        child: Padding(
          padding: const EdgeInsets.all(16),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                children: [
                  Container(
                    padding: const EdgeInsets.all(8),
                    decoration: BoxDecoration(
                      color: color.withAlpha(30),
                      borderRadius: BorderRadius.circular(8),
                    ),
                    child: Icon(icon, color: color, size: 24),
                  ),
                  const SizedBox(width: 12),
                  Expanded(
                    child: Text(
                      title,
                      style: Theme.of(context).textTheme.titleMedium?.copyWith(
                            fontWeight: FontWeight.bold,
                          ),
                    ),
                  ),
                  Icon(
                    Icons.arrow_forward_ios,
                    size: 16,
                    color: Colors.grey.shade400,
                  ),
                ],
              ),
              const SizedBox(height: 16),
              Wrap(
                spacing: 12,
                runSpacing: 8,
                children:
                    stats.map((stat) => _buildStatItem(context, stat)).toList(),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildStatItem(BuildContext context, StatItem item) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
      decoration: BoxDecoration(
        color: Colors.grey.shade100,
        borderRadius: BorderRadius.circular(20),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Text(
            item.label,
            style: Theme.of(context).textTheme.bodySmall?.copyWith(
                  color: Colors.grey.shade700,
                ),
          ),
          const SizedBox(width: 4),
          Text(
            item.value.toString(),
            style: Theme.of(context).textTheme.bodySmall?.copyWith(
                  fontWeight: FontWeight.bold,
                  color: Colors.grey.shade900,
                ),
          ),
        ],
      ),
    );
  }
}

class StatItem {
  StatItem(this.label, this.value);
  final String label;
  final int value;
}
