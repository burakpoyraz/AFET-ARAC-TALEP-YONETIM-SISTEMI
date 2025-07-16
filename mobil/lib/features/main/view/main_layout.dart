import 'package:afet_arac_takip/features/notifications/view/notifications_view.dart';
import 'package:afet_arac_takip/features/panel/view/panel_view.dart';
import 'package:afet_arac_takip/features/profile/view/profile_view.dart';
import 'package:afet_arac_takip/features/requests/view/requests_view.dart';
import 'package:afet_arac_takip/features/tasks/view/my_tasks_view.dart';
import 'package:afet_arac_takip/features/tasks/view/tasks_view.dart';
import 'package:afet_arac_takip/features/vehicles/view/my_vehicles_view.dart';
import 'package:afet_arac_takip/features/vehicles/view/vehicles_view.dart';
import 'package:afet_arac_takip/product/cache/local_storage.dart';
import 'package:flutter/material.dart';

/// Main layout with bottom navigation
class MainLayout extends StatefulWidget {
  /// Creates a main layout
  const MainLayout({super.key, this.initialIndex = 0});

  /// Initial tab index
  final int initialIndex;

  @override
  State<MainLayout> createState() => _MainLayoutState();
}

class _MainLayoutState extends State<MainLayout> {
  late int _currentIndex;
  final _pageController = PageController();

  @override
  void initState() {
    super.initState();
    _currentIndex = widget.initialIndex;

    // Check if user is pending approval
    WidgetsBinding.instance.addPostFrameCallback((_) {
      final user = LocalStorage.instance.getUser();
      if (user != null && user.isBeklemede) {
        Navigator.of(context).pushReplacementNamed('/pending-approval');
      } else {
        _pageController.jumpToPage(_currentIndex);
      }
    });
  }

  @override
  void dispose() {
    _pageController.dispose();
    super.dispose();
  }

  List<Widget> _getPages() {
    final user = LocalStorage.instance.getUser();
    if (user == null) return [];

    if (user.isKoordinator) {
      return const [
        PanelView(),
        RequestsView(), // Will show KoordinatorRequestsView
        TasksView(),
        VehiclesView(),
        ProfileView(),
      ];
    } else if (user.isAracSahibi) {
      return [
        const PanelView(),
        const MyVehiclesView(),
        const MyTasksView(),
        const NotificationsView(),
        const ProfileView(),
      ];
    } else if (user.isTalepEden) {
      return const [
        PanelView(),
        RequestsView(), // Will show user's own requests
        TasksView(), // Will show task tracking
        NotificationsView(),
        ProfileView(),
      ];
    }
    return [];
  }

  List<BottomNavigationBarItem> _getNavItems() {
    final user = LocalStorage.instance.getUser();
    if (user == null) return [];

    if (user.isKoordinator) {
      return const [
        BottomNavigationBarItem(
          icon: Icon(Icons.dashboard),
          label: 'Panel',
        ),
        BottomNavigationBarItem(
          icon: Icon(Icons.assignment),
          label: 'Talepler',
        ),
        BottomNavigationBarItem(
          icon: Icon(Icons.task_alt),
          label: 'Görevler',
        ),
        BottomNavigationBarItem(
          icon: Icon(Icons.local_shipping),
          label: 'Araçlar',
        ),
        BottomNavigationBarItem(
          icon: Icon(Icons.person),
          label: 'Profil',
        ),
      ];
    } else if (user.isAracSahibi) {
      return const [
        BottomNavigationBarItem(
          icon: Icon(Icons.dashboard),
          label: 'Panel',
        ),
        BottomNavigationBarItem(
          icon: Icon(Icons.directions_car),
          label: 'Araçlarım',
        ),
        BottomNavigationBarItem(
          icon: Icon(Icons.assignment_turned_in),
          label: 'Görevlerim',
        ),
        BottomNavigationBarItem(
          icon: Icon(Icons.notifications),
          label: 'Bildirimler',
        ),
        BottomNavigationBarItem(
          icon: Icon(Icons.person),
          label: 'Profil',
        ),
      ];
    } else if (user.isTalepEden) {
      return const [
        BottomNavigationBarItem(
          icon: Icon(Icons.dashboard),
          label: 'Panel',
        ),
        BottomNavigationBarItem(
          icon: Icon(Icons.assignment),
          label: 'Taleplerim',
        ),
        BottomNavigationBarItem(
          icon: Icon(Icons.track_changes),
          label: 'Görev Takibi',
        ),
        BottomNavigationBarItem(
          icon: Icon(Icons.notifications),
          label: 'Bildirimler',
        ),
        BottomNavigationBarItem(
          icon: Icon(Icons.person),
          label: 'Profil',
        ),
      ];
    }
    return [];
  }

  @override
  Widget build(BuildContext context) {
    final pages = _getPages();
    final navItems = _getNavItems();

    if (pages.isEmpty || navItems.isEmpty) {
      return const Scaffold(
        body: Center(
          child: Text('Kullanıcı bilgisi bulunamadı'),
        ),
      );
    }

    return Scaffold(
      body: PageView(
        controller: _pageController,
        onPageChanged: (index) {
          setState(() {
            _currentIndex = index;
          });
        },
        children: pages,
      ),
      bottomNavigationBar: NavigationBar(
        selectedIndex: _currentIndex,
        onDestinationSelected: (index) {
          setState(() {
            _currentIndex = index;
          });
          _pageController.animateToPage(
            index,
            duration: const Duration(milliseconds: 300),
            curve: Curves.easeInOut,
          );
        },
        destinations: navItems.map((item) {
          return NavigationDestination(
            icon: item.icon,
            label: item.label!,
          );
        }).toList(),
      ),
    );
  }
}
