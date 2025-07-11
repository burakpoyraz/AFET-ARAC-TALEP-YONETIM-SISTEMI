import 'package:flutter/cupertino.dart';

/// Profile view
class ProfileView extends StatelessWidget {
  /// Creates a profile view
  const ProfileView({super.key});

  @override
  Widget build(BuildContext context) {
    return const CupertinoPageScaffold(
      navigationBar: CupertinoNavigationBar(
        middle: Text('Profil'),
      ),
      child: SafeArea(
        child: Center(
          child: Text('Profil bilgileri burada görüntülenecek'),
        ),
      ),
    );
  }
}
