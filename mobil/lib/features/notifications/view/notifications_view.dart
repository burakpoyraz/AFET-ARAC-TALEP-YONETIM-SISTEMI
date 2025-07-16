import 'package:flutter/cupertino.dart';

/// Notifications view
class NotificationsView extends StatelessWidget {
  /// Creates a notifications view
  const NotificationsView({super.key});

  @override
  Widget build(BuildContext context) {
    return const CupertinoPageScaffold(
      navigationBar: CupertinoNavigationBar(
        middle: Text('Bildirimler'),
      ),
      child: SafeArea(
        child: Center(
          child: Text('Bildirim listesi burada görüntülenecek'),
        ),
      ),
    );
  }
}
