import 'package:afet_arac_takip/features/requests/model/request_model.dart';
import 'package:afet_arac_takip/features/requests/viewmodel/talep_eden_requests_viewmodel.dart';
import 'package:afet_arac_takip/features/requests/widgets/request_card.dart';
import 'package:afet_arac_takip/features/requests/widgets/request_detail_modal.dart';
import 'package:afet_arac_takip/product/widgets/custom_button.dart';
import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

/// [TalepEdenRequestsView] provides a modern, sleek interface for request creators
/// to manage their requests following Apple's Human Interface Guidelines
/// Features include request listing, filtering, creation, and detailed viewing
class TalepEdenRequestsView extends StatefulWidget {
  /// Creates a talep eden requests view with Apple-style design
  const TalepEdenRequestsView({super.key});

  @override
  State<TalepEdenRequestsView> createState() => _TalepEdenRequestsViewState();
}

class _TalepEdenRequestsViewState extends State<TalepEdenRequestsView>
    with TickerProviderStateMixin {
  final _searchController = TextEditingController();
  String _selectedStatus = 'all';
  late AnimationController _animationController;
  late Animation<double> _fadeAnimation;

  @override
  void initState() {
    super.initState();
    // Initialize smooth Apple-style animations
    _animationController = AnimationController(
      duration: const Duration(milliseconds: 600),
      vsync: this,
    );
    _fadeAnimation = Tween<double>(begin: 0, end: 1).animate(
      CurvedAnimation(parent: _animationController, curve: Curves.easeInOut),
    );
    _animationController.forward();
  }

  @override
  void dispose() {
    _searchController.dispose();
    _animationController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return ChangeNotifierProvider(
      create: (_) => TalepEdenRequestsViewModel()..loadMyRequests(),
      child: Scaffold(
        backgroundColor: CupertinoColors.systemGroupedBackground,
        body: Consumer<TalepEdenRequestsViewModel>(
          builder: (context, viewModel, _) {
            return CustomScrollView(
              physics: const BouncingScrollPhysics(), // Apple-style physics
              slivers: [
                // Modern Apple-style app bar
                SliverAppBar.large(
                  backgroundColor: CupertinoColors.systemGroupedBackground,
                  title: const Text(
                    'Taleplerim',
                    style: TextStyle(
                      fontSize: 28,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                  actions: [
                    // Beautiful add button with Apple-style design
                    Container(
                      margin: const EdgeInsets.only(right: 16),
                      child: Material(
                        color: Colors.transparent,
                        child: InkWell(
                          borderRadius: BorderRadius.circular(20),
                          onTap: () =>
                              _showCreateRequestModal(context, viewModel),
                          child: Container(
                            padding: const EdgeInsets.all(8),
                            decoration: BoxDecoration(
                              color: Theme.of(context).primaryColor,
                              borderRadius: BorderRadius.circular(20),
                              boxShadow: [
                                BoxShadow(
                                  color: Theme.of(context)
                                      .primaryColor
                                      .withValues(alpha: 0.3),
                                  blurRadius: 8,
                                  offset: const Offset(0, 2),
                                ),
                              ],
                            ),
                            child: const Icon(
                              CupertinoIcons.add,
                              color: Colors.white,
                              size: 20,
                            ),
                          ),
                        ),
                      ),
                    ),
                  ],
                ),
                // Statistics section with beautiful cards
                SliverToBoxAdapter(
                  child: FadeTransition(
                    opacity: _fadeAnimation,
                    child: _buildStatisticsSection(context, viewModel),
                  ),
                ),
                // Search and filter section
                SliverToBoxAdapter(
                  child: _buildSearchAndFilter(context, viewModel),
                ),
                // Content section
                _buildContentSection(context, viewModel),
              ],
            );
          },
        ),
      ),
    );
  }

  /// [_buildStatisticsSection] creates beautiful Apple-style statistic cards
  Widget _buildStatisticsSection(
      BuildContext context, TalepEdenRequestsViewModel viewModel) {
    if (viewModel.isLoading) return const SizedBox.shrink();

    final stats = viewModel.getRequestStatistics();

    return Container(
      padding: const EdgeInsets.all(16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text(
            'İstatistikler',
            style: TextStyle(
              fontSize: 20,
              fontWeight: FontWeight.w600,
            ),
          ),
          const SizedBox(height: 12),
          // Beautiful grid of statistic cards
          GridView.count(
            shrinkWrap: true,
            physics: const NeverScrollableScrollPhysics(),
            crossAxisCount: 2,
            mainAxisSpacing: 12,
            crossAxisSpacing: 12,
            childAspectRatio: 1.8,
            children: [
              _buildStatCard(
                  'Toplam', stats['toplam']!, CupertinoColors.systemBlue),
              _buildStatCard('Beklemede', stats['beklemede']!,
                  CupertinoColors.systemOrange),
              _buildStatCard('Görevlendirildi', stats['gorevlendirildi']!,
                  CupertinoColors.systemPurple),
              _buildStatCard('Tamamlandı', stats['tamamlandi']!,
                  CupertinoColors.systemGreen),
            ],
          ),
        ],
      ),
    );
  }

  /// [_buildStatCard] creates individual statistic cards with Apple design
  Widget _buildStatCard(String title, int value, Color color) {
    return Container(
      decoration: BoxDecoration(
        color: CupertinoColors.systemBackground,
        borderRadius: BorderRadius.circular(12),
        boxShadow: [
          BoxShadow(
            color: CupertinoColors.systemGrey.withOpacity(0.1),
            blurRadius: 10,
            offset: const Offset(0, 2),
          ),
        ],
      ),
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Text(
              value.toString(),
              style: TextStyle(
                fontSize: 28,
                fontWeight: FontWeight.bold,
                color: color,
              ),
            ),
            const SizedBox(height: 4),
            Text(
              title,
              style: const TextStyle(
                fontSize: 14,
                color: CupertinoColors.systemGrey,
              ),
            ),
          ],
        ),
      ),
    );
  }

  /// [_buildSearchAndFilter] creates search and filter UI elements
  Widget _buildSearchAndFilter(
      BuildContext context, TalepEdenRequestsViewModel viewModel) {
    final stats = viewModel.getRequestStatistics();

    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 16),
      child: Column(
        children: [
          // Search bar with Apple-style design
          Container(
            decoration: BoxDecoration(
              color: CupertinoColors.systemBackground,
              borderRadius: BorderRadius.circular(12),
              boxShadow: [
                BoxShadow(
                  color: CupertinoColors.systemGrey.withOpacity(0.1),
                  blurRadius: 8,
                  offset: const Offset(0, 2),
                ),
              ],
            ),
            child: TextField(
              controller: _searchController,
              onChanged: (_) => setState(() {}),
              decoration: const InputDecoration(
                hintText: 'Taleplerde ara...',
                hintStyle: TextStyle(),
                prefixIcon: Icon(CupertinoIcons.search),
                border: InputBorder.none,
                contentPadding: EdgeInsets.all(16),
              ),
              style: const TextStyle(),
            ),
          ),
          const SizedBox(height: 16),
          // Status filter chips with modern design
          SingleChildScrollView(
            scrollDirection: Axis.horizontal,
            physics: const BouncingScrollPhysics(),
            child: Row(
              children: [
                _buildFilterChip('all', 'Tümü', stats['toplam']!),
                _buildFilterChip('beklemede', 'Beklemede', stats['beklemede']!),
                _buildFilterChip('gorevlendirildi', 'Görevlendirildi',
                    stats['gorevlendirildi']!),
                _buildFilterChip(
                    'tamamlandı', 'Tamamlandı', stats['tamamlandi']!),
                _buildFilterChip('iptal edildi', 'İptal', stats['iptal']!),
              ],
            ),
          ),
          const SizedBox(height: 16),
        ],
      ),
    );
  }

  /// [_buildFilterChip] creates individual filter chips
  Widget _buildFilterChip(String status, String label, int count) {
    final isSelected = _selectedStatus == status;
    return Container(
      margin: const EdgeInsets.only(right: 8),
      child: AnimatedContainer(
        duration: const Duration(milliseconds: 200),
        child: FilterChip(
          label: Text(
            '$label ($count)',
            style: TextStyle(
              color: isSelected ? Colors.white : CupertinoColors.systemGrey,
              fontWeight: isSelected ? FontWeight.w600 : FontWeight.normal,
            ),
          ),
          selected: isSelected,
          onSelected: (selected) {
            setState(() {
              _selectedStatus = status;
            });
          },
          backgroundColor: CupertinoColors.systemBackground,
          selectedColor: Theme.of(context).primaryColor,
          showCheckmark: false,
          elevation: isSelected ? 4 : 1,
          shadowColor: Theme.of(context).primaryColor.withValues(alpha: 0.3),
        ),
      ),
    );
  }

  /// [_buildContentSection] creates the main content area
  Widget _buildContentSection(
      BuildContext context, TalepEdenRequestsViewModel viewModel) {
    if (viewModel.isLoading) {
      return const SliverFillRemaining(
        child: Center(
          child: CupertinoActivityIndicator(radius: 16),
        ),
      );
    }

    if (viewModel.error != null) {
      return SliverFillRemaining(
        child: _buildErrorState(context, viewModel),
      );
    }

    final filteredRequests = viewModel.getFilteredRequests(
      _searchController.text,
      _selectedStatus,
    );

    if (filteredRequests.isEmpty) {
      return SliverFillRemaining(
        child: _buildEmptyState(context),
      );
    }

    return SliverPadding(
      padding: const EdgeInsets.symmetric(horizontal: 16),
      sliver: SliverList(
        delegate: SliverChildBuilderDelegate(
          (context, index) {
            final request = filteredRequests[index];
            return Container(
              margin: const EdgeInsets.only(bottom: 12),
              child: RequestCard(
                request: request,
                onTap: () => _showRequestDetail(context, request, viewModel),
                onEdit: request.durum == 'beklemede'
                    ? () => _showEditRequestModal(context, request, viewModel)
                    : null,
              ),
            );
          },
          childCount: filteredRequests.length,
        ),
      ),
    );
  }

  /// [_buildErrorState] creates error state UI
  Widget _buildErrorState(
      BuildContext context, TalepEdenRequestsViewModel viewModel) {
    return Center(
      child: Padding(
        padding: const EdgeInsets.all(32),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            const Icon(
              CupertinoIcons.exclamationmark_triangle,
              size: 64,
              color: CupertinoColors.systemRed,
            ),
            const SizedBox(height: 16),
            const Text(
              'Bir hata oluştu',
              style: TextStyle(
                fontSize: 18,
                fontWeight: FontWeight.w600,
              ),
            ),
            const SizedBox(height: 8),
            Text(
              viewModel.error!,
              textAlign: TextAlign.center,
              style: const TextStyle(
                color: CupertinoColors.systemGrey,
              ),
            ),
            const SizedBox(height: 24),
            CustomButton(
              onPressed: () => viewModel.loadMyRequests(),
              text: 'Yeniden Dene',
              width: 150,
            ),
          ],
        ),
      ),
    );
  }

  /// [_buildEmptyState] creates empty state UI
  Widget _buildEmptyState(BuildContext context) {
    return const Center(
      child: Padding(
        padding: EdgeInsets.all(32),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(
              CupertinoIcons.doc_text,
              size: 64,
              color: CupertinoColors.systemGrey,
            ),
            SizedBox(height: 16),
            Text(
              'Henüz talep yok',
              style: TextStyle(
                fontSize: 18,
                fontWeight: FontWeight.w600,
              ),
            ),
            SizedBox(height: 8),
            Text(
              'İlk talebinizi oluşturmak için + butonuna dokunun',
              textAlign: TextAlign.center,
              style: TextStyle(
                color: CupertinoColors.systemGrey,
              ),
            ),
          ],
        ),
      ),
    );
  }

  /// [_showCreateRequestModal] shows request creation modal
  void _showCreateRequestModal(
      BuildContext context, TalepEdenRequestsViewModel viewModel) {
    showCupertinoModalPopup<void>(
      context: context,
      builder: (context) => _CreateRequestModal(
        onCreateRequest: (baslik, aciklama, araclar, lokasyon) async {
          final success = await viewModel.createRequest(
            baslik: baslik,
            aciklama: aciklama,
            araclar: araclar,
            lokasyon: lokasyon,
          );
          if (success && context.mounted) {
            Navigator.of(context).pop();
            ScaffoldMessenger.of(context).showSnackBar(
              const SnackBar(
                content: Text('Talep başarıyla oluşturuldu'),
                backgroundColor: CupertinoColors.systemGreen,
              ),
            );
          }
        },
      ),
    );
  }

  /// [_showEditRequestModal] shows request editing modal
  void _showEditRequestModal(BuildContext context, Request request,
      TalepEdenRequestsViewModel viewModel) {
    showCupertinoModalPopup<void>(
      context: context,
      builder: (context) => _CreateRequestModal(
        initialRequest: request,
        onCreateRequest: (baslik, aciklama, araclar, lokasyon) async {
          final success = await viewModel.updateRequest(
            requestId: request.id,
            baslik: baslik,
            aciklama: aciklama,
            araclar: araclar,
            lokasyon: lokasyon,
          );
          if (success && context.mounted) {
            Navigator.of(context).pop();
            ScaffoldMessenger.of(context).showSnackBar(
              const SnackBar(
                content: Text('Talep başarıyla güncellendi'),
                backgroundColor: CupertinoColors.systemBlue,
              ),
            );
          }
        },
      ),
    );
  }

  /// [_showRequestDetail] shows request detail modal
  void _showRequestDetail(BuildContext context, Request request,
      TalepEdenRequestsViewModel viewModel) {
    showModalBottomSheet<void>(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (context) => RequestDetailModal(request: request),
    );
  }
}

