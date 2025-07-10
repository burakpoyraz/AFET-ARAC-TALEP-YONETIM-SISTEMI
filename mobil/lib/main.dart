import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import 'core/init/navigation/navigation_service.dart';
import 'core/init/navigation/navigation_route.dart';
import 'product/theme/app_theme.dart';

void main() {
  runApp(
    MultiProvider(
      providers: [
        // Add providers here
      ],
      child: const MyApp(),
    ),
  );
}

/// Main application widget
class MyApp extends StatelessWidget {
  /// Creates the main application widget
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Afet Araç Takip',
      debugShowCheckedModeBanner: false,
      theme: AppTheme.light,
      darkTheme: AppTheme.dark,
      onGenerateRoute: NavigationRoute.instance.generateRoute,
      navigatorKey: NavigationService.instance.navigatorKey,
    );
  }
}
