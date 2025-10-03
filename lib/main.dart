import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:firebase_core/firebase_core.dart';
import 'package:flutter/foundation.dart';
import 'theme/torque_theme_extension.dart';
import 'widgets/auth_wrapper.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();

  // Initialize Firebase with platform-specific options
  if (kIsWeb) {
    await Firebase.initializeApp(
      options: const FirebaseOptions(
        apiKey: "AIzaSyBumgFkL7A85i9fs_-ilQPNH1zOC_RFR2M",
        authDomain: "lane-choice-mvp-backend.firebaseapp.com",
        projectId: "lane-choice-mvp-backend",
        storageBucket: "lane-choice-mvp-backend.firebasestorage.app",
        messagingSenderId: "408050114631",
        appId: "1:408050114631:web:86b69c67bac767d5a09162",
      ),
    );
  } else {
    // For mobile platforms, Firebase will use the config files
    await Firebase.initializeApp();
  }

  runApp(const ProviderScope(child: MyApp()));
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Lane Choice',
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
        colorScheme: ColorScheme.fromSeed(
          seedColor: const Color(0xFF10B9B9),
          brightness: Brightness.light,
        ),
        useMaterial3: true,
        extensions: const [TorqueThemeExtension.light],
      ),
      darkTheme: ThemeData(
        colorScheme: ColorScheme.fromSeed(
          seedColor: const Color(0xFF3BE1E1),
          brightness: Brightness.dark,
        ),
        useMaterial3: true,
        extensions: const [TorqueThemeExtension.dark],
      ),
      themeMode: ThemeMode.system,
      home: const AuthWrapper(),
    );
  }
}
