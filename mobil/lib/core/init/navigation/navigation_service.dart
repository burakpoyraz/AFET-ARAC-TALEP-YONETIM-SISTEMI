import 'package:flutter/material.dart';

/// Navigation service for handling app navigation
class NavigationService {
  static NavigationService? _instance;
  static NavigationService get instance {
    _instance ??= NavigationService._init();
    return _instance!;
  }

  NavigationService._init();

  final GlobalKey<NavigatorState> navigatorKey = GlobalKey<NavigatorState>();

  Future<void> navigateToPage({required String path, Object? data}) async {
    await navigatorKey.currentState?.pushNamed(path, arguments: data);
  }

  Future<void> navigateToPageClear({required String path, Object? data}) async {
    await navigatorKey.currentState?.pushNamedAndRemoveUntil(
      path,
      (route) => false,
      arguments: data,
    );
  }

  void pop() {
    navigatorKey.currentState?.pop();
  }

  Future<bool> maybePop() async {
    return await navigatorKey.currentState?.maybePop() ?? false;
  }
}
