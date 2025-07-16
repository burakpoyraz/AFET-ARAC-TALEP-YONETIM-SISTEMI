import 'package:flutter/material.dart';

/// Application color scheme configurations
class AppColorScheme {
  /// Light theme color scheme
  static ColorScheme get lightColorScheme => ColorScheme.fromSeed(
        seedColor: const Color(0xFF1E88E5),
        surface: Colors.white,
      );

  /// Dark theme color scheme
  static ColorScheme get darkColorScheme => ColorScheme.fromSeed(
        seedColor: const Color(0xFF1E88E5),
        brightness: Brightness.dark,
        surface: const Color(0xFF121212),
      );
}
