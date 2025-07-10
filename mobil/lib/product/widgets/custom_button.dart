import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';

/// Custom button widget that follows Apple's Human Interface Guidelines
class CustomButton extends StatelessWidget {
  /// Creates a custom button widget
  const CustomButton({
    required this.onPressed,
    required this.text,
    this.isLoading = false,
    this.isSecondary = false,
    this.isDestructive = false,
    this.width,
    super.key,
  });

  /// Called when the button is tapped
  final VoidCallback onPressed;

  /// Text to display on the button
  final String text;

  /// Whether to show a loading indicator
  final bool isLoading;

  /// Whether this is a secondary button
  final bool isSecondary;

  /// Whether this is a destructive button
  final bool isDestructive;

  /// Optional width for the button
  final double? width;

  @override
  Widget build(BuildContext context) {
    final colorScheme = Theme.of(context).colorScheme;

    return SizedBox(
      width: width ?? double.infinity,
      child: CupertinoButton(
        padding: const EdgeInsets.symmetric(vertical: 16, horizontal: 24),
        color: isSecondary
            ? Colors.transparent
            : isDestructive
                ? colorScheme.error
                : colorScheme.primary,
        borderRadius: BorderRadius.circular(12),
        onPressed: isLoading ? null : onPressed,
        child: isLoading
            ? const CupertinoActivityIndicator(color: CupertinoColors.white)
            : Text(
                text,
                style: TextStyle(
                  color: isSecondary
                      ? colorScheme.primary
                      : isDestructive
                          ? CupertinoColors.white
                          : colorScheme.onPrimary,
                  fontSize: 16,
                  fontWeight: FontWeight.w600,
                ),
              ),
      ),
    );
  }
}
