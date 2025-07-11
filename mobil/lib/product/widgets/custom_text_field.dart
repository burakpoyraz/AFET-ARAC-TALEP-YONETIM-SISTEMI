import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';

/// Custom text field widget that follows Apple's Human Interface Guidelines
class CustomTextField extends StatelessWidget {
  /// Creates a custom text field widget
  const CustomTextField({
    required this.controller,
    required this.labelText,
    this.hintText,
    this.keyboardType,
    this.obscureText = false,
    this.validator,
    this.onChanged,
    this.prefixIcon,
    this.suffixIcon,
    this.maxLines = 1,
    this.readOnly = false,
    this.onTap,
    super.key,
  });

  /// Text editing controller
  final TextEditingController controller;

  /// Label text for the field
  final String labelText;

  /// Hint text for the field
  final String? hintText;

  /// Keyboard type for the field
  final TextInputType? keyboardType;

  /// Whether to obscure the text
  final bool obscureText;

  /// Validator function
  final String? Function(String?)? validator;

  /// Called when the text changes
  final void Function(String)? onChanged;

  /// Prefix icon
  final Widget? prefixIcon;

  /// Suffix icon
  final Widget? suffixIcon;

  /// Maximum number of lines
  final int maxLines;

  /// Whether the field is read only
  final bool readOnly;

  /// Called when the field is tapped
  final VoidCallback? onTap;

  @override
  Widget build(BuildContext context) {
    final colorScheme = Theme.of(context).colorScheme;

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        if (labelText.isNotEmpty) ...[
          Text(
            labelText,
            style: TextStyle(
              color: colorScheme.onSurface,
              fontSize: 14,
              fontWeight: FontWeight.w500,
            ),
          ),
          const SizedBox(height: 8),
        ],
        CupertinoTextField(
          controller: controller,
          placeholder: hintText,
          keyboardType: keyboardType,
          obscureText: obscureText,
          onChanged: onChanged,
          prefix: prefixIcon != null
              ? Padding(
                  padding: const EdgeInsets.only(left: 12),
                  child: prefixIcon,
                )
              : null,
          suffix: suffixIcon != null
              ? Padding(
                  padding: const EdgeInsets.only(right: 12),
                  child: suffixIcon,
                )
              : null,
          maxLines: maxLines,
          readOnly: readOnly,
          onTap: onTap,
          padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
          decoration: BoxDecoration(
            color: colorScheme.surface,
            borderRadius: BorderRadius.circular(12),
            border:
                Border.all(color: colorScheme.outline.withValues(alpha: 0.5)),
          ),
          style: TextStyle(color: colorScheme.onSurface, fontSize: 16),
          placeholderStyle: TextStyle(
            color: colorScheme.onSurface.withValues(alpha: 0.5),
            fontSize: 16,
          ),
        ),
      ],
    );
  }
}
