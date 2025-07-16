import 'package:afet_arac_takip/core/init/navigation/navigation_service.dart';
import 'package:afet_arac_takip/product/cache/local_storage.dart';
import 'package:flutter/material.dart';

/// Pending approval view for users waiting for account approval
class PendingApprovalView extends StatelessWidget {
  /// Creates a pending approval view
  const PendingApprovalView({super.key});

  @override
  Widget build(BuildContext context) {
    final user = LocalStorage.instance.getUser();

    return Scaffold(
      backgroundColor: Colors.white,
      body: SafeArea(
        child: Padding(
          padding: const EdgeInsets.all(24),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Icon(
                Icons.hourglass_empty,
                size: 80,
                color: Colors.orange.shade400,
              ),
              const SizedBox(height: 24),
              Text(
                'Hesabınız onay bekliyor',
                style: Theme.of(context).textTheme.headlineSmall?.copyWith(
                      fontWeight: FontWeight.bold,
                      color: Colors.grey.shade800,
                    ),
                textAlign: TextAlign.center,
              ),
              const SizedBox(height: 16),
              Text(
                'Merhaba ${user?.fullName ?? ""},\n\nHesabınız yönetici onayı bekliyor. Onaylandıktan sonra sisteme giriş yapabileceksiniz.',
                style: Theme.of(context).textTheme.bodyLarge?.copyWith(
                      color: Colors.grey.shade600,
                    ),
                textAlign: TextAlign.center,
              ),
              const SizedBox(height: 8),
              Text(
                'Lütfen yönetici ile iletişime geçin.',
                style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                      color: Colors.grey.shade500,
                      fontStyle: FontStyle.italic,
                    ),
                textAlign: TextAlign.center,
              ),
              const SizedBox(height: 48),
              SizedBox(
                width: double.infinity,
                child: ElevatedButton(
                  onPressed: () async {
                    await LocalStorage.instance.clear();
                    await NavigationService.instance.navigateToPageClear(
                      path: '/login',
                    );
                  },
                  style: ElevatedButton.styleFrom(
                    backgroundColor: Colors.red.shade400,
                    padding: const EdgeInsets.symmetric(vertical: 16),
                  ),
                  child: const Text(
                    'Çıkış Yap',
                    style: TextStyle(
                      fontSize: 16,
                      fontWeight: FontWeight.w600,
                    ),
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