/// [_CreateRequestModal] is a beautiful modal for creating/editing requests
class _CreateRequestModal extends StatefulWidget {
  const _CreateRequestModal({
    required this.onCreateRequest,
    this.initialRequest,
  });

  final Future<void> Function(String baslik, String aciklama,
      List<VehicleRequest> araclar, Location lokasyon) onCreateRequest;
  final Request? initialRequest;

  @override
  State<_CreateRequestModal> createState() => _CreateRequestModalState();
}

class _CreateRequestModalState extends State<_CreateRequestModal> {
  final _baslikController = TextEditingController();
  final _aciklamaController = TextEditingController();
  final _adresController = TextEditingController();
  final _aracTuruController = TextEditingController();
  final _aracSayisiController = TextEditingController();

  @override
  void initState() {
    super.initState();
    // Initialize with existing data if editing
    if (widget.initialRequest != null) {
      final request = widget.initialRequest!;
      _baslikController.text = request.baslik;
      _aciklamaController.text = request.aciklama;
      _adresController.text = request.lokasyon.adres;
      if (request.araclar.isNotEmpty) {
        final arac = request.araclar.first;
        _aracTuruController.text = arac.aracTuru;
        _aracSayisiController.text = arac.aracSayisi.toString();
      }
    }
  }

  @override
  void dispose() {
    _baslikController.dispose();
    _aciklamaController.dispose();
    _adresController.dispose();
    _aracTuruController.dispose();
    _aracSayisiController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Container(
      height: MediaQuery.of(context).size.height * 0.9,
      decoration: const BoxDecoration(
        color: CupertinoColors.systemGroupedBackground,
        borderRadius: BorderRadius.vertical(top: Radius.circular(20)),
      ),
      child: Column(
        children: [
          // Header
          Container(
            padding: const EdgeInsets.all(16),
            decoration: const BoxDecoration(
              color: CupertinoColors.systemBackground,
              borderRadius: BorderRadius.vertical(top: Radius.circular(20)),
            ),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                CupertinoButton(
                  onPressed: () => Navigator.of(context).pop(),
                  child: const Text('İptal'),
                ),
                Text(
                  widget.initialRequest != null
                      ? 'Talep Düzenle'
                      : 'Yeni Talep',
                  style: const TextStyle(
                    fontSize: 18,
                    fontWeight: FontWeight.w600,
                  ),
                ),
                CupertinoButton(
                  onPressed: _saveRequest,
                  child: Text(
                      widget.initialRequest != null ? 'Güncelle' : 'Oluştur'),
                ),
              ],
            ),
          ),
          // Form content
          Expanded(
            child: SingleChildScrollView(
              padding: const EdgeInsets.all(16),
              child: Column(
                children: [
                  _buildFormSection(
                      'Başlık', _baslikController, 'Talep başlığını yazın'),
                  const SizedBox(height: 16),
                  _buildFormSection(
                      'Açıklama', _aciklamaController, 'Detaylı açıklama yazın',
                      maxLines: 4),
                  const SizedBox(height: 16),
                  _buildFormSection(
                      'Adres', _adresController, 'Konum adresini yazın'),
                  const SizedBox(height: 16),
                  _buildFormSection('Araç Türü', _aracTuruController,
                      'Örn: Ambulans, İtfaiye'),
                  const SizedBox(height: 16),
                  _buildFormSection(
                      'Araç Sayısı', _aracSayisiController, 'Kaç araç gerekli',
                      keyboardType: TextInputType.number),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildFormSection(
      String title, TextEditingController controller, String hint,
      {int maxLines = 1, TextInputType? keyboardType}) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          title,
          style: const TextStyle(
            fontSize: 16,
            fontWeight: FontWeight.w600,
          ),
        ),
        const SizedBox(height: 8),
        Container(
          decoration: BoxDecoration(
            color: CupertinoColors.systemBackground,
            borderRadius: BorderRadius.circular(12),
            boxShadow: [
              BoxShadow(
                color: CupertinoColors.systemGrey.withOpacity(0.1),
                blurRadius: 8,
                offset: const Offset(0, 2),
              ),
            ],
          ),
          child: TextField(
            controller: controller,
            maxLines: maxLines,
            keyboardType: keyboardType,
            decoration: InputDecoration(
              hintText: hint,
              hintStyle: const TextStyle(),
              border: InputBorder.none,
              contentPadding: const EdgeInsets.all(16),
            ),
            style: const TextStyle(),
          ),
        ),
      ],
    );
  }

  void _saveRequest() {
    final baslik = _baslikController.text.trim();
    final aciklama = _aciklamaController.text.trim();
    final adres = _adresController.text.trim();
    final aracTuru = _aracTuruController.text.trim();
    final aracSayisiText = _aracSayisiController.text.trim();

    if (baslik.isEmpty ||
        aciklama.isEmpty ||
        adres.isEmpty ||
        aracTuru.isEmpty ||
        aracSayisiText.isEmpty) {
      showCupertinoDialog<void>(
        context: context,
        builder: (context) => CupertinoAlertDialog(
          title: const Text('Eksik Bilgi'),
          content: const Text('Lütfen tüm alanları doldurun'),
          actions: [
            CupertinoDialogAction(
              onPressed: () => Navigator.of(context).pop(),
              child: const Text('Tamam'),
            ),
          ],
        ),
      );
      return;
    }

    final aracSayisi = int.tryParse(aracSayisiText) ?? 1;

    final araclar = [
      VehicleRequest(aracTuru: aracTuru, aracSayisi: aracSayisi),
    ];

    final lokasyon = Location(adres: adres, lat: 0, lng: 0);

    widget.onCreateRequest(baslik, aciklama, araclar, lokasyon);
  }
}
