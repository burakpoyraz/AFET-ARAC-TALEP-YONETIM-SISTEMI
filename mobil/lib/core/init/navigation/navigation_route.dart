import 'package:flutter/material.dart';

import '../../../features/auth/view/login_view.dart';
import '../../../features/auth/view/register_view.dart';
import '../../../features/vehicles/view/vehicles_view.dart';
import '../../../features/tasks/view/tasks_view.dart';
import '../../../features/requests/view/requests_view.dart';
import '../../../features/notifications/view/notifications_view.dart';
import '../../../features/profile/view/profile_view.dart';

/// Navigation route handler for app routes
class NavigationRoute {
  static NavigationRoute? _instance;
  static NavigationRoute get instance {
    _instance ??= NavigationRoute._init();
    return _instance!;
  }

  NavigationRoute._init();

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

  MaterialPageRoute _navigate(Widget widget) {
    return MaterialPageRoute(builder: (context) => widget);
  }
}
