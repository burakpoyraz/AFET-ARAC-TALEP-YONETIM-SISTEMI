import 'package:afet_arac_takip/features/auth/viewmodel/login_viewmodel.dart';
import 'package:afet_arac_takip/product/widgets/custom_button.dart';
import 'package:afet_arac_takip/product/widgets/custom_text_field.dart';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

/// Login view
class LoginView extends StatefulWidget {
  /// Creates a login view
  const LoginView({super.key});

  @override
  State<LoginView> createState() => _LoginViewState();
}

class _LoginViewState extends State<LoginView> {
  late final TextEditingController _emailController;
  late final TextEditingController _passwordController;

  @override
  void initState() {
    super.initState();
    debugPrint('Initializing LoginView');
    _emailController = TextEditingController();
    _passwordController = TextEditingController();
  }

  @override
  void dispose() {
    _emailController.dispose();
    _passwordController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    debugPrint('Building LoginView');
    return ChangeNotifierProvider(
      create: (_) => LoginViewModel(),
      child: Scaffold(
        backgroundColor: Colors.white,
        body: SafeArea(
          child: Padding(
            padding: const EdgeInsets.all(24),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Spacer(),
                Text(
                  'Hoş Geldiniz',
                  style: Theme.of(context).textTheme.headlineMedium?.copyWith(
                        color: Colors.black,
                        fontWeight: FontWeight.bold,
                      ),
                ),
                const SizedBox(height: 8),
                Text(
                  'Afet Araç Takip Sistemine giriş yapın',
                  style: Theme.of(context).textTheme.bodyLarge?.copyWith(
                        color: Colors.black.withValues(alpha: 0.7),
                      ),
                ),
                const SizedBox(height: 32),
                CustomTextField(
                  controller: _emailController,
                  labelText: 'E-posta',
                  hintText: 'E-posta adresinizi girin',
                  keyboardType: TextInputType.emailAddress,
                ),
                const SizedBox(height: 16),
                CustomTextField(
                  controller: _passwordController,
                  labelText: 'Şifre',
                  hintText: 'Şifrenizi girin',
                  obscureText: true,
                ),
                const SizedBox(height: 8),
                Consumer<LoginViewModel>(
                  builder: (context, viewModel, _) {
                    if (viewModel.errorMessage != null) {
                      return Padding(
                        padding: const EdgeInsets.only(top: 8),
                        child: Text(
                          viewModel.errorMessage!,
                          style: TextStyle(
                            color: Theme.of(context).colorScheme.error,
                            fontSize: 14,
                          ),
                        ),
                      );
                    }
                    return const SizedBox(height: 8);
                  },
                ),
                const SizedBox(height: 16),
                Consumer<LoginViewModel>(
                  builder: (context, viewModel, _) {
                    return CustomButton(
                      onPressed: viewModel.isLoading
                          ? null
                          : () {
                              debugPrint('Login button pressed');
                              viewModel.login(
                                email: _emailController.text.trim(),
                                password: _passwordController.text,
                              );
                            },
                      text: 'Giriş Yap',
                      isLoading: viewModel.isLoading,
                    );
                  },
                ),
                const SizedBox(height: 16),
                CustomButton(
                  onPressed: () {
                    debugPrint('Register button pressed');
                    Navigator.pushNamed(context, '/register');
                  },
                  text: 'Hesap Oluştur',
                  isSecondary: true,
                ),
                const Spacer(),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
