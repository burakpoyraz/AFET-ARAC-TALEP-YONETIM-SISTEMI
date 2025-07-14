import 'package:afet_arac_takip/features/panel/widgets/arac_sahibi_panel.dart';
import 'package:afet_arac_takip/features/panel/widgets/koordinator_panel.dart';
import 'package:afet_arac_takip/features/panel/widgets/talep_eden_panel.dart';
import 'package:afet_arac_takip/features/auth/model/user_model.dart';
import 'package:afet_arac_takip/product/cache/local_storage.dart';
import 'package:afet_arac_takip/product/network/network_manager.dart';
import 'package:dio/dio.dart';
import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';

/// Main panel view that shows role-based content
class PanelView extends StatefulWidget {
  /// Creates a panel view
  const PanelView({super.key});

  @override
  State<PanelView> createState() => _PanelViewState();
}

class _PanelViewState extends State<PanelView> {
  final NetworkManager _networkManager = NetworkManager.instance;
  String? _kurumAdi;
  bool _isLoadingKurum = false;

  @override
  void initState() {
    super.initState();
    _debugUserData();
    _loadInstitutionData();
  }

  /// [_debugUserData] prints detailed user data for debugging
  void _debugUserData() {
    final user = LocalStorage.instance.getUser();
    if (kDebugMode) {
      print('=== USER DEBUG INFO ===');
      print('User: ${user?.toJson()}');
      print('KurumFirmaId: ${user?.kurumFirmaId?.toJson()}');
      print(
          'KullaniciBeyanBilgileri: ${user?.kullaniciBeyanBilgileri?.toJson()}');
      print('========================');
    }
  }

