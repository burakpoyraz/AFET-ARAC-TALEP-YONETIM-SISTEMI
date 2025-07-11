import 'package:afet_arac_takip/core/init/navigation/navigation_service.dart';
import 'package:afet_arac_takip/product/cache/local_storage.dart';
import 'package:afet_arac_takip/product/network/network_manager.dart';
import 'package:dio/dio.dart';
import 'package:flutter/foundation.dart' show kDebugMode;
import 'package:flutter/material.dart';

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

  @override
  void initState() {
    super.initState();
    _loadStatistics();
  }

  Future<void> _loadStatistics() async {
    try {
      setState(() {
        _isLoading = true;
      });

      if (kDebugMode) {
        print('🔄 Starting to load statistics...');
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
      if (kDebugMode) {
        print('✅ Token found: ${token.substring(0, 20)}...');
      }

      // Load each endpoint separately to better handle errors
      var kullanicilar = <dynamic>[];
      var talepler = <dynamic>[];
      var gorevler = <dynamic>[];
      var araclar = <dynamic>[];

      try {
        if (kDebugMode) {
          print('📞 Calling /kullanicilar...');
        }
        final kullanicilarResponse =
            await _networkManager.dio.get<List<dynamic>>('/kullanicilar');
        if (kullanicilarResponse.statusCode == 200) {
          kullanicilar = kullanicilarResponse.data!;
          if (kDebugMode) {
            print('✅ Kullanicilar loaded: ${kullanicilar.length} users');
          }
        } else {
          if (kDebugMode) {
            print(
                '❌ Kullanicilar failed with status: ${kullanicilarResponse.statusCode}');
          }
        }
      } on DioException catch (e) {
        if (kDebugMode) {
          print('❌ Error loading kullanicilar: $e');
        }
      }

      try {
        if (kDebugMode) {
          print('📞 Calling /talepler...');
        }
        final taleplerResponse =
            await _networkManager.dio.get<List<dynamic>>('/talepler');
        if (taleplerResponse.statusCode == 200) {
          talepler = taleplerResponse.data!;
          if (kDebugMode) {
            print('✅ Talepler loaded: ${talepler.length} requests');
          }
        } else {
          if (kDebugMode) {
            print(
                '❌ Talepler failed with status: ${taleplerResponse.statusCode}');
          }
        }
      } on DioException catch (e) {
        if (kDebugMode) {
          print('❌ Error loading talepler: $e');
        }
      }

      try {
        if (kDebugMode) {
          print('📞 Calling /gorevler...');
        }
        final gorevlerResponse =
            await _networkManager.dio.get<List<dynamic>>('/gorevler');
        if (gorevlerResponse.statusCode == 200) {
          gorevler = gorevlerResponse.data!;
          if (kDebugMode) {
            print('✅ Gorevler loaded: ${gorevler.length} tasks');
          }
        } else {
          if (kDebugMode) {
            print(
                '❌ Gorevler failed with status: ${gorevlerResponse.statusCode}');
          }
        }
      } on DioException catch (e) {
        if (kDebugMode) {
          print('❌ Error loading gorevler: $e');
        }
      }

      try {
        if (kDebugMode) {
          print('📞 Calling /araclar...');
        }
        final araclarResponse =
            await _networkManager.dio.get<List<dynamic>>('/araclar');
        if (araclarResponse.statusCode == 200) {
          araclar = araclarResponse.data!;
          if (kDebugMode) {
            print('✅ Araclar loaded: ${araclar.length} vehicles');
          }
        } else {
          if (kDebugMode) {
            print(
                '❌ Araclar failed with status: ${araclarResponse.statusCode}');
          }
        }
      } on DioException catch (e) {
        if (kDebugMode) {
          print('❌ Error loading araclar: $e');
        }
      }

      // Debug print to see the actual data structure
      if (kullanicilar.isNotEmpty) {
        if (kDebugMode) {
          print('👤 Sample user data: ${kullanicilar.first}');
        }
      }
      if (talepler.isNotEmpty) {
        if (kDebugMode) {
          print('📋 Sample request data: ${talepler.first}');
        }
      }
      if (gorevler.isNotEmpty) {
        if (kDebugMode) {
          print('📝 Sample task data: ${gorevler.first}');
        }
      }
      if (araclar.isNotEmpty) {
        if (kDebugMode) {
          print('🚗 Sample vehicle data: ${araclar.first}');
        }
      }

      setState(() {
        _stats = {
          'kullanici': {
            'toplam': kullanicilar.length,
            'beklemede':
                kullanicilar.where((k) => k['rol'] == 'beklemede').length,
            'koordinator':
                kullanicilar.where((k) => k['rol'] == 'koordinator').length,
            'arac_sahibi':
                kullanicilar.where((k) => k['rol'] == 'arac_sahibi').length,
            'talep_eden':
                kullanicilar.where((k) => k['rol'] == 'talep_eden').length,
          },
          'talep': {
            'toplam': talepler.length,
            'bekleyen': talepler.where((t) => t['durum'] == 'beklemede').length,
            'gorevlendirildi':
                talepler.where((t) => t['durum'] == 'gorevlendirildi').length,
            'iptal': talepler.where((t) => t['durum'] == 'iptal edildi').length,
            'tamamlanan':
                talepler.where((t) => t['durum'] == 'tamamlandı').length,
          },
          'gorev': {
            'toplam': gorevler.length,
            'bekleyen':
                gorevler.where((g) => g['gorevDurumu'] == 'beklemede').length,
            'basladi':
                gorevler.where((g) => g['gorevDurumu'] == 'başladı').length,
            'tamamlanan':
                gorevler.where((g) => g['gorevDurumu'] == 'tamamlandı').length,
            'iptal': gorevler
                .where((g) => g['gorevDurumu'] == 'iptal edildi')
                .length,
          },
          'arac': {
            'toplam': araclar.length,
            'musait': araclar.where((a) => a['musaitlikDurumu'] == true).length,
            'mesgul':
                araclar.where((a) => a['musaitlikDurumu'] == false).length,
          },
        };
        _isLoading = false;
      });

      print('📊 Final statistics:');
      print('  - Users: ${_stats?['kullanici']['toplam']}');
      print('  - Requests: ${_stats?['talep']['toplam']}');
      print('  - Tasks: ${_stats?['gorev']['toplam']}');
      print('  - Vehicles: ${_stats?['arac']['toplam']}');
    } on DioException catch (e) {
      print('❌ Error loading statistics: $e');
      setState(() {
        _isLoading = false;
        // Set default values when there's an error
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
  }

  @override
  Widget build(BuildContext context) {
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
            StatItem(
                'Beklemede', (_stats?['kullanici']['beklemede'] ?? 0) as int),
            StatItem('Toplam', (_stats?['kullanici']['toplam'] ?? 0) as int),
            StatItem('Koordinatör',
                (_stats?['kullanici']['koordinator'] ?? 0) as int),
            StatItem('Araç Sahibi',
                (_stats?['kullanici']['arac_sahibi'] ?? 0) as int),
            StatItem(
                'Talep Eden', (_stats?['kullanici']['talep_eden'] ?? 0) as int),
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
            StatItem('Bekleyen', (_stats?['talep']['bekleyen'] ?? 0) as int),
            StatItem('Görevlendirilen',
                (_stats?['talep']['gorevlendirildi'] ?? 0) as int),
            StatItem(
                'Tamamlanan', (_stats?['talep']['tamamlanan'] ?? 0) as int),
            StatItem('İptal Edilen', (_stats?['talep']['iptal'] ?? 0) as int),
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
            StatItem('Bekleyen', (_stats?['gorev']['bekleyen'] ?? 0) as int),
            StatItem('Başladı', (_stats?['gorev']['basladi'] ?? 0) as int),
            StatItem(
                'Tamamlandı', (_stats?['gorev']['tamamlanan'] ?? 0) as int),
            StatItem('İptal Edilen', (_stats?['gorev']['iptal'] ?? 0) as int),
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
