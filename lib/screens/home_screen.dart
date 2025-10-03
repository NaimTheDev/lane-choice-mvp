import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../theme/torque_theme_extension.dart';
import '../providers/auth_providers.dart';

class HomeScreen extends ConsumerWidget {
  const HomeScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final torqueTheme = Theme.of(context).extension<TorqueThemeExtension>()!;
    final userAsync = ref.watch(firebaseUserStreamProvider);

    return Scaffold(
      backgroundColor: torqueTheme.lightBeige,
      appBar: AppBar(
        title: const Text(
          'Lane Choice',
          style: TextStyle(fontWeight: FontWeight.bold),
        ),
        backgroundColor: torqueTheme.racingGreen,
        foregroundColor: Colors.white,
        elevation: 0,
        actions: [
          PopupMenuButton<String>(
            icon: const Icon(Icons.more_vert),
            onSelected: (value) async {
              if (value == 'logout') {
                final authService = ref.read(authServiceProvider);
                await authService.signOut();
              }
            },
            itemBuilder: (context) => [
              const PopupMenuItem(
                value: 'logout',
                child: Row(
                  children: [
                    Icon(Icons.logout),
                    SizedBox(width: 8),
                    Text('Sign Out'),
                  ],
                ),
              ),
            ],
          ),
        ],
      ),
      body: userAsync.when(
        data: (user) => SingleChildScrollView(
          padding: const EdgeInsets.all(24.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              // Welcome Card
              Card(
                color: torqueTheme.cardBackground,
                elevation: 4,
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(16),
                ),
                child: Padding(
                  padding: const EdgeInsets.all(24.0),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Row(
                        children: [
                          CircleAvatar(
                            radius: 30,
                            backgroundColor: torqueTheme.racingGreen,
                            backgroundImage: user?.photoURL != null
                                ? NetworkImage(user!.photoURL!)
                                : null,
                            child: user?.photoURL == null
                                ? Icon(
                                    Icons.person,
                                    size: 30,
                                    color: Colors.white,
                                  )
                                : null,
                          ),
                          const SizedBox(width: 16),
                          Expanded(
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Text(
                                  'Welcome back!',
                                  style: Theme.of(context).textTheme.titleLarge
                                      ?.copyWith(
                                        color: torqueTheme.racingGreen,
                                        fontWeight: FontWeight.bold,
                                      ),
                                ),
                                const SizedBox(height: 4),
                                Text(
                                  user?.displayName ?? user?.email ?? 'User',
                                  style: Theme.of(context).textTheme.bodyLarge
                                      ?.copyWith(color: Colors.grey[600]),
                                ),
                              ],
                            ),
                          ),
                        ],
                      ),
                    ],
                  ),
                ),
              ),

              const SizedBox(height: 24),

              // Features Grid
              Text(
                'Features',
                style: Theme.of(context).textTheme.headlineSmall?.copyWith(
                  color: torqueTheme.racingGreen,
                  fontWeight: FontWeight.bold,
                ),
              ),

              const SizedBox(height: 16),

              GridView.count(
                shrinkWrap: true,
                physics: const NeverScrollableScrollPhysics(),
                crossAxisCount: 2,
                crossAxisSpacing: 16,
                mainAxisSpacing: 16,
                children: [
                  _buildFeatureCard(
                    context,
                    torqueTheme,
                    'Lane Analysis',
                    Icons.analytics,
                    'Analyze traffic patterns',
                  ),
                  _buildFeatureCard(
                    context,
                    torqueTheme,
                    'Route Planning',
                    Icons.route,
                    'Plan optimal routes',
                  ),
                  _buildFeatureCard(
                    context,
                    torqueTheme,
                    'Traffic Updates',
                    Icons.traffic,
                    'Real-time traffic info',
                  ),
                  _buildFeatureCard(
                    context,
                    torqueTheme,
                    'Settings',
                    Icons.settings,
                    'App preferences',
                  ),
                ],
              ),

              const SizedBox(height: 24),

              // Quick Actions
              Text(
                'Quick Actions',
                style: Theme.of(context).textTheme.headlineSmall?.copyWith(
                  color: torqueTheme.racingGreen,
                  fontWeight: FontWeight.bold,
                ),
              ),

              const SizedBox(height: 16),

              Card(
                color: torqueTheme.cardBackground,
                elevation: 4,
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(16),
                ),
                child: Column(
                  children: [
                    ListTile(
                      leading: Icon(
                        Icons.directions_car,
                        color: torqueTheme.racingGreen,
                      ),
                      title: const Text('Start Navigation'),
                      subtitle: const Text('Begin your journey'),
                      trailing: Icon(
                        Icons.arrow_forward_ios,
                        color: torqueTheme.racingGreen,
                      ),
                      onTap: () {
                        ScaffoldMessenger.of(context).showSnackBar(
                          const SnackBar(
                            content: Text('Navigation feature coming soon!'),
                          ),
                        );
                      },
                    ),
                    Divider(color: Colors.grey[300]),
                    ListTile(
                      leading: Icon(
                        Icons.history,
                        color: torqueTheme.racingGreen,
                      ),
                      title: const Text('Trip History'),
                      subtitle: const Text('View past journeys'),
                      trailing: Icon(
                        Icons.arrow_forward_ios,
                        color: torqueTheme.racingGreen,
                      ),
                      onTap: () {
                        ScaffoldMessenger.of(context).showSnackBar(
                          const SnackBar(
                            content: Text('Trip history feature coming soon!'),
                          ),
                        );
                      },
                    ),
                  ],
                ),
              ),
            ],
          ),
        ),
        loading: () => const Center(child: CircularProgressIndicator()),
        error: (error, stack) => Center(child: Text('Error: $error')),
      ),
    );
  }

  Widget _buildFeatureCard(
    BuildContext context,
    TorqueThemeExtension torqueTheme,
    String title,
    IconData icon,
    String subtitle,
  ) {
    return Card(
      color: torqueTheme.cardBackground,
      elevation: 4,
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
      child: InkWell(
        borderRadius: BorderRadius.circular(16),
        onTap: () {
          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(content: Text('$title feature coming soon!')),
          );
        },
        child: Padding(
          padding: const EdgeInsets.all(16.0),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Icon(icon, size: 40, color: torqueTheme.racingGreen),
              const SizedBox(height: 12),
              Text(
                title,
                style: Theme.of(context).textTheme.titleMedium?.copyWith(
                  color: torqueTheme.racingGreen,
                  fontWeight: FontWeight.bold,
                ),
                textAlign: TextAlign.center,
              ),
              const SizedBox(height: 4),
              Text(
                subtitle,
                style: Theme.of(
                  context,
                ).textTheme.bodySmall?.copyWith(color: Colors.grey[600]),
                textAlign: TextAlign.center,
              ),
            ],
          ),
        ),
      ),
    );
  }
}
