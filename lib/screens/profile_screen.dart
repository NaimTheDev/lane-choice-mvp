import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../widgets/adaptive_image.dart';
import '../models/app_user.dart';
import '../models/post.dart';
import '../services/mock_data_service.dart';
import '../theme/torque_theme_extension.dart';
import '../providers/auth_providers.dart';
import '../widgets/post_card.dart';

final currentUserProvider = FutureProvider<AppUser?>((ref) async {
  // In a real app, this would fetch the current user's profile
  final users = await MockDataService().getUsers();
  return users.isNotEmpty ? users.first : null;
});

final userPostsProvider = FutureProvider<List<Post>>((ref) async {
  final posts = await MockDataService().getPosts();
  final currentUser = await ref.watch(currentUserProvider.future);
  if (currentUser != null) {
    return posts.where((post) => post.author.uid == currentUser.uid).toList();
  }
  return [];
});

class ProfileScreen extends ConsumerStatefulWidget {
  const ProfileScreen({super.key});

  @override
  ConsumerState<ProfileScreen> createState() => _ProfileScreenState();
}

class _ProfileScreenState extends ConsumerState<ProfileScreen>
    with SingleTickerProviderStateMixin {
  late TabController _tabController;

  @override
  void initState() {
    super.initState();
    _tabController = TabController(length: 3, vsync: this);
  }

  @override
  void dispose() {
    _tabController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final torqueTheme = Theme.of(context).extension<TorqueThemeExtension>()!;
    final userAsync = ref.watch(currentUserProvider);
    final postsAsync = ref.watch(userPostsProvider);

    return Scaffold(
      backgroundColor: torqueTheme.lightBeige,
      body: userAsync.when(
        data: (user) => user != null
            ? CustomScrollView(
                slivers: [
                  // App bar with cover photo
                  SliverAppBar(
                    expandedHeight: 200,
                    pinned: true,
                    backgroundColor: torqueTheme.cardBackground,
                    foregroundColor: torqueTheme.racingGreen,
                    flexibleSpace: FlexibleSpaceBar(
                      background: user.coverUrl != null
                          ? AdaptiveImage(
                              imageUrl: user.coverUrl!,
                              fit: BoxFit.cover,
                              placeholder: (context, url) =>
                                  Container(color: torqueTheme.surfaceVariant),
                              errorWidget: (context, url, error) => Container(
                                color: torqueTheme.surfaceVariant,
                                child: const Icon(Icons.error),
                              ),
                            )
                          : Container(
                              color: torqueTheme.surfaceVariant,
                              child: const Center(
                                child: Icon(
                                  Icons.directions_car,
                                  size: 80,
                                  color: Colors.grey,
                                ),
                              ),
                            ),
                    ),
                    actions: [
                      PopupMenuButton<String>(
                        icon: const Icon(Icons.more_vert),
                        onSelected: (value) async {
                          switch (value) {
                            case 'edit':
                              ScaffoldMessenger.of(context).showSnackBar(
                                const SnackBar(
                                  content: Text(
                                    'Edit profile feature coming soon!',
                                  ),
                                ),
                              );
                              break;
                            case 'settings':
                              ScaffoldMessenger.of(context).showSnackBar(
                                const SnackBar(
                                  content: Text(
                                    'Settings feature coming soon!',
                                  ),
                                ),
                              );
                              break;
                            case 'logout':
                              final authService = ref.read(authServiceProvider);
                              await authService.signOut();
                              break;
                          }
                        },
                        itemBuilder: (context) => [
                          const PopupMenuItem(
                            value: 'edit',
                            child: Row(
                              children: [
                                Icon(Icons.edit),
                                SizedBox(width: 8),
                                Text('Edit Profile'),
                              ],
                            ),
                          ),
                          const PopupMenuItem(
                            value: 'settings',
                            child: Row(
                              children: [
                                Icon(Icons.settings),
                                SizedBox(width: 8),
                                Text('Settings'),
                              ],
                            ),
                          ),
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

                  // Profile info
                  SliverToBoxAdapter(
                    child: Container(
                      color: torqueTheme.cardBackground,
                      child: Column(
                        children: [
                          // Profile picture and basic info
                          Padding(
                            padding: const EdgeInsets.all(16),
                            child: Column(
                              children: [
                                // Profile picture (overlapping the cover)
                                Transform.translate(
                                  offset: const Offset(0, -40),
                                  child: CircleAvatar(
                                    radius: 50,
                                    backgroundColor: torqueTheme.cardBackground,
                                    child: CircleAvatar(
                                      radius: 46,
                                      backgroundColor: torqueTheme.racingGreen,
                                      child: user.imageUrl != null
                                          ? ClipOval(
                                              child: AdaptiveImage(
                                                imageUrl: user.imageUrl!,
                                                width: 92,
                                                height: 92,
                                                fit: BoxFit.cover,
                                                placeholder: (context, url) =>
                                                    Container(
                                                      color: torqueTheme
                                                          .racingGreen,
                                                      child: Text(
                                                        user.name
                                                                ?.substring(
                                                                  0,
                                                                  1,
                                                                )
                                                                .toUpperCase() ??
                                                            'U',
                                                        style: const TextStyle(
                                                          color: Colors.white,
                                                          fontSize: 32,
                                                          fontWeight:
                                                              FontWeight.bold,
                                                        ),
                                                      ),
                                                    ),
                                                errorWidget:
                                                    (
                                                      context,
                                                      url,
                                                      error,
                                                    ) => Container(
                                                      color: torqueTheme
                                                          .racingGreen,
                                                      child: Text(
                                                        user.name
                                                                ?.substring(
                                                                  0,
                                                                  1,
                                                                )
                                                                .toUpperCase() ??
                                                            'U',
                                                        style: const TextStyle(
                                                          color: Colors.white,
                                                          fontSize: 32,
                                                          fontWeight:
                                                              FontWeight.bold,
                                                        ),
                                                      ),
                                                    ),
                                              ),
                                            )
                                          : Text(
                                              user.name
                                                      ?.substring(0, 1)
                                                      .toUpperCase() ??
                                                  'U',
                                              style: const TextStyle(
                                                color: Colors.white,
                                                fontSize: 32,
                                                fontWeight: FontWeight.bold,
                                              ),
                                            ),
                                    ),
                                  ),
                                ),

                                // Name and handle
                                Transform.translate(
                                  offset: const Offset(0, -20),
                                  child: Column(
                                    children: [
                                      Row(
                                        mainAxisAlignment:
                                            MainAxisAlignment.center,
                                        children: [
                                          Text(
                                            user.name ?? 'Unknown User',
                                            style: Theme.of(context)
                                                .textTheme
                                                .headlineSmall
                                                ?.copyWith(
                                                  fontWeight: FontWeight.bold,
                                                  color:
                                                      torqueTheme.racingGreen,
                                                ),
                                          ),
                                          if (user.isVerified) ...[
                                            const SizedBox(width: 8),
                                            Icon(
                                              Icons.verified,
                                              color: torqueTheme.racingGreen,
                                              size: 20,
                                            ),
                                          ],
                                        ],
                                      ),
                                      const SizedBox(height: 4),
                                      Text(
                                        '@${user.handle ?? 'unknown'}',
                                        style: TextStyle(
                                          color: Colors.grey[600],
                                          fontSize: 16,
                                        ),
                                      ),
                                    ],
                                  ),
                                ),

                                // Bio
                                if (user.bio != null) ...[
                                  const SizedBox(height: 8),
                                  Text(
                                    user.bio!,
                                    textAlign: TextAlign.center,
                                    style: const TextStyle(fontSize: 16),
                                  ),
                                ],

                                const SizedBox(height: 16),

                                // Car and location info
                                Row(
                                  mainAxisAlignment: MainAxisAlignment.center,
                                  children: [
                                    if (user.raceCarName != null) ...[
                                      Icon(
                                        Icons.directions_car,
                                        size: 16,
                                        color: Colors.grey[600],
                                      ),
                                      const SizedBox(width: 4),
                                      Text(
                                        user.raceCarName!,
                                        style: TextStyle(
                                          color: Colors.grey[600],
                                          fontSize: 14,
                                        ),
                                      ),
                                    ],
                                    if (user.raceCarName != null &&
                                        user.location != null) ...[
                                      const SizedBox(width: 16),
                                      Text(
                                        '•',
                                        style: TextStyle(
                                          color: Colors.grey[600],
                                        ),
                                      ),
                                      const SizedBox(width: 16),
                                    ],
                                    if (user.location != null) ...[
                                      Icon(
                                        Icons.location_on,
                                        size: 16,
                                        color: Colors.grey[600],
                                      ),
                                      const SizedBox(width: 4),
                                      Text(
                                        user.location!,
                                        style: TextStyle(
                                          color: Colors.grey[600],
                                          fontSize: 14,
                                        ),
                                      ),
                                    ],
                                  ],
                                ),

                                const SizedBox(height: 16),

                                // Stats
                                Row(
                                  mainAxisAlignment:
                                      MainAxisAlignment.spaceEvenly,
                                  children: [
                                    _buildStatColumn(
                                      context,
                                      'Posts',
                                      postsAsync.value?.length.toString() ??
                                          '0',
                                    ),
                                    _buildStatColumn(
                                      context,
                                      'Followers',
                                      _formatNumber(user.followerCount),
                                    ),
                                    _buildStatColumn(
                                      context,
                                      'Following',
                                      _formatNumber(user.followingCount),
                                    ),
                                  ],
                                ),

                                const SizedBox(height: 16),

                                // Race types
                                if (user.raceTypes.isNotEmpty) ...[
                                  Wrap(
                                    spacing: 8,
                                    runSpacing: 4,
                                    children: user.raceTypes.map((type) {
                                      String displayName;
                                      switch (type) {
                                        case RaceType.eighthMile:
                                          displayName = '1/8 Mile';
                                          break;
                                        case RaceType.quarterMile:
                                          displayName = '1/4 Mile';
                                          break;
                                        case RaceType.rollRace:
                                          displayName = 'Roll Race';
                                          break;
                                        case RaceType.drift:
                                          displayName = 'Drift';
                                          break;
                                      }
                                      return Chip(
                                        label: Text(
                                          displayName,
                                          style: const TextStyle(fontSize: 12),
                                        ),
                                        backgroundColor: torqueTheme.racingGreen
                                            .withOpacity(0.1),
                                        side: BorderSide(
                                          color: torqueTheme.racingGreen
                                              .withOpacity(0.3),
                                        ),
                                      );
                                    }).toList(),
                                  ),
                                  const SizedBox(height: 16),
                                ],
                              ],
                            ),
                          ),
                        ],
                      ),
                    ),
                  ),

                  // Tabs section
                  SliverPersistentHeader(
                    pinned: true,
                    delegate: _TabBarDelegate(
                      torqueTheme: torqueTheme,
                      tabController: _tabController,
                    ),
                  ),

                  // Tab content
                  SliverToBoxAdapter(
                    child: SizedBox(
                      height: MediaQuery.of(context).size.height * 0.6,
                      child: TabBarView(
                        controller: _tabController,
                        children: [
                          // Posts tab
                          postsAsync.when(
                            data: (posts) => posts.isNotEmpty
                                ? ListView.builder(
                                    padding: const EdgeInsets.symmetric(
                                      horizontal: 16,
                                    ),
                                    itemCount: posts.length,
                                    itemBuilder: (context, index) {
                                      final post = posts[index];
                                      return Padding(
                                        padding: const EdgeInsets.symmetric(
                                          vertical: 8,
                                        ),
                                        child: PostCard(post: post),
                                      );
                                    },
                                  )
                                : const Center(
                                    child: Column(
                                      mainAxisAlignment:
                                          MainAxisAlignment.center,
                                      children: [
                                        Icon(
                                          Icons.post_add,
                                          size: 64,
                                          color: Colors.grey,
                                        ),
                                        SizedBox(height: 16),
                                        Text(
                                          'No posts yet',
                                          style: TextStyle(
                                            fontSize: 18,
                                            color: Colors.grey,
                                          ),
                                        ),
                                        SizedBox(height: 8),
                                        Text(
                                          'Share your first car photo!',
                                          style: TextStyle(color: Colors.grey),
                                        ),
                                      ],
                                    ),
                                  ),
                            loading: () => const Center(
                              child: CircularProgressIndicator(),
                            ),
                            error: (error, stack) => const Center(
                              child: Text('Failed to load posts'),
                            ),
                          ),

                          // Garage tab
                          SingleChildScrollView(
                            padding: const EdgeInsets.all(16),
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                if (user.raceCarName != null) ...[
                                  Text(
                                    user.raceCarName!,
                                    style: Theme.of(context)
                                        .textTheme
                                        .titleLarge
                                        ?.copyWith(
                                          fontWeight: FontWeight.bold,
                                          color: torqueTheme.racingGreen,
                                        ),
                                  ),
                                  const SizedBox(height: 16),
                                ],

                                if (user.garagePhotos.isNotEmpty) ...[
                                  GridView.builder(
                                    shrinkWrap: true,
                                    physics:
                                        const NeverScrollableScrollPhysics(),
                                    gridDelegate:
                                        const SliverGridDelegateWithFixedCrossAxisCount(
                                          crossAxisCount: 2,
                                          crossAxisSpacing: 8,
                                          mainAxisSpacing: 8,
                                        ),
                                    itemCount: user.garagePhotos.length,
                                    itemBuilder: (context, index) {
                                      return ClipRRect(
                                        borderRadius: BorderRadius.circular(8),
                                        child: AdaptiveImage(
                                          imageUrl: user.garagePhotos[index],
                                          fit: BoxFit.cover,
                                          placeholder: (context, url) =>
                                              Container(
                                                color:
                                                    torqueTheme.surfaceVariant,
                                                child: const Center(
                                                  child:
                                                      CircularProgressIndicator(),
                                                ),
                                              ),
                                          errorWidget: (context, url, error) =>
                                              Container(
                                                color:
                                                    torqueTheme.surfaceVariant,
                                                child: const Center(
                                                  child: Icon(Icons.error),
                                                ),
                                              ),
                                        ),
                                      );
                                    },
                                  ),
                                ] else ...[
                                  const Center(
                                    child: Column(
                                      children: [
                                        SizedBox(height: 60),
                                        Icon(
                                          Icons.garage,
                                          size: 64,
                                          color: Colors.grey,
                                        ),
                                        SizedBox(height: 16),
                                        Text(
                                          'No garage photos yet',
                                          style: TextStyle(
                                            fontSize: 18,
                                            color: Colors.grey,
                                          ),
                                        ),
                                        SizedBox(height: 8),
                                        Text(
                                          'Add photos of your ride!',
                                          style: TextStyle(color: Colors.grey),
                                        ),
                                      ],
                                    ),
                                  ),
                                ],
                              ],
                            ),
                          ),

                          // Races tab
                          const Center(
                            child: Column(
                              mainAxisAlignment: MainAxisAlignment.center,
                              children: [
                                Icon(Icons.flag, size: 64, color: Colors.grey),
                                SizedBox(height: 16),
                                Text(
                                  'Race History',
                                  style: TextStyle(
                                    fontSize: 18,
                                    color: Colors.grey,
                                  ),
                                ),
                                SizedBox(height: 8),
                                Text(
                                  'Coming soon!',
                                  style: TextStyle(color: Colors.grey),
                                ),
                              ],
                            ),
                          ),
                        ],
                      ),
                    ),
                  ),
                ],
              )
            : const Center(child: Text('User not found')),
        loading: () => const Center(child: CircularProgressIndicator()),
        error: (error, stack) => Center(
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Icon(Icons.error_outline, size: 64, color: Colors.red[400]),
              const SizedBox(height: 16),
              Text(
                'Failed to load profile',
                style: Theme.of(context).textTheme.titleLarge,
              ),
              const SizedBox(height: 16),
              ElevatedButton(
                onPressed: () {
                  ref.invalidate(currentUserProvider);
                },
                child: const Text('Retry'),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildStatColumn(BuildContext context, String label, String value) {
    return Column(
      children: [
        Text(
          value,
          style: Theme.of(
            context,
          ).textTheme.titleLarge?.copyWith(fontWeight: FontWeight.bold),
        ),
        const SizedBox(height: 4),
        Text(label, style: TextStyle(color: Colors.grey[600], fontSize: 14)),
      ],
    );
  }

  String _formatNumber(int number) {
    if (number >= 1000000) {
      return '${(number / 1000000).toStringAsFixed(1)}M';
    } else if (number >= 1000) {
      return '${(number / 1000).toStringAsFixed(1)}K';
    }
    return number.toString();
  }
}

class _TabBarDelegate extends SliverPersistentHeaderDelegate {
  final TorqueThemeExtension torqueTheme;
  final TabController tabController;

  _TabBarDelegate({required this.torqueTheme, required this.tabController});

  @override
  Widget build(
    BuildContext context,
    double shrinkOffset,
    bool overlapsContent,
  ) {
    return Container(
      color: torqueTheme.cardBackground,
      child: TabBar(
        controller: tabController,
        labelColor: torqueTheme.racingGreen,
        unselectedLabelColor: Colors.grey[600],
        indicatorColor: torqueTheme.racingGreen,
        tabs: const [
          Tab(text: 'Posts'),
          Tab(text: 'Garage'),
          Tab(text: 'Races'),
        ],
      ),
    );
  }

  @override
  double get maxExtent => 48;

  @override
  double get minExtent => 48;

  @override
  bool shouldRebuild(covariant SliverPersistentHeaderDelegate oldDelegate) =>
      false;
}
