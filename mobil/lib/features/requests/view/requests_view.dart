import 'package:afet_arac_takip/features/requests/view/koordinator_requests_view.dart';
import 'package:afet_arac_takip/features/requests/view/talep_eden_requests_view.dart';
import 'package:afet_arac_takip/product/cache/local_storage.dart';
import 'package:flutter/material.dart';

/// Requests view that shows different content based on user role
class RequestsView extends StatelessWidget {
  /// Creates a requests view
  const RequestsView({super.key});

  @override
  Widget build(BuildContext context) {
    final user = LocalStorage.instance.getUser();

    if (user == null) {
      return const Scaffold(
        body: Center(
          child: Text('Kullanıcı bilgisi bulunamadı'),
        ),
      );
    }

    // Show different views based on user role
    if (user.isKoordinator) {
      return const KoordinatorRequestsView();
    } else if (user.isTalepEden) {
      return const TalepEdenRequestsView();
    } else {
      // For arac_sahibi or other roles, show a message
      return Scaffold(
        appBar: AppBar(
          title: const Text('Talepler'),
        ),
        body: const Center(
          child: Text('Bu rol için talep görünümü mevcut değil'),
        ),
      );
    }
  }
}
