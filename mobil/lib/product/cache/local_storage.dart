import 'dart:convert';

import 'package:afet_arac_takip/features/auth/model/user_model.dart';
import 'package:flutter/cupertino.dart' show debugPrint;
import 'package:shared_preferences/shared_preferences.dart';

/// Local storage manager for handling data persistence
class LocalStorage {
  LocalStorage._init();
  static final LocalStorage instance = LocalStorage._init();

  SharedPreferences? _preferences;

  Future<void> init() async {
    _preferences = await SharedPreferences.getInstance();
  }

  Future<void> setToken(String token) async {
    await _preferences?.setString('token', token);
  }

  String? getToken() {
    return _preferences?.getString('token');
  }

  Future<void> removeToken() async {
    await _preferences?.remove('token');
  }

  Future<void> setUser(User user) async {
    final userJson = json.encode(user.toJson());
    await _preferences?.setString('user', userJson);
  }

  User? getUser() {
    final userString = _preferences?.getString('user');
    if (userString != null) {
      try {
        final userJson = json.decode(userString) as Map<String, dynamic>;
        return User.fromJson(userJson);
      } on FormatException catch (e) {
        debugPrint('Error parsing user: $e');
        // If there's an error parsing, return null
        return null;
      }
    }
    return null;
  }

  Future<void> removeUser() async {
    await _preferences?.remove('user');
  }

  Future<void> clear() async {
    await _preferences?.clear();
  }
}
