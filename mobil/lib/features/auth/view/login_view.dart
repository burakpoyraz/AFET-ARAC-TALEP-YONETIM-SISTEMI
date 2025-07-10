import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import '../../../product/widgets/custom_button.dart';
import '../../../product/widgets/custom_text_field.dart';
import '../viewmodel/login_viewmodel.dart';

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
    return ChangeNotifierProvider(
      create: (_) => LoginViewModel(),
      child: Scaffold(
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
                        fontWeight: FontWeight.bold,
                      ),
                ),
                const SizedBox(height: 8),
                Text(
                  'Afet Araç Takip Sistemine giriş yapın',
                  style: Theme.of(context).textTheme.bodyLarge?.copyWith(
                        color: Theme.of(
                          context,
                        ).colorScheme.onBackground.withOpacity(0.7),
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
                const SizedBox(height: 24),
                Consumer<LoginViewModel>(
                  builder: (context, viewModel, _) {
                    return CustomButton(
                      onPressed: () => viewModel.login(
                        email: _emailController.text,
                        password: _passwordController.text,
                      ),
                      text: 'Giriş Yap',
                      isLoading: viewModel.isLoading,
                    );
                  },
                ),
                const SizedBox(height: 16),
                CustomButton(
                  onPressed: () => Navigator.pushNamed(context, '/register'),
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
