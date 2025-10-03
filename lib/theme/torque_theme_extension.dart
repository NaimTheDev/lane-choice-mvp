import 'package:flutter/material.dart';

@immutable
class TorqueThemeExtension extends ThemeExtension<TorqueThemeExtension> {
  const TorqueThemeExtension({
    required this.racingGreen,
    required this.lightBeige,
    required this.rustyOrange,
    required this.cardBackground,
    required this.surfaceVariant,
  });

  final Color racingGreen; // #3A5F0B
  final Color lightBeige; // #F5F5DC
  final Color rustyOrange; // #B87333
  final Color cardBackground;
  final Color surfaceVariant;

  static const TorqueThemeExtension light = TorqueThemeExtension(
    racingGreen: Color(0xFF10B9B9), // Primary teal
    lightBeige: Color(0xFFF0F0F0), // Secondary light gray
    rustyOrange: Color(0xFF1DC4C4), // Accent teal
    cardBackground: Color(0xFFFAFAFA), // Card background
    surfaceVariant: Color(0xFFF5F5F5), // Muted background
  );

  static const TorqueThemeExtension dark = TorqueThemeExtension(
    racingGreen: Color(0xFF3BE1E1), // Primary bright cyan
    lightBeige: Color(0xFF1D2121), // Secondary dark gray
    rustyOrange: Color(0xFF27D4D4), // Accent vibrant cyan
    cardBackground: Color(0xFF131616), // Card dark background
    surfaceVariant: Color(0xFF1D2121), // Muted dark background
  );

  @override
  TorqueThemeExtension copyWith({
    Color? racingGreen,
    Color? lightBeige,
    Color? rustyOrange,
    Color? cardBackground,
    Color? surfaceVariant,
  }) {
    return TorqueThemeExtension(
      racingGreen: racingGreen ?? this.racingGreen,
      lightBeige: lightBeige ?? this.lightBeige,
      rustyOrange: rustyOrange ?? this.rustyOrange,
      cardBackground: cardBackground ?? this.cardBackground,
      surfaceVariant: surfaceVariant ?? this.surfaceVariant,
    );
  }

  @override
  TorqueThemeExtension lerp(
    ThemeExtension<TorqueThemeExtension>? other,
    double t,
  ) {
    if (other is! TorqueThemeExtension) {
      return this;
    }
    return TorqueThemeExtension(
      racingGreen: Color.lerp(racingGreen, other.racingGreen, t)!,
      lightBeige: Color.lerp(lightBeige, other.lightBeige, t)!,
      rustyOrange: Color.lerp(rustyOrange, other.rustyOrange, t)!,
      cardBackground: Color.lerp(cardBackground, other.cardBackground, t)!,
      surfaceVariant: Color.lerp(surfaceVariant, other.surfaceVariant, t)!,
    );
  }
}
