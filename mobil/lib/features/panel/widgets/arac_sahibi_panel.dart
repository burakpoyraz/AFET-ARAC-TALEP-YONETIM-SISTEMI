import 'package:afet_arac_takip/core/init/navigation/navigation_service.dart';
import 'package:afet_arac_takip/product/network/network_manager.dart';
import 'package:dio/dio.dart';
import 'package:flutter/foundation.dart' show kDebugMode;
import 'package:flutter/material.dart';

/// Arac sahibi panel widget
class AracSahibiPanel extends StatefulWidget {
  /// Creates an arac sahibi panel widget
  const AracSahibiPanel({super.key});

  @override
  State<AracSahibiPanel> createState() => _AracSahibiPanelState();
}

class _AracSahibiPanelState extends State<AracSahibiPanel> {
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
      final futures = await Future.wait([
        _networkManager.dio.get<List<dynamic>>('/araclar/araclarim'),
        _networkManager.dio.get<List<dynamic>>('/gorevler/arac-sahibi'),
      ]);

      final araclar = futures[0].data!;
      final gorevler = futures[1].data!;

      setState(() {
        _stats = {
          'arac': {
            'toplam': araclar.length,
            'musait': araclar.where((a) => a['musaitlikDurumu'] == true).length,
            'gorevde':
                araclar.where((a) => a['musaitlikDurumu'] == false).length,
          },
          'gorev': {
            'toplam': gorevler.length,
            'aktif': gorevler
                .where((g) =>
                    g['gorevDurumu'] == 'beklemede' ||
                    g['gorevDurumu'] == 'başladı')
                .length,
            'tamamlanan':
                gorevler.where((g) => g['gorevDurumu'] == 'tamamlandı').length,
            'bekleyen':
                gorevler.where((g) => g['gorevDurumu'] == 'beklemede').length,
            'devam_eden':
                gorevler.where((g) => g['gorevDurumu'] == 'başladı').length,
          },
        };
        _isLoading = false;
      });
    } on DioException catch (e) {
      if (kDebugMode) {
        print(e.response?.data);
      }
      setState(() {
        _isLoading = false;
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
          'İstatistiklerim',
          style: Theme.of(context).textTheme.titleLarge?.copyWith(
                fontWeight: FontWeight.bold,
              ),
        ),
        const SizedBox(height: 16),

        // Vehicle Statistics
        _buildStatCard(
          context,
          title: 'Araçlarım',
          icon: Icons.local_shipping,
          color: Colors.blue,
          subtitle: 'Toplam ${_stats?['arac']['toplam'] ?? 0} araç',
          stats: [
            _buildStatRow('Müsait', (_stats?['arac']['musait'] ?? 0) as int,
                Colors.green),
            _buildStatRow('Görevde', (_stats?['arac']['gorevde'] ?? 0) as int,
                Colors.orange),
          ],
          onTap: () =>
              NavigationService.instance.navigateToPage(path: '/vehicles'),
        ),

        const SizedBox(height: 16),

        // Task Statistics
        _buildStatCard(
          context,
          title: 'Görevlerim',
          icon: Icons.assignment,
          color: Colors.purple,
          subtitle: 'Toplam ${_stats?['gorev']['toplam'] ?? 0} görev',
          stats: [
            _buildStatRow('Bekleyen',
                (_stats?['gorev']['bekleyen'] ?? 0) as int, Colors.orange),
            _buildStatRow('Devam Eden',
                (_stats?['gorev']['devam_eden'] ?? 0) as int, Colors.blue),
            _buildStatRow('Tamamlanan',
                (_stats?['gorev']['tamamlanan'] ?? 0) as int, Colors.green),
          ],
          onTap: () =>
              NavigationService.instance.navigateToPage(path: '/tasks'),
        ),

        const SizedBox(height: 24),

        // Quick Actions
        Text(
          'Hızlı İşlemler',
          style: Theme.of(context).textTheme.titleMedium?.copyWith(
                fontWeight: FontWeight.bold,
              ),
        ),
        const SizedBox(height: 12),

        Row(
          children: [
            Expanded(
              child: _buildActionButton(
                context,
                icon: Icons.add_circle_outline,
                label: 'Araç Ekle',
                color: Colors.blue,
                onTap: () => NavigationService.instance
                    .navigateToPage(path: '/vehicles'),
              ),
            ),
            const SizedBox(width: 12),
            Expanded(
              child: _buildActionButton(
                context,
                icon: Icons.task,
                label: 'Görevlerim',
                color: Colors.purple,
                onTap: () =>
                    NavigationService.instance.navigateToPage(path: '/tasks'),
              ),
            ),
          ],
        ),
      ],
    );
  }

  Widget _buildStatCard(
    BuildContext context, {
    required String title,
    required IconData icon,
    required Color color,
    required String subtitle,
    required List<Widget> stats,
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
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          title,
                          style:
                              Theme.of(context).textTheme.titleMedium?.copyWith(
                                    fontWeight: FontWeight.bold,
                                  ),
                        ),
                        Text(
                          subtitle,
                          style:
                              Theme.of(context).textTheme.bodySmall?.copyWith(
                                    color: Colors.grey.shade600,
                                  ),
                        ),
                      ],
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
              ...stats,
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildStatRow(String label, int value, Color color) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 4),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Row(
            children: [
              Container(
                width: 8,
                height: 8,
                decoration: BoxDecoration(
                  color: color,
                  shape: BoxShape.circle,
                ),
              ),
              const SizedBox(width: 8),
              Text(
                label,
                style: TextStyle(color: Colors.grey.shade700),
              ),
            ],
          ),
          Text(
            value.toString(),
            style: const TextStyle(
              fontWeight: FontWeight.bold,
              fontSize: 16,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildActionButton(
    BuildContext context, {
    required IconData icon,
    required String label,
    required Color color,
    required VoidCallback onTap,
  }) {
    return Card(
      elevation: 1,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(12),
      ),
      child: InkWell(
        onTap: onTap,
        borderRadius: BorderRadius.circular(12),
        child: Padding(
          padding: const EdgeInsets.all(16),
          child: Column(
            children: [
              Icon(icon, color: color, size: 32),
              const SizedBox(height: 8),
              Text(
                label,
                style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                      fontWeight: FontWeight.w500,
                    ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
