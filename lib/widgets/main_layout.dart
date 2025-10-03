import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../screens/feed_screen.dart';
import '../screens/groups_screen.dart';
import '../screens/speed_dating_screen.dart';
import '../screens/vote_screen.dart';
import '../screens/profile_screen.dart';
import '../theme/torque_theme_extension.dart';

class MainLayout extends ConsumerStatefulWidget {
  const MainLayout({super.key});

  @override
  ConsumerState<MainLayout> createState() => _MainLayoutState();
}

class _MainLayoutState extends ConsumerState<MainLayout> {
  int _currentIndex = 0;

  final List<Widget> _screens = [
    const FeedScreen(),
    const GroupsScreen(),
    const SpeedDatingScreen(),
    const VoteScreen(),
    const ProfileScreen(),
  ];

  final List<BottomNavigationBarItem> _navItems = [
    const BottomNavigationBarItem(icon: Icon(Icons.home), label: 'Feed'),
    const BottomNavigationBarItem(icon: Icon(Icons.groups), label: 'Groups'),
    const BottomNavigationBarItem(icon: Icon(Icons.favorite), label: 'Dating'),
    const BottomNavigationBarItem(icon: Icon(Icons.how_to_vote), label: 'Vote'),
    const BottomNavigationBarItem(icon: Icon(Icons.person), label: 'Profile'),
  ];

  @override
  Widget build(BuildContext context) {
    final torqueTheme = Theme.of(context).extension<TorqueThemeExtension>()!;

    return Scaffold(
      body: IndexedStack(index: _currentIndex, children: _screens),
      bottomNavigationBar: BottomNavigationBar(
        currentIndex: _currentIndex,
        onTap: (index) {
          setState(() {
            _currentIndex = index;
          });
        },
        type: BottomNavigationBarType.fixed,
        backgroundColor: torqueTheme.cardBackground,
        selectedItemColor: torqueTheme.racingGreen,
        unselectedItemColor: Colors.grey[600],
        selectedLabelStyle: const TextStyle(
          fontSize: 12,
          fontWeight: FontWeight.w600,
        ),
        unselectedLabelStyle: const TextStyle(
          fontSize: 12,
          fontWeight: FontWeight.w500,
        ),
        items: _navItems,
      ),
    );
  }
}
