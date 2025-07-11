import 'package:afet_arac_takip/features/auth/view/login_view.dart';
import 'package:afet_arac_takip/features/auth/view/register_view.dart';
import 'package:afet_arac_takip/features/notifications/view/notifications_view.dart';
import 'package:afet_arac_takip/features/profile/view/profile_view.dart';
import 'package:afet_arac_takip/features/requests/view/requests_view.dart';
import 'package:afet_arac_takip/features/tasks/view/tasks_view.dart';
import 'package:afet_arac_takip/features/vehicles/view/vehicles_view.dart';
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
      case '/vehicles':
        return _navigate(const VehiclesView());
      case '/tasks':
        return _navigate(const TasksView());
      case '/requests':
        return _navigate(const RequestsView());
      case '/notifications':
        return _navigate(const NotificationsView());
      case '/profile':
        return _navigate(const ProfileView());
      default:
        return _navigate(const LoginView());
    }
  }

  MaterialPageRoute<dynamic> _navigate(Widget widget) =>
      MaterialPageRoute<dynamic>(builder: (context) => widget);
}
