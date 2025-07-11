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

  Future<void> setUser(String user) async {
    await _preferences?.setString('user', user);
  }

  String? getUser() {
    return _preferences?.getString('user');
  }

  Future<void> removeUser() async {
    await _preferences?.remove('user');
  }

  Future<void> clear() async {
    await _preferences?.clear();
  }
}
