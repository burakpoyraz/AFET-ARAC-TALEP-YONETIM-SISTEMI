import 'package:afet_arac_takip/core/init/navigation/navigation_service.dart';
import 'package:afet_arac_takip/features/auth/model/user_model.dart';
import 'package:afet_arac_takip/product/cache/local_storage.dart';
import 'package:afet_arac_takip/product/network/network_manager.dart';
import 'package:flutter/cupertino.dart';

/// Profile view - beautiful, modern user profile page
/// Following Apple Human Interface Guidelines with sleek design
class ProfileView extends StatefulWidget {
  /// Creates a profile view
  const ProfileView({super.key});

  @override
  State<ProfileView> createState() => _ProfileViewState();
}

class _ProfileViewState extends State<ProfileView>
    with TickerProviderStateMixin {
  final LocalStorage _localStorage = LocalStorage.instance;
  final NavigationService _navigationService = NavigationService.instance;
  final NetworkManager _networkManager = NetworkManager.instance;

  User? _user;
  String? _institutionName;
  bool _isLoading = false;
  late AnimationController _fadeController;
  late Animation<double> _fadeAnimation;

  @override
  void initState() {
    super.initState();
    _user = _localStorage.getUser();

    // [ProfileView.initState] Setup fade animation for smooth entrance
    _fadeController = AnimationController(
      duration: const Duration(milliseconds: 800),
      vsync: this,
    );
    _fadeAnimation = Tween<double>(
      begin: 0,
      end: 1,
    ).animate(CurvedAnimation(
      parent: _fadeController,
      curve: Curves.easeOutCubic,
    ));

    _fadeController.forward();
    _loadInstitutionData();
  }

  @override
  void dispose() {
    _fadeController.dispose();
    super.dispose();
  }

  /// [_loadInstitutionData] Load institution data for better profile display
  Future<void> _loadInstitutionData() async {
    if (_user?.isTalepEden ?? false) {
      try {
        // [ProfileView._loadInstitutionData] For talep_eden users, try to get institution from tasks endpoint
        final response = await _networkManager.dio.get<List<dynamic>>(
          '/gorevler/talep-eden-kurum',
        );

        if (response.statusCode == 200 &&
            response.data != null &&
            response.data!.isNotEmpty) {
          final firstTask = response.data!.first;
          final talepId = firstTask['talepId'] as Map<String, dynamic>?;

          if (talepId != null) {
            final talepEdenKurumFirmaId =
                talepId['talepEdenKurumFirmaId'] as Map<String, dynamic>?;

            if (talepEdenKurumFirmaId != null) {
              final kurumAdi = talepEdenKurumFirmaId['kurumAdi'] as String?;

              if (kurumAdi != null && kurumAdi.isNotEmpty && mounted) {
                setState(() {
                  _institutionName = kurumAdi;
                });
              }
            }
          }
        }
      } on Exception catch (e) {
        debugPrint(
            '[ProfileView._loadInstitutionData] Error loading institution: $e');
      }
    }
  }

  /// [_handleLogout] Handle user logout with confirmation dialog
  Future<void> _handleLogout() async {
    final shouldLogout = await _showLogoutDialog();
    if (shouldLogout ?? false) {
      await _performLogout();
    }
  }

  /// [_showLogoutDialog] Show elegant logout confirmation dialog
  Future<bool?> _showLogoutDialog() {
    return showCupertinoDialog<bool>(
      context: context,
      builder: (context) => CupertinoAlertDialog(
        title: const Text(
          'Çıkış Yap',
          style: TextStyle(
            fontSize: 18,
            fontWeight: FontWeight.w600,
          ),
        ),
        content: const Text(
          'Hesabınızdan çıkış yapmak istediğinizden emin misiniz?',
          style: TextStyle(fontSize: 16),
        ),
        actions: [
          CupertinoDialogAction(
            child: const Text(
              'İptal',
              style: TextStyle(
                color: CupertinoColors.systemBlue,
                fontSize: 16,
              ),
            ),
            onPressed: () => Navigator.of(context).pop(false),
          ),
          CupertinoDialogAction(
            isDestructiveAction: true,
            child: const Text(
              'Çıkış Yap',
              style: TextStyle(
                fontSize: 16,
                fontWeight: FontWeight.w600,
              ),
            ),
            onPressed: () => Navigator.of(context).pop(true),
          ),
        ],
      ),
    );
  }

  /// [_performLogout] Perform the actual logout process
  Future<void> _performLogout() async {
    setState(() {
      _isLoading = true;
    });

    try {
      // [ProfileView._performLogout] Clear local storage and navigate to login
      await _localStorage.clear();
      await _navigationService.navigateToPageClear(path: '/login');
    } on Exception catch (e) {
      debugPrint('[ProfileView._performLogout] Logout error: $e');
      // Even if there's an error, still navigate to login
      await _navigationService.navigateToPageClear(path: '/login');
    } finally {
      if (mounted) {
        setState(() {
          _isLoading = false;
        });
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return CupertinoPageScaffold(
      navigationBar: const CupertinoNavigationBar(
        middle: Text(
          'Profil',
          style: TextStyle(
            fontSize: 18,
            fontWeight: FontWeight.w600,
          ),
        ),
        backgroundColor: CupertinoColors.systemBackground,
      ),
      child: SafeArea(
        child: FadeTransition(
          opacity: _fadeAnimation,
          child: _buildProfileContent(),
        ),
      ),
    );
  }

  /// [_buildProfileContent] Build the main profile content with beautiful design
  Widget _buildProfileContent() {
    if (_user == null) {
      return const Center(
        child: Text(
          'Kullanıcı bilgileri bulunamadı',
          style: TextStyle(
            fontSize: 16,
            color: CupertinoColors.systemGrey,
          ),
        ),
      );
    }

    return CustomScrollView(
      physics: const BouncingScrollPhysics(),
      slivers: [
        SliverToBoxAdapter(
          child: Padding(
            padding: const EdgeInsets.all(20),
            child: Column(
              children: [
                const SizedBox(height: 20),
                _buildProfileHeader(),
                const SizedBox(height: 30),
                _buildProfileInfoCard(),
                const SizedBox(height: 20),
                _buildInstitutionCard(),
                const SizedBox(height: 30),
                _buildLogoutButton(),
                const SizedBox(height: 40),
              ],
            ),
          ),
        ),
      ],
    );
  }

  /// [_buildProfileHeader] Build beautiful profile header with avatar and name
  Widget _buildProfileHeader() {
    return Column(
      children: [
        // Beautiful circular avatar with gradient background
        Container(
          width: 120,
          height: 120,
          decoration: BoxDecoration(
            shape: BoxShape.circle,
            gradient: LinearGradient(
              begin: Alignment.topLeft,
              end: Alignment.bottomRight,
              colors: [
                CupertinoColors.systemBlue.withOpacity(0.8),
                CupertinoColors.systemIndigo.withOpacity(0.9),
              ],
            ),
            boxShadow: [
              BoxShadow(
                color: CupertinoColors.systemBlue.withOpacity(0.3),
                blurRadius: 20,
                offset: const Offset(0, 10),
              ),
            ],
          ),
          child: Center(
            child: Text(
              _getInitials(),
              style: const TextStyle(
                fontSize: 42,
                fontWeight: FontWeight.w600,
                color: CupertinoColors.white,
              ),
            ),
          ),
        ),
        const SizedBox(height: 20),
        // User name with elegant typography
        Text(
          _user!.fullName,
          style: const TextStyle(
            fontSize: 28,
            fontWeight: FontWeight.w700,
            color: CupertinoColors.label,
          ),
        ),
        const SizedBox(height: 8),
        // Role badge with beautiful styling
        Container(
          padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
          decoration: BoxDecoration(
            color: _getRoleColor().withValues(alpha: 0.1),
            borderRadius: BorderRadius.circular(20),
            border: Border.all(
              color: _getRoleColor().withValues(alpha: 0.3),
            ),
          ),
          child: Text(
            _user!.displayRole,
            style: TextStyle(
              fontSize: 16,
              fontWeight: FontWeight.w600,
              color: _getRoleColor(),
            ),
          ),
        ),
      ],
    );
  }

  /// [_buildProfileInfoCard] Build profile information card with smooth design
  Widget _buildProfileInfoCard() {
    return Container(
      decoration: BoxDecoration(
        color: CupertinoColors.systemBackground,
        borderRadius: BorderRadius.circular(16),
        boxShadow: [
          BoxShadow(
            color: CupertinoColors.systemGrey.withOpacity(0.1),
            blurRadius: 10,
            offset: const Offset(0, 2),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Padding(
            padding: EdgeInsets.fromLTRB(20, 20, 20, 10),
            child: Text(
              'Kişisel Bilgiler',
              style: TextStyle(
                fontSize: 20,
                fontWeight: FontWeight.w700,
                color: CupertinoColors.label,
              ),
            ),
          ),
          _buildInfoRow(
            icon: CupertinoIcons.person_fill,
            title: 'Ad Soyad',
            value: _user!.fullName,
          ),
          _buildInfoRow(
            icon: CupertinoIcons.mail_solid,
            title: 'E-posta',
            value: _user!.email,
          ),
          if (_user!.telefon != null && _user!.telefon!.isNotEmpty)
            _buildInfoRow(
              icon: CupertinoIcons.phone_fill,
              title: 'Telefon',
              value: _user!.telefon!,
            ),
          _buildInfoRow(
            icon: CupertinoIcons.person_crop_circle_fill,
            title: 'Rol',
            value: _user!.displayRole,
            isLast: true,
          ),
        ],
      ),
    );
  }

  /// [_buildInstitutionCard] Build institution information card
  Widget _buildInstitutionCard() {
    final kurumAdi = _getInstitutionName();

    if (kurumAdi.isEmpty) {
      return const SizedBox.shrink();
    }

    return Container(
      decoration: BoxDecoration(
        color: CupertinoColors.systemBackground,
        borderRadius: BorderRadius.circular(16),
        boxShadow: [
          BoxShadow(
            color: CupertinoColors.systemGrey.withOpacity(0.1),
            blurRadius: 10,
            offset: const Offset(0, 2),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Padding(
            padding: EdgeInsets.fromLTRB(20, 20, 20, 10),
            child: Text(
              'Kurum Bilgileri',
              style: TextStyle(
                fontSize: 20,
                fontWeight: FontWeight.w700,
                color: CupertinoColors.label,
              ),
            ),
          ),
          _buildInfoRow(
            icon: CupertinoIcons.building_2_fill,
            title: 'Kurum Adı',
            value: kurumAdi,
          ),
          if (_user!.kullaniciBeyanBilgileri?.kurumFirmaTuru != null)
            _buildInfoRow(
              icon: CupertinoIcons.doc_checkmark_fill,
              title: 'Beyan Türü',
              value: _user!.kullaniciBeyanBilgileri!.displayType,
              isLast: true,
            ),
        ],
      ),
    );
  }

  /// [_buildInfoRow] Build individual information row with beautiful styling
  Widget _buildInfoRow({
    required IconData icon,
    required String title,
    required String value,
    bool isLast = false,
  }) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 16),
      decoration: BoxDecoration(
        border: isLast
            ? null
            : const Border(
                bottom: BorderSide(
                  color: CupertinoColors.separator,
                  width: 0.5,
                ),
              ),
      ),
      child: Row(
        children: [
          Container(
            width: 40,
            height: 40,
            decoration: BoxDecoration(
              color: CupertinoColors.systemBlue.withOpacity(0.1),
              borderRadius: BorderRadius.circular(10),
            ),
            child: Icon(
              icon,
              color: CupertinoColors.systemBlue,
              size: 20,
            ),
          ),
          const SizedBox(width: 16),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  title,
                  style: const TextStyle(
                    fontSize: 14,
                    fontWeight: FontWeight.w500,
                    color: CupertinoColors.systemGrey,
                  ),
                ),
                const SizedBox(height: 4),
                Text(
                  value,
                  style: const TextStyle(
                    fontSize: 16,
                    fontWeight: FontWeight.w600,
                    color: CupertinoColors.label,
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  /// [_buildLogoutButton] Build beautiful logout button with loading state
  Widget _buildLogoutButton() {
    return SizedBox(
      width: double.infinity,
      child: CupertinoButton(
        onPressed: _isLoading ? null : _handleLogout,
        color: CupertinoColors.systemRed,
        borderRadius: BorderRadius.circular(16),
        padding: const EdgeInsets.symmetric(vertical: 18),
        child: _isLoading
            ? const CupertinoActivityIndicator(
                color: CupertinoColors.white,
              )
            : const Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Icon(
                    CupertinoIcons.square_arrow_right,
                    color: CupertinoColors.white,
                    size: 20,
                  ),
                  SizedBox(width: 8),
                  Text(
                    'Çıkış Yap',
                    style: TextStyle(
                      fontSize: 18,
                      fontWeight: FontWeight.w600,
                      color: CupertinoColors.white,
                    ),
                  ),
                ],
              ),
      ),
    );
  }

  /// [_getInitials] Get user initials for avatar
  String _getInitials() {
    if (_user == null) return '?';

    final firstName = _user!.ad.trim();
    final lastName = _user!.soyad.trim();

    var initials = '';

    if (firstName.isNotEmpty) {
      initials += firstName[0].toUpperCase();
    }

    if (lastName.isNotEmpty) {
      initials += lastName[0].toUpperCase();
    }

    return initials.isEmpty ? '?' : initials;
  }

  /// [_getRoleColor] Get color based on user role
  Color _getRoleColor() {
    switch (_user?.rol) {
      case 'koordinator':
        return CupertinoColors.systemPurple;
      case 'arac_sahibi':
        return CupertinoColors.systemGreen;
      case 'talep_eden':
        return CupertinoColors.systemBlue;
      case 'beklemede':
        return CupertinoColors.systemOrange;
      default:
        return CupertinoColors.systemGrey;
    }
  }

  /// [_getInstitutionName] Get institution name with fallback logic
  String _getInstitutionName() {
    // Priority order: API fetched -> User kurumFirmaId -> BeyanBilgileri -> empty
    if (_institutionName != null && _institutionName!.isNotEmpty) {
      return _institutionName!;
    }

    if (_user?.kurumFirmaId?.kurumAdi != null &&
        _user!.kurumFirmaId!.kurumAdi.isNotEmpty) {
      return _user!.kurumFirmaId!.kurumAdi;
    }

    if (_user?.kullaniciBeyanBilgileri?.kurumFirmaAdi != null &&
        _user!.kullaniciBeyanBilgileri!.kurumFirmaAdi!.isNotEmpty) {
      return _user!.kullaniciBeyanBilgileri!.kurumFirmaAdi!;
    }

    return '';
  }
}
