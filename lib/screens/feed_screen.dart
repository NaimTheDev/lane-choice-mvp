import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:timeago/timeago.dart' as timeago;
import '../models/post.dart';
import '../services/mock_data_service.dart';
import '../theme/torque_theme_extension.dart';
import '../widgets/post_card.dart';
import '../providers/auth_providers.dart';

final postsProvider = FutureProvider<List<Post>>((ref) async {
  return MockDataService().getPosts();
});

class FeedScreen extends ConsumerWidget {
  const FeedScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final torqueTheme = Theme.of(context).extension<TorqueThemeExtension>()!;
    final userAsync = ref.watch(firebaseUserStreamProvider);
    final postsAsync = ref.watch(postsProvider);

    return Scaffold(
      backgroundColor: torqueTheme.lightBeige,
      appBar: AppBar(
        title: Row(
          children: [
            Icon(
              Icons.directions_car,
              color: torqueTheme.racingGreen,
              size: 28,
            ),
            const SizedBox(width: 8),
            const Text(
              'Lane Choice',
              style: TextStyle(fontWeight: FontWeight.bold, fontSize: 20),
            ),
          ],
        ),
        backgroundColor: torqueTheme.cardBackground,
        foregroundColor: torqueTheme.racingGreen,
        elevation: 0,
        actions: [
          IconButton(
            icon: const Icon(Icons.search),
            onPressed: () {
              ScaffoldMessenger.of(context).showSnackBar(
                const SnackBar(content: Text('Search feature coming soon!')),
              );
            },
          ),
          IconButton(
            icon: const Icon(Icons.notifications_outlined),
            onPressed: () {
              ScaffoldMessenger.of(context).showSnackBar(
                const SnackBar(
                  content: Text('Notifications feature coming soon!'),
                ),
              );
            },
          ),
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
      body: RefreshIndicator(
        onRefresh: () async {
          ref.invalidate(postsProvider);
        },
        child: CustomScrollView(
          slivers: [
            // Create Post Section
            SliverToBoxAdapter(
              child: userAsync.when(
                data: (user) => user != null
                    ? Container(
                        margin: const EdgeInsets.all(16),
                        child: Card(
                          color: torqueTheme.cardBackground,
                          elevation: 2,
                          shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(12),
                          ),
                          child: Padding(
                            padding: const EdgeInsets.all(16),
                            child: Row(
                              children: [
                                CircleAvatar(
                                  radius: 20,
                                  backgroundColor: torqueTheme.racingGreen,
                                  child: const Icon(
                                    Icons.person,
                                    color: Colors.white,
                                    size: 20,
                                  ),
                                ),
                                const SizedBox(width: 12),
                                Expanded(
                                  child: GestureDetector(
                                    onTap: () {
                                      ScaffoldMessenger.of(
                                        context,
                                      ).showSnackBar(
                                        const SnackBar(
                                          content: Text(
                                            'Create post feature coming soon!',
                                          ),
                                        ),
                                      );
                                    },
                                    child: Container(
                                      padding: const EdgeInsets.symmetric(
                                        horizontal: 16,
                                        vertical: 12,
                                      ),
                                      decoration: BoxDecoration(
                                        color: torqueTheme.surfaceVariant,
                                        borderRadius: BorderRadius.circular(24),
                                      ),
                                      child: Text(
                                        'What\'s on your mind?',
                                        style: TextStyle(
                                          color: Colors.grey[600],
                                          fontSize: 16,
                                        ),
                                      ),
                                    ),
                                  ),
                                ),
                                const SizedBox(width: 12),
                                IconButton(
                                  icon: Icon(
                                    Icons.camera_alt,
                                    color: torqueTheme.racingGreen,
                                  ),
                                  onPressed: () {
                                    ScaffoldMessenger.of(context).showSnackBar(
                                      const SnackBar(
                                        content: Text(
                                          'Photo upload coming soon!',
                                        ),
                                      ),
                                    );
                                  },
                                ),
                              ],
                            ),
                          ),
                        ),
                      )
                    : const SizedBox.shrink(),
                loading: () => const SizedBox.shrink(),
                error: (error, stack) => const SizedBox.shrink(),
              ),
            ),

            // Posts Feed
            SliverToBoxAdapter(
              child: Padding(
                padding: const EdgeInsets.symmetric(horizontal: 16),
                child: Row(
                  children: [
                    Text(
                      'Activity Feed',
                      style: Theme.of(context).textTheme.headlineSmall
                          ?.copyWith(
                            color: torqueTheme.racingGreen,
                            fontWeight: FontWeight.bold,
                          ),
                    ),
                    const Spacer(),
                    IconButton(
                      icon: Icon(Icons.refresh, color: torqueTheme.racingGreen),
                      onPressed: () {
                        ref.invalidate(postsProvider);
                      },
                    ),
                  ],
                ),
              ),
            ),

            postsAsync.when(
              data: (posts) => SliverList(
                delegate: SliverChildBuilderDelegate((context, index) {
                  final post = posts[index];
                  return Padding(
                    padding: const EdgeInsets.symmetric(
                      horizontal: 16,
                      vertical: 8,
                    ),
                    child: PostCard(post: post),
                  );
                }, childCount: posts.length),
              ),
              loading: () => SliverList(
                delegate: SliverChildBuilderDelegate(
                  (context, index) => Padding(
                    padding: const EdgeInsets.symmetric(
                      horizontal: 16,
                      vertical: 8,
                    ),
                    child: Card(
                      color: torqueTheme.cardBackground,
                      child: const Padding(
                        padding: EdgeInsets.all(16),
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Row(
                              children: [
                                CircleAvatar(radius: 20),
                                SizedBox(width: 12),
                                Column(
                                  crossAxisAlignment: CrossAxisAlignment.start,
                                  children: [
                                    SizedBox(
                                      width: 120,
                                      height: 16,
                                      child: LinearProgressIndicator(),
                                    ),
                                    SizedBox(height: 4),
                                    SizedBox(
                                      width: 80,
                                      height: 12,
                                      child: LinearProgressIndicator(),
                                    ),
                                  ],
                                ),
                              ],
                            ),
                            SizedBox(height: 16),
                            SizedBox(
                              width: double.infinity,
                              height: 16,
                              child: LinearProgressIndicator(),
                            ),
                            SizedBox(height: 8),
                            SizedBox(
                              width: 200,
                              height: 16,
                              child: LinearProgressIndicator(),
                            ),
                            SizedBox(height: 16),
                            SizedBox(
                              width: double.infinity,
                              height: 200,
                              child: LinearProgressIndicator(),
                            ),
                          ],
                        ),
                      ),
                    ),
                  ),
                  childCount: 3,
                ),
              ),
              error: (error, stack) => SliverToBoxAdapter(
                child: Center(
                  child: Padding(
                    padding: const EdgeInsets.all(32),
                    child: Column(
                      children: [
                        Icon(
                          Icons.error_outline,
                          size: 64,
                          color: Colors.red[400],
                        ),
                        const SizedBox(height: 16),
                        Text(
                          'Failed to load posts',
                          style: Theme.of(context).textTheme.titleLarge,
                        ),
                        const SizedBox(height: 8),
                        Text(
                          'Please check your connection and try again',
                          style: Theme.of(context).textTheme.bodyMedium
                              ?.copyWith(color: Colors.grey[600]),
                          textAlign: TextAlign.center,
                        ),
                        const SizedBox(height: 16),
                        ElevatedButton(
                          onPressed: () {
                            ref.invalidate(postsProvider);
                          },
                          style: ElevatedButton.styleFrom(
                            backgroundColor: torqueTheme.racingGreen,
                            foregroundColor: Colors.white,
                          ),
                          child: const Text('Retry'),
                        ),
                      ],
                    ),
                  ),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
