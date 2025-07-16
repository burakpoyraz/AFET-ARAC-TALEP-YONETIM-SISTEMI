import 'package:afet_arac_takip/features/auth/viewmodel/register_viewmodel.dart';
import 'package:afet_arac_takip/product/widgets/custom_button.dart';
import 'package:afet_arac_takip/product/widgets/custom_text_field.dart';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

/// Register view
class RegisterView extends StatefulWidget {
  /// Creates a register view
  const RegisterView({super.key});

  @override
  State<RegisterView> createState() => _RegisterViewState();
}

class _RegisterViewState extends State<RegisterView> {
  late final TextEditingController _adController;
  late final TextEditingController _soyadController;
  late final TextEditingController _emailController;
  late final TextEditingController _phoneController;
  late final TextEditingController _passwordController;
  late final TextEditingController _passwordConfirmController;

  @override
  void initState() {
    super.initState();
    _adController = TextEditingController();
    _soyadController = TextEditingController();
    _emailController = TextEditingController();
    _phoneController = TextEditingController();
    _passwordController = TextEditingController();
    _passwordConfirmController = TextEditingController();
  }

  @override
  void dispose() {
    _adController.dispose();
    _soyadController.dispose();
    _emailController.dispose();
    _phoneController.dispose();
    _passwordController.dispose();
    _passwordConfirmController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return ChangeNotifierProvider(
      create: (_) => RegisterViewModel(),
      child: Scaffold(
        appBar: AppBar(title: const Text('Hesap Oluştur')),
        body: SafeArea(
          child: SingleChildScrollView(
            padding: const EdgeInsets.all(24),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  'Kişisel Bilgiler',
                  style: Theme.of(
                    context,
                  ).textTheme.titleLarge?.copyWith(fontWeight: FontWeight.bold),
                ),
                const SizedBox(height: 24),
                CustomTextField(
                  controller: _adController,
                  labelText: 'Ad',
                  hintText: 'Adınızı girin',
                ),
                const SizedBox(height: 16),
                CustomTextField(
                  controller: _soyadController,
                  labelText: 'Soyad',
                  hintText: 'Soyadınızı girin',
                ),
                const SizedBox(height: 16),
                CustomTextField(
                  controller: _emailController,
                  labelText: 'E-posta',
                  hintText: 'E-posta adresinizi girin',
                  keyboardType: TextInputType.emailAddress,
                ),
                const SizedBox(height: 16),
                CustomTextField(
                  controller: _phoneController,
                  labelText: 'Telefon',
                  hintText: 'Telefon numaranızı girin',
                  keyboardType: TextInputType.phone,
                ),
                const SizedBox(height: 32),
                Text(
                  'Güvenlik',
                  style: Theme.of(
                    context,
                  ).textTheme.titleLarge?.copyWith(fontWeight: FontWeight.bold),
                ),
                const SizedBox(height: 24),
                CustomTextField(
                  controller: _passwordController,
                  labelText: 'Şifre',
                  hintText: 'Şifrenizi girin',
                  obscureText: true,
                ),
                const SizedBox(height: 16),
                CustomTextField(
                  controller: _passwordConfirmController,
                  labelText: 'Şifre Tekrar',
                  hintText: 'Şifrenizi tekrar girin',
                  obscureText: true,
                ),
                const SizedBox(height: 32),
                Consumer<RegisterViewModel>(
                  builder: (context, viewModel, _) {
                    if (viewModel.errorMessage != null) {
                      WidgetsBinding.instance.addPostFrameCallback((_) {
                        ScaffoldMessenger.of(context).showSnackBar(
                          SnackBar(
                            content: Text(viewModel.errorMessage!),
                            backgroundColor:
                                Theme.of(context).colorScheme.error,
                          ),
                        );
                      });
                    }
                    return CustomButton(
                      onPressed: viewModel.isLoading
                          ? null
                          : () => viewModel.register(
                                ad: _adController.text.trim(),
                                soyad: _soyadController.text.trim(),
                                email: _emailController.text.trim(),
                                phone: _phoneController.text.trim(),
                                password: _passwordController.text,
                                passwordConfirm:
                                    _passwordConfirmController.text,
                              ),
                      text: 'Hesap Oluştur',
                      isLoading: viewModel.isLoading,
                    );
                  },
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