  /// [_loadInstitutionData] loads institution data if user has kurumFirmaId
  Future<void> _loadInstitutionData() async {
    final user = LocalStorage.instance.getUser();

    // Eğer kullanıcının kurum bilgisi zaten mevcutsa, ek API çağrısı yapma
    if (user?.kurumFirmaId?.kurumAdi != null &&
        user!.kurumFirmaId!.kurumAdi.isNotEmpty) {
      setState(() {
        _kurumAdi = user.kurumFirmaId!.kurumAdi;
      });
      if (kDebugMode) {
        print('[PanelView] Institution name already available: $_kurumAdi');
      }
      return;
    }

    // Kurum ID'si varsa ama kurum adı yoksa API'den çekmeyi dene
    if (user?.kurumFirmaId?.id == null || user!.kurumFirmaId!.id.isEmpty) {
      if (kDebugMode) {
        print('[PanelView] No kurumFirmaId found for user');
      }
      return;
    }

    setState(() {
      _isLoadingKurum = true;
    });

    try {
      if (kDebugMode) {
        print(
            '[PanelView] Loading institution data for ID: ${user.kurumFirmaId!.id}');
      }

      // talep_eden kullanıcıları için /gorevler/talep-eden-kurum endpoint'ini kullan
      // Bu endpoint'te kurum bilgisi var ve talep_eden rolü erişebiliyor
      final response = await _networkManager.dio
          .get<List<dynamic>>('/gorevler/talep-eden-kurum');

      if (response.statusCode == 200 && response.data != null) {
        final gorevler = response.data!;

        if (kDebugMode) {
          print(
              '[PanelView] Found ${gorevler.length} tasks from /gorevler/talep-eden-kurum');
        }

        // İlk görevden kurum bilgisini çek (tüm görevler aynı kullanıcının kurumuna ait)
        if (gorevler.isNotEmpty) {
          final ilkGorev = gorevler.first;
          final talepId = ilkGorev['talepId'];

          if (talepId != null && talepId['talepEdenKurumFirmaId'] != null) {
            final kurumData = talepId['talepEdenKurumFirmaId'];
            final kurumAdi = kurumData['kurumAdi'] as String?;

            if (kurumAdi != null && kurumAdi.isNotEmpty) {
              setState(() {
                _kurumAdi = kurumAdi;
              });

              if (kDebugMode) {
                print(
                    '[PanelView] Institution name loaded from tasks: $_kurumAdi');
              }
              return;
            }
          }
        }

        if (kDebugMode) {
          print('[PanelView] No institution data found in tasks');
        }
      }
    } on DioException catch (e) {
      if (kDebugMode) {
        print(
            '[PanelView] Error loading institution data from tasks: ${e.message}');
      }

      // Fallback: /kurumlar endpoint'ini dene (muhtemelen 403 verecek ama deneyelim)
      try {
        final response =
            await _networkManager.dio.get<List<dynamic>>('/kurumlar');

        if (response.statusCode == 200 && response.data != null) {
          final kurumlar = response.data!;

          final userKurum = kurumlar
              .where(
                (kurum) => kurum['_id'] == user.kurumFirmaId!.id,
              )
              .toList();

          if (userKurum.isNotEmpty) {
            setState(() {
              _kurumAdi = userKurum.first['kurumAdi'] as String?;
            });

            if (kDebugMode) {
              print(
                  '[PanelView] Institution name loaded from /kurumlar fallback: $_kurumAdi');
            }
          }
        }
      } on DioException catch (fallbackError) {
        if (kDebugMode) {
          print(
              '[PanelView] Fallback /kurumlar also failed: ${fallbackError.message}');
        }
      }
    } catch (e) {
      if (kDebugMode) {
        print('[PanelView] Unexpected error loading institution data: $e');
      }
    } finally {
      setState(() {
        _isLoadingKurum = false;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    final user = LocalStorage.instance.getUser();

    if (user == null) {
      return const Scaffold(
        body: Center(
          child: Text('Kullanıcı bilgisi bulunamadı'),
        ),
      );
    }

    return Scaffold(
      appBar: AppBar(
        title: const Text('Ana Panel'),
        centerTitle: false,
      ),
      body: SingleChildScrollView(
        child: Padding(
          padding: const EdgeInsets.all(16),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Welcome card
              Card(
                elevation: 2,
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(12),
                ),
                child: Padding(
                  padding: const EdgeInsets.all(16),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        'Hoş geldiniz,',
                        style:
                            Theme.of(context).textTheme.titleMedium?.copyWith(
                                  color: Colors.grey.shade600,
                                ),
                      ),
                      const SizedBox(height: 4),
                      Text(
                        user.fullName,
                        style:
                            Theme.of(context).textTheme.headlineSmall?.copyWith(
                                  fontWeight: FontWeight.bold,
                                  color: Theme.of(context).primaryColor,
                                ),
                      ),
                      const SizedBox(height: 8),
                      Row(
                        children: [
                          Icon(
                            Icons.badge_outlined,
                            size: 16,
                            color: Colors.grey.shade600,
                          ),
                          const SizedBox(width: 4),
                          Text(
                            user.displayRole,
                            style: Theme.of(context)
                                .textTheme
                                .bodyMedium
                                ?.copyWith(
                                  color: Colors.grey.shade600,
                                ),
                          ),
                          if (user.kurumFirmaId != null ||
                              user.kullaniciBeyanBilgileri != null) ...[
                            const SizedBox(width: 16),
                            Icon(
                              Icons.business_outlined,
                              size: 16,
                              color: Colors.grey.shade600,
                            ),
                            const SizedBox(width: 4),
                            Expanded(
                              child: Row(
                                children: [
                                  if (_isLoadingKurum)
                                    const SizedBox(
                                      width: 12,
                                      height: 12,
                                      child: CircularProgressIndicator(
                                        strokeWidth: 2,
                                      ),
                                    )
                                  else
                                    Expanded(
                                      child: Text(
                                        _getInstitutionDisplayText(user),
                                        style: Theme.of(context)
                                            .textTheme
                                            .bodyMedium
                                            ?.copyWith(
                                              color: Colors.grey.shade600,
                                              fontStyle: FontStyle.italic,
                                            ),
                                        overflow: TextOverflow.ellipsis,
                                      ),
                                    ),
                                ],
                              ),
                            ),
                          ],
                        ],
                      ),
                    ],
                  ),
                ),
              ),
              const SizedBox(height: 20),

              // Role-based content
              if (user.isKoordinator) const KoordinatorPanel(),
              if (user.isAracSahibi) const AracSahibiPanel(),
              if (user.isTalepEden) const TalepEdenPanel(),
            ],
          ),
        ),
      ),
    );
  }

  String _getInstitutionDisplayText(User user) {
    // API'den çekilen kurum adı önceliklidir
    if (_kurumAdi != null && _kurumAdi!.isNotEmpty) {
      return _kurumAdi!;
    }

    // Sonra kurumFirmaId'den kurum adını kontrol et
    if (user.kurumFirmaId != null && user.kurumFirmaId!.kurumAdi.isNotEmpty) {
      return user.kurumFirmaId!.kurumAdi;
    }

    // Kullanıcı beyan bilgilerinden kurum adını kontrol et
    if (user.kullaniciBeyanBilgileri?.kurumFirmaAdi != null &&
        user.kullaniciBeyanBilgileri!.kurumFirmaAdi!.isNotEmpty) {
      return user.kullaniciBeyanBilgileri!.kurumFirmaAdi!;
    }

    // Kurum türü bilgisini göster
    if (user.kullaniciBeyanBilgileri?.kurumFirmaTuru != null) {
      return user.kullaniciBeyanBilgileri!.displayType;
    }

    return 'Kurum Bilgisi Yok';
  }
}
