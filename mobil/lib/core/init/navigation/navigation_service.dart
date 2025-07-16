import 'package:flutter/material.dart';

/// Navigation service for handling app navigation
class NavigationService extends ChangeNotifier {
  NavigationService._init();
  static final NavigationService instance = NavigationService._init();

  final GlobalKey<NavigatorState> navigatorKey = GlobalKey<NavigatorState>();

  Future<void> navigateToPage({required String path, Object? data}) async {
    await navigatorKey.currentState?.pushNamed(path, arguments: data);
    notifyListeners();
  }

  Future<void> navigateToPageClear({required String path, Object? data}) async {
    await navigatorKey.currentState?.pushNamedAndRemoveUntil(
      path,
      (route) => false,
      arguments: data,
    );
    notifyListeners();
  }

  void pop() {
    navigatorKey.currentState?.pop();
    notifyListeners();
  }

  Future<bool> maybePop() async {
    final result = await navigatorKey.currentState?.maybePop() ?? false;
    notifyListeners();
    return result;
  }
}
