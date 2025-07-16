import 'package:afet_arac_takip/core/init/navigation/navigation_service.dart';
import 'package:afet_arac_takip/product/network/network_manager.dart';
import 'package:dio/dio.dart';
import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';

/// Talep eden panel widget
class TalepEdenPanel extends StatefulWidget {
  /// Creates a talep eden panel widget
  const TalepEdenPanel({super.key});

  @override
  State<TalepEdenPanel> createState() => _TalepEdenPanelState();
}

class _TalepEdenPanelState extends State<TalepEdenPanel> {
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
        _networkManager.dio.get<List<dynamic>>('/talepler/taleplerim'),
        _networkManager.dio.get<List<dynamic>>('/gorevler/talep-eden-kurum'),
      ]);

      final talepler = futures[0].data!;
      final gorevler = futures[1].data!;

      setState(() {
        _stats = {
          'talep': {
            'toplam': talepler.length,
            'bekleyen': talepler.where((t) => t['durum'] == 'beklemede').length,
            'gorevlendirildi':
                talepler.where((t) => t['durum'] == 'gorevlendirildi').length,
            'tamamlanan':
                talepler.where((t) => t['durum'] == 'tamamlandı').length,
            'iptal': talepler.where((t) => t['durum'] == 'iptal edildi').length,
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
          'Talep Özeti',
          style: Theme.of(context).textTheme.titleLarge?.copyWith(
                fontWeight: FontWeight.bold,
              ),
        ),
        const SizedBox(height: 16),

        // Request Statistics
        _buildStatCard(
          context,
          title: 'Taleplerim',
          icon: Icons.assignment,
          color: Colors.orange,
          subtitle: 'Toplam ${_stats?['talep']['toplam'] ?? 0} talep',
          stats: [
            _buildStatRow('Bekleyen',
                (_stats?['talep']['bekleyen'] ?? 0) as int, Colors.orange),
            _buildStatRow('Görevlendirildi',
                (_stats?['talep']['gorevlendirildi'] ?? 0) as int, Colors.blue),
            _buildStatRow('Tamamlanan',
                (_stats?['talep']['tamamlanan'] ?? 0) as int, Colors.green),
            _buildStatRow('İptal Edilen',
                (_stats?['talep']['iptal'] ?? 0) as int, Colors.red),
          ],
          onTap: () =>
              NavigationService.instance.navigateToPage(path: '/my-requests'),
        ),

        const SizedBox(height: 16),

        // Task Tracking
        _buildStatCard(
          context,
          title: 'Görev Takibi',
          icon: Icons.track_changes,
          color: Colors.purple,
          subtitle: '${_stats?['gorev']['aktif'] ?? 0} aktif görev',
          stats: [
            _buildStatRow('Aktif Görevler',
                (_stats?['gorev']['aktif'] ?? 0) as int, Colors.blue),
            _buildStatRow('Tamamlanan',
                (_stats?['gorev']['tamamlanan'] ?? 0) as int, Colors.green),
          ],
          onTap: () =>
              NavigationService.instance.navigateToPage(path: '/task-tracking'),
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
                label: 'Yeni Talep',
                color: Colors.orange,
                onTap: () => NavigationService.instance
                    .navigateToPage(path: '/my-requests'),
              ),
            ),
            const SizedBox(width: 12),
            Expanded(
              child: _buildActionButton(
                context,
                icon: Icons.visibility,
                label: 'Görev Takibi',
                color: Colors.purple,
                onTap: () => NavigationService.instance
                    .navigateToPage(path: '/task-tracking'),
              ),
            ),
          ],
        ),

        const SizedBox(height: 24),

        // Information Card
        Card(
          elevation: 1,
          color: Colors.blue.shade50,
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(12),
          ),
          child: Padding(
            padding: const EdgeInsets.all(16),
            child: Row(
              children: [
                Icon(
                  Icons.info_outline,
                  color: Colors.blue.shade700,
                  size: 24,
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: Text(
                    'Talebiniz onaylandıktan sonra uygun araç ataması yapılacaktır.',
                    style: TextStyle(
                      color: Colors.blue.shade700,
                      fontSize: 13,
                    ),
                  ),
                ),
              ],
            ),
          ),
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
