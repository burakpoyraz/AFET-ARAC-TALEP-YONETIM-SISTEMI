import 'package:flutter/cupertino.dart';

/// Requests view
class RequestsView extends StatelessWidget {
  /// Creates a requests view
  const RequestsView({super.key});

  @override
  Widget build(BuildContext context) {
    return const CupertinoPageScaffold(
      navigationBar: CupertinoNavigationBar(
        middle: Text('Talepler'),
      ),
      child: SafeArea(
        child: Center(
          child: Text('Talep listesi burada görüntülenecek'),
        ),
      ),
    );
  }
}
