import 'package:afet_arac_takip/core/init/navigation/navigation_route.dart';
import 'package:afet_arac_takip/core/init/navigation/navigation_service.dart';
import 'package:afet_arac_takip/features/requests/viewmodel/koordinator_requests_viewmodel.dart';
import 'package:afet_arac_takip/features/tasks/viewmodel/koordinator_tasks_viewmodel.dart';
import 'package:afet_arac_takip/features/vehicles/viewmodel/vehicles_viewmodel.dart';
import 'package:afet_arac_takip/product/cache/local_storage.dart';
import 'package:afet_arac_takip/product/theme/app_theme.dart';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:provider/provider.dart';

Future<void> main() async {
  try {
    WidgetsFlutterBinding.ensureInitialized();

    // Initialize local storage
    await LocalStorage.instance.init();
    debugPrint('Local storage initialized');

    // Set preferred orientations
    await SystemChrome.setPreferredOrientations([
      DeviceOrientation.portraitUp,
      DeviceOrientation.portraitDown,
    ]);

    // Set iOS specific UI settings
    SystemChrome.setSystemUIOverlayStyle(
      const SystemUiOverlayStyle(
        statusBarBrightness: Brightness.light,
        statusBarIconBrightness: Brightness.dark,
        statusBarColor: Colors.transparent,
      ),
    );

    debugPrint('Starting app...');

    runApp(
      MultiProvider(
        providers: [
          // Navigation service
          ChangeNotifierProvider(create: (_) => NavigationService.instance),
          // Core ViewModels for shared data and caching
          ChangeNotifierProvider(create: (_) => KoordinatorRequestsViewModel()),
          ChangeNotifierProvider(create: (_) => KoordinatorTasksViewModel()),
          ChangeNotifierProvider(create: (_) => VehiclesViewModel()),
        ],
        child: const MyApp(),
      ),
    );
  } on Exception catch (e, stackTrace) {
    debugPrint('Error in main: $e');
    debugPrint('Stack trace: $stackTrace');
  }
}

/// Main application widget
class MyApp extends StatelessWidget {
  /// Creates the main application widget
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    debugPrint('Building MyApp');
    return MaterialApp(
      title: 'Afet Araç Takip',
      debugShowCheckedModeBanner: false,
      theme: AppTheme.light,
      darkTheme: AppTheme.dark,
      themeMode: ThemeMode.light,
      builder: (context, child) {
        debugPrint('Building app with child');
        // Add top-level error boundary
        ErrorWidget.builder = (FlutterErrorDetails details) {
          debugPrint('Error in app: ${details.exception}');
          return Material(
            child: ColoredBox(
              color: Colors.white,
              child: Center(
                child: Text(
                  'Bir hata oluştu\n${details.exception}',
                  style: const TextStyle(color: Colors.black),
                  textAlign: TextAlign.center,
                ),
              ),
            ),
          );
        };
        return child ?? const SizedBox.shrink();
      },
      home: Builder(
        builder: (context) {
          debugPrint('Building home widget');
          return const Scaffold(
            backgroundColor: Colors.white,
            body: SafeArea(
              child: Center(
                child: Text(
                  'Yükleniyor...',
                  style: TextStyle(
                    color: Colors.black,
                    fontSize: 16,
                  ),
                ),
              ),
            ),
          );
        },
      ),
      initialRoute: '/login',
      onGenerateRoute: NavigationRoute.instance.generateRoute,
      navigatorKey: NavigationService.instance.navigatorKey,
    );
  }
}
