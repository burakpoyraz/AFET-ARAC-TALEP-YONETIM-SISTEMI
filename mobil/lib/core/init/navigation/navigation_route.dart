import 'package:afet_arac_takip/features/auth/view/login_view.dart';
import 'package:afet_arac_takip/features/auth/view/pending_approval_view.dart';
import 'package:afet_arac_takip/features/auth/view/register_view.dart';
import 'package:afet_arac_takip/features/main/view/main_layout.dart';
import 'package:afet_arac_takip/features/notifications/view/notifications_view.dart';
import 'package:afet_arac_takip/features/profile/view/profile_view.dart';
import 'package:afet_arac_takip/features/users/view/users_management_view.dart';
import 'package:flutter/material.dart';

/// Navigation route handler for app routes
class NavigationRoute {
  NavigationRoute._init();
  static final NavigationRoute _instance = NavigationRoute._init();
  static NavigationRoute get instance => _instance;

  Route<dynamic> generateRoute(RouteSettings settings) {
    switch (settings.name) {
      case '/login':
        return _navigate(const LoginView());
      case '/register':
        return _navigate(const RegisterView());
      case '/pending-approval':
        return _navigate(const PendingApprovalView());
      case '/panel':
        return _navigate(const MainLayout());
      case '/main':
        return _navigate(const MainLayout());
      case '/vehicles':
        return _navigate(const MainLayout(initialIndex: 1)); // For arac_sahibi
      case '/tasks':
        return _navigate(const MainLayout(initialIndex: 2));
      case '/requests':
        return _navigate(const MainLayout(initialIndex: 1)); // For koordinator
      case '/my-requests':
        return _navigate(const MainLayout(initialIndex: 1)); // For talep_eden
      case '/task-tracking':
        return _navigate(const MainLayout(initialIndex: 2)); // For talep_eden
      case '/notifications':
        return _navigate(const NotificationsView());
      case '/profile':
        return _navigate(const ProfileView());
      case '/users':
        return _navigate(const UsersManagementView());
      case '/institutions':
        // Navigate to vehicles tab for now, will create institutions management later
        return _navigate(const MainLayout(initialIndex: 3));
      case '/reports':
        // Navigate to tasks tab for now, will create reports later
        return _navigate(const MainLayout(initialIndex: 2));
      default:
        return _navigate(const LoginView());
    }
  }

  MaterialPageRoute<dynamic> _navigate(Widget widget) =>
      MaterialPageRoute<dynamic>(builder: (context) => widget);
}
